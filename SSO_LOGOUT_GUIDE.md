# SSO 로그아웃 완벽 구현 가이드

Hub를 중심으로 한 SSO 환경에서 로그아웃 동기화를 위한 완벽한 가이드입니다.

## 목차

1. [아키텍처 개요](#아키텍처-개요)
2. [Hub (IdP) 구현](#hub-idp-구현)
3. [독립 앱 (Susi, StudyPlanner) 구현](#독립-앱-구현)
4. [테스트 방법](#테스트-방법)
5. [보안 고려사항](#보안-고려사항)

---

## 아키텍처 개요

### SSO 로그아웃 플로우

```
┌─────────────────────────────────────────────────────────────┐
│                         Hub (IdP)                            │
│                                                              │
│  사용자가 로그아웃 버튼 클릭                                      │
│         ↓                                                     │
│  1. POST /auth/logout        (refresh token 블랙리스트)      │
│  2. POST /oauth/logout       (OAuth codes 삭제)              │
│  3. BroadcastChannel 전송    (같은 브라우저 내 탭)             │
│  4. postMessage 전송         (iframe/popup 앱들)              │
│  5. localStorage 삭제        (storage event 트리거)           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                         ↓ ↓ ↓
        ┌────────────────┴─┴─┴────────────────┐
        ↓                  ↓                  ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│     Susi     │  │StudyPlanner  │  │  기타 앱들    │
│              │  │              │  │              │
│ SSO Listener │  │ SSO Listener │  │ SSO Listener │
│      ↓       │  │      ↓       │  │      ↓       │
│ 자동 로그아웃  │  │ 자동 로그아웃  │  │ 자동 로그아웃  │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 3가지 동기화 메커니즘

1. **BroadcastChannel**: 같은 브라우저 내 다른 탭 간 통신
2. **postMessage**: iframe 또는 popup으로 열린 앱과의 통신
3. **localStorage Event**: storage 변경 감지를 통한 자동 동기화

---

## Hub (IdP) 구현

### 1. 백엔드: OAuth 로그아웃 API

#### oauth.service.ts
```typescript
/**
 * 특정 사용자의 모든 Authorization Codes 삭제 (OAuth 로그아웃)
 */
async revokeAllCodes(memberId: number): Promise<void> {
  await this.authCodeRepository.delete({ memberId });
}

/**
 * 특정 사용자의 특정 클라이언트 Authorization Codes 삭제
 */
async revokeCodesByClient(memberId: number, clientId: string): Promise<void> {
  await this.authCodeRepository.delete({ memberId, clientId });
}
```

#### oauth.controller.ts
```typescript
/**
 * POST /oauth/logout
 * OAuth SSO 로그아웃 - 모든 클라이언트에서 사용자 세션 정리
 */
@Post('logout')
@UseGuards(JwtAuthGuard)
async logout(
  @CurrentMemberId() memberId: string,
  @Body() body?: { client_id?: string },
) {
  const memberIdNum = Number(memberId);
  await this.oauthService.revokeAllCodes(memberIdNum);

  return {
    success: true,
    message: 'OAuth 로그아웃이 완료되었습니다.',
  };
}
```

### 2. 프론트엔드: 로그아웃 브로드캐스트

#### header.tsx (로그아웃 핸들러)
```typescript
const handleLogoutClick = async () => {
  console.log('🚪 로그아웃 시작...');

  // 1. 백엔드 로그아웃 API 호출
  const refreshToken = localStorage.getItem('refreshToken');
  const accessToken = localStorage.getItem('accessToken');

  if (refreshToken) {
    await authClient.post('/auth/logout', { refreshToken });
  }

  // 2. OAuth SSO 로그아웃
  if (accessToken) {
    await authClient.post('/oauth/logout');
  }

  // 3. BroadcastChannel을 통한 크로스 탭 알림
  const channel = new BroadcastChannel('sso_logout');
  channel.postMessage({ type: 'SSO_LOGOUT', timestamp: Date.now() });
  channel.close();

  // 4. postMessage를 통한 다른 앱 알림
  const LINKED_APPS = [
    'http://localhost:3001',
    'http://localhost:3002',
    'https://susi.turtleschool.com',
    'https://planner.turtleschool.com',
  ];

  LINKED_APPS.forEach(appUrl => {
    window.postMessage({ type: 'SSO_LOGOUT', timestamp: Date.now() }, appUrl);
  });

  // 5. 토큰 삭제 및 리다이렉트
  localStorage.clear();
  sessionStorage.clear();
  window.location.replace('/auth/login');
};
```

---

## 독립 앱 구현

### 1. SSO 리스너 설치

각 독립 앱(Susi, StudyPlanner 등)에 `sso-logout-listener.ts` 파일을 복사합니다.

```
Susi/src/lib/sso-logout-listener.ts
StudyPlanner/src/lib/sso-logout-listener.ts
```

### 2. App.tsx에 리스너 추가

#### Susi/src/App.tsx
```typescript
import { useEffect } from 'react';
import { setupSSOLogoutListener } from '@/lib/sso-logout-listener';
import { clearTokens } from '@/lib/auth';

function App() {
  useEffect(() => {
    // SSO 로그아웃 리스너 설정
    const cleanup = setupSSOLogoutListener({
      onLogout: () => {
        console.log('🚪 [Susi] Hub에서 로그아웃 감지됨');

        // 1. 로컬 토큰 삭제
        clearTokens();

        // 2. React Query 캐시 삭제 (있는 경우)
        // queryClient.clear();

        // 3. 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      },
      allowedOrigins: [
        'http://localhost:3000',           // Hub 개발 서버
        'https://hub.turtleschool.com',    // Hub 프로덕션
      ],
      debug: true, // 개발 환경에서는 true
    });

    return cleanup; // 컴포넌트 언마운트 시 리스너 제거
  }, []);

  return (
    <div className="App">
      {/* 앱 컴포넌트 */}
    </div>
  );
}

export default App;
```

### 3. 독립 앱 자체 로그아웃 구현

#### Susi/src/components/LogoutButton.tsx
```typescript
import { performSSOLogout } from '@/lib/sso-logout-listener';

function LogoutButton() {
  const handleLogout = async () => {
    await performSSOLogout({
      clearTokens: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        sessionStorage.clear();
      },
      redirectUrl: '/login',
      notifyHub: true, // Hub에 로그아웃 알림
      hubApiUrl: 'http://localhost:4001', // Hub API URL
    });
  };

  return (
    <button onClick={handleLogout}>
      로그아웃
    </button>
  );
}
```

---

## 테스트 방법

### 시나리오 1: Hub에서 로그아웃

1. **준비**:
   - Hub (localhost:3000) 열기
   - Susi (localhost:3001) 새 탭으로 열기
   - StudyPlanner (localhost:3002) 새 탭으로 열기

2. **실행**:
   - Hub에서 로그아웃 버튼 클릭

3. **예상 결과**:
   ```
   Hub 콘솔:
   🚪 로그아웃 시작...
   📡 백엔드 로그아웃 API 호출...
   📡 OAuth SSO 로그아웃 API 호출...
   📢 SSO 앱들에게 로그아웃 알림...
   ✅ 로그아웃 완료

   Susi 콘솔:
   [SSO Logout Listener] BroadcastChannel 메시지 수신: {type: 'SSO_LOGOUT', ...}
   🚪 [Susi] Hub에서 로그아웃 감지됨
   → 자동으로 /login으로 리다이렉트

   StudyPlanner 콘솔:
   [SSO Logout Listener] BroadcastChannel 메시지 수신: {type: 'SSO_LOGOUT', ...}
   🚪 [StudyPlanner] Hub에서 로그아웃 감지됨
   → 자동으로 /login으로 리다이렉트
   ```

### 시나리오 2: Susi에서 로그아웃

1. **실행**:
   - Susi에서 로그아웃 버튼 클릭

2. **예상 결과**:
   ```
   Susi 콘솔:
   🚪 [SSO] 로그아웃 시작...
   ✅ [SSO] Hub에 로그아웃 알림 완료
   ✅ [SSO] 토큰 삭제 완료
   → /login으로 리다이렉트

   Hub 백엔드:
   POST /oauth/logout 200 OK

   Hub 프론트엔드:
   (자동으로 로그아웃되지 않음 - Hub는 중앙 서버이므로)
   ```

### 시나리오 3: localStorage 직접 삭제

1. **실행**:
   - Hub 브라우저 콘솔에서 `localStorage.clear()` 실행

2. **예상 결과**:
   ```
   Susi 콘솔:
   [SSO Logout Listener] Storage 변경 감지: accessToken
   🚪 SSO 로그아웃 감지 (localStorage)
   → 자동으로 /login으로 리다이렉트

   StudyPlanner 콘솔:
   [SSO Logout Listener] Storage 변경 감지: accessToken
   🚪 SSO 로그아웃 감지 (localStorage)
   → 자동으로 /login으로 리다이렉트
   ```

---

## 보안 고려사항

### 1. Origin 검증

**독립 앱에서 반드시 허용된 오리진만 처리**:
```typescript
setupSSOLogoutListener({
  allowedOrigins: [
    'http://localhost:3000',
    'https://hub.turtleschool.com',
    // ❌ '*' 사용 금지!
  ],
});
```

### 2. CSRF 방어

- 모든 API 요청에 CSRF 토큰 포함
- OAuth state 파라미터 사용

### 3. XSS 방어

- `HttpOnly` 쿠키 사용 (토큰 저장 시)
- Content Security Policy (CSP) 설정

### 4. 토큰 보안

- Access Token: 짧은 유효기간 (2시간)
- Refresh Token: 블랙리스트 관리
- 로그아웃 시 서버에서 토큰 무효화

---

## API 문서

### POST /oauth/logout

OAuth SSO 로그아웃 - 모든 클라이언트의 세션 정리

**Headers**:
```
Authorization: Bearer <access_token>
```

**Request Body** (선택):
```json
{
  "client_id": "susi-app"  // 특정 클라이언트만 로그아웃
}
```

**Response**:
```json
{
  "success": true,
  "revokedCodes": 3,
  "message": "OAuth 로그아웃이 완료되었습니다."
}
```

**에러 응답**:
- `401 Unauthorized`: JWT 토큰 없음 또는 유효하지 않음

---

## 트러블슈팅

### Q1: BroadcastChannel이 작동하지 않음

**원인**: 브라우저가 BroadcastChannel을 지원하지 않음

**해결**: postMessage나 localStorage 이벤트를 대신 사용

### Q2: 다른 탭에서 로그아웃이 감지되지 않음

**원인**: 같은 도메인이 아님

**해결**: localStorage 이벤트는 같은 도메인에서만 작동합니다. 다른 도메인은 postMessage를 사용하세요.

### Q3: Hub에서 로그아웃했는데 독립 앱이 반응 없음

**체크리스트**:
1. 독립 앱에 SSO 리스너가 설치되어 있는지 확인
2. allowedOrigins에 Hub URL이 포함되어 있는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인
4. debug: true로 설정하여 로그 확인

---

## 추가 개선 사항 (향후)

### 1. WebSocket을 사용한 실시간 로그아웃 알림

```typescript
// Hub 백엔드
wss.broadcast({ type: 'SSO_LOGOUT', memberId: 123 });

// 독립 앱
ws.onmessage = (event) => {
  if (event.data.type === 'SSO_LOGOUT') {
    performLogout();
  }
};
```

### 2. Redis를 사용한 세션 관리

```typescript
// 로그아웃 시 Redis에 blacklist 추가
await redis.sadd(`blacklist:member:${memberId}`, accessToken);
await redis.expire(`blacklist:member:${memberId}`, 7200);
```

### 3. OAuth Revocation Endpoint 추가

```typescript
// RFC 7009: Token Revocation
POST /oauth/revoke
{
  "token": "access_token",
  "token_type_hint": "access_token"
}
```

---

## 참고 문서

- [OAuth 2.0 RFC 6749](https://datatracker.ietf.org/doc/html/rfc6749)
- [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html)
- [Token Revocation RFC 7009](https://datatracker.ietf.org/doc/html/rfc7009)
- [BroadcastChannel API](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel)
- [Window.postMessage()](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [Storage Event](https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent)
