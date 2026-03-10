# 플래너 기능 (Planner Feature)

학습 계획 및 일정 관리 기능입니다. **주간 루틴 기반**으로 장기 학습계획을 세우고, **자동으로 일일 미션을 생성**하며, 성취도를 추적합니다.

## 🎯 핵심 워크플로우

```
1️⃣ 주간 루틴 정하기
   └─ 고정 일과 (수업, 식사, 수면) + 과목별 학습 시간 설정
              ↓
2️⃣ 학습 가능 시간 파악
   └─ 루틴 외 빈 시간 = 과목별 학습 시간으로 자동 배분
              ↓
3️⃣ 장기 계획 수립
   └─ 년/학기/방학/월 단위 목표 설정 (교재/강의 분량)
              ↓
4️⃣ 자동 분배 ✨
   └─ 장기 계획 → 주간/일간 미션 자동 생성
              ↓
5️⃣ 일간 계획 확인 & 실행
   └─ 타임라인에서 오늘의 미션 확인 → 학습 → 성취도 입력
              ↓
6️⃣ 멘토 검사 & 피드백
   └─ 멘토가 성취도 확인, 평가(별점), 피드백 작성
```

## 📁 폴더 구조

```
planner/
├── frontend/
│   ├── types.ts                 # 타입 정의 및 상수
│   ├── index.ts                 # 컴포넌트/유틸 export
│   │
│   ├── components/
│   │   ├── RoutineForm.tsx      # 루틴 폼 (카테고리 지원)
│   │   ├── WeeklyRoutineView.tsx # 주간 루틴 타임테이블
│   │   ├── LongTermPlanForm.tsx # 장기 계획 폼
│   │   ├── DailyMissionCard.tsx # 일일 미션 카드
│   │   ├── DailyTimeline.tsx    # 일간 타임라인 뷰
│   │   ├── MentorFeedbackForm.tsx # 멘토 피드백 폼
│   │   ├── StudentMissionCard.tsx # 학생 미션 카드 (멘토용)
│   │   ├── PlanForm.tsx         # 계획 폼 (기존)
│   │   ├── PlanList.tsx         # 계획 목록
│   │   ├── ScheduleForm.tsx     # 일정 폼
│   │   ├── WeeklyProgressChart.tsx # 주간 성취도 차트
│   │   └── StatusTabs.tsx       # 탭 컴포넌트
│   │
│   └── utils/
│       └── distributionUtils.ts # 자동 분배 로직
│
├── PLANNER_APP_DESIGN.md        # 상세 설계 문서
└── README.md                    # 이 파일
```

## 🔧 주요 컴포넌트

### 1. WeeklyRoutineView - 주간 루틴 타임테이블

```tsx
import { WeeklyRoutineView } from '@/features/planner/frontend';

<WeeklyRoutineView
  routines={routines}
  onRoutineClick={handleEdit}
  onEmptySlotClick={(dayIndex, time) => handleAdd(dayIndex, time)}
  showStats={true}
/>
```

### 2. LongTermPlanForm - 장기 계획 폼

```tsx
import { LongTermPlanForm } from '@/features/planner/frontend';

<LongTermPlanForm
  onSubmit={handlePlanSubmit}
  onCancel={() => router.back()}
/>
// 기간 유형: 년/학기/방학/월
// 일일/주간 목표 자동 계산
```

### 3. DailyTimeline - 일간 타임라인

```tsx
import { DailyTimeline } from '@/features/planner/frontend';

<DailyTimeline
  date={new Date()}
  routines={routines}
  missions={todayMissions}
  currentTime={new Date()}  // 현재 시간 표시
  onMissionClick={handleMissionClick}
/>
```

### 4. DailyMissionCard - 일일 미션 카드

```tsx
import { DailyMissionCard } from '@/features/planner/frontend';

<DailyMissionCard
  mission={mission}
  onAchievementSubmit={handleAchievement}
  onStatusChange={handleStatusChange}
/>
// 퀵 버튼 (0/25/50/75/100%)
// 상세 입력 (슬라이더, 완료량, 메모)
```

### 5. MentorFeedbackForm - 멘토 피드백

```tsx
import { MentorFeedbackForm } from '@/features/planner/frontend';

<MentorFeedbackForm
  mission={selectedMission}
  onSubmit={handleFeedback}
  onCancel={() => setSelectedMission(null)}
/>
// 평가 점수 (별 5개)
// 피드백 유형 (칭찬/격려/분발요청)
// 빠른 코멘트 템플릿
```

