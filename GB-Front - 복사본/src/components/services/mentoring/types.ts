// 멘토링 기능 타입 정의

export interface Student {
  id: number
  name: string
  school: string
  class: string
}

export interface Child {
  id: number
  name: string
  school: string
  grade?: string
}

export interface StudentInfo {
  name: string
  grade: string
  school: string
  hagwon?: string
  mentorAccount: string
}

export interface GenerateCodeResponse {
  success: boolean
  data?: {
    code: string
    time: string
  }
  msg?: string
}

export interface VerifyCodeResponse {
  success: boolean | string
  data?: {
    mento_account: string
    info: {
      user_name: string
      gradeCode: string
      school: string
      hagwon: string
    }
  }
  msg?: string
}

export interface LinkResponse {
  success: boolean
  msg?: string
}

export type UserType = 'student' | 'parent' | 'teacher' | null

export const selectRelationType = (code?: string): UserType => {
  switch (code) {
    case '10':
    case '30':
      return 'student'
    case '20':
      return 'parent'
    case '40':
    case '50':
    case '70':
      return 'teacher'
    default:
      return null
  }
}
