# TurtleSchool Frontend - Architecture Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Project Structure](#project-structure)
5. [Core Systems](#core-systems)
6. [Code Flow & Data Flow](#code-flow--data-flow)
7. [API Integration](#api-integration)
8. [State Management](#state-management)
9. [Routing System](#routing-system)
10. [Component Architecture](#component-architecture)

---

## 📖 Project Overview

**TurtleSchool Frontend** is a React-based web application designed for Korean college admission consulting services. It provides two main services:
- **수시 (Susi)**: Early admission consulting for comprehensive and subject-specific evaluations
- **정시 (Jungsi)**: Regular admission consulting based on standardized test scores

The application helps students analyze their academic performance, evaluate university compatibility, and make informed decisions about college applications.

---

## 🛠️ Technology Stack

### Core Framework & Libraries
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

### Key Dependencies
- **UI Components**: Material-UI (@mui), Radix UI primitives
- **Data Visualization**: Recharts, Nivo charts, Chart.js
- **Forms**: react-hook-form, zod validation
- **HTTP Client**: Axios 1.3.5
- **Authentication**: Social login (Google, Naver, Kakao, Apple)
- **State Persistence**: recoil-persist
- **Notifications**: Sonner toast library

---

## 🏗️ Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Interface Layer                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Header  │  │  Footer  │  │  Pages   │  │Components│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   State Management Layer                     │
│  ┌──────────────────┐              ┌──────────────────┐    │
│  │  Recoil Atoms    │◄────────────►│  React Query     │    │
│  │  (Global State)  │              │  (Server State)  │    │
│  └──────────────────┘              └──────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      API/Service Layer                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐   │
│  │ clientAxios│  │memberAxios │  │ nestAxiosInstance  │   │
│  │ (Public)   │  │(Authed)    │  │ (NestJS Backend)   │   │
│  └────────────┘  └────────────┘  └────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                       Backend APIs                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Auth    │  │  Susi    │  │  Jungsi  │  │  Payment │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Design Patterns
1. **Container/Presentational Pattern**: Separation of business logic and UI
2. **HOC Pattern**: Lazy loading with Suspense
3. **Atomic Design**: Component hierarchy (atoms → molecules → organisms → pages)
4. **Repository Pattern**: Centralized API calls through fetch functions
5. **State Persistence**: Recoil atoms with localStorage persistence

---

## 📁 Project Structure

```
turtleschool_front/
├── public/                          # Static assets
│   └── asset/
│       ├── image/                   # Images (banners, icons, logos)
│       └── fonts/                   # Custom fonts
│
├── src/
│   ├── api/                         # API Layer (Legacy)
│   │   ├── instance.ts              # Axios instances (clientAxios, memberAxios)
│   │   ├── urls.ts                  # API endpoint definitions
│   │   └── fetches/                 # API fetch functions
│   │       ├── auth.ts              # Authentication APIs
│   │       ├── user.ts              # User management APIs
│   │       ├── earlyd.ts            # Susi (early admission) APIs
│   │       ├── essay.ts             # Essay/논술 APIs
│   │       ├── mock.ts              # Mock exam APIs
│   │       ├── officer.ts           # Evaluation officer APIs
│   │       └── store.ts             # Store/payment APIs
│   │
│   ├── apis/                        # API Layer (New/NestJS)
│   │   ├── nest-axios-instance.ts   # NestJS backend axios instance
│   │   ├── base-response.ts         # Response type definitions
│   │   └── fetches/                 # New API fetch functions
│   │       ├── mock-exam-api.ts
│   │       ├── officer-evaluation.ts
│   │       ├── store-api.ts
│   │       └── susi-*.ts
│   │
│   ├── components/                  # Modern UI Components
│   │   ├── ui/                      # Base UI primitives (Radix + shadcn/ui)
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   ├── customs/                 # Custom components
│   │   │   ├── button.tsx
│   │   │   ├── chart.tsx
│   │   │   └── risk-badge.tsx
│   │   ├── dialogs/                 # Dialog components
│   │   │   ├── susi-comprehensive/
│   │   │   └── susi-subject/
│   │   ├── reports/                 # Report components
│   │   ├── score-visualizations/    # Chart components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── main-nav.tsx
│   │
│   ├── components_legacy/           # Legacy Components
│   │   ├── atom/                    # Atomic components
│   │   ├── block/                   # Block-level components
│   │   ├── common/                  # Shared components
│   │   └── pages/                   # Page components
│   │       ├── home/                # Home page
│   │       ├── jungsi/              # Jungsi (regular admission)
│   │       ├── suSi/                # Susi (early admission)
│   │       ├── signIn/              # Login
│   │       ├── signUp/              # Registration
│   │       └── store/               # E-commerce/payments
│   │
│   ├── pages/                       # Modern Page Components
│   │   ├── susi/                    # Susi pages
│   │   │   ├── subject/             # Subject-based admission
│   │   │   ├── comprehensive/       # Comprehensive admission
│   │   │   └── input-and-analysis/  # Data input & analysis
│   │   ├── strategy/                # Strategy pages
│   │   │   ├── interest/            # Interest universities
│   │   │   └── combination/         # Application combinations
│   │   ├── user/                    # User pages
│   │   │   └── payment/             # Payment pages
│   │   └── errors/                  # Error pages
│   │
│   ├── routes/                      # Routing Configuration
│   │   ├── root.tsx                 # Root router
│   │   └── routes/                  # Sub-route modules
│   │       ├── user-routes.tsx
│   │       ├── susi-routes.tsx
│   │       ├── store-routes.tsx
│   │       └── explain-routes.tsx
│   │
│   ├── recoil/                      # State Management
│   │   ├── atoms/                   # Global state atoms
│   │   │   ├── tokens-state.ts      # Auth tokens
│   │   │   ├── user-info-state.ts   # User profile
│   │   │   └── signup-state.ts      # Signup form state
│   │   └── selectors/               # Derived state selectors
│   │       ├── fetch-*.selector.ts  # Data fetching selectors
│   │       └── my-*.selector.ts     # User data selectors
│   │
│   ├── App.tsx                      # Application root
│   ├── config.ts                    # Environment configuration
│   └── theme.ts                     # MUI theme configuration
│
├── package.json
└── tsconfig.json
```

---

## ⚙️ Core Systems

### 1. Application Bootstrap (App.tsx)

```typescript
// src/App.tsx
function App() {
  return (
    <QueryClientProvider client={queryClient}>      // React Query for server state
      <RecoilRoot>                                   // Recoil for global state
        <ThemeProvider theme={muiTheme}>             // MUI theming
          <RecoilNexus />                            // Recoil bridge for non-React code
          <ReactQueryDevtools />                     // Dev tools
          <RootRoutes />                             // Main router
          <Toaster richColors />                     // Toast notifications
        </ThemeProvider>
      </RecoilRoot>
    </QueryClientProvider>
  );
}
```

**Key Features:**
- **React Query**: Server state caching with `refetchOnWindowFocus: false`, `retry: false`
- **Recoil + RecoilNexus**: Global state accessible from anywhere including axios interceptors
- **MUI Theme**: Custom typography, color palette, component overrides
- **Lazy Loading**: All routes lazy loaded with Suspense fallback

### 2. HTTP Client Configuration

#### Three Axios Instances:

**a) clientAxios** (Public API)
```typescript
// src/api/instance.ts
export const clientAxios = axios.create({
  baseURL: config.devBaseUrl,
  withCredentials: true
});

// Request interceptor: Add refreshToken for token reissue
// Response interceptor: Handle C999 (token expired) → logout + redirect
```

**b) memberAxios** (Authenticated API)
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

// Request interceptor: Add accessToken Bearer header
// Response interceptor:
//   - C5050: Session expired → logout
//   - C401: Token expired → auto-refresh → retry request
//   - C999: Invalid token → logout
```

**c) nestAxiosInstance** (NestJS Backend)
```typescript
// src/apis/nest-axios-instance.ts
const nestAxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL2,
  withCredentials: true
});

// Request interceptor: Add accessToken from Recoil state
```

### 3. Authentication Flow

```
┌─────────────┐
│  Login Page │
└──────┬──────┘
       │
       ├─────► Social Login (Google/Naver/Kakao/Apple)
       │       └─► socialLoginFetch(oauthId) → tokens
       │
       └─────► Email Login
               └─► emailLoginFetch(email, password) → tokens
                   │
                   ▼
        ┌──────────────────────┐
        │ Store tokens in      │
        │ Recoil (persisted)   │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Fetch user profile   │
        │ Store in userInfo    │
        └──────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Redirect to Home     │
        └──────────────────────┘

Token Refresh Flow:
┌──────────────┐
│ API Request  │ (with expired accessToken)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 401 C401     │ (Token expired)
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ tokenReissueFetch()  │ (using refreshToken)
└──────┬───────────────┘
       │
       ├─────► Success → Update accessToken → Retry original request
       │
       └─────► Failure → Logout → Redirect to login
```

---

## 🔄 Code Flow & Data Flow

### Page Load Flow

```
1. User navigates to URL
   └─► React Router matches route
       └─► Lazy load page component (Suspense)
           └─► Page component renders
               ├─► Read Recoil atoms (user, tokens)
               ├─► Fetch data via React Query or Recoil selectors
               │   └─► API call via axios instance
               │       └─► Request interceptor adds auth headers
               │           └─► Backend API
               │               └─► Response interceptor handles errors
               │                   └─► Data returned to component
               └─► Render UI with data
```

### Form Submission Flow (Example: Mock Exam Input)

```
1. User fills form
   └─► react-hook-form manages form state
       └─► Zod validation on submit
           └─► Call API fetch function
               └─► mockAddScoreFetch(data)
                   └─► POST via memberAxios
                       └─► Success
                           ├─► Invalidate React Query cache
                           ├─► Show success toast
                           └─► Navigate to results page
```

### State Update Flow

```
User Action
    │
    ▼
Component Event Handler
    │
    ├─► Update Recoil Atom (global state)
    │   └─► Auto-persisted to localStorage
    │
    └─► Trigger API Call
        └─► React Query mutation
            └─► On success:
                ├─► Invalidate queries
                ├─► Update local cache
                └─► Trigger re-render
```

---

## 🌐 API Integration

### API Endpoint Organization

**Base URLs:**
- Legacy Backend: `REACT_APP_BASE_URL`
- NestJS Backend: `REACT_APP_BASE_URL2`

### API Categories (src/api/urls.ts)

#### Authentication APIs
```typescript
- POST /auth/login/oauth2          // Social login
- POST /auth/signup                // Email signup
- POST /auth/signup/oauth2         // Social signup
- POST /auth/login                 // Email login
- GET  /auth/reissue               // Token refresh
- POST /auth/logout                // Logout
- POST /auth/findpw                // Password reset
```

#### User APIs
```typescript
- GET  /user/me                    // Get user profile
- PUT  /user/update                // Update profile
```

#### Susi (Early Admission) APIs
```typescript
// School record upload
- POST /earlyd/lr/fileupload                    // Life record upload
- POST /earlyd/three/grade/html/fileupload      // Grade HTML upload
- POST /earlyd/three/grade/pdf/fileupload       // Grade PDF upload

// University search
- POST /pearlyd/sr/search/list                  // Search universities
- POST /pearlyd/sr/gyo/list                     // Subject-based list
- POST /pearlyd/sr/total/list                   // Comprehensive list
- POST /pearlyd/sr/depart/info                  // Department info
- POST /pearlyd/sr/interest/add                 // Add to interest list
```

#### Mock Exam APIs
```typescript
- POST /mock/add/score            // Add mock exam scores
- POST /mock/add/marks            // Add raw marks
- GET  /mock/list/raw             // Get raw scores
- GET  /mock/list/marks           // Get marks
- GET  /mock/check/input          // Check if input exists
```

#### Officer Evaluation APIs
```typescript
- POST /officer/profile/save      // Save officer profile
- GET  /officer/profile/info      // Get officer info
- GET  /officer/choose/list       // Get evaluator list
- POST /officer/map/record        // Use evaluation ticket
- POST /officer/add/result        // Submit evaluation
- GET  /officer/survey/score/list // Get evaluation scores
```

#### Payment APIs
```typescript
- GET  /order/product/list        // Get product list
- POST /pay/payments/preregi      // Pre-register payment
- POST /pay/payments/validate     // Validate payment
- POST /pay/payments/cancel/request  // Request refund
- GET  /pay/detail/:id            // Get order details
```

### API Fetch Pattern

**Standard Fetch Function Structure:**

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

**Usage in Components:**

```typescript
// Using React Query
const loginMutation = useMutation({
  mutationFn: emailLoginFetch,
  onSuccess: (data) => {
    setRecoil(tokenState, data.accessToken);
    navigate('/');
  }
});

// Using Recoil Selector
const userInfo = useRecoilValue(userInfoSelector);
```

---

## 📊 State Management

### Recoil Atoms (Global State)

#### 1. Token State
```typescript
// src/recoil/atoms/tokens-state.ts
interface Tokens {
  accessToken: string | null;
  refreshToken: string | null;
}

export const tokenState = atom<Tokens>({
  key: 'tokens',
  default: { accessToken: null, refreshToken: null },
  effects_UNSTABLE: [persistAtom]  // Persisted to localStorage
});
```

**Usage:** Auth headers in axios interceptors via RecoilNexus

#### 2. User Info State
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
    // ... more fields
  },
  effects_UNSTABLE: [persistAtom]
});
```

**Usage:** Display user profile, conditionally render features

#### 3. Signup State
```typescript
// src/recoil/atoms/signup-state.ts
export const signupState = atom({
  key: 'signup',
  default: {
    step: 1,
    formData: {},
    // ... signup flow state
  }
});
```

### Recoil Selectors (Derived State)

#### Example: Fetch School Record Selector
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

**Usage:** Automatic data fetching when dependencies change

### React Query (Server State)

**Configuration:**
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,  // Don't refetch on window focus
      retry: false                  // Don't retry failed requests
    }
  }
});
```

**Usage Patterns:**

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

## 🛣️ Routing System

### Route Hierarchy

```
/                          → Home (Landing page)
├── /user/*                → User routes
│   ├── /signIn           → Login page
│   ├── /signUp           → Registration page
│   ├── /myPage           → User profile
│   ├── /myInfo           → Edit profile
│   ├── /findPw           → Password recovery
│   └── /payment          → Payment history
│       └── /:id          → Payment detail
│
├── /susi/*                → Susi (Early Admission) routes
│   ├── /subject          → Subject-based admission
│   ├── /comprehensive    → Comprehensive admission
│   ├── /input-and-analysis/*
│   │   ├── /life-record       → Upload school records
│   │   ├── /mock-exam         → Mock exam input
│   │   ├── /evaluation        → Request evaluation
│   │   ├── /evaluation-result → View evaluation
│   │   └── /compatibility     → Department compatibility
│   ├── /st/*
│   │   ├── /interest          → Interest universities
│   │   └── /combi             → Application combinations
│   └── /officer/*             → Officer evaluation system
│
├── /jungsi/*              → Jungsi (Regular Admission) routes
│
├── /store/*               → E-commerce routes
│   ├── /product          → Product listing
│   ├── /order            → Checkout
│   └── /orderlist        → Order history
│       └── /details/:id  → Order detail
│
├── /explain/*             → Terms & policies
│   ├── /serviceUse       → Terms of service
│   ├── /privacyUse       → Privacy policy
│   └── /refundUse        → Refund policy
│
├── /guide                 → User guide
└── /redirect              → OAuth redirect handler
```

### Route Components

**Root Router (src/routes/root.tsx):**
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

**Nested Susi Routes (src/routes/routes/susi-routes.tsx):**
```typescript
const SusiRoutes = () => {
  return (
    <div className="flex w-full max-w-screen-xl">
      <SideNav />  {/* Susi navigation sidebar */}
      <Routes>
        {/* New pages */}
        <Route path="subject" element={<SusiSubjectPage />} />
        <Route path="comprehensive" element={<SusiComprehensivePage />} />

        {/* Input & Analysis with layout */}
        <Route element={<InputAndAnalysisLayout />}>
          <Route path="input-and-analysis/life-record" element={<LifeRecordPage />} />
          <Route path="input-and-analysis/mock-exam" element={<MockExamPage />} />
          <Route path="input-and-analysis/evaluation" element={<EvaluationPage />} />
        </Route>

        {/* Strategy with layout */}
        <Route element={<StrategyLayout />}>
          <Route path="st/interest" element={<InterestPage />} />
          <Route path="st/combi" element={<CombiPage />} />
        </Route>
      </Routes>
    </div>
  );
};
```

### Route Guards & Protection

Currently, route protection is handled via:
1. **Token check in Recoil**: Components check `tokenState` for authentication
2. **Axios interceptors**: Redirect to login on 401 errors
3. **Conditional rendering**: Show different UI based on `userInfoState`

**Example:**
```typescript
const MyPage = () => {
  const tokens = useRecoilValue(tokenState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tokens.accessToken) {
      navigate('/user/signIn');
    }
  }, [tokens]);

  // ... component logic
};
```

---

## 🧩 Component Architecture

### Component Categories

#### 1. UI Primitives (src/components/ui/)
**Base components built on Radix UI + shadcn/ui:**
- `dialog.tsx` - Modal dialogs
- `input.tsx` - Form inputs
- `select.tsx` - Dropdown selects
- `checkbox.tsx` - Checkboxes
- `tabs.tsx` - Tab navigation
- `card.tsx` - Card containers
- `alert-dialog.tsx` - Confirmation dialogs

**Design:** Unstyled primitives + Tailwind CSS styling

#### 2. Custom Components (src/components/customs/)
- `button.tsx` - Custom button variants
- `chart.tsx` - Chart wrappers
- `risk-badge.tsx` - Risk indicator badges

#### 3. Dialog Components (src/components/dialogs/)

**Susi Comprehensive Dialog:**
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

#### 4. Visualization Components (src/components/score-visualizations/)
- `evaluation-radar-chart.tsx` - Radar chart for evaluation scores
- `evaluation-score-chart.tsx` - Bar chart for scores
- `my-grade-univ-chart.tsx` - Comparison chart
- `non-subject-grade-display.tsx` - Non-subject grade display

#### 5. Report Components (src/components/reports/)
- `comprehensive-report/` - Comprehensive evaluation reports
- `evaluation-report/` - Detailed evaluation reports
  - `evaluation-summary.tsx`
  - `evaluation-hakup.tsx` (academic performance)
  - `evaluation-jinro.tsx` (career path)
  - `evaluation-gongdong.tsx` (community service)

#### 6. Legacy Components (src/components_legacy/)

**Atomic Design Structure:**
- `atom/` - Basic elements (logos, text, buttons)
- `block/` - Composite blocks (footer, content boxes)
- `common/` - Shared components (tables, indicators, filters)
- `pages/` - Full page components

**Key Legacy Pages:**
- `home/` - Landing page with banners, login, video sections
- `jungsi/` - Regular admission system (성적입력, 관심대학, 컨설팅)
- `suSi/` - Early admission system (교과, 학종, 논술)
- `store/` - E-commerce (product list, order, payment)

### Component Communication Patterns

#### 1. Props Drilling (Parent → Child)
```typescript
<UnivSearchResults
  data={universities}
  onSelect={handleSelect}
  filters={filters}
