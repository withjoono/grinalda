# TurtleSchool 프론트엔드 - 아키텍처 문서

## 📋 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [아키텍처 개요](#아키텍처-개요)
4. [프로젝트 구조](#프로젝트-구조)
5. [핵심 시스템](#핵심-시스템)
6. [코드 흐름 & 데이터 흐름](#코드-흐름--데이터-흐름)
7. [API 통합](#api-통합)
8. [상태 관리](#상태-관리)
9. [라우팅 시스템](#라우팅-시스템)
10. [컴포넌트 아키텍처](#컴포넌트-아키텍처)

---

## 📖 프로젝트 개요

**TurtleSchool Frontend**는 대학 입시 컨설팅 서비스를 위한 React 기반 웹 애플리케이션입니다. 두 가지 주요 서비스를 제공합니다:
- **수시**: 학생부종합전형 및 학생부교과전형 컨설팅
- **정시**: 수능 성적 기반 정시전형 컨설팅

이 애플리케이션은 학생들이 학업 성적을 분석하고, 대학 적합도를 평가하며, 대학 지원에 대한 정보에 기반한 결정을 내릴 수 있도록 돕습니다.

---

## 🛠️ 기술 스택

### 핵심 프레임워크 & 라이브러리
```json
{
  "framework": "React 18.2.0",
  "language": "TypeScript 4.9.5",
  "build_tool": "react-scripts 5.0.1",
  "routing": "react-router-dom 6.10.0",
  "state_management": ["recoil 0.7.7", "react-query 3.39.3"],
  "ui_framework": "@mui/material 5.12.3",
  "styling": ["tailwindcss 3.4.3", "sass 1.62.1"]
}
```

### 주요 의존성
- **UI 컴포넌트**: Material-UI (@mui), Radix UI primitives
- **데이터 시각화**: Recharts, Nivo charts, Chart.js
- **폼**: react-hook-form, zod 유효성 검사
- **HTTP 클라이언트**: Axios 1.3.5
- **인증**: 소셜 로그인 (Google, Naver, Kakao, Apple)
- **상태 영속성**: recoil-persist
- **알림**: Sonner toast 라이브러리

---

## 🏗️ 아키텍처 개요

### 상위 레벨 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                      사용자 인터페이스 계층                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Header  │  │  Footer  │  │  Pages   │  │Components│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      상태 관리 계층                           │
│  ┌──────────────────┐              ┌──────────────────┐    │
│  │  Recoil Atoms    │◄────────────►│  React Query     │    │
│  │  (전역 상태)      │              │  (서버 상태)      │    │
│  └──────────────────┘              └──────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API/서비스 계층                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │
│  │ clientAxios│  │memberAxios │  │ nestAxiosInstance  │   │
│  │ (공개)     │  │(인증 필요)  │  │ (NestJS 백엔드)    │   │
│  └────────────┘  └────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       백엔드 API                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │  수시    │  │  정시    │  │  결제    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 디자인 패턴
1. **Container/Presentational 패턴**: 비즈니스 로직과 UI 분리
2. **HOC 패턴**: Suspense를 사용한 지연 로딩
3. **Atomic Design**: 컴포넌트 계층 구조 (atoms → molecules → organisms → pages)
4. **Repository 패턴**: fetch 함수를 통한 중앙 집중식 API 호출
5. **상태 영속성**: localStorage 영속성을 가진 Recoil atoms

---

## 📁 프로젝트 구조

```
turtleschool_front/
├── public/                          # 정적 에셋
│   └── asset/
│       ├── image/                   # 이미지 (배너, 아이콘, 로고)
│       └── fonts/                   # 커스텀 폰트
│
├── src/
│   ├── api/                         # API 계층 (레거시)
│   │   ├── instance.ts              # Axios 인스턴스 (clientAxios, memberAxios)
│   │   ├── urls.ts                  # API 엔드포인트 정의
│   │   └── fetches/                 # API fetch 함수
│   │       ├── auth.ts              # 인증 API
│   │       ├── user.ts              # 사용자 관리 API
│   │       ├── earlyd.ts            # 수시 API
│   │       ├── essay.ts             # 논술 API
│   │       ├── mock.ts              # 모의고사 API
│   │       ├── officer.ts           # 평가 담당자 API
│   │       └── store.ts             # 스토어/결제 API
│   │
│   ├── apis/                        # API 계층 (신규/NestJS)
│   │   ├── nest-axios-instance.ts   # NestJS 백엔드 axios 인스턴스
│   │   ├── base-response.ts         # 응답 타입 정의
│   │   └── fetches/                 # 신규 API fetch 함수
│   │       ├── mock-exam-api.ts
│   │       ├── officer-evaluation.ts
│   │       ├── store-api.ts
│   │       └── susi-*.ts
│   │
│   ├── components/                  # 모던 UI 컴포넌트
│   │   ├── ui/                      # 기본 UI primitives (Radix + shadcn/ui)
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   ├── customs/                 # 커스텀 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── chart.tsx
│   │   │   └── risk-badge.tsx
│   │   ├── dialogs/                 # 다이얼로그 컴포넌트
│   │   │   ├── susi-comprehensive/
│   │   │   └── susi-subject/
│   │   ├── reports/                 # 리포트 컴포넌트
│   │   ├── score-visualizations/    # 차트 컴포넌트
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── main-nav.tsx
│   │
│   ├── components_legacy/           # 레거시 컴포넌트
│   │   ├── atom/                    # 원자 컴포넌트
│   │   ├── block/                   # 블록 레벨 컴포넌트
│   │   ├── common/                  # 공유 컴포넌트
│   │   └── pages/                   # 페이지 컴포넌트
│   │       ├── home/                # 홈 페이지
│   │       ├── jungsi/              # 정시
│   │       ├── suSi/                # 수시
│   │       ├── signIn/              # 로그인
│   │       ├── signUp/              # 회원가입
│   │       └── store/               # 전자상거래/결제
│   │
│   ├── pages/                       # 모던 페이지 컴포넌트
│   │   ├── susi/                    # 수시 페이지
│   │   │   ├── subject/             # 교과 전형
│   │   │   ├── comprehensive/       # 종합 전형
│   │   │   └── input-and-analysis/  # 데이터 입력 & 분석
│   │   ├── strategy/                # 전략 페이지
│   │   │   ├── interest/            # 관심 대학
│   │   │   └── combination/         # 지원 조합
│   │   ├── user/                    # 사용자 페이지
│   │   │   └── payment/             # 결제 페이지
│   │   └── errors/                  # 에러 페이지
│   │
│   ├── routes/                      # 라우팅 설정
│   │   ├── root.tsx                 # 루트 라우터
│   │   └── routes/                  # 서브 라우트 모듈
│   │       ├── user-routes.tsx
│   │       ├── susi-routes.tsx
│   │       ├── store-routes.tsx
│   │       └── explain-routes.tsx
│   │
│   ├── recoil/                      # 상태 관리
│   │   ├── atoms/                   # 전역 상태 atoms
│   │   │   ├── tokens-state.ts      # 인증 토큰
│   │   │   ├── user-info-state.ts   # 사용자 프로필
│   │   │   └── signup-state.ts      # 회원가입 폼 상태
│   │   └── selectors/               # 파생 상태 selectors
│   │       ├── fetch-*.selector.ts  # 데이터 페칭 selectors
│   │       └── my-*.selector.ts     # 사용자 데이터 selectors
│   │
│   ├── App.tsx                      # 애플리케이션 루트
│   ├── config.ts                    # 환경 설정
│   └── theme.ts                     # MUI 테마 설정
│
├── package.json
└── tsconfig.json
```

---

## ⚙️ 핵심 시스템

### 1. 애플리케이션 부트스트랩 (App.tsx)

```typescript
// src/App.tsx
function App() {
  return (
    <QueryClientProvider client={queryClient}>      // React Query - 서버 상태
      <RecoilRoot>                                   // Recoil - 전역 상태
        <ThemeProvider theme={muiTheme}>             // MUI 테마
          <RecoilNexus />                            // Recoil 브릿지
          <ReactQueryDevtools />                     // 개발 도구
          <RootRoutes />                             // 메인 라우터
          <Toaster richColors />                     // 토스트 알림
        </ThemeProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
}
```

**주요 기능:**
- **React Query**: `refetchOnWindowFocus: false`, `retry: false`로 서버 상태 캐싱
- **Recoil + RecoilNexus**: axios 인터셉터를 포함한 모든 곳에서 접근 가능한 전역 상태
- **MUI Theme**: 커스텀 타이포그래피, 색상 팔레트, 컴포넌트 오버라이드
- **지연 로딩**: Suspense fallback을 사용한 모든 라우트 지연 로딩

### 2. HTTP 클라이언트 설정

#### 세 개의 Axios 인스턴스:

**a) clientAxios** (공개 API)
```typescript
// src/api/instance.ts
export const clientAxios = axios.create({
  baseURL: config.devBaseUrl,
  withCredentials: true
});

// Request 인터셉터: 토큰 재발급을 위한 refreshToken 추가
// Response 인터셉터: C999 (토큰 만료) 처리 → 로그아웃 + 리다이렉트
```

**b) memberAxios** (인증 API)
```typescript
// src/api/instance.ts
export const memberAxios = axios.create({
  baseURL: config.devBaseUrl,
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': config.frontUrl,
    'Access-Control-Allow-Credentials': 'true'
  }
});

// Request 인터셉터: accessToken Bearer 헤더 추가
// Response 인터셉터:
//   - C5050: 세션 만료 → 로그아웃
//   - C401: 토큰 만료 → 자동 갱신 → 요청 재시도
//   - C999: 유효하지 않은 토큰 → 로그아웃
```

**c) nestAxiosInstance** (NestJS 백엔드)
```typescript
// src/apis/nest-axios-instance.ts
const nestAxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL2,
  withCredentials: true
});

// Request 인터셉터: Recoil 상태에서 accessToken 추가
```

### 3. 인증 흐름

```
┌─────────────┐
│  로그인 페이지 │
└──────┬──────┘
       │
       ├─────► 소셜 로그인 (Google/Naver/Kakao/Apple)
       │       └─► socialLoginFetch(oauthId) → 토큰
       │
       └─────► 이메일 로그인
               └─► emailLoginFetch(email, password) → 토큰
                   │
                   ▼
        ┌──────────────────────┐
        │ Recoil에 토큰 저장    │
        │ (영속화됨)            │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ 사용자 프로필 가져오기 │
        │ userInfo에 저장       │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ 홈으로 리다이렉트      │
        └──────────────────────┘

토큰 갱신 흐름:
┌──────────────┐
│ API 요청      │ (만료된 accessToken)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 401 C401     │ (토큰 만료)
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ tokenReissueFetch()  │ (refreshToken 사용)
└──────┬───────────────┘
       │
       ├─────► 성공 → accessToken 업데이트 → 원래 요청 재시도
       │
       └─────► 실패 → 로그아웃 → 로그인으로 리다이렉트
```

---

## 🔄 코드 흐름 & 데이터 흐름

### 페이지 로드 흐름

```
1. 사용자가 URL로 이동
   └─► React Router가 라우트 매칭
       └─► 페이지 컴포넌트 지연 로딩 (Suspense)
           └─► 페이지 컴포넌트 렌더링
               ├─► Recoil atoms 읽기 (user, tokens)
               ├─► React Query 또는 Recoil selectors를 통한 데이터 페칭
               │   └─► axios 인스턴스를 통한 API 호출
               │       └─► Request 인터셉터가 인증 헤더 추가
               │           └─► 백엔드 API
               │               └─► Response 인터셉터가 에러 처리
               │                   └─► 컴포넌트로 데이터 반환
               └─► 데이터와 함께 UI 렌더링
```

### 폼 제출 흐름 (예: 모의고사 입력)

```
1. 사용자가 폼 작성
   └─► react-hook-form이 폼 상태 관리
       └─► 제출 시 Zod 유효성 검사
           └─► API fetch 함수 호출
               └─► mockAddScoreFetch(data)
                   └─► memberAxios를 통한 POST
                       └─► 성공
                           ├─► React Query 캐시 무효화
                           ├─► 성공 토스트 표시
                           └─► 결과 페이지로 이동
```

### 상태 업데이트 흐름

```
사용자 액션
    │
    ▼
컴포넌트 이벤트 핸들러
    │
    ├─► Recoil Atom 업데이트 (전역 상태)
    │   └─► localStorage에 자동 영속화
    │
    └─► API 호출 트리거
        └─► React Query mutation
            └─► 성공 시:
                ├─► 쿼리 무효화
                ├─► 로컬 캐시 업데이트
                └─► 리렌더링 트리거
```

---

## 🌐 API 통합

### API 엔드포인트 구성

**기본 URL:**
- 레거시 백엔드: `REACT_APP_BASE_URL`
- NestJS 백엔드: `REACT_APP_BASE_URL2`

### API 카테고리 (src/api/urls.ts)

#### 인증 API
```typescript
- POST /auth/login/oauth2          // 소셜 로그인
- POST /auth/signup                // 이메일 회원가입
- POST /auth/signup/oauth2         // 소셜 회원가입
- POST /auth/login                 // 이메일 로그인
- GET  /auth/reissue               // 토큰 갱신
- POST /auth/logout                // 로그아웃
- POST /auth/findpw                // 비밀번호 재설정
```

#### 사용자 API
```typescript
- GET  /user/me                    // 사용자 프로필 조회
- PUT  /user/update                // 프로필 업데이트
```

#### 수시 API
```typescript
// 학교 기록 업로드
- POST /earlyd/lr/fileupload                    // 생활기록부 업로드
- POST /earlyd/three/grade/html/fileupload      // 성적 HTML 업로드
- POST /earlyd/three/grade/pdf/fileupload       // 성적 PDF 업로드

// 대학 검색
- POST /pearlyd/sr/search/list                  // 대학 검색
- POST /pearlyd/sr/gyo/list                     // 교과 기반 목록
- POST /pearlyd/sr/total/list                   // 종합 목록
- POST /pearlyd/sr/depart/info                  // 학과 정보
- POST /pearlyd/sr/interest/add                 // 관심 목록에 추가
```

#### 모의고사 API
```typescript
- POST /mock/add/score            // 모의고사 점수 추가
- POST /mock/add/marks            // 원점수 추가
- GET  /mock/list/raw             // 원점수 목록 조회
- GET  /mock/list/marks           // 점수 목록 조회
- GET  /mock/check/input          // 입력 여부 확인
```

#### 평가 담당자 API
```typescript
- POST /officer/profile/save      // 담당자 프로필 저장
- GET  /officer/profile/info      // 담당자 정보 조회
- GET  /officer/choose/list       // 평가자 목록 조회
- POST /officer/map/record        // 평가 티켓 사용
- POST /officer/add/result        // 평가 제출
- GET  /officer/survey/score/list // 평가 점수 조회
```

#### 결제 API
```typescript
- GET  /order/product/list        // 상품 목록 조회
- POST /pay/payments/preregi      // 결제 사전 등록
- POST /pay/payments/validate     // 결제 검증
- POST /pay/payments/cancel/request  // 환불 요청
- GET  /pay/detail/:id            // 주문 상세 조회
```

### API Fetch 패턴

**표준 Fetch 함수 구조:**

```typescript
// src/api/fetches/auth.ts
export interface EmailLoginParams {
  email: string | null;
  password: string | null;
}

export const emailLoginFetch = async ({
  email,
  password
}: EmailLoginParams) => {
  const res = await clientAxios.post(emailLoginAPI, {
    email,
    password
  });
  return res.data;
};
```

**컴포넌트에서의 사용:**

```typescript
// React Query 사용
const loginMutation = useMutation({
  mutationFn: emailLoginFetch,
  onSuccess: (data) => {
    setRecoil(tokenState, data.accessToken);
    navigate('/');
  }
});

// Recoil Selector 사용
const userInfo = useRecoilValue(userInfoSelector);
```

---

## 📊 상태 관리

### Recoil Atoms (전역 상태)

#### 1. 토큰 상태
```typescript
// src/recoil/atoms/tokens-state.ts
interface Tokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export const tokenState = atom<Tokens>({
  key: 'tokens',
  default: { accessToken: null, refreshToken: null },
  effects_UNSTABLE: [persistAtom]  // localStorage에 영속화
});
```

**용도:** RecoilNexus를 통한 axios 인터셉터의 인증 헤더

#### 2. 사용자 정보 상태
```typescript
// src/recoil/atoms/user-info-state.ts
export const userInfoState = atom<UserInfo>({
  key: 'userInfo',
  default: {
    id: null,
    email: null,
    nickname: null,
    phone: null,
    highschoolName: null,
    graduateYear: null,
    isOfficer: null,
    // ... 추가 필드
  },
  effects_UNSTABLE: [persistAtom]
});
```

**용도:** 사용자 프로필 표시, 기능 조건부 렌더링

#### 3. 회원가입 상태
```typescript
// src/recoil/atoms/signup-state.ts
export const signupState = atom({
  key: 'signup',
  default: {
    step: 1,
    formData: {},
    // ... 회원가입 흐름 상태
  }
});
```

### Recoil Selectors (파생 상태)

#### 예시: 학교 기록 조회 Selector
```typescript
// src/recoil/selectors/fetch-school-record-selector.ts
export const fetchSchoolRecordSelector = selector({
  key: 'fetchSchoolRecord',
  get: async ({ get }) => {
    const tokens = get(tokenState);
    if (!tokens.accessToken) return null;

    const response = await earlydStudentSchoolrecordListFetch();
    return response.data;
  }
});
```

**용도:** 의존성 변경 시 자동 데이터 페칭

### React Query (서버 상태)

**설정:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,  // 윈도우 포커스 시 재조회 안함
      retry: false                  // 실패한 요청 재시도 안함
    }
  }
});
```

**사용 패턴:**

```typescript
// Queries (GET)
const { data, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts
});

