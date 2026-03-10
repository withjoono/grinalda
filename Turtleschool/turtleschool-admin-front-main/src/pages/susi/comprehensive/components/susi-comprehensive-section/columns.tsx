import { ColumnDef } from '@tanstack/react-table';
import { SusiComprehensive } from '@/api2/types/susi-comprehensive';

export const columns: ColumnDef<SusiComprehensive>[] = [
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
    accessorKey: 'document_rate',
    header: '서류비율',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('document_rate')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'interview_rate',
    header: '면접비율',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('interview_rate')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'other_rate',
    header: '그외비율',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('other_rate')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'other_details',
    header: '그외내역',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('other_details')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'step2_step1_score_rate',
    header: '2단계)1단계성적',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('step2_step1_score_rate')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'step2_interview_rate',
    header: '2단계)면접비율',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('step2_interview_rate')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'step2_other_rate',
    header: '2단계)그외',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('step2_other_rate')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'step2_other_details',
    header: '2단계)그외내역',
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
    accessorKey: 'cut_50',
    header: '50컷',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('cut_50')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'cut_70',
    header: '70컷',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('cut_70')}
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
    accessorKey: 'minimum_english',
    header: '최저영어',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('minimum_english')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'minimum_social_studies',
    header: '최저사탐',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('minimum_social_studies')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'minimum_science_studies',
    header: '최저과탐',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('minimum_science_studies')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'minimum_calculation_studies',
    header: '탐계산',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('minimum_calculation_studies')}
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
    accessorKey: 'minimum_korean_history',
    header: '최저한국사',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('minimum_korean_history')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'minimum_others',
    header: '최저그외',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[100px] text-center hover:line-clamp-none">
        {row.getValue('minimum_others')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'minimum_others_details',
    header: '최저그외상세',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('minimum_others_details')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'evaluation_ratios',
    header: '3개평가 비중(30:20:50)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('evaluation_ratios')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'evaluation_code',
    header: '3개평가 코드',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[150px] text-center hover:line-clamp-none">
        {row.getValue('evaluation_code')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'interview_score_applied',
    header: '면접점수반영여부',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
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
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
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
    accessorKey: 'admission_criteria_2024',
    header: '2024년입결기준',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('admission_criteria_2024')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_2024_grade',
    header: '2024학년도입결(등급)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('admission_2024_grade')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_2024_converted_score',
    header: '2024학년도입결(환산점수)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('admission_2024_converted_score')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'competition_rate_2024',
    header: '2024학년도경쟁률',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('competition_rate_2024')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'replenishment_2024',
    header: '2024충원',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('replenishment_2024')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_criteria_2023',
    header: '2023학년도기준',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('admission_criteria_2023')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_2023_grade',
    header: '2023학년도입결(등급)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('admission_2023_grade')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_2023_converted_score',
    header: '2023학년도입결(환산점수)',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('admission_2023_converted_score')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'competition_rate_2023',
    header: '2023학년도경쟁률',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('competition_rate_2023')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'replenishment_2023',
    header: '2023충원',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('replenishment_2023')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_criteria_2022',
    header: '2022학년도기준',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('admission_criteria_2022')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_2022_grade',
    header: '2022학년도입결',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('admission_2022_grade')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'competition_rate_2022',
    header: '2022학년도경쟁률',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('competition_rate_2022')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'replenishment_2022',
    header: '2022충원',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('replenishment_2022')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_2021_grade',
    header: '2021학년도입결',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('admission_2021_grade')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'competition_rate_2021',
    header: '2021학년도경쟁률',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('competition_rate_2021')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'replenishment_2021',
    header: '2021충원',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('replenishment_2021')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'admission_2020_grade',
    header: '2020학년도입결',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('admission_2020_grade')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'competition_rate_2020',
    header: '2020학년도경쟁률',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('competition_rate_2020')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'replenishment_2020',
    header: '2020충원',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('replenishment_2020')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'application_notes',
    header: '지원시유의사항',
    cell: ({ row }) => (
      <div className="line-clamp-2 w-[200px] text-center hover:line-clamp-none">
        {row.getValue('application_notes')}
      </div>
    ),
    enableSorting: true,
  },
];