### 6. StudentMissionCard - 학생 미션 카드 (멘토용)

```tsx
import { StudentMissionCard } from '@/features/planner/frontend';

<StudentMissionCard
  student={student}
  missions={studentMissions}
  date={new Date()}
  onFeedbackClick={handleFeedback}
/>
// 피드백 필요 뱃지
// 미션별 상세 정보
```

## 🔄 자동 분배 로직

### 사용법

```typescript
import { 
  distributePlansToMissions,
  extractSubjectWeeklyTime,
  calculateAvailableStudyTime 
} from '@/features/planner/frontend';

// 1. 과목별 주간 학습 시간 추출
const subjectTimes = extractSubjectWeeklyTime(routines);
// → { subject: '수학', totalMinutes: 840, dailyMinutes: [0, 120, 120, ...] }

// 2. 학습 가능 시간 계산
const available = calculateAvailableStudyTime(routines);
// → { totalWeeklyMinutes: 2520, bySubject: { 수학: 840, ... }, freeTimeByDay: [...] }

// 3. 장기 계획 → 일일 미션 자동 분배
const result = distributePlansToMissions(plans, routines, {
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31'),
  memberId: 1,
  prioritizeHighPriority: true,
});

console.log(result.missions);   // 생성된 미션 배열
console.log(result.warnings);   // 경고 메시지
console.log(result.summary);    // 요약 통계
```

### 분배 알고리즘

1. **과목별 학습 시간 추출**: 주간 루틴에서 `category: 'study'`인 루틴 분석
2. **일일 목표량 계산**: `남은 분량 / 남은 일수` (학습 요일 가중치 적용)
3. **미션 생성**: 각 날짜에 해당 과목 루틴이 있으면 미션 생성
4. **시간 배정**: 루틴의 시작/종료 시간을 미션에 자동 배정

## 📊 타입 정의

### 루틴 카테고리
```typescript
type RoutineCategory = 'fixed' | 'study' | 'rest' | 'other'
```

### 기간 유형
```typescript
type PeriodType = 'year' | 'semester' | 'vacation' | 'month' | 'custom'
```

### 미션 상태
```typescript
type MissionStatus = 'pending' | 'in_progress' | 'completed' | 'skipped'
```

### 피드백 유형
```typescript
type FeedbackType = 'praise' | 'encourage' | 'warning'
```

## 🎨 과목 색상

```typescript
const SUBJECT_COLORS = {
  국어: '#ef4444',     // red
  수학: '#eab308',     // yellow
  영어: '#f97316',     // orange
  사회: '#3b82f6',     // blue
  과학: '#14b8a6',     // teal
  한국사: '#a855f7',   // purple
  제2외국어: '#6366f1', // indigo
  기타: '#6b7280',     // gray
}
```

## 📱 사용 시나리오

### 학생 플로우
1. **설정** → 주간 루틴 설정 (WeeklyRoutineView + RoutineForm)
2. **계획** → 장기 학습 계획 등록 (LongTermPlanForm)
3. **매일** → DailyTimeline에서 미션 확인 → 학습 → DailyMissionCard로 성취도 입력
4. **확인** → 멘토 피드백 확인

### 멘토 플로우
1. **대시보드** → StudentMissionCard로 담당 학생 목록 확인
2. **검사** → 학생별 오늘 미션 & 성취도 확인
3. **피드백** → MentorFeedbackForm으로 평가 + 코멘트 작성

## 🔗 백엔드 연동

백엔드는 `GB-Back-Nest/src/modules/planner/`에 구현되어 있습니다.

### 플래너 전용 개발 환경
```bash
# GB-Back-Nest 프로젝트에서
npm run start:planner   # 포트 4002, DB: planner_dev
```

## ✅ 구현 완료

- [x] 타입 확장 (루틴 카테고리, 장기계획, 일일미션)
- [x] 주간 루틴 타임테이블 (WeeklyRoutineView)
- [x] 장기 계획 폼 (LongTermPlanForm)
- [x] 일일 미션 카드 (DailyMissionCard)
- [x] 일간 타임라인 (DailyTimeline)
- [x] 자동 분배 로직 (distributionUtils)
- [x] 멘토 피드백 폼 (MentorFeedbackForm)
- [x] 학생 미션 카드 (StudentMissionCard)

## 라이선스
내부 프로젝트용
