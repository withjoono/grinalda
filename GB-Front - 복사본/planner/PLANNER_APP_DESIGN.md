# 플래너 앱 설계 문서

## 🎯 핵심 워크플로우

```
┌─────────────────────────────────────────────────────────────────┐
│                        플래너 작성 흐름                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1️⃣ 주간 루틴 정하기                                            │
│     └─ 고정 일과 설정 (수업, 식사, 수면, 운동 등)                  │
│                    ↓                                            │
│  2️⃣ 학습 가능 시간 파악                                          │
│     └─ 루틴 외 빈 시간 = 과목별 학습 시간으로 배분                 │
│                    ↓                                            │
│  3️⃣ 장기 계획 수립                                               │
│     └─ 년/학기/방학/월 단위 목표 설정                             │
│        (교재 몇 페이지, 강의 몇 강 등)                            │
│                    ↓                                            │
│  4️⃣ 자동 분배                                                    │
│     └─ 장기 계획 → 주간 루틴의 과목별 시간에 맞춰                  │
│        주간/일간 미션 자동 생성                                   │
│                    ↓                                            │
│  5️⃣ 일간 계획 작성                                               │
│     └─ 주어진 미션 기반으로 시간 단위 상세 계획 직접 작성          │
│                    ↓                                            │
│  6️⃣ 성취도 입력                                                  │
│     └─ 학생이 하루 미션 완료 후 성취도(%) 입력                     │
│                    ↓                                            │
│  7️⃣ 멘토 검사                                                    │
│     └─ 멘토가 성취도 확인, 평가, 피드백 작성                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📱 화면 구성

### 1. 메인 탭 구조

```
┌──────────────────────────────────────────────────────────────┐
│  [🏠 홈]  [📅 주간]  [📋 일간]  [📊 통계]  [⚙️ 설정]           │
└──────────────────────────────────────────────────────────────┘
```

### 2. 각 화면 상세

#### 🏠 홈 (대시보드)
- 오늘의 미션 요약
- 오늘 성취도
- 이번 주 진행률
- 멘토 최근 피드백

#### 📅 주간 뷰
- 주간 타임테이블 (루틴 + 학습 계획)
- 요일별 미션 목록
- 과목별 시간 배분 현황

#### 📋 일간 뷰
- 시간대별 상세 계획
- 오늘의 미션 체크리스트
- 성취도 입력
- 메모/회고

#### 📊 통계
- 주간/월간 성취도 그래프
- 과목별 학습 시간
- 장기 계획 진행률
- 랭킹 (클래스 내)

#### ⚙️ 설정
- 주간 루틴 관리
- 장기 계획 관리
- 프로필

---

## 🗂️ 데이터 구조

### 1. 루틴 (Routine) - 확장

```typescript
interface Routine {
  id: number
  memberId: number
  title: string
  category: RoutineCategory  // 🆕 카테고리 추가
  subject?: string           // 🆕 학습 루틴인 경우 과목
  startTime: string          // "09:00"
  endTime: string            // "10:30"
  repeat: boolean
  days: boolean[]            // [일, 월, 화, 수, 목, 금, 토]
  color?: string             // 🆕 색상
}

type RoutineCategory = 
  | 'fixed'      // 고정 일과 (수업, 식사, 수면 등)
  | 'study'      // 학습 시간 (과목별)
  | 'rest'       // 휴식
  | 'other'      // 기타
```

### 2. 장기 계획 (LongTermPlan) - 확장

```typescript
interface LongTermPlan {
  id: number
  memberId: number
  title: string
  subject: string
  periodType: PeriodType     // 🆕 기간 유형
  startDate: Date
  endDate: Date
  type: 'textbook' | 'lecture'
  material: string           // 교재명/강의명
  totalAmount: number        // 총 분량
  completedAmount: number    // 완료 분량
  dailyTarget?: number       // 🆕 일일 목표량 (자동 계산)
  weeklyTarget?: number      // 🆕 주간 목표량 (자동 계산)
  priority: number           // 🆕 우선순위
}

type PeriodType = 
  | 'year'       // 년간
  | 'semester'   // 학기
  | 'vacation'   // 방학
  | 'month'      // 월간
  | 'custom'     // 사용자 정의
```

### 3. 일일 미션 (DailyMission) - 🆕 새로 추가

```typescript
interface DailyMission {
  id: number
  memberId: number
  date: Date
  planId: number             // 연결된 장기 계획
  subject: string
  title: string              // "수학 개념원리 p.45~52"
  targetAmount: number       // 목표량
  completedAmount: number    // 완료량
  achievement: number        // 성취도 (0-100)
  status: MissionStatus
  startTime?: string         // 배정된 시간
  endTime?: string
  studentMemo?: string       // 학생 메모
  mentorFeedback?: MentorFeedback  // 멘토 피드백
}

type MissionStatus = 
  | 'pending'     // 대기
  | 'in_progress' // 진행중
  | 'completed'   // 완료
  | 'skipped'     // 건너뜀

interface MentorFeedback {
  rating: 1 | 2 | 3 | 4 | 5  // 평가 점수
  type: 'praise' | 'encourage' | 'warning'  // 칭찬/격려/분발요구
  comment: string
  checkedAt: Date
  mentorId: number
}
```

### 4. 일간 계획 (DailySchedule) - 🆕 새로 추가

```typescript
interface DailySchedule {
  id: number
  memberId: number
  date: Date
  timeSlots: TimeSlot[]
  totalStudyMinutes: number  // 총 학습 시간
  completedMinutes: number   // 완료된 학습 시간
  dailyReview?: string       // 하루 회고
}