// Mutations (POST/PUT/DELETE)
const mutation = useMutation({
  mutationFn: addMockScore,
  onSuccess: () => {
    queryClient.invalidateQueries(['mockScores']);
  }
});
```

---

## 🛣️ 라우팅 시스템

### 라우트 계층 구조

```
/                          → 홈 (랜딩 페이지)
├── /user/*                → 사용자 라우트
│   ├── /signIn           → 로그인 페이지
│   ├── /signUp           → 회원가입 페이지
│   ├── /myPage           → 사용자 프로필
│   ├── /myInfo           → 프로필 편집
│   ├── /findPw           → 비밀번호 찾기
│   └── /payment          → 결제 내역
│       └── /:id          → 결제 상세
│
├── /susi/*                → 수시 라우트
│   ├── /subject          → 교과 전형
│   ├── /comprehensive    → 종합 전형
│   ├── /input-and-analysis/*
│   │   ├── /life-record       → 생활기록부 업로드
│   │   ├── /mock-exam         → 모의고사 입력
│   │   ├── /evaluation        → 평가 요청
│   │   ├── /evaluation-result → 평가 결과 조회
│   │   └── /compatibility     → 학과 적합도
│   ├── /st/*
│   │   ├── /interest          → 관심 대학
│   │   └── /combi             → 지원 조합
│   └── /officer/*             → 담당자 평가 시스템
│
├── /jungsi/*              → 정시 라우트
│
├── /store/*               → 전자상거래 라우트
│   ├── /product          → 상품 목록
│   ├── /order            → 결제
│   └── /orderlist        → 주문 내역
│       └── /details/:id  → 주문 상세
│
├── /explain/*             → 약관 & 정책
│   ├── /serviceUse       → 서비스 이용약관
│   ├── /privacyUse       → 개인정보 처리방침
│   └── /refundUse        → 환불 정책
│
├── /guide                 → 사용 가이드
└── /redirect              → OAuth 리다이렉트 핸들러
```

### 라우트 컴포넌트

**루트 라우터 (src/routes/root.tsx):**
```typescript
const RootRoutes = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <div className="flex min-h-screen justify-center">
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/user/*" element={<UserRoutes />} />
            <Route path="/susi/*" element={<SusiRoutes />} />
            <Route path="/jungsi/*" element={<K_정시 />} />
            <Route path="/store/*" element={<StoreRoutes />} />
            <Route path="/explain/*" element={<ExplainRoutes />} />
            <Route path="/guide" element={<GuidePage />} />
            <Route path="/*" element={<NotFoundError />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </BrowserRouter>
  );
};
```

**중첩 수시 라우트 (src/routes/routes/susi-routes.tsx):**
```typescript
const SusiRoutes = () => {
  return (
    <div className="flex w-full max-w-screen-xl">
      <SideNav />  {/* 수시 네비게이션 사이드바 */}
      <Routes>
        {/* 신규 페이지 */}
        <Route path="subject" element={<SusiSubjectPage />} />
        <Route path="comprehensive" element={<SusiComprehensivePage />} />

        {/* 레이아웃이 있는 입력 & 분석 */}
        <Route element={<InputAndAnalysisLayout />}>
          <Route path="input-and-analysis/life-record" element={<LifeRecordPage />} />
          <Route path="input-and-analysis/mock-exam" element={<MockExamPage />} />
          <Route path="input-and-analysis/evaluation" element={<EvaluationPage />} />
        </Route>

        {/* 레이아웃이 있는 전략 */}
        <Route element={<StrategyLayout />}>
          <Route path="st/interest" element={<InterestPage />} />
          <Route path="st/combi" element={<CombiPage />} />
        </Route>
      </Routes>
    </div>
  );
};
```

### 라우트 가드 & 보호

현재 라우트 보호는 다음을 통해 처리됩니다:
1. **Recoil의 토큰 확인**: 컴포넌트가 인증을 위해 `tokenState` 확인
2. **Axios 인터셉터**: 401 에러 시 로그인으로 리다이렉트
3. **조건부 렌더링**: `userInfoState`에 따라 다른 UI 표시

**예시:**
```typescript
const MyPage = () => {
  const tokens = useRecoilValue(tokenState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tokens.accessToken) {
      navigate('/user/signIn');
    }
  }, [tokens]);

  // ... 컴포넌트 로직
};
```

---

## 🧩 컴포넌트 아키텍처

### 컴포넌트 카테고리

#### 1. UI Primitives (src/components/ui/)
**Radix UI + shadcn/ui 기반 기본 컴포넌트:**
- `dialog.tsx` - 모달 다이얼로그
- `input.tsx` - 폼 입력
- `select.tsx` - 드롭다운 선택
- `checkbox.tsx` - 체크박스
- `tabs.tsx` - 탭 네비게이션
- `card.tsx` - 카드 컨테이너
- `alert-dialog.tsx` - 확인 다이얼로그

**디자인:** 스타일 없는 primitives + Tailwind CSS 스타일링

#### 2. 커스텀 컴포넌트 (src/components/customs/)
- `button.tsx` - 커스텀 버튼 변형
- `chart.tsx` - 차트 래퍼
- `risk-badge.tsx` - 위험도 표시 배지

#### 3. 다이얼로그 컴포넌트 (src/components/dialogs/)

**수시 종합 다이얼로그:**
```typescript
// src/components/dialogs/susi-comprehensive/index.tsx
export const SusiComprehensiveDialog = ({ univId, deptId }) => {
  return (
    <Dialog>
      <Tabs>
        <TabsList>
          <Tab>합격 예측</Tab>
          <Tab>학교 상세</Tab>
          <Tab>합격자 기록</Tab>
        </TabsList>
        <TabsContent value="predict">
          <SubjectPredictSection />
          <NonSubjectPredictSection />
          <CompatibilitySection />
        </TabsContent>
        <TabsContent value="detail">
          <DetailSection />
        </TabsContent>
        <TabsContent value="record">
          <SusiPassRecord />
        </TabsContent>
      </Tabs>
    </Dialog>
  );
};
```

#### 4. 시각화 컴포넌트 (src/components/score-visualizations/)
- `evaluation-radar-chart.tsx` - 평가 점수 레이더 차트
- `evaluation-score-chart.tsx` - 점수 막대 차트
- `my-grade-univ-chart.tsx` - 비교 차트
- `non-subject-grade-display.tsx` - 비교과 성적 표시

#### 5. 리포트 컴포넌트 (src/components/reports/)
- `comprehensive-report/` - 종합 평가 리포트
- `evaluation-report/` - 상세 평가 리포트
  - `evaluation-summary.tsx`
  - `evaluation-hakup.tsx` (학업 성취)
  - `evaluation-jinro.tsx` (진로)
  - `evaluation-gongdong.tsx` (공동체)

#### 6. 레거시 컴포넌트 (src/components_legacy/)

**Atomic Design 구조:**
- `atom/` - 기본 요소 (로고, 텍스트, 버튼)
- `block/` - 복합 블록 (푸터, 컨텐츠 박스)
- `common/` - 공유 컴포넌트 (테이블, 표시기, 필터)
- `pages/` - 전체 페이지 컴포넌트

**주요 레거시 페이지:**
- `home/` - 배너, 로그인, 비디오 섹션이 있는 랜딩 페이지
- `jungsi/` - 정시 시스템 (성적입력, 관심대학, 컨설팅)
- `suSi/` - 수시 시스템 (교과, 학종, 논술)
- `store/` - 전자상거래 (상품 목록, 주문, 결제)

### 컴포넌트 통신 패턴

#### 1. Props Drilling (부모 → 자식)
```typescript
<UnivSearchResults
  data={universities}
  onSelect={handleSelect}
  filters={filters}