/>
```

#### 2. Recoil State (Global)
```typescript
// Any component
const userInfo = useRecoilValue(userInfoState);
const setUserInfo = useSetRecoilState(userInfoState);
```

#### 3. React Query (Server State)
```typescript
// Parent fetches
const { data } = useQuery(['products'], fetchProducts);

// Child displays
<ProductList products={data} />
```

#### 4. Context (Localized State)
```typescript
// Form context
const FormContext = createContext();

<FormContext.Provider value={formMethods}>
  <FormField />
  <FormSubmit />
</FormContext.Provider>
```

---

## 🔐 Key Features & Flows

### 1. Mock Exam Input Flow

```
User navigates to /susi/input-and-analysis/mock-exam
    │
    ▼
Component loads
    ├─► Check if mock exam data exists (mockCheckInputFetch)
    │   └─► If exists → Load existing data
    │   └─► If not → Show empty form
    │
    ▼
User fills form
    ├─► Select exam type (6월/9월 평가원, 3월/4월 학력평가)
    ├─► Select grade (3학년 1학기/2학기)
    ├─► Enter scores by subject
    │   └─► Korean, Math, English, Science/Social
    │
    ▼
User submits
    ├─► Validate form (react-hook-form + zod)
    ├─► POST /mock/add/score
    │   └─► Success
    │       ├─► Show success toast
    │       ├─► Invalidate mock score cache
    │       └─► Navigate to analysis page
    │   └─► Error
    │       └─► Show error message