interface TimeSlot {
  id: number
  startTime: string          // "09:00"
  endTime: string            // "10:30"
  type: 'routine' | 'study' | 'mission' | 'free'
  routineId?: number         // 루틴 연결
  missionId?: number         // 미션 연결
  title: string
  subject?: string
  isCompleted: boolean
  actualStartTime?: string   // 실제 시작 시간
  actualEndTime?: string     // 실제 종료 시간
}
```

---

## 🔄 자동 분배 로직

### 1. 학습 가능 시간 계산

```
하루 24시간
 - 수면 루틴 (7시간)
 - 식사 루틴 (2시간)
 - 학교/학원 수업 (8시간)
 - 기타 고정 일과 (1시간)
────────────────────
= 학습 가능 시간 (6시간)
```

### 2. 과목별 시간 배분

```
학습 루틴에서 설정:
- 국어: 1.5시간/일
- 수학: 2시간/일
- 영어: 1시간/일
- 탐구: 1.5시간/일
```

### 3. 장기 계획 → 일일 미션 변환

```
장기 계획: 수학 개념원리 300페이지 / 30일
    ↓
일일 목표: 10페이지/일
    ↓
주간 루틴의 수학 시간 (2시간)에 배정
    ↓
일일 미션 생성: "수학 개념원리 p.41~50 (2시간)"
```

---

## 📁 컴포넌트 구조

```
frontend/
├── components/
│   ├── common/
│   │   ├── TimeSlot.tsx          # 시간 슬롯 UI
│   │   ├── ProgressBar.tsx       # 진행률 바
│   │   ├── SubjectBadge.tsx      # 과목 뱃지
│   │   └── MissionCard.tsx       # 미션 카드
│   │
│   ├── routine/
│   │   ├── RoutineForm.tsx       # 루틴 폼 (기존, 확장)
│   │   ├── RoutineList.tsx       # 루틴 목록
│   │   └── WeeklyRoutineView.tsx # 🆕 주간 루틴 타임테이블
│   │
│   ├── plan/
│   │   ├── PlanForm.tsx          # 장기 계획 폼 (기존, 확장)
│   │   ├── PlanList.tsx          # 장기 계획 목록 (기존)
│   │   └── PlanProgress.tsx      # 🆕 계획 진행률 뷰
│   │
│   ├── weekly/
│   │   ├── WeeklyView.tsx        # 🆕 주간 뷰 메인
│   │   ├── WeeklyMissions.tsx    # 🆕 주간 미션 목록
│   │   └── WeeklyStats.tsx       # 🆕 주간 통계
│   │
│   ├── daily/
│   │   ├── DailyView.tsx         # 🆕 일간 뷰 메인
│   │   ├── DailyTimeline.tsx     # 🆕 시간대별 타임라인
│   │   ├── DailyMissions.tsx     # 🆕 오늘의 미션
│   │   ├── AchievementInput.tsx  # 🆕 성취도 입력
│   │   └── DailyReview.tsx       # 🆕 하루 회고
│   │
│   ├── mentor/
│   │   ├── MentorDashboard.tsx   # 🆕 멘토 대시보드
│   │   ├── StudentList.tsx       # 🆕 학생 목록
│   │   ├── FeedbackForm.tsx      # 🆕 피드백 입력
│   │   └── FeedbackHistory.tsx   # 🆕 피드백 히스토리
│   │
│   └── stats/
│       ├── WeeklyProgressChart.tsx  # 주간 성취도 차트 (기존)
│       ├── SubjectTimeChart.tsx     # 🆕 과목별 시간 차트
│       └── RankingView.tsx          # 🆕 랭킹 뷰
│
├── hooks/
│   ├── useRoutines.ts            # 🆕 루틴 관리 훅
│   ├── usePlans.ts               # 🆕 장기 계획 훅
│   ├── useMissions.ts            # 🆕 미션 관리 훅
│   └── useAutoDistribute.ts      # 🆕 자동 분배 로직 훅
│
├── utils/
│   ├── timeUtils.ts              # 🆕 시간 계산 유틸
│   ├── distributionUtils.ts      # 🆕 분배 계산 유틸
│   └── missionGenerator.ts       # 🆕 미션 자동 생성
│
├── types.ts                      # 타입 정의 (확장)
└── index.ts                      # export
```

---

## 🚀 개발 우선순위

### Phase 1: 기초 구조 (1주)
- [ ] 타입 확장
- [ ] 루틴 카테고리 추가
- [ ] 기본 레이아웃

### Phase 2: 주간 루틴 (1주)
- [ ] WeeklyRoutineView 개발
- [ ] 학습 가능 시간 계산
- [ ] 과목별 시간 배분 UI

### Phase 3: 장기 계획 & 자동 분배 (1.5주)
- [ ] 장기 계획 기간 유형 추가
- [ ] 자동 분배 로직 구현
- [ ] 일일 미션 자동 생성

### Phase 4: 일간 플래너 (1.5주)
- [ ] DailyView 개발
- [ ] 시간대별 계획 작성
- [ ] 성취도 입력 UI

### Phase 5: 멘토 시스템 (1주)
- [ ] 멘토 대시보드
- [ ] 피드백 시스템
- [ ] 알림

---

## 🎨 UI/UX 가이드라인

### 색상 팔레트
- Primary: Orange (#f97316)
- 국어: Red (#ef4444)
- 수학: Yellow (#eab308)
- 영어: Orange (#f97316)
- 탐구: Blue (#3b82f6)
- 한국사: Purple (#a855f7)

### 타임테이블 뷰
- 30분 단위 그리드
- 드래그&드롭으로 일정 조정
- 색상으로 과목/카테고리 구분

### 성취도 입력
- 슬라이더 (0-100%)
- 퀵 버튼 (25%, 50%, 75%, 100%)
- 이모지로 기분 표시