/>
```

#### 2. Recoil 상태 (전역)
```typescript
// 모든 컴포넌트
const userInfo = useRecoilValue(userInfoState);
const setUserInfo = useSetRecoilState(userInfoState);
```

#### 3. React Query (서버 상태)
```typescript
// 부모가 페칭
const { data } = useQuery(['products'], fetchProducts);

// 자식이 표시
<ProductList products={data} />
```

#### 4. Context (지역 상태)
```typescript
// 폼 컨텍스트
const FormContext = createContext();

<FormContext.Provider value={formMethods}>
  <FormField />
  <FormSubmit />
</FormContext.Provider>
```

---

## 🔐 주요 기능 & 흐름

### 1. 모의고사 입력 흐름

```
사용자가 /susi/input-and-analysis/mock-exam으로 이동
    │
    ▼
컴포넌트 로드
    ├─► 모의고사 데이터 존재 여부 확인 (mockCheckInputFetch)
    │   └─► 존재하면 → 기존 데이터 로드
    │   └─► 없으면 → 빈 폼 표시
    │
    ▼
사용자가 폼 작성
    ├─► 시험 유형 선택 (6월/9월 평가원, 3월/4월 학력평가)
    ├─► 학년 선택 (3학년 1학기/2학기)
    ├─► 과목별 점수 입력
    │   └─► 국어, 수학, 영어, 과학/사회
    │
    ▼