```

### 2. University Search & Interest Flow

```
User navigates to /susi/subject or /susi/comprehensive
    │
    ▼
Component loads
    ├─► Fetch user's school record (if exists)
    ├─► Fetch user's mock exam scores (if exists)
    ├─► Fetch filters (regions, university types)
    │
    ▼
User applies filters
    ├─► Region selection
    ├─► University type (national/private)
    ├─► Department category
    ├─► Admission type filter
    │
    ▼
POST /pearlyd/sr/search/list (with filters)
    │
    ▼
Display results table
    ├─► University name
    ├─► Department name
    ├─► Admission quota
    ├─► Required scores
    ├─► Predicted pass probability (risk indicator)
    │   └─► ⚠️ Color-coded: 안전/적정/소신/위험
    │
    ▼
User clicks row → Open detail dialog
    ├─► Tab 1: Prediction
    │   ├─► Subject score prediction
    │   ├─► Non-subject score prediction
    │   └─► Compatibility analysis
    ├─► Tab 2: Detail
    │   ├─► Admission criteria
    │   ├─► Score calculation method
    │   └─► Required documents
    ├─► Tab 3: Pass Records
    │   └─► Historical pass/fail data
    │
    ▼
User clicks "Add to Interest" button
    ├─► POST /pearlyd/sr/interest/add
    ├─► Success → Show in interest list
    └─► Navigate to /susi/st/interest
