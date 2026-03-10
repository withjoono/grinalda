import { ColumnDef } from '@tanstack/react-table';
import { SuSiSubject } from '@/api2/types/susi-subject';

export const columns: ColumnDef<SuSiSubject>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[40px] text-center hover:line-clamp-none">
        {row.getValue('id')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'unified_id',
    header: '통합 아이디',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[50px] text-center hover:line-clamp-none">
        {row.getValue('unified_id')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'year',
    header: '학년도',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[50px] text-center hover:line-clamp-none">
        {row.getValue('year')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'region',
    header: '지역구분',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('region')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'university_name',
    header: '대학명',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('university_name')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'university_code',
    header: '대학코드',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('university_code')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'national_or_private',
    header: '국립/사립',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('national_or_private')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'basic_type',
    header: '기본유형',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('basic_type')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'detailed_type',
    header: '전형세부유형',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('detailed_type')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'type_name',
    header: '전형명',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('type_name')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'central_classification',
    header: '중심전형분류',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('central_classification')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'department',
    header: '계열',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('department')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'college',
    header: '단과대학',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('college')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'recruitment_unit_name',
    header: '모집단위명',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('recruitment_unit_name')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'large_department',
    header: '대계열',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('large_department')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'medium_department',
    header: '중계열',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('medium_department')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'small_department',
    header: '소계열',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('small_department')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'recruitment_number',
    header: '모집인원',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('recruitment_number')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'selection_model',
    header: '선발모형',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('selection_model')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'selection_ratio',
    header: '선발비율',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('selection_ratio')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'selection_method',
    header: '전형방법',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('selection_method')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'curriculum',
    header: '교과',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[50px] text-center hover:line-clamp-none">
        {row.getValue('curriculum')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'interview',
    header: '면접',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[50px] text-center hover:line-clamp-none">
        {row.getValue('interview')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'attendance',
    header: '출결',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[50px] text-center hover:line-clamp-none">
        {row.getValue('attendance')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'volunteer',
    header: '봉사',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[50px] text-center hover:line-clamp-none">
        {row.getValue('volunteer')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'document_non_academic',
    header: '서류(비교과)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('document_non_academic')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'step1_score',
    header: '1단계성적',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('step1_score')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'step2_others',
    header: '2단계그외',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('step2_others')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'step2_other_details',
    header: '2단계그외내역',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('step2_other_details')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'application_eligibility_text',
    header: '지원자격TEXT',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[400px] text-center hover:line-clamp-none">
        {row.getValue('application_eligibility_text')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'student_record_utilization_index',
    header: '학생부활용지표',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('student_record_utilization_index')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'curriculum_reflection_semester',
    header: '교과반영학기',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('curriculum_reflection_semester')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'first_year_ratio',
    header: '1학년비율',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('first_year_ratio')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'second_year_ratio',
    header: '2학년비율',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('second_year_ratio')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'third_year_ratio',
    header: '3학년비율',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('third_year_ratio')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'second_third_year_ratio',
    header: '2-3학년비율',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('second_third_year_ratio')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'first_second_third_year_ratio',
    header: '1-2-3학년비율',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('first_second_third_year_ratio')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'curriculum_grade_1',
    header: '교과등급점수1등급',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('curriculum_grade_1')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'curriculum_grade_2',
    header: '교과등급점수2등급',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('curriculum_grade_2')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'curriculum_grade_3',
    header: '교과등급점수3등급',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('curriculum_grade_3')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'curriculum_grade_4',
    header: '교과등급점수4등급',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('curriculum_grade_4')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'curriculum_grade_5',
    header: '교과등급점수5등급',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('curriculum_grade_5')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'curriculum_grade_6',
    header: '교과등급점수6등급',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('curriculum_grade_6')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'curriculum_grade_7',
    header: '교과등급점수7등급',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('curriculum_grade_7')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'curriculum_grade_8',
    header: '교과등급점수8등급',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('curriculum_grade_8')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'curriculum_grade_9',
    header: '교과등급점수9등급',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('curriculum_grade_9')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'common_general_and_career_integration',
    header: '공통일반과진로가통합',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('common_general_and_career_integration')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'common_general_subject_ratio',
    header: '공통일반과목비율',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('common_general_subject_ratio')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'reflected_subject_1_year_korean',
    header: '1년_국어',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('reflected_subject_1_year_korean')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'reflected_subject_1_year_math',
    header: '1년_수학',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('reflected_subject_1_year_math')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'reflected_subject_1_year_english',
    header: '1년_영어',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('reflected_subject_1_year_english')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'reflected_subject_1_year_science',
    header: '1년_과학',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('reflected_subject_1_year_science')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'reflected_subject_1_year_social',
    header: '1년_사회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('reflected_subject_1_year_social')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'reflected_subject_1_year_korean_history',
    header: '1년_한국사',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('reflected_subject_1_year_korean_history')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'reflected_subject_1_year_other',
    header: '1년_기가외',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('reflected_subject_1_year_other')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'number_of_optional_subjects_1',
    header: '1년_선택과목수',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('number_of_optional_subjects_1')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'total_number_of_top_subjects_1',
    header: '1_년전체상위과목수',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('total_number_of_top_subjects_1')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'number_of_top_subjects_per_subject_1',
    header: '1_년과목별상위과목수',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('number_of_top_subjects_per_subject_1')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'reflected_subject_2_3_years_korean',
    header: '2-3년_국어',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('reflected_subject_2_3_years_korean')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'reflected_subject_2_3_years_math',
    header: '2-3년_수학',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('reflected_subject_2_3_years_math')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'reflected_subject_2_3_years_english',
    header: '2-3년_영어',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('reflected_subject_2_3_years_english')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'reflected_subject_2_3_years_science',
    header: '2-3년_과학',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('reflected_subject_2_3_years_science')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'reflected_subject_2_3_years_social',
    header: '2-3년_사회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('reflected_subject_2_3_years_social')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'reflected_subject_2_3_years_korean_history',
    header: '2-3년_한국사',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('reflected_subject_2_3_years_korean_history')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'reflected_subject_2_3_years_other',
    header: '2-3년_기가외',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('reflected_subject_2_3_years_other')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'number_of_optional_subjects_2_3',
    header: '2-3년_선택과목수',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('number_of_optional_subjects_2_3')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'total_number_of_top_subjects_2_3',
    header: '2-3년_전체상위과목수',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('total_number_of_top_subjects_2_3')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'number_of_top_subjects_per_subject_2_3',
    header: '2-3년_과목별상위과목수',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('number_of_top_subjects_per_subject_2_3')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'common_general_reflection_method',
    header: '공통일반반영방식',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('common_general_reflection_method')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'perfect_score',
    header: '만점',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[50px] text-center hover:line-clamp-none">
        {row.getValue('perfect_score')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'attendance_usage',
    header: '출결사용여부',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('attendance_usage')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'attendance_usage_ratio',
    header: '출결사용비중',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('attendance_usage_ratio')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_1',
    header: '결석1회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_1')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_2',
    header: '결석2회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_2')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_3',
    header: '결석3회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_3')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_4',
    header: '결석4회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_4')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_5',
    header: '결석5회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_5')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_6',
    header: '결석6회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_6')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_7',
    header: '결석7회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_7')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_8',
    header: '결석8회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_8')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_9',
    header: '결석9회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_9')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_10',
    header: '결석10회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_10')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_11',
    header: '결석11회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_11')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_12',
    header: '결석12회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_12')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_13',
    header: '결석13회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_13')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_14',
    header: '결석14회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_14')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_15',
    header: '결석15회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_15')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_16',
    header: '결석16회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_16')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_17',
    header: '결석17회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_17')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_18',
    header: '결석18회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_18')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_19',
    header: '결석19회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_19')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'absence_20',
    header: '결석20회',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[80px] text-center hover:line-clamp-none">
        {row.getValue('absence_20')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'career_subject_application',
    header: '진로과목적용여부',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('career_subject_application')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'career_subject_reflection_method',
    header: '진로과목반영방식',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('career_subject_reflection_method')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'career_optional_subject',
    header: '진로선택과목',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('career_optional_subject')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'career_if_2',
    header: '진로2일경우',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('career_if_2')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'career_optional_subject_A',
    header: '진로선택과목A',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('career_optional_subject_A')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'career_optional_subject_B',
    header: '진로선택과목B',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('career_optional_subject_B')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'career_optional_subject_C',
    header: '진로선택과목C',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('career_optional_subject_C')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'A_distribution_ratio',
    header: 'A분포비율',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('A_distribution_ratio')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'B_distribution_ratio',
    header: 'B분포비율',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('B_distribution_ratio')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'C_distribution_ratio',
    header: 'C분포비율',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('C_distribution_ratio')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'career_subject_ratio',
    header: '진로과목비율',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('career_subject_ratio')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'career_subject_additional_points',
    header: '진로과목가산',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('career_subject_additional_points')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'number_of_top_subjects_in_all_career_subjects',
    header: '진로전체과목중상위과목수',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('number_of_top_subjects_in_all_career_subjects')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'number_of_top_subjects_in_career_curriculum',
    header: '진로교과중상위과목수',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('number_of_top_subjects_in_career_curriculum')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'grade_cut',
    header: '등급컷',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('grade_cut')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'converted_score_cut',
    header: '환산점수컷',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('converted_score_cut')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'converted_score_total',
    header: '환산점수총점',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('converted_score_total')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'risk_level_plus5',
    header: '위험도(+)5',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('risk_level_plus5')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'risk_level_plus4',
    header: '위험도(+)4',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('risk_level_plus4')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'risk_level_plus3',
    header: '위험도(+)3',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('risk_level_plus3')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'risk_level_plus2',
    header: '위험도(+)2',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('risk_level_plus2')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'risk_level_plus1',
    header: '위험도(+)1',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('risk_level_plus1')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'risk_level_minus1',
    header: '위험도(-1)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('risk_level_minus1')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'risk_level_minus2',
    header: '위험도(-2)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('risk_level_minus2')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'risk_level_minus3',
    header: '위험도(-3)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('risk_level_minus3')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'risk_level_minus4',
    header: '위험도(-4)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('risk_level_minus4')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'risk_level_minus5',
    header: '위험도(-5)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('risk_level_minus5')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'minimum_academic_standards_applied',
    header: '최저학력기준_반영여부',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('minimum_academic_standards_applied')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'minimum_academic_standards_text',
    header: '수능최저학력기준TEXT',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[400px] text-center hover:line-clamp-none">
        {row.getValue('minimum_academic_standards_text')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'minimum_korean',
    header: '최저국어',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('minimum_korean')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'minimum_math',
    header: '최저수학',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('minimum_math')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'minimum_math_science_engineering',
    header: '최저수학(미/기)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('minimum_math_science_engineering')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'english',
    header: '영어',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[50px] text-center hover:line-clamp-none">
        {row.getValue('english')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'social_studies',
    header: '사탐',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[50px] text-center hover:line-clamp-none">
        {row.getValue('social_studies')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'science_studies',
    header: '과탐',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[50px] text-center hover:line-clamp-none">
        {row.getValue('science_studies')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'calculation_studies',
    header: '탐계산',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[50px] text-center hover:line-clamp-none">
        {row.getValue('calculation_studies')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'minimum_count',
    header: '최저갯수',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('minimum_count')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'minimum_sum',
    header: '최저합',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('minimum_sum')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'korean_history',
    header: '한국사',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('korean_history')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'others',
    header: '그외',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('others')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'others_details',
    header: '그외상세',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('others_details')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'additional_points',
    header: '가산점',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('additional_points')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'additional_points_text',
    header: '가산점TEXT',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[400px] text-center hover:line-clamp-none">
        {row.getValue('additional_points_text')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'interview_score_applied',
    header: '면접점수반영여부',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('interview_score_applied')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'interview_type',
    header: '면접유형',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('interview_type')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'interview_resources',
    header: '면접시활용자료',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('interview_resources')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'interview_method',
    header: '면접진행방식',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('interview_method')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'interview_evaluation_content',
    header: '면접평가내용',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('interview_evaluation_content')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'interview_date_text',
    header: '면접날짜TEXT',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[400px] text-center hover:line-clamp-none">
        {row.getValue('interview_date_text')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'interview_time',
    header: '면접시간',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('interview_time')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'curriculum_calculation_formula',
    header: '교과계산식',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('curriculum_calculation_formula')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_criteria_2024',
    header: '2024년입결기준',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('admission_criteria_2024')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_2024_grade',
    header: '2024학년도입결(등급)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('admission_2024_grade')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_2024_converted_score',
    header: '2024학년도입결(환산점수)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('admission_2024_converted_score')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'competition_rate_2024',
    header: '2024학년도경쟁률',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('competition_rate_2024')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'replenishment_2024',
    header: '2024충원',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('replenishment_2024')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_criteria_2023',
    header: '2023학년도기준',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('admission_criteria_2023')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_2023_grade',
    header: '2023학년도입결(등급)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('admission_2023_grade')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_2023_converted_score',
    header: '2023학년도입결(환산점수)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('admission_2023_converted_score')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'competition_rate_2023',
    header: '2023학년도경쟁률',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('competition_rate_2023')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'replenishment_2023',
    header: '2023충원',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('replenishment_2023')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_criteria_2022',
    header: '2022학년도기준',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('admission_criteria_2022')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_2022_grade',
    header: '2022학년도입결',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('admission_2022')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'competition_rate_2022',
    header: '2022학년도경쟁률',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('competition_rate_2022')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'replenishment_2022',
    header: '2022충원',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('replenishment_2022')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_2021_grade',
    header: '2021학년도입결',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('admission_2021')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'competition_rate_2021',
    header: '2021학년도경쟁률',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('competition_rate_2021')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'replenishment_2021',
    header: '2021충원',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('replenishment_2021')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_2020_grade',
    header: '2020학년도입결',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('admission_2020')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'competition_rate_2020',
    header: '2020학년도경쟁률',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('competition_rate_2020')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'replenishment_2020',
    header: '2020충원',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('replenishment_2020')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'application_notes',
    header: '지원시유의사항',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('application_notes')}
      </div>
    ),
    enableSorting: true,
  },
];