사용자가 제출
    ├─► 폼 검증 (react-hook-form + zod)
    ├─► POST /mock/add/score
    │   └─► 성공
    │       ├─► 성공 토스트 표시
    │       ├─► 모의고사 점수 캐시 무효화
    │       └─► 분석 페이지로 이동
    │   └─► 에러
    │       └─► 에러 메시지 표시
```

### 2. 대학 검색 & 관심 흐름

```
사용자가 /susi/subject 또는 /susi/comprehensive로 이동
    │
    ▼
컴포넌트 로드
    ├─► 사용자의 학교 기록 조회 (존재하는 경우)
    ├─► 사용자의 모의고사 점수 조회 (존재하는 경우)
    ├─► 필터 조회 (지역, 대학 유형)
    │
    ▼
사용자가 필터 적용
    ├─► 지역 선택
    ├─► 대학 유형 (국립/사립)
    ├─► 학과 카테고리
    ├─► 전형 유형 필터
    │
    ▼
POST /pearlyd/sr/search/list (필터와 함께)
    │
    ▼
결과 테이블 표시
    ├─► 대학명
    ├─► 학과명
    ├─► 모집 인원
    ├─► 요구 점수
    ├─► 합격 가능성 예측 (위험도 표시기)
    │   └─► ⚠️ 색상 코드: 안전/적정/소신/위험
    │
    ▼
