export interface IRegularAdmission {
  id: number;
  year: number;
  admission_name: string;
  admission_type: string; // 가,나,다 군
  general_field_name: string; // 계열명 (의치한약수)
  recruitment_number: number; // 정원
  selection_method: string | null; // 선발 방식
  detailed_fields: string | null; // 상세계열 (전기•전자•컴퓨터•통신)
  recruitment_name: string | null; // 모집단위명 (한국어문학과)
  csat_ratio: string | null; // 수능 비율
  school_record_ratio: string | null; // 학생부 비율
  interview_ratio: string | null; // 면접 비율
  other_ratio: string | null; // 기타 비율
  score_calculation: string | null; // 점수환산식 (계명의학)
  csat_elements: string | null; // 수능요소 (백+백)
  csat_combination: string | null; // 수능조합 (수탐(2)+국영中택1)
  csat_required: string | null; // 수능필수 (수탐(2))
  csat_optional: string | null; // 수능선택 (국영中택1)
  total_score: number | null; // 전형 총점
  research_subject_count: number | null; // 탐구과목수
  korean_reflection_score: string | null; // 국어배점 (float)
  math_reflection_score: string | null; // 수학배점 (float)
  research_reflection_score: string | null; // 탐구배점 (float)
  english_reflection_score: string | null; // 영어배점 (float)
  korean_history_reflection_score: string | null; // 한국사배점 (float)
  second_foreign_language_reflection_score: string | null; // 제2외국어배점 (float)
  min_cut: string | null; // 최초컷 (float)
  min_cut_percent: string | null; // 최초누백 float
  max_cut: string | null; // 추합컷 (float)
  max_cut_percent: string | null; // 추합누백 float
  risk_plus_5: string | null; // 위험도 +5 (float)
  risk_plus_4: string | null; // 위험도 +4 (float)
  risk_plus_3: string | null; // 위험도 +3 (float)
  risk_plus_2: string | null; // 위험도 +2 (float)
  risk_plus_1: string | null; // 위험도 +1 (float)
  risk_minus_1: string | null; // 위험도 -1 (float)
  risk_minus_2: string | null; // 위험도 -2 (float)
  risk_minus_3: string | null; // 위험도 -3 (float)
  risk_minus_4: string | null; // 위험도 -4 (float)
  risk_minus_5: string | null; // 위험도 -5 (float)
  initial_cumulative_percentile: string | null; // 최초누백 (float)
  additional_cumulative_percentile: string | null; // 추합누백 (float)
  korean_elective_subject: string | null; // 국어선택과목
  math_elective_subject: string | null; // 수학_선택과목
  math_probability_statistics_additional_points: string | null; // 수학_확률과통계가산점
  math_calculus_additional_points: string | null; // 수학_미적분가산점
  math_geometry_additional_points: string | null; // 수학_기하가산점
  research_type: string | null; // 탐구_유형
  research_social_additional_points: string | null; // 탐구_사회가산점
  research_science_additional_points: string | null; // 탐구_과학가산점
  math_research_selection: string | null; // 수탐선택
  english_application_criteria: string | null; // 영어_적용기준
  english_grade_1_score: string | null; // 영어 1등급점수
  english_grade_2_score: string | null; // 영어 2등급점수
  english_grade_3_score: string | null; // 영어 3등급점수
  english_grade_4_score: string | null; // 영어 4등급점수
  english_grade_5_score: string | null; // 영어 5등급점수
  english_grade_6_score: string | null; // 영어 6등급점수
  english_grade_7_score: string | null; // 영어 7등급점수
  english_grade_8_score: string | null; // 영어 8등급점수
  english_grade_9_score: string | null; // 영어 9등급점수
  english_minimum_criteria: string | null; // 영어 최저기준
  korean_history_application_criteria: string | null; // 한국사_적용기준
  korean_history_grade_1_score: string | null; // 한국사 1등급점수
  korean_history_grade_2_score: string | null; // 한국사 2등급점수
  korean_history_grade_3_score: string | null; // 한국사 3등급점수
  korean_history_grade_4_score: string | null; // 한국사 4등급점수
  korean_history_grade_5_score: string | null; // 한국사 5등급점수
  korean_history_grade_6_score: string | null; // 한국사 6등급점수
  korean_history_grade_7_score: string | null; // 한국사 7등급점수
  korean_history_grade_8_score: string | null; // 한국사 8등급점수
  korean_history_grade_9_score: string | null; // 한국사 9등급점수
  korean_history_minimum_criteria: string | null; // 한국사 최저기준
  university: {
    establishment_type: string;
    id: number;
    name: string;
    region: string;
    code: string;
  };
}

export interface IRegularAdmissionDetail extends IRegularAdmission {
  previous_results: {
    id: number;
    year: number;
    min_cut: string | null; // float
    max_cut: string | null; // float
    competition_ratio: string | null; // float
    percent: string | null; // float
    recruitment_number: number | null;
  }[];
}

export interface IRegularCombination {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  regular_admissions: IRegularAdmission[];
}
