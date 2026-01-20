# OAuth 2.0 + OIDC 통합 테스트 및 보안 검증 가이드

## 개요
Hub ↔ Susi 간 OAuth 2.0 Authorization Code Flow with PKCE 구현에 대한 통합 테스트 및 보안 검증 가이드입니다.

## 1. 보안 검증 체크리스트

### 1.1 PKCE (Proof Key for Code Exchange) 검증
- [x] **Code Verifier 생성**: 32바이트 랜덤 문자열 생성 (base64url 인코딩)
- [x] **Code Challenge 생성**: SHA-256 해시 후 base64url 인코딩
- [x] **Code Challenge Method**: `S256` 사용 (plain은 보안상 취약)
- [ ] **Code Verifier 검증**: Authorization Code 교환 시 정확히 검증되는지 확인
- [ ] **Code Verifier 저장**: 캐시에 임시 저장 후 사용 후 즉시 삭제

### 1.2 State 파라미터 (CSRF 방지)
- [x] **State 생성**: 랜덤 문자열 생성
- [x] **State 저장**: 캐시에 Code Verifier와 함께 저장
- [ ] **State 검증**: 콜백에서 State 일치 여부 확인
- [ ] **State 만료**: 5분 TTL 설정 확인
- [ ] **State 재사용 방지**: 사용 후 즉시 삭제

### 1.3 Authorization Code 보안
- [ ] **일회성 사용**: Authorization Code는 한 번만 사용 가능
- [ ] **짧은 만료 시간**: 5분 이내 만료
- [ ] **사용 후 삭제**: DB에서 즉시 삭제
- [ ] **재사용 시도 탐지**: 이미 사용된 코드 재사용 시 에러

### 1.4 토큰 보안
- [ ] **Access Token 만료**: 적절한 만료 시간 설정 (Hub: 2시간, Susi: 2시간)
- [ ] **Refresh Token 만료**: 장기 만료 시간 (Hub: 60일, Susi: 60일)
- [ ] **ID Token 검증**:
  - [ ] 서명 검증 (JWT)
  - [ ] iss (issuer) 검증
  - [ ] aud (audience) 검증
  - [ ] exp (expiration) 검증
  - [ ] iat (issued at) 검증
- [ ] **HttpOnly 쿠키**: XSS 공격 방지
- [ ] **Secure 쿠키**: HTTPS에서만 전송 (프로덕션)
- [ ] **SameSite 쿠키**: CSRF 방지

### 1.5 클라이언트 인증
- [x] **Client ID 검증**: 등록된 클라이언트인지 확인
- [x] **Client Secret 검증**: 토큰 교환 시 클라이언트 시크릿 확인
- [ ] **Redirect URI 검증**: 등록된 URI로만 리다이렉트 허용
- [ ] **환경별 설정**: 개발/프로덕션 환경별 다른 설정

### 1.6 사용자 동의 (Consent)
- [x] **동의 화면 표시**: 첫 로그인 시 권한 요청 화면
- [x] **Scope 표시**: 요청하는 권한 명시
- [ ] **동의 저장**: 사용자의 동의 이력 저장
- [ ] **동의 취소**: 사용자가 언제든 동의 취소 가능

### 1.7 에러 처리
- [ ] **명확한 에러 메시지**: 사용자에게 이해하기 쉬운 메시지
- [ ] **민감 정보 노출 방지**: 내부 에러 상세 정보 숨김
- [ ] **에러 로깅**: 서버 측에서 상세 로그 기록
- [ ] **리다이렉트 에러 처리**: 에러 발생 시 적절한 페이지로 리다이렉트

## 2. 통합 테스트 시나리오

### 2.1 정상 플로우 테스트

#### 시나리오 1: 신규 사용자 OAuth 로그인
1. **Susi 로그인 페이지 접속**
   - URL: `http://localhost:3001/auth/login`
   - "Hub 계정으로 로그인" 버튼 클릭