사용자가 행 클릭 → 상세 다이얼로그 열기
    ├─► 탭 1: 예측
    │   ├─► 교과 점수 예측
    │   ├─► 비교과 점수 예측
    │   └─► 적합도 분석
    ├─► 탭 2: 상세
    │   ├─► 입학 기준
    │   ├─► 점수 계산 방법
    │   └─► 필요 서류
    ├─► 탭 3: 합격 기록
    │   └─► 과거 합격/불합격 데이터
    │
    ▼
사용자가 "관심 추가" 버튼 클릭
    ├─► POST /pearlyd/sr/interest/add
    ├─► 성공 → 관심 목록에 표시
    └─► /susi/st/interest로 이동
```

### 3. 담당자 평가 흐름

```
사용자가 학교 기록 업로드 → 구조화된 데이터로 변환
    │
    ▼
사용자가 /susi/input-and-analysis/evaluation로 이동
    │
    ▼
평가 유형 선택
    ├─► 자가평가 (무료)
    └─► 담당자 평가 (유료, 티켓 필요)
    │
    ▼
티켓 개수 확인 (GET /officer/ticket/count)
    ├─► 티켓 있음 → 진행
    └─► 티켓 없음 → 스토어로 리다이렉트
    │
    ▼
목록에서 담당자 선택 (GET /officer/choose/list)
    ├─► 담당자 프로필 조회
    ├─► 전문 분야 조회
    └─► 담당자 선택
    │
    ▼