```

### 3. Officer Evaluation Flow

```
User uploads school record → Converted to structured data
    │
    ▼
User navigates to /susi/input-and-analysis/evaluation
    │
    ▼
Select evaluation type
    ├─► Self-evaluation (free)
    └─► Officer evaluation (paid, requires ticket)
    │
    ▼
Check ticket count (GET /officer/ticket/count)
    ├─► Has tickets → Proceed
    └─► No tickets → Redirect to store
    │
    ▼
Select officer from list (GET /officer/choose/list)
    ├─► View officer profile
    ├─► View specialization
    └─► Select officer
    │
    ▼
Use ticket (POST /officer/map/record)
    ├─► Ticket consumed
    └─► Evaluation request created
    │
    ▼
Wait for officer to complete evaluation
    │
    ▼
Notification received → View evaluation result
    │
    ▼
Navigate to /susi/input-and-analysis/evaluation-result
    ├─► Overall score (총점)
    ├─► Category breakdown
    │   ├─► 학업역량 (Academic ability)
    │   ├─► 진로역량 (Career readiness)
    │   ├─► 공동체역량 (Community involvement)
    │   └─► 기타역량 (Other abilities)
    ├─► Radar chart visualization
    ├─► Detailed comments
    └─► Comparison with average
```

### 4. Payment Flow

```
User navigates to /store/product
    │
    ▼