2. **OAuth 인증 시작**
   - Susi Backend: `GET /api/auth/oauth/login`
   - 확인 사항:
     - [ ] Code Verifier 생성 확인
     - [ ] Code Challenge 생성 확인
     - [ ] State 생성 및 캐시 저장 확인
     - [ ] Hub 인증 페이지로 리다이렉트 확인
   - 예상 리다이렉트: `http://localhost:4001/oauth/authorize?response_type=code&client_id=susi-client&redirect_uri=http://localhost:4002/api/auth/oauth/callback&scope=openid%20profile%20email&state=xxx&code_challenge=yyy&code_challenge_method=S256`

3. **Hub 로그인**
   - Hub 로그인 페이지에서 이메일/비밀번호 입력
   - 확인 사항:
     - [ ] Hub 로그인 성공
     - [ ] 사용자 세션 생성 확인

4. **동의 화면 표시**
   - URL: `http://localhost:4001/oauth/consent`
   - 확인 사항:
     - [ ] 클라이언트 정보 표시 (Susi)
     - [ ] 요청 권한 표시 (이메일, 프로필)
     - [ ] 승인/거부 버튼 표시

5. **동의 처리**
   - "승인" 버튼 클릭
   - Hub Backend: `POST /api/oauth/authorize`
   - 확인 사항:
     - [ ] Authorization Code 생성
     - [ ] Code Challenge 저장 확인
     - [ ] DB에 authorization_codes 레코드 생성 확인
     - [ ] Susi 콜백으로 리다이렉트 확인
   - 예상 리다이렉트: `http://localhost:4002/api/auth/oauth/callback?code=xxx&state=yyy`

6. **토큰 교환**
   - Susi Backend: `GET /api/auth/oauth/callback?code=xxx&state=yyy`
   - 확인 사항:
     - [ ] State 검증 성공
     - [ ] 캐시에서 Code Verifier 조회 성공
     - [ ] Hub에 토큰 교환 요청: `POST http://localhost:4001/api/oauth/token`
     - [ ] Hub에서 Code Verifier 검증 성공
     - [ ] Access Token, Refresh Token, ID Token 발급 확인
     - [ ] Authorization Code DB에서 삭제 확인

7. **사용자 정보 조회**
   - Susi Backend: Hub UserInfo 엔드포인트 호출
   - 확인 사항:
     - [ ] Access Token으로 사용자 정보 조회 성공
     - [ ] 이메일, 닉네임, 전화번호 수신 확인

8. **Susi 회원 생성**
   - Susi Backend: `createMemberFromOAuth()` 실행
   - 확인 사항:
     - [ ] member_tb에 새 레코드 생성
     - [ ] provider_type = 'hub' 확인
     - [ ] oauth_id = Hub의 memberId 확인
     - [ ] 이메일, 닉네임, 전화번호 저장 확인

9. **Susi 토큰 발급**
   - Susi Backend: Susi의 JWT Access/Refresh Token 발급
   - 확인 사항:
     - [ ] Access Token 생성 확인
     - [ ] Refresh Token 생성 확인
     - [ ] HttpOnly 쿠키 설정 확인

10. **프론트엔드 리다이렉트**
    - Susi Backend: `res.redirect('http://localhost:3001/')`
    - 확인 사항:
      - [ ] 쿠키와 함께 리다이렉트 확인
      - [ ] 프론트엔드에서 쿠키 읽기 가능 확인
      - [ ] 로그인 상태 확인 (useCurrentUser hook)
      - [ ] 대시보드 또는 홈 화면 표시 확인

#### 시나리오 2: 기존 사용자 OAuth 로그인
1. **Susi 로그인 페이지 접속** (동일)
2. **OAuth 인증 시작** (동일)
3. **Hub 로그인** (동일)
4. **동의 화면 건너뛰기**
   - 확인 사항:
     - [ ] 이미 동의한 사용자는 동의 화면 표시 안 함
     - [ ] 바로 Authorization Code 발급 및 리다이렉트