티켓 사용 (POST /officer/map/record)
    ├─► 티켓 차감
    └─► 평가 요청 생성
    │
    ▼
담당자의 평가 완료 대기
    │
    ▼
알림 수신 → 평가 결과 조회
    │
    ▼
/susi/input-and-analysis/evaluation-result로 이동
    ├─► 총점
    ├─► 카테고리별 세부 내용
    │   ├─► 학업역량
    │   ├─► 진로역량
    │   ├─► 공동체역량
    │   └─► 기타역량
    ├─► 레이더 차트 시각화
    ├─► 상세 코멘트
    └─► 평균과의 비교
```

### 4. 결제 흐름

```
사용자가 /store/product로 이동
    │
    ▼
상품 조회 (GET /order/product/list)
    ├─► 상품 카드 표시
    │   ├─► 상품명
    │   ├─► 가격
    │   ├─► 기능
    │   └─► "구매" 버튼
    │
    ▼
사용자가 상품 선택 → /store/order로 이동
    │
    ▼
주문 페이지
    ├─► 상품 정보
    ├─► 쿠폰 입력 필드
    ├─► 결제 방법 선택
    │   ├─► 신용카드
    │   ├─► 계좌이체
    │   └─► 모바일 결제
    ├─► 약관 동의 체크박스
    │
    ▼
