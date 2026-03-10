export interface EarlydStudentRecord {
  id: number;

  // 학년도
  year: string;

  // 지역
  region: string;

  // 대학명
  college_name: string;

  // 대학코드
  college_code: string | null;

  // 정원구분
  classification: string;

  // 대계열
  grand_series: string;

  // 중계열
  middle_series: string;

  // 소계열
  row_series: string;

  // 전형기본유형
  basic_type_admission: string;

  // 전형세부유형
  application_detailed_type: string;

  // 전형명
  type_name: string | null;

  // 지역인재적용범위
  region_range: string;

  // 중심전형분류
  center_type: string;

  // 계열
  line: string;

  // 모집단위명
  recruitment_unit: string | null;

  // 모집인원
  recruitment_num: string;

  // 50%컷
  cut50: string;

  // 70%컷
  cut70: string;

  // 최저학력기준_반영여부
  lowest_use: number;

  // 수능 최저학력기준 TEXT
  lowest_text: string;

  // 최저국어
  lowest_korean: number;

  // 최저수학
  lowest_math: number;

  // 최저수학(미/기)
  lowest_migi: number;

  // 최저영어
  lowest_english: number;

  // 최저사탐
  lowest_society: number;

  // 최저과탐
  lowest_science: number;

  // 탐계산
  lowest_cal: number;

  // 탐갯수
  lowest_count: number;

  // 최저합 (~이내)
  lowest_sum: number;

  // 지원자격
  support_qualification_text: string | null;

  // 선발모형
  selection_model: string | null;

  // 선발비율
  selection_rate: number;

  // 면접율
  interview_rate: number;

  // 교과율
  subject_rate: number;

  // 서류율
  paper_rate: number;

  // 한국사 (~이내)
  lowest_history: number;

  /**
   * 면접유형
   * 0: 면접없음, 1:제시문기반, 2:생기부기반
   */
  interview_type: string | null;

  /**
   * 학교장추천유무
   * 무:0, 유 :1
   */
  recommend_use: number;

  // 면접안내TEXT
  interview_text: string;

  // 면접날짜
  interview_date: string | null;

  // 면접시간
  interview_time: string;

  // 면접시 서류종류
  interview_paper: string;

  // 3개평가 비중 (학업/진로/공동)
  evaluate_rate: string | null;

  // 3개평가 코드
  evaluate_code: string | null;

  // 1학년비중
  first_class_rate: number;

  // 2학년비중
  two_class_rate: number;

  // 3학년비중
  third_class_rate: number;
}