Fetch products (GET /order/product/list)
    ├─► Display product cards
    │   ├─► Product name
    │   ├─► Price
    │   ├─► Features
    │   └─► "Purchase" button
    │
    ▼
User selects product → Navigate to /store/order
    │
    ▼
Order page
    ├─► Product information
    ├─► Coupon input field
    ├─► Payment method selection
    │   ├─► Credit card
    │   ├─► Bank transfer
    │   └─► Mobile payment
    ├─► Terms agreement checkboxes
    │
    ▼
User clicks "Pay" button
    ├─► Validate coupon (if entered)
    ├─► Pre-register payment (POST /pay/payments/preregi)
    │   └─► Get payment ID
    │
    ▼
Open payment gateway (PG)
    ├─► User completes payment on PG
    │
    ▼
PG callback
    ├─► POST /pay/payments/validate (verify payment)
    ├─► Success
    │   ├─► Create order record
    │   ├─► Update user tickets/credits
    │   ├─► Send confirmation email
    │   └─► Navigate to success page
    └─► Failure
        └─► Show error + refund instructions
```

### 5. School Record Upload & Processing

```
User navigates to /susi/input-and-analysis/life-record
    │
    ▼
Upload options
    ├─► HTML file (from school portal)
    ├─► PDF file (official document)
    └─► Manual input
    │
    ▼
