/**
 * 멘토링 기능 API 인터페이스
 */

// 사용자 관계 타입
export type RelationType = 'student' | 'parent' | 'teacher' | null

// 관계 코드 맵
export const RELATION_CODE_MAP = {
  STUDENT_NORMAL: '10',
  PARENT: '20',
  STUDENT_PREMIUM: '30',
  TEACHER_NORMAL: '40',
  TEACHER_PREMIUM: '50',
  TEACHER_ADMIN: '70',
} as const

// 연동된 학생 정보
export interface ILinkedStudent {
  id: number
  memberId: string
  name: string
  nickname: string
  school: string
  grade: string
  class?: string
  linkedAt: string
  allowedServices: string[]
}

// 연동된 자녀 정보 (학부모용)
export interface ILinkedChild {
  id: number
  memberId: string
  name: string
  nickname: string
  school: string
  grade: string
  linkedAt: string
  allowedServices: string[]
}

// 연동된 멘토 정보 (학생용)
export interface ILinkedMentor {
  id: number
  memberId: string
  name: string
  nickname: string
  type: 'teacher' | 'parent'
  linkedAt: string
}

// 메모
export interface IMemo {
  id: number
  content: string
  authorType: 'mentor' | 'student'
  authorId: string
  authorName: string
  targetStudentId: string
  createdAt: string
  updatedAt: string
  isRead: boolean
}

// 연계 코드 생성 응답
export interface IGenerateCodeResponse {
  code: string
  expiresAt: string
  expiresInSeconds: number
}

// 연계 코드 검증 응답
export interface IVerifyCodeResponse {
  isValid: boolean
  mentorInfo?: {
    memberId: string
    name: string
    nickname: string
    type: 'teacher' | 'parent'
  }
}

// 계정 연동 요청
export interface ILinkAccountRequest {
  code: string
}

// 계정 연동 응답
export interface ILinkAccountResponse {
  success: boolean
  linkId: number
  message?: string
}

// 서비스 권한 설정 요청
export interface IUpdateServicePermissionRequest {
  linkId: number
  allowedServices: string[]
}

// 메모 생성 요청
export interface ICreateMemoRequest {
  targetStudentId: string
  content: string
}

// 메모 수정 요청
export interface IUpdateMemoRequest {
  memoId: number
  content: string
}

// 멘토링 관계 정보
export interface IMentoringRelation {
  id: number
  mentorId: string
  mentorType: 'teacher' | 'parent'
  studentId: string
  linkedAt: string
  status: 'active' | 'pending' | 'inactive'
  allowedServices: string[]
}

// 서비스 목록
export const MENTORING_SERVICES = [
  { key: 'planner', label: '플래너', description: '학습 계획 및 일정 관리' },
  { key: 'grade-analysis', label: '내신 성적 관리', description: '내신 성적 분석 및 추이' },
  { key: 'mock-analysis', label: '모의고사 성적 관리', description: '모의고사 성적 분석' },
  { key: 'susi', label: '수시 컨설팅', description: '수시 지원 전략 컨설팅' },
  { key: 'jungsi', label: '정시 합격 예측', description: '정시 지원 전략 및 예측' },
  { key: 'myclass', label: '마이클래스', description: '학습 콘텐츠 및 자료' },
] as const

export type ServiceKey = typeof MENTORING_SERVICES[number]['key']

// 학생 추가 요청
export interface IAddStudentRequest {
  studentCode: string
  className: string
}

// 반 추가 요청
export interface IAddClassRequest {
  className: string
}

// 반 삭제 요청
export interface IDeleteClassRequest {
  className: string
}

// ============= 초대 시스템 =============

// 초대 코드 생성 요청
export interface ICreateInviteRequest {
  className?: string
}

// 초대 코드 생성 응답
export interface ICreateInviteResponse {
  inviteCode: string
  inviteUrl: string
  expiresAt: string
  expiresInDays: number
  className?: string
  teacherName: string
}

// 초대 코드 정보 조회 응답
export interface IInviteInfo {
  isValid: boolean
  reason?: 'expired' | 'used' | 'not_found'
  teacherInfo?: {
    name: string
    nickname: string
    school: string
  }
  className?: string
  expiresAt?: string
}

// 초대 목록 아이템
export interface IInviteItem {
  id: number
  inviteCode: string
  className?: string
  status: 'pending' | 'used' | 'expired' | 'cancelled'
  createdAt: string
  expiresAt: string
  usedBy?: {
    id: number
    name: string
    linkedAt: string
  }
}
