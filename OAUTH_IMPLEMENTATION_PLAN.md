# OAuth 2.0 + OIDC 구현 계획서

## 목표
Hub를 중앙 인증 서버(IdP/Authorization Server)로, Susi를 OAuth 클라이언트로 전환하여 표준 OAuth 2.0 + OpenID Connect 프로토콜 구현

## 현재 구조 vs 목표 구조

### 현재 (비표준)
```
Hub 로그인 → Susi redirect
https://susi.app?sso_access_token=xxx&sso_refresh_token=yyy
                 ↓
        Susi가 토큰 저장
```

**문제점:**
- ❌ 토큰이 URL에 노출 (브라우저 히스토리, 서버 로그)
- ❌ CSRF 공격 취약
- ❌ 클라이언트 검증 없음
- ❌ 표준 프로토콜 미준수

### 목표 (표준 OAuth 2.0 + OIDC)
```
1. Susi → Hub redirect
   GET /oauth/authorize?
     client_id=susi-app
     &redirect_uri=http://localhost:3001/auth/callback
     &response_type=code
     &state=random_csrf_token
     &code_challenge=base64url(sha256(verifier))
     &code_challenge_method=S256
     &scope=openid profile email

2. Hub에서 로그인 + 동의

3. Hub → Susi callback
   GET http://localhost:3001/auth/callback?
     code=authorization_code_here
     &state=random_csrf_token

4. Susi 백엔드 → Hub 백엔드
   POST /oauth/token
   {
     grant_type: "authorization_code",
     code: "authorization_code_here",
     redirect_uri: "http://localhost:3001/auth/callback",
     client_id: "susi-app",
     code_verifier: "original_verifier"
   }

5. Hub 응답
   {
     access_token: "jwt_token",
     refresh_token: "refresh_jwt",
     id_token: "oidc_id_token",
     token_type: "Bearer",
     expires_in: 7200
   }
```

**장점:**
- ✅ 토큰이 URL에 노출되지 않음
- ✅ CSRF 방어 (state 파라미터)
- ✅ 클라이언트 검증 (client_id)
- ✅ PKCE로 Authorization Code 탈취 방지
- ✅ 표준 프로토콜 준수

---

## DB 스키마 설계

### 1. OAuth Clients 테이블
```sql
CREATE TABLE oauth_clients (
  id SERIAL PRIMARY KEY,
  client_id VARCHAR(255) UNIQUE NOT NULL,
  client_secret VARCHAR(255),  -- PKCE 사용 시 선택사항
  client_name VARCHAR(255) NOT NULL,
  redirect_uris TEXT[] NOT NULL,  -- PostgreSQL array
  allowed_scopes VARCHAR(255)[] NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 초기 데이터
INSERT INTO oauth_clients (client_id, client_name, redirect_uris, allowed_scopes) VALUES
('susi-app', 'Susi Application',
 ARRAY['http://localhost:3001/auth/callback', 'https://susi.turtleschool.com/auth/callback'],
 ARRAY['openid', 'profile', 'email']);
```

### 2. Authorization Codes 테이블
```sql
CREATE TABLE oauth_authorization_codes (
  id SERIAL PRIMARY KEY,
  code VARCHAR(255) UNIQUE NOT NULL,
  client_id VARCHAR(255) NOT NULL,
  member_id INTEGER NOT NULL,
  redirect_uri TEXT NOT NULL,
  scope VARCHAR(255)[] NOT NULL,
  code_challenge VARCHAR(255),  -- PKCE
  code_challenge_method VARCHAR(10),  -- S256 or plain
  expires_at TIMESTAMP NOT NULL,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (client_id) REFERENCES oauth_clients(client_id),
  FOREIGN KEY (member_id) REFERENCES member(id)
);

CREATE INDEX idx_oauth_code ON oauth_authorization_codes(code);
CREATE INDEX idx_oauth_code_expires ON oauth_authorization_codes(expires_at);
```

### 3. Refresh Tokens 테이블 (기존 확장)
```sql
-- 기존 테이블이 있다면 컬럼 추가
ALTER TABLE refresh_tokens ADD COLUMN client_id VARCHAR(255);
ALTER TABLE refresh_tokens ADD COLUMN scope VARCHAR(255)[];
```

---

## Hub 백엔드 구현 (NestJS)

### 파일 구조
```
src/
├── oauth/
│   ├── oauth.module.ts
│   ├── oauth.controller.ts
│   ├── oauth.service.ts
│   ├── entities/
│   │   ├── oauth-client.entity.ts
│   │   └── oauth-authorization-code.entity.ts
│   ├── dtos/
│   │   ├── authorize.dto.ts
│   │   └── token.dto.ts
│   └── guards/
│       └── oauth-consent.guard.ts
└── auth/
    └── (기존 인증 시스템 유지)
```

### 주요 엔드포인트