User uploads HTML/PDF
    ├─► POST /earlyd/three/grade/html/fileupload
    └─► POST /earlyd/three/grade/pdf/fileupload
    │
    ▼
Backend processing
    ├─► Parse file
    ├─► Extract grades by subject, semester
    ├─► Calculate GPA
    ├─► Extract non-subject records
    │   ├─► Attendance
    │   ├─► Awards
    │   ├─► Extracurricular activities
    │   ├─► Volunteer hours
    │   └─► Career development
    ├─► Store in database
    │
    ▼
Success → Show parsed data preview
    ├─► Grade summary table
    ├─► Edit incorrect data (if needed)
    ├─► Confirm and save
    │
    ▼
Data available for
    ├─► University search predictions
    ├─► Compatibility analysis
    ├─► Evaluation requests
    └─► Report generation
```

---

## 🎨 Styling & Theming

### Styling Approaches

1. **Tailwind CSS** (Primary)
   - Utility-first classes
   - Responsive design utilities
   - Custom color palette

2. **MUI Theme** (Material-UI components)
   ```typescript
   // src/theme.ts
   export const muiTheme = createTheme({
     palette: {
       primary: { main: '#ff5600' },  // Orange
       secondary: { main: '#3360ff' }, // Blue
       text: {
         primary: '#212121',
         secondary: '#9A9A9A',
         disabled: '#666'
       }
     },
     typography: {
       fontFamily: 'nanumsquare_regular, ...',
       // Custom variants:
       'H1_Exbold, 36, 54': { fontSize: '36px', ... }
     }
   });
   ```

3. **SCSS Modules** (Legacy components)
   - Component-scoped styles
   - Sass variables and mixins

### Typography System

**Custom MUI Typography Variants:**
- Naming: `{H|D}{number}_{weight}, {size}, {lineHeight}`
- Headers: H1–H9 (20px–36px)
- Details: D1–D9 (8px–18px)
- Weights: Exbold, Bold, Regular, Light

**Font Families:**
- Primary: NanumSquare (Regular, Bold, ExtraBold, Light)
- Alternative: Pretendard, Spoqa Han Sans Neo

---

## 🚀 Build & Deployment

### Scripts
```json
{
  "start": "react-scripts start",
  "start:prod": "env-cmd -f .env.production react-scripts start",
  "build": "env-cmd -f .env.production react-scripts --max-old-space-size=8000 build",
  "build:dev": "env-cmd -f .env.development react-scripts build"
}
```

### Environment Variables
```bash
# .env.development / .env.production
REACT_APP_BASE_URL=          # Legacy backend URL
REACT_APP_BASE_URL2=         # NestJS backend URL
REACT_APP_FRONT_URL=         # Frontend URL (for CORS)

