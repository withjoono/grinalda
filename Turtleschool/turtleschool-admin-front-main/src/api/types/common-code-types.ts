export interface ISubjectCodeData {
  id: number;
  main_subject_code: string;
  main_subject_name: string;
  subject_code: string;
  subject_name: string;
  type: number; // 평가방식 (0: 석차등급, 1: 성취도)
  course_type: number; // 과목 종류 (0: 공통일반, 1: 일반선택, 2: 진로선택, 3: 전문교과1, 4: 전문교과2)
  is_required: boolean; // 필수과목 여부 (0: 필수, 1: 선택)
}
