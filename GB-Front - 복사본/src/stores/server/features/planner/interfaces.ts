/**
 * 플래너 기능 인터페이스 정의
 */

// ─────────────────────────────────────────────────────
// 기본 타입
// ─────────────────────────────────────────────────────

export type RoutineCategory = 'fixed' | 'study' | 'rest' | 'other';
export type PeriodType = 'year' | 'semester' | 'vacation' | 'month' | 'custom';
export type MissionStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';
export type FeedbackType = 'praise' | 'encourage' | 'warning';
export type PrimaryType = '학습' | '수업';

// ─────────────────────────────────────────────────────
// 루틴 (Routine)
// ─────────────────────────────────────────────────────

export interface IRoutine {
  id: number;
  memberId: number;
  title: string;
  category: RoutineCategory;
  subject?: string;
  startTime: string;
  endTime: string;
  repeat: boolean;
  date?: string;
  days: boolean[];
  color?: string;
  sun?: boolean;
  mon?: boolean;
  tues?: boolean;
  wed?: boolean;
  thurs?: boolean;
  fri?: boolean;
  sat?: boolean;
}

export interface ICreateRoutineRequest {
  title: string;
  category: RoutineCategory;
  subject?: string;
  startTime: string;
  endTime: string;
  repeat: boolean;
  date?: string;
  days: boolean[];
  color?: string;
}

export interface IUpdateRoutineRequest extends ICreateRoutineRequest {
  id: number;
}

// ─────────────────────────────────────────────────────
// 장기 계획 (Plan)
// ─────────────────────────────────────────────────────

export interface IPlan {
  id: number;
  memberId: number;
  title: string;
  subject?: string;
  step?: string;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  type: number; // 0: 강의, 1: 교재
  material?: string;
  total?: number;
  done: number;
  person?: string;
  isItem: boolean;
  isItemDone: boolean;
  study?: {
    title: string;
    amount: number;
    finished: number;
    person?: string;
    type: 'textbook' | 'lecture';
  };
}

export interface ICreatePlanRequest {
  title: string;
  subject?: string;
  step?: string;
  startDay?: string;
  endDay?: string;
  type: 'textbook' | 'lecture';
  material?: string;
  amount?: number;
  finished?: number;
  person?: string;
}

export interface IUpdatePlanRequest extends ICreatePlanRequest {
  id: number;
}

export interface IUpdatePlanProgressRequest {
  id?: number;
  itemId: number;
  done: number;
}

// ─────────────────────────────────────────────────────
// 플래너 아이템 (일정)
// ─────────────────────────────────────────────────────

export interface IPlannerItem {
  id: number;
  memberId: number;
  primaryType: PrimaryType;
  subject?: string;
  teacher?: string;
  title: string;
  startDate: string;
  endDate: string;
  rRule?: string;
  exDate?: string;
  late?: boolean;
  absent?: boolean;
  description?: string;
  progress: number;
  score?: number;
  rank?: number;
  mentorRank?: number;
  mentorDesc?: string;
  mentorTest?: string;
  studyType?: string;
  studyContent?: string;
  planDate?: string;
  achievement?: number;
  taskStatus?: string;
  test?: string;
  startPage?: number;
  endPage?: number;
  startSession?: number;
  endSession?: number;
}

export interface ICreatePlannerItemRequest {
  primaryType: PrimaryType;
  subject?: string;
  teacher?: string;
  title: string;
  startDate: string;
  endDate: string;
  rRule?: string;
  exDate?: string;
  description?: string;
  progress?: number;
  studyType?: string;
  studyContent?: string;
  startPage?: number;
  endPage?: number;
  startSession?: number;
  endSession?: number;
}

export interface IUpdatePlannerItemRequest extends ICreatePlannerItemRequest {
  id: number;
  late?: boolean;
  absent?: boolean;
  score?: number;
  rank?: number;
  mentorRank?: number;
  mentorDesc?: string;
  mentorTest?: string;
}

// ─────────────────────────────────────────────────────
// 주간 성취도
// ─────────────────────────────────────────────────────

export interface IWeeklyProgress {
  primaryType: string;
  memberId: number;
  startDateDay: string;
  comnCd: number;
  comnNm: string;
  avgProgress: number;
}

// ─────────────────────────────────────────────────────
// 멘토/클래스 관련
// ─────────────────────────────────────────────────────

export interface IPlannerMentor {
  id: number;
  name: string;
  subject?: string;
  profileImage?: string;
  phone?: string;
}

export interface INotice {
  id: number;
  title: string;
  content?: string;
  date: string;
  isImportant: boolean;
}

export interface IRankInfo {
  myRank: number;
  totalStudents: number;
  myAchievement: number;
  dailyAchievement: number;
  weeklyAchievement: number;
  monthlyAchievement: number;
}

export interface IPlannerClass {
  id: number;
  highschool?: string;
  univ?: string;
  department?: string;
  account: string;
  userName: string;
  age?: number;
  cellphone?: string;
  email?: string;
  region?: string;
  imgPath?: string;
  cls: string;
  clsNm: string;
  school?: string;
  clsCount: number;
  memCount: number;
}

export interface IClassMember {
  id: number;
  userName: string;
  cls: string;
  school?: string;
}

export interface ISetPlannerClassRequest {
  plannerId: number;
  classCode: string;
  className: string;
  startDate: string;
  endDate?: string;
}

// ─────────────────────────────────────────────────────
// 멘토 피드백
// ─────────────────────────────────────────────────────

export interface IMentorFeedback {
  id: number;
  missionId: number;
  mentorId: number;
  rating: 1 | 2 | 3 | 4 | 5;
  type: FeedbackType;
  comment: string;
  checkedAt: string;
}

export interface ICreateFeedbackRequest {
  itemId: number;
  rating: 1 | 2 | 3 | 4 | 5;
  type: FeedbackType;
  comment: string;
  mentorRank?: number;
  mentorDesc?: string;
}

// ─────────────────────────────────────────────────────
// 일일 미션 (프론트엔드 확장)
// ─────────────────────────────────────────────────────

export interface IDailyMission {
  id: number;
  memberId: number;
  date: string;
  planId: number;
  subject: string;
  title: string;
  description?: string;
  targetAmount: number;
  completedAmount: number;
  achievement: number;
  status: MissionStatus;
  startTime?: string;
  endTime?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  studentMemo?: string;
  mentorFeedback?: IMentorFeedback;
}

export interface IUpdateMissionAchievementRequest {
  itemId: number;
  progress: number;
  description?: string;
}




