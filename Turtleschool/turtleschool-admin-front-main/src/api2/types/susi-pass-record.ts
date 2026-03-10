export interface SusiPassRecord {
  id: number;

  unified_id: string; // 통합 아이디 (ex. U0094121)

  region: string; // 지역
  department: string; // 계열
  university_name: string; // 대학명
  recruitment_unit_name: string; // 학과명
  central_classification: string; // 전형유형 (실기, 논술, 교과)
  basic_type: string; // 일반, 특별
  type_name: string; // 전형명
  first_result: string; // 지원결과 1단계
  final_result: string; // 지원결과 최종
  avg_grade_all: string; // 평균등급 - 전과목
  avg_grade_gyss: string; // 평균등급 국영수사
  avg_grade_gysg: string; // 평균등급 국영수과
  avg_grade_gyst_100: string; // 국영수탐 백분위
  avg_grade_gyst: string; // 평균등급 국영수탐
}