# Social Login
REACT_APP_KAKAO_REST_API_LOGIN_KEY=
REACT_APP_NAVER_LOGIN_CLIENT_ID=
REACT_APP_GOOGLE_CLIENT_ID=

# Firebase (if used)
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_PROJECT_ID=
# ... more Firebase config
```

### Deployment Flow
```
1. Build: npm run build
   └─► Generates optimized production bundle in /dist

2. Deploy to CDN/Server
   └─► Static files served
   └─► API requests proxied to backend

3. Environment-specific config
   └─► Production uses REACT_APP_BASE_URL from .env.production
```

---

## 📌 Key Observations & Recommendations

### Architecture Strengths
✅ Clear separation of concerns (API, state, components)
✅ Type safety with TypeScript
✅ Modern state management (Recoil + React Query)
✅ Comprehensive error handling in axios interceptors
✅ Token auto-refresh mechanism
✅ Lazy loading for performance

### Areas for Improvement
⚠️ **Code Duplication**: Two API layers (`/api` and `/apis`) - consider consolidation
⚠️ **Legacy Components**: Mix of legacy and modern components - gradual migration needed
⚠️ **Route Protection**: Add proper route guards instead of per-component checks
⚠️ **Type Definitions**: Some API responses lack full type definitions
⚠️ **Error Handling**: Inconsistent error handling in components
⚠️ **Testing**: No visible test files - add unit and integration tests

### Security Considerations
🔒 **Token Storage**: Using localStorage (persisted Recoil) - consider httpOnly cookies
🔒 **XSS Protection**: Ensure proper input sanitization
🔒 **CORS**: Proper CORS configuration with credentials

### Performance Optimizations
⚡ **Code Splitting**: Lazy load routes ✅ (already implemented)
⚡ **Query Caching**: React Query caching ✅ (already implemented)
⚡ **Image Optimization**: Consider next-gen formats (WebP, AVIF)
⚡ **Bundle Size**: Monitor and optimize (current stats.html: 3MB)

---

## 📚 Additional Resources

### Related Documentation
- React Router v6: https://reactrouter.com/
- Recoil: https://recoiljs.org/
- React Query: https://tanstack.com/query/
- Material-UI: https://mui.com/
- Tailwind CSS: https://tailwindcss.com/

### Development Tools
- React DevTools
- React Query DevTools (enabled in dev)
- Redux DevTools (for Recoil)
- Browser network inspector (for API debugging)

---

## 🔄 Data Flow Summary

```
User Interaction
    ↓