사용자가 "결제" 버튼 클릭
    ├─► 쿠폰 검증 (입력된 경우)
    ├─► 결제 사전 등록 (POST /pay/payments/preregi)
    │   └─► 결제 ID 받기
    │
    ▼
결제 게이트웨이(PG) 열기
    ├─► 사용자가 PG에서 결제 완료
    │
    ▼
PG 콜백
    ├─► POST /pay/payments/validate (결제 검증)
    ├─► 성공
    │   ├─► 주문 기록 생성
    │   ├─► 사용자 티켓/크레딧 업데이트
    │   ├─► 확인 이메일 발송
    │   └─► 성공 페이지로 이동
    └─► 실패
        └─► 에러 표시 + 환불 안내
```

### 5. 학교 기록 업로드 & 처리

```
사용자가 /susi/input-and-analysis/life-record로 이동
    │
    ▼
업로드 옵션
    ├─► HTML 파일 (학교 포털에서)
    ├─► PDF 파일 (공식 문서)
    └─► 수동 입력
    │
    ▼
사용자가 HTML/PDF 업로드
    ├─► POST /earlyd/three/grade/html/fileupload
    └─► POST /earlyd/three/grade/pdf/fileupload
    │
    ▼
백엔드 처리
    ├─► 파일 파싱
    ├─► 과목별, 학기별 성적 추출
    ├─► GPA 계산
    ├─► 비교과 기록 추출
    │   ├─► 출석
    │   ├─► 수상
    │   ├─► 비교과 활동
    │   ├─► 봉사 시간
    │   └─► 진로 개발
    ├─► 데이터베이스에 저장
    │
    ▼
성공 → 파싱된 데이터 미리보기 표시
    ├─► 성적 요약 테이블
    ├─► 잘못된 데이터 수정 (필요한 경우)
    ├─► 확인 및 저장
    │
    ▼
다음 용도로 데이터 사용 가능
    ├─► 대학 검색 예측
    ├─► 적합도 분석
    ├─► 평가 요청
    └─► 리포트 생성
```

---

## 🎨 스타일링 & 테마

### 스타일링 접근 방식

1. **Tailwind CSS** (주요)
   - 유틸리티 우선 클래스
   - 반응형 디자인 유틸리티
   - 커스텀 색상 팔레트

2. **MUI Theme** (Material-UI 컴포넌트)
   ```typescript
   // src/theme.ts
   export const muiTheme = createTheme({
     palette: {
       primary: { main: '#ff5600' },  // 주황색
       secondary: { main: '#3360ff' }, // 파란색
       text: {
         primary: '#212121',
         secondary: '#9A9A9A',
         disabled: '#666'
       }
     },
     typography: {
       fontFamily: 'nanumsquare_regular, ...',
       // 커스텀 변형:
       'H1_Exbold, 36, 54': { fontSize: '36px', ... }
     }
   });
   ```

3. **SCSS 모듈** (레거시 컴포넌트)
   - 컴포넌트 범위 스타일
   - Sass 변수 및 믹스인

### 타이포그래피 시스템

**커스텀 MUI 타이포그래피 변형:**
- 명명: `{H|D}{숫자}_{굵기}, {크기}, {행높이}`
- 헤더: H1–H9 (20px–36px)
- 상세: D1–D9 (8px–18px)
- 굵기: Exbold, Bold, Regular, Light

**폰트 패밀리:**
- 주요: NanumSquare (Regular, Bold, ExtraBold, Light)
- 대체: Pretendard, Spoqa Han Sans Neo

---

## 🚀 빌드 & 배포

### 스크립트
```json
{
  "start": "react-scripts start",
  "start:prod": "env-cmd -f .env.production react-scripts start",
  "build": "env-cmd -f .env.production react-scripts --max-old-space-size=8000 build",
  "build:dev": "env-cmd -f .env.development react-scripts build"
}
```

### 환경 변수
```bash
# .env.development / .env.production
REACT_APP_BASE_URL=          # 레거시 백엔드 URL
REACT_APP_BASE_URL2=         # NestJS 백엔드 URL
REACT_APP_FRONT_URL=         # 프론트엔드 URL (CORS용)

# 소셜 로그인
REACT_APP_KAKAO_REST_API_LOGIN_KEY=
REACT_APP_NAVER_LOGIN_CLIENT_ID=
REACT_APP_GOOGLE_CLIENT_ID=

