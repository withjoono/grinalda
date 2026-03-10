// 플래너 관련 타입 정의

/** 과목 색상 매핑 */
export const SUBJECT_COLORS: Record<string, string> = {
  국어: '#ef4444',    // red
  수학: '#eab308',    // yellow
  영어: '#f97316',    // orange
  사회: '#3b82f6',    // blue
  과학: '#3b82f6',    // blue
  사탐: '#3b82f6',    // blue
  과탐: '#3b82f6',    // blue
  한국사: '#a855f7',  // purple
  기타: '#6b7280',    // gray
}

/** 과목 정렬 순서 */
export const SUBJECT_ORDER: Record<string, number> = {
  국어: 1,
  수학: 2,
  사회: 3,
  영어: 4,
  과학: 5,
  한국사: 6,
  기타: 7,
}

/** 요일 */
export const DAYS = ['일', '월', '화', '수', '목', '금', '토']

/** 과목 목록 */
export const SUBJECTS = ['국어', '수학', '영어', '한국사', '과학', '사회']

/** 장기 계획 (plans 테이블) */
export interface Plan {
  id: number
  title: string
  subject: string
  step?: string
  range: [Date, Date] | string  // [시작일, 종료일]
  type: 'textbook' | 'lecture'  // 교재 or 강의
  material?: string             // 교재명/강의명
  total?: number                // 총 분량 (페이지/강수)
  done: number                  // 완료 분량
  person?: string               // 담당자
  isItem?: boolean              // 단기 항목 여부
  startTime?: string            // 시작 시간
  endTime?: string              // 종료 시간
  isItemDone?: boolean          // 항목 완료 여부
}

/** 일정 항목 (planneritems 테이블) */
export interface PlannerItem {
  id: number
  memberId: number
  primaryType: '학습' | '수업'  // 학습 or 수업
  subject: string
  teacher?: string
  title: string
  startDate: Date
  endDate: Date
  rRule?: string                // iCalendar 반복 규칙
  exDate?: string               // 제외 날짜
  late?: number                 // 지각 횟수
  absent?: number               // 결석 횟수
  description?: string
  progress?: number             // 성취도 (0-100)
  score?: number                // 점수
  rank?: number                 // 순위
  mentorRank?: number           // 멘토 순위
  mentorDesc?: string           // 멘토 코멘트
  mentorTest?: string           // 멘토 테스트
  studyType?: string
  studyContent?: string
  startPage?: number
  endPage?: number
  startSession?: number
  endSession?: number
  planDate?: Date
  achievement?: number
  taskStatus?: string
  test?: string
}

/** 루틴 (routines 테이블) */
export interface Routine {
  id: number
  title: string
  startTime: string             // "09:00"
  endTime: string               // "10:30"
  repeat: boolean
  date?: Date
  days: boolean[]               // [일, 월, 화, 수, 목, 금, 토]
  memberId: string
}

/** 플래너 클래스 (plannerclass 테이블) */
export interface PlannerClass {
  id: number
  plannerId: number             // 플래너 담당자 ID
  className: string             // 반 이름
  classCode: string             // 반 코드
  startDate: string             // 시작일 (yyyyMMdd)
  endDate?: string              // 종료일 (yyyyMMdd)
  useYn: 'Y' | 'N'
}

/** 플래너 관리 (plannermanagement 테이블) */
export interface PlannerManagement {
  id: number                    // 학생 ID
  plannerId: number             // 플래너 담당자 ID
  className: string             // 반 코드
  startDate: string             // 시작일 (yyyyMMdd)
  endDate?: string              // 종료일 (yyyyMMdd)
  useYn: 'Y' | 'N'
}

/** API 응답 공통 형식 */
export interface ApiResponse<T> {
  success: boolean
  msg: string
  data: T
}

/** 주간 성취도 그래프 데이터 */
export interface WeeklyProgress {
  primaryType: string
  memberId: number
  startDateDay: string
  comnCd: number
  comnNm: string
  avgProgress: number
}