#### 1. GET /oauth/authorize
```typescript
@Public()
@Get('authorize')
async authorize(
  @Query() query: AuthorizeDto,
  @Req() req: Request,
  @Res() res: Response,
) {
  // 1. client_id 검증
  const client = await this.oauthService.validateClient(query.client_id);

  // 2. redirect_uri 검증
  if (!client.redirect_uris.includes(query.redirect_uri)) {
    throw new BadRequestException('Invalid redirect_uri');
  }

  // 3. 로그인 확인
  const memberId = req.user?.memberId;
  if (!memberId) {
    // 로그인 페이지로 리다이렉트 (return_url 포함)
    return res.redirect(
      `/auth/login?return_url=${encodeURIComponent(req.originalUrl)}`
    );
  }

  // 4. 동의 화면으로 리다이렉트
  return res.redirect(`/oauth/consent?${queryString}`);
}
```

#### 2. POST /oauth/consent
```typescript
@Post('consent')
async consent(
  @Body() body: ConsentDto,
  @CurrentMemberId() memberId: string,
  @Res() res: Response,
) {
  // 1. Authorization Code 생성 (10분 유효)
  const code = await this.oauthService.generateAuthorizationCode({
    clientId: body.client_id,
    memberId,
    redirectUri: body.redirect_uri,
    scope: body.scope,
    codeChallenge: body.code_challenge,
    codeChallengeMethod: body.code_challenge_method,
  });

  // 2. Callback URL로 리다이렉트
  const callbackUrl = new URL(body.redirect_uri);
  callbackUrl.searchParams.set('code', code);
  callbackUrl.searchParams.set('state', body.state);

  return res.redirect(callbackUrl.toString());
}
```

#### 3. POST /oauth/token
```typescript
@Public()
@Post('token')
async token(@Body() body: TokenDto) {
  if (body.grant_type === 'authorization_code') {
    // 1. Authorization Code 검증
    const authCode = await this.oauthService.validateAuthorizationCode(body.code);

    // 2. PKCE 검증
    if (authCode.code_challenge) {
      const hash = crypto
        .createHash('sha256')
        .update(body.code_verifier)
        .digest('base64url');

      if (hash !== authCode.code_challenge) {
        throw new UnauthorizedException('Invalid code_verifier');
      }
    }

    // 3. Code 사용 처리
    await this.oauthService.markCodeAsUsed(body.code);

    // 4. 토큰 생성
    const tokens = await this.authService.generateTokens(authCode.member_id);
    const idToken = await this.oauthService.generateIdToken(
      authCode.member_id,
      body.client_id,
    );

    return {
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      id_token: idToken,
      token_type: 'Bearer',
      expires_in: 7200,
    };
  }

  if (body.grant_type === 'refresh_token') {
    // Refresh Token 처리 (기존 로직 재사용)
    return this.authService.refreshTokens(body.refresh_token);
  }
}
```

---

## Hub 프론트엔드 구현

### 1. OAuth 동의 화면
```typescript
// src/routes/oauth/consent.tsx
export const OAuthConsentPage = () => {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client_id');
  const scope = searchParams.get('scope')?.split(' ');

  const handleApprove = async () => {
    await fetch('/oauth/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        redirect_uri: searchParams.get('redirect_uri'),
        scope,
        state: searchParams.get('state'),
        code_challenge: searchParams.get('code_challenge'),
        code_challenge_method: searchParams.get('code_challenge_method'),
      }),
    });
  };

  return (
    <div>
      <h1>{clientName}이(가) 다음 권한을 요청합니다:</h1>
      <ul>
        {scope?.includes('profile') && <li>프로필 정보</li>}
        {scope?.includes('email') && <li>이메일 주소</li>}
      </ul>
      <button onClick={handleApprove}>허용</button>
      <button onClick={handleDeny}>거부</button>
    </div>
  );
};
```

---

## Susi 백엔드 구현

### 1. OAuth 설정
```typescript
// src/config/oauth.config.ts
export const oauthConfig = {
  hub: {
    authorizationUrl: 'http://localhost:3000/oauth/authorize',
    tokenUrl: 'http://localhost:4001/oauth/token',
    clientId: 'susi-app',
    redirectUri: 'http://localhost:3001/auth/callback',
    scope: 'openid profile email',
  },
};
```

### 2. OAuth 클라이언트 서비스
```typescript
// src/auth/services/oauth-client.service.ts
@Injectable()
export class OAuthClientService {
  async exchangeCodeForTokens(code: string, codeVerifier: string) {
    const response = await axios.post(oauthConfig.hub.tokenUrl, {
      grant_type: 'authorization_code',
      code,
      redirect_uri: oauthConfig.hub.redirectUri,
      client_id: oauthConfig.hub.clientId,
      code_verifier: codeVerifier,
    });

    return response.data;
  }

  async verifyIdToken(idToken: string): Promise<JwtPayload> {
    // Hub의 공개 키로 ID Token 검증
    // 또는 /oauth/userinfo 엔드포인트 호출
  }
}
```

