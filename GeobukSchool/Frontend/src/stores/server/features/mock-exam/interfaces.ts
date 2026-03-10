/**
 * 모의고사 표준점수
 */
export interface IMockExamScore {
  code: string;
  grade: number;
  standard_score: string;
  percentile: number;
}

/**
 * 모의고사 원점수
 */
export interface IMockExamRawScore {
  id: number;
  raw_score: string;
  subject_code: string;
}

/**
 * 모의고사 일정
 */
export interface IMockExamSchedule {
  id: number;
  mockexam_month: string;
  mockexam_year: string;
}

// 모의고사 원점수 저장
export interface ISaveMockExamRawScoresData {
  subject_code: string; // 과목 코드 (ex. S1, S3, S5 ...)
  raw_score: number; // 원점수
  schedule_id?: number; // 2024년 6월 모의고사 아이디: 5
}

// 모의고사 표준점수 저장
export interface ISaveMockExamStandardScoresData {
  subject_code: string; // 과목 코드 (ex. S1, S3, S5 ...)
  standard_score: number; // 표준점수
  percentile: number; // 백분위
  grade: number; // 학년
  schedule_id?: number; // 2024년 6월 모의고사 아이디: 5
}

/**
 * 모의고사 표준점수
 */
export interface IMockExamStandardScore {
  subject_code: string;
  grade: number;
  standard_score: string;
  percentile: number;
}