5. **토큰 교환** (동일)
6. **사용자 정보 조회** (동일)
7. **Susi 회원 조회**
   - Susi Backend: `findOneByEmail()` 실행
   - 확인 사항:
     - [ ] 기존 회원 정보 조회 성공
     - [ ] 새 회원 생성하지 않음
8. **Susi 토큰 발급** (동일)
9. **프론트엔드 리다이렉트** (동일)

### 2.2 에러 처리 테스트

#### 시나리오 3: State 불일치 (CSRF 공격 시도)
1. **OAuth 인증 시작**
2. **State 파라미터 조작**
   - 콜백 URL의 state 파라미터를 임의로 변경
   - 예: `http://localhost:4002/api/auth/oauth/callback?code=xxx&state=FAKE_STATE`
3. **확인 사항**
   - [ ] Susi Backend에서 400 또는 401 에러 반환
   - [ ] "유효하지 않거나 만료된 state입니다." 에러 메시지
   - [ ] 로그인 실패

#### 시나리오 4: Authorization Code 재사용
1. **정상 OAuth 로그인 완료**
2. **Authorization Code 저장**
3. **동일한 Code로 다시 토큰 교환 요청**
   - `POST http://localhost:4001/api/oauth/token` (동일한 code 사용)
4. **확인 사항**
   - [ ] Hub Backend에서 400 또는 401 에러 반환
   - [ ] "유효하지 않거나 만료된 인증 코드입니다." 에러 메시지
   - [ ] 토큰 발급 실패

#### 시나리오 5: Code Verifier 불일치
1. **OAuth 인증 시작**
2. **Hub에서 Authorization Code 발급 받음**
3. **잘못된 Code Verifier로 토큰 교환 시도**
   - Susi Backend 로직 임시 수정하여 다른 Code Verifier 전송
4. **확인 사항**
   - [ ] Hub Backend에서 400 에러 반환
   - [ ] "Code verifier가 일치하지 않습니다." 에러 메시지
   - [ ] 토큰 발급 실패

#### 시나리오 6: 만료된 Authorization Code
1. **OAuth 인증 시작**
2. **Hub에서 Authorization Code 발급 받음**
3. **5분 이상 대기**
4. **만료된 Code로 토큰 교환 시도**
5. **확인 사항**
   - [ ] Hub Backend에서 400 에러 반환
   - [ ] "인증 코드가 만료되었습니다." 에러 메시지
   - [ ] 토큰 발급 실패

#### 시나리오 7: 잘못된 Redirect URI
1. **OAuth 인증 시작 시 Redirect URI 조작**
   - 예: `http://malicious-site.com/callback`
2. **확인 사항**
   - [ ] Hub Backend에서 400 에러 반환
   - [ ] "등록되지 않은 redirect_uri입니다." 에러 메시지
   - [ ] 리다이렉트 차단

#### 시나리오 8: 잘못된 Client Secret
1. **토큰 교환 요청 시 Client Secret 조작**
2. **확인 사항**
   - [ ] Hub Backend에서 401 에러 반환
   - [ ] "클라이언트 인증에 실패했습니다." 에러 메시지
   - [ ] 토큰 발급 실패

### 2.3 토큰 관리 테스트

#### 시나리오 9: Access Token 만료 및 Refresh
1. **정상 OAuth 로그인**
2. **Access Token 만료 시간 대기 (2시간)**
3. **만료된 Access Token으로 API 요청**
   - 예: `GET /api/auth/me`
4. **확인 사항**
   - [ ] 401 에러 반환
   - [ ] "토큰이 만료되었습니다." 메시지
5. **Refresh Token으로 토큰 갱신**
   - `POST /api/auth/refresh`
6. **확인 사항**
   - [ ] 새 Access Token 발급
   - [ ] 새 Refresh Token 발급
   - [ ] 새 토큰으로 API 요청 성공