# Firebase (사용하는 경우)
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_PROJECT_ID=
# ... 추가 Firebase 설정
```

### 배포 흐름
```
1. 빌드: npm run build
   └─► /dist에 최적화된 프로덕션 번들 생성

2. CDN/서버에 배포
   └─► 정적 파일 제공
   └─► 백엔드로 API 요청 프록시

3. 환경별 설정
   └─► 프로덕션은 .env.production의 REACT_APP_BASE_URL 사용
```

---

## 📌 주요 관찰 사항 & 권장 사항

### 아키텍처 강점
✅ 명확한 관심사 분리 (API, 상태, 컴포넌트)
✅ TypeScript를 통한 타입 안전성
✅ 모던 상태 관리 (Recoil + React Query)
✅ axios 인터셉터의 포괄적인 에러 처리
✅ 토큰 자동 갱신 메커니즘
✅ 성능을 위한 지연 로딩

### 개선 영역
⚠️ **코드 중복**: 두 개의 API 레이어 (`/api`와 `/apis`) - 통합 고려
⚠️ **레거시 컴포넌트**: 레거시와 모던 컴포넌트 혼재 - 점진적 마이그레이션 필요
⚠️ **라우트 보호**: 컴포넌트별 확인 대신 적절한 라우트 가드 추가
⚠️ **타입 정의**: 일부 API 응답에 완전한 타입 정의 부족
⚠️ **에러 처리**: 컴포넌트의 일관성 없는 에러 처리
⚠️ **테스팅**: 테스트 파일 없음 - 단위 테스트 및 통합 테스트 추가

### 보안 고려사항
🔒 **토큰 저장**: localStorage 사용 (영속화된 Recoil) - httpOnly 쿠키 고려
🔒 **XSS 보호**: 적절한 입력 새니타이제이션 보장
🔒 **CORS**: 자격 증명이 포함된 적절한 CORS 설정

### 성능 최적화
⚡ **코드 분할**: 지연 로드 라우트 ✅ (이미 구현됨)
⚡ **쿼리 캐싱**: React Query 캐싱 ✅ (이미 구현됨)
⚡ **이미지 최적화**: 차세대 포맷 고려 (WebP, AVIF)
⚡ **번들 크기**: 모니터링 및 최적화 (현재 stats.html: 3MB)

---

## 📚 추가 리소스

### 관련 문서
- React Router v6: https://reactrouter.com/
- Recoil: https://recoiljs.org/
- React Query: https://tanstack.com/query/
- Material-UI: https://mui.com/
- Tailwind CSS: https://tailwindcss.com/

### 개발 도구
- React DevTools
- React Query DevTools (개발 환경에서 활성화)
- Redux DevTools (Recoil용)
- 브라우저 네트워크 인스펙터 (API 디버깅용)

---

## 🔄 데이터 흐름 요약

```
사용자 상호작용
    ↓
React 컴포넌트
    ↓
    ├─→ 로컬 상태 (useState, react-hook-form)
    │
    ├─→ 전역 상태 (Recoil atoms)
    │       ↓
    │   localStorage (영속화)
    │
    ├─→ 서버 상태 (React Query)
    │       ↓
    │   API Fetch 함수
    │       ↓
    │   Axios 인스턴스 (clientAxios/memberAxios/nestAxios)
    │       ↓
    │   Request 인터셉터 (인증 헤더 추가)
    │       ↓
    │   백엔드 API
    │       ↓
    │   Response 인터셉터 (에러 처리, 토큰 갱신)
    │       ↓
    │   컴포넌트 리렌더링
    │
    └─→ 부수 효과 (useEffect, mutations)
            ↓
        Navigate, Toast, 상태 업데이트
```

---

## 🎯 빠른 참조

### 가장 중요한 파일들
- `src/App.tsx` - 애플리케이션 진입점
- `src/routes/root.tsx` - 메인 라우팅 설정
- `src/api/instance.ts` - Axios 인스턴스 & 인터셉터
- `src/api/urls.ts` - API 엔드포인트 정의
- `src/recoil/atoms/tokens-state.ts` - 인증 상태
- `src/recoil/atoms/user-info-state.ts` - 사용자 프로필 상태

### 가장 중요한 흐름들
1. **인증**: 로그인 → 토큰 저장 → 자동 갱신 → 로그아웃
2. **데이터 입력**: 모의고사 / 학교 기록 업로드 → 검증 → 저장
3. **대학 검색**: 필터 적용 → 결과 조회 → 상세 보기 → 관심 추가
4. **평가**: 요청 → 담당자 배정 → 대기 → 결과 보기
5. **결제**: 상품 선택 → 결제 → PG 결제 → 확인

### 일반 작업
- **새 API 추가**: `/api/fetches/`에 fetch 함수 생성, `/api/urls.ts`에 URL 추가
- **새 페이지 추가**: `/pages/`에 생성, `/routes/routes/`에 라우트 추가
- **전역 상태 추가**: `/recoil/atoms/`에 atom 생성
- **UI 컴포넌트 추가**: `/components/ui/` 또는 `/components/customs/`에 생성

---

*문서 버전: 1.0*
*최종 업데이트: 2024*
*분석 코드베이스: TurtleSchool Frontend (_reference/turtleschool_front)*