React Component
    ↓
    ├─→ Local State (useState, react-hook-form)
    │
    ├─→ Global State (Recoil atoms)
    │       ↓
    │   localStorage (persisted)
    │
    ├─→ Server State (React Query)
    │       ↓
    │   API Fetch Functions
    │       ↓
    │   Axios Instances (clientAxios/memberAxios/nestAxios)
    │       ↓
    │   Request Interceptors (add auth headers)
    │       ↓
    │   Backend API
    │       ↓
    │   Response Interceptors (handle errors, refresh tokens)
    │       ↓
    │   Component Re-render
    │
    └─→ Side Effects (useEffect, mutations)
            ↓
        Navigate, Toast, Update state
```

---

## 🎯 Quick Reference

### Most Important Files
- `src/App.tsx` - Application entry point
- `src/routes/root.tsx` - Main routing configuration
- `src/api/instance.ts` - Axios instances & interceptors
- `src/api/urls.ts` - API endpoint definitions
- `src/recoil/atoms/tokens-state.ts` - Authentication state
- `src/recoil/atoms/user-info-state.ts` - User profile state

### Most Important Flows
1. **Authentication**: Login → Store tokens → Auto-refresh → Logout
2. **Data Input**: Mock exam / School record upload → Validation → Storage
3. **University Search**: Apply filters → Fetch results → View details → Add to interest
4. **Evaluation**: Request → Officer assignment → Wait → View results
5. **Payment**: Select product → Checkout → PG payment → Confirmation

### Common Tasks
- **Add new API**: Create fetch function in `/api/fetches/`, add URL to `/api/urls.ts`
- **Add new page**: Create in `/pages/`, add route in `/routes/routes/`
- **Add global state**: Create atom in `/recoil/atoms/`
- **Add UI component**: Create in `/components/ui/` or `/components/customs/`

---

*Document Version: 1.0*
*Last Updated: 2024*
*Analyzed Code Base: TurtleSchool Frontend (_reference/turtleschool_front)*