### 3. Callback 엔드포인트
```typescript
// src/auth/auth.controller.ts
@Public()
@Get('callback')
async oauthCallback(
  @Query('code') code: string,
  @Query('state') state: string,
  @Res() res: Response,
) {
  // 1. State 검증 (CSRF 방지)
  const savedState = this.sessionService.getState();
  if (state !== savedState) {
    throw new UnauthorizedException('Invalid state');
  }

  // 2. Code Verifier 가져오기
  const codeVerifier = this.sessionService.getCodeVerifier();

  // 3. Token 교환
  const tokens = await this.oauthClientService.exchangeCodeForTokens(
    code,
    codeVerifier,
  );

  // 4. ID Token 검증
  const userInfo = await this.oauthClientService.verifyIdToken(tokens.id_token);

  // 5. 토큰 저장
  res.cookie('accessToken', tokens.access_token, { httpOnly: true });
  res.cookie('refreshToken', tokens.refresh_token, { httpOnly: true });

  // 6. 메인 페이지로 리다이렉트
  return res.redirect('/');
}
```

---

## Susi 프론트엔드 구현

### 1. OAuth 로그인 시작
```typescript
// src/lib/auth/oauth-helper.ts
export const initiateOAuthLogin = () => {
  // 1. State 생성 (CSRF 방지)
  const state = generateRandomString(32);
  sessionStorage.setItem('oauth_state', state);

  // 2. PKCE Code Verifier & Challenge 생성
  const codeVerifier = generateRandomString(64);
  sessionStorage.setItem('code_verifier', codeVerifier);

  const codeChallenge = base64UrlEncode(
    sha256(codeVerifier)
  );

  // 3. Hub Authorization URL로 리다이렉트
  const params = new URLSearchParams({
    client_id: 'susi-app',
    redirect_uri: 'http://localhost:3001/auth/callback',
    response_type: 'code',
    scope: 'openid profile email',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  window.location.href = `http://localhost:3000/oauth/authorize?${params}`;
};
```

### 2. Callback 처리
```typescript
// src/routes/auth/callback.tsx
export const OAuthCallbackPage = () => {
  const searchParams = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // 1. State 검증
    const savedState = sessionStorage.getItem('oauth_state');
    if (state !== savedState) {
      console.error('Invalid state - possible CSRF attack');
      navigate('/auth/login');
      return;
    }

    // 2. Code Verifier 가져오기
    const codeVerifier = sessionStorage.getItem('code_verifier');

    // 3. 백엔드로 code와 verifier 전송
    fetch('/api-nest/auth/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, code_verifier: codeVerifier }),
    }).then(() => {
      // 4. 세션 정리
      sessionStorage.removeItem('oauth_state');
      sessionStorage.removeItem('code_verifier');

      // 5. 메인 페이지로 이동
      navigate('/');
    });
  }, []);

  return <div>로그인 처리 중...</div>;
};
```

---

## 보안 고려사항

### 1. PKCE (Proof Key for Code Exchange)
- ✅ Authorization Code 탈취 공격 방지
- ✅ Public 클라이언트(SPA)에 필수
- ✅ S256 (SHA-256) 메서드 사용

### 2. State 파라미터
- ✅ CSRF 공격 방지
- ✅ 32바이트 이상 랜덤 문자열
- ✅ 세션에 저장 후 검증

### 3. Authorization Code
- ✅ 10분 유효기간
- ✅ 1회만 사용 가능
- ✅ 사용 후 즉시 무효화

### 4. Redirect URI 검증
- ✅ 등록된 URI만 허용
- ✅ 정확히 일치해야 함 (쿼리 파라미터 포함)

### 5. Scope 관리
- ✅ 최소 권한 원칙
- ✅ 사용자 동의 필수

---

## 마이그레이션 전략

### Phase 1: 인프라 구축
1. DB 스키마 생성
2. Hub 백엔드 OAuth 엔드포인트 구현
3. 테스트 클라이언트 등록

### Phase 2: Hub 통합
1. 동의 화면 구현
2. 기존 JWT 시스템과 통합
3. 테스트

### Phase 3: Susi 통합
1. Susi 백엔드 OAuth 클라이언트 구현
2. Susi 프론트엔드 OAuth 플로우 구현
3. 통합 테스트

### Phase 4: 전환
1. 기존 SSO URL 파라미터 방식과 병행 운영
2. 점진적 마이그레이션
3. 레거시 방식 제거

---

## 테스트 시나리오

### 정상 플로우
1. ✅ Susi → Hub redirect
2. ✅ Hub 로그인
3. ✅ 동의 화면 표시
4. ✅ Callback으로 code 전달
5. ✅ Token exchange 성공
6. ✅ Susi 메인 페이지 로드

### 에러 케이스
1. ❌ 잘못된 client_id → 에러 메시지
2. ❌ 잘못된 redirect_uri → 에러 메시지
3. ❌ State 불일치 → CSRF 경고
4. ❌ Code 재사용 시도 → Unauthorized
5. ❌ PKCE 검증 실패 → Unauthorized
6. ❌ Code 만료 → 재로그인 필요

---

## 다음 단계

1. ✅ **DB 스키마 생성** - oauth_clients, oauth_authorization_codes 테이블
2. ⏳ Hub 백엔드 OAuth 모듈 구현
3. ⏳ Hub 프론트엔드 동의 화면
4. ⏳ Susi 백엔드 OAuth 클라이언트
5. ⏳ Susi 프론트엔드 OAuth 플로우
6. ⏳ 통합 테스트 및 검증