#### 시나리오 10: Refresh Token 만료
1. **정상 OAuth 로그인**
2. **Refresh Token 만료 시간 대기 (60일)**
3. **만료된 Refresh Token으로 갱신 시도**
4. **확인 사항**
   - [ ] 401 에러 반환
   - [ ] "리프레시 토큰이 만료되었습니다." 메시지
   - [ ] 재로그인 필요

#### 시나리오 11: 로그아웃
1. **정상 OAuth 로그인**
2. **로그아웃 요청**
   - `POST /api/auth/logout`
3. **확인 사항**
   - [ ] Refresh Token 블랙리스트 등록 (Susi)
   - [ ] 모든 인증 쿠키 삭제
   - [ ] 로그아웃 후 API 요청 시 401 에러

## 3. 수동 테스트 절차

### 3.1 환경 설정
```bash
# Hub 백엔드 실행 (포트 4001)
cd E:\Dev\github\Hub
npm run start:dev

# Susi 백엔드 실행 (포트 4002)
cd E:\Dev\github\Susi\susi-back
npm run start:dev

# Hub 프론트엔드 실행 (포트 4000)
cd E:\Dev\github\Hub\hub-front
npm run dev

# Susi 프론트엔드 실행 (포트 3001)
cd E:\Dev\github\Susi\susi-front
npm run dev
```

### 3.2 DB 상태 확인 쿼리

#### Hub DB 확인
```sql
-- OAuth 클라이언트 확인
SELECT * FROM oauth_clients WHERE client_id = 'susi-client';

-- Authorization Codes 확인
SELECT * FROM authorization_codes ORDER BY created_at DESC LIMIT 10;

-- 사용자 Consent 확인
SELECT * FROM oauth_user_consents WHERE user_id = [USER_ID];
```

#### Susi DB 확인
```sql
-- OAuth로 생성된 회원 확인
SELECT * FROM member_tb WHERE provider_type = 'hub' ORDER BY create_dt DESC LIMIT 10;

-- 특정 이메일로 회원 조회
SELECT * FROM member_tb WHERE email = 'test@example.com';
```

### 3.3 캐시 확인 (Redis)
```bash
# Redis CLI 접속
redis-cli

# Susi의 OAuth State/Verifier 확인
KEYS oauth_verifier:*
GET oauth_verifier:[STATE_VALUE]

# TTL 확인
TTL oauth_verifier:[STATE_VALUE]
```

### 3.4 네트워크 디버깅
- **브라우저 개발자 도구 → Network 탭**
  - [ ] Authorization 요청 확인
  - [ ] 리다이렉트 체인 확인
  - [ ] 토큰 교환 요청 확인
  - [ ] 쿠키 설정 확인

- **브라우저 개발자 도구 → Application 탭**
  - [ ] HttpOnly 쿠키 확인 (accessToken, refreshToken)
  - [ ] 쿠키 만료 시간 확인
  - [ ] SameSite 속성 확인

## 4. 자동화 테스트 (추후 구현)

### 4.1 E2E 테스트 (Playwright)
```typescript
// tests/oauth-flow.spec.ts
describe('OAuth 2.0 + OIDC Flow', () => {
  test('신규 사용자 OAuth 로그인', async ({ page }) => {
    // 1. Susi 로그인 페이지 접속
    await page.goto('http://localhost:3001/auth/login');

    // 2. Hub OAuth 로그인 버튼 클릭
    await page.click('text=Hub 계정으로 로그인');

    // 3. Hub 로그인 페이지로 리다이렉트 확인
    await expect(page).toHaveURL(/localhost:4001\/auth\/login/);

    // 4. Hub 로그인
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 5. 동의 화면 확인 및 승인
    await expect(page).toHaveURL(/localhost:4001\/oauth\/consent/);
    await page.click('text=승인');

    // 6. Susi로 리다이렉트 및 로그인 확인
    await expect(page).toHaveURL('http://localhost:3001/');

    // 7. 로그인 상태 확인
    await expect(page.locator('text=로그아웃')).toBeVisible();
  });

  test('State 불일치 시 에러', async ({ page, request }) => {
    // State를 조작한 콜백 URL 직접 호출
    const response = await request.get(
      'http://localhost:4002/api/auth/oauth/callback?code=test&state=FAKE_STATE'
    );

    expect(response.status()).toBe(401);
  });

  // 기타 시나리오 추가...
});
```

### 4.2 통합 테스트 (Jest)
```typescript
// susi-back/test/auth/oauth.e2e.spec.ts
describe('OAuth Client E2E', () => {
  it('should generate PKCE challenge correctly', () => {
    const { codeVerifier, codeChallenge } = oauthClientService.generatePKCEChallenge();

    expect(codeVerifier).toHaveLength(43); // base64url of 32 bytes
    expect(codeChallenge).toHaveLength(43);
    expect(codeChallenge).not.toEqual(codeVerifier);
  });

  it('should exchange code for tokens', async () => {
    // Mock Hub token endpoint
    const tokens = await oauthClientService.exchangeCodeForTokens('code', 'verifier');

    expect(tokens).toHaveProperty('access_token');
    expect(tokens).toHaveProperty('refresh_token');
    expect(tokens).toHaveProperty('id_token');
  });

  // 기타 테스트 추가...
});
```

## 5. 보안 권장 사항

### 5.1 프로덕션 배포 전 체크리스트
- [ ] **HTTPS 필수**: 모든 OAuth 통신은 HTTPS로만 허용
- [ ] **환경 변수 보안**: Client Secret 등 민감 정보는 환경 변수로 관리
- [ ] **CORS 설정**: 허용된 Origin만 API 호출 가능
- [ ] **Rate Limiting**: 토큰 요청에 속도 제한 적용
- [ ] **로깅**: 모든 OAuth 이벤트 로깅 (단, 토큰/시크릿은 제외)
- [ ] **모니터링**: 비정상 OAuth 활동 감지 및 알림
- [ ] **정기 감사**: 주기적으로 OAuth 클라이언트 및 권한 검토

### 5.2 알려진 보안 위협 및 대응
- **Authorization Code Interception**: PKCE로 방어
- **CSRF Attack**: State 파라미터로 방어
- **Token Leakage**: HttpOnly 쿠키로 방어
- **Replay Attack**: Authorization Code 일회성 사용으로 방어
- **Man-in-the-Middle**: HTTPS 필수로 방어

## 6. 문제 해결 가이드

### 6.1 일반적인 오류
| 오류 메시지 | 원인 | 해결 방법 |
|------------|------|----------|
| "유효하지 않거나 만료된 state입니다." | State 불일치 또는 캐시 만료 | 로그인 처음부터 다시 시도 |
| "Code verifier가 일치하지 않습니다." | PKCE 검증 실패 | 서버 로그 확인, 캐시 상태 확인 |
| "인증 코드가 만료되었습니다." | 5분 이상 경과 | 로그인 처음부터 다시 시도 |
| "등록되지 않은 redirect_uri입니다." | Redirect URI 불일치 | oauth_clients 테이블의 redirect_uris 확인 |

### 6.2 디버깅 팁
- **서버 로그 확인**: NestJS 콘솔 로그에서 OAuth 플로우 추적
- **DB 상태 확인**: authorization_codes, oauth_clients 테이블 조회
- **Redis 캐시 확인**: oauth_verifier 키 확인
- **네트워크 탭**: 브라우저에서 리다이렉트 및 쿠키 확인

## 7. 참고 자료
- [RFC 6749: OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749)
- [RFC 7636: PKCE for OAuth Public Clients](https://datatracker.ietf.org/doc/html/rfc7636)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
