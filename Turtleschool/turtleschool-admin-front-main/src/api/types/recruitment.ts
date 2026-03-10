import { IAdmissionData } from './admission';
import { IGeneralFieldData, IMinorFieldData } from './fields-types';

export interface IRecruitmentUnitData {
  id: number;
  name: string;
  recruitment_number: number;
  admission: IAdmissionData;
  general_field: IGeneralFieldData | null;
  minor_field: IMinorFieldData | null;
  scores: IRecruitmentUnitScoreData | null;
  minimum_grade: IRecruitmentUnitMinimumGradeData | null;
  interview: IRecruitmentUnitInterviewData | null;
  previous_results: IRecruitmentUnitPreviousResultData[];
}

export interface IRecruitmentUnitScoreData {
  id: number;
  grade_50_cut: number | null;
  grade_70_cut: number | null;
  convert_50_cut: number | null;
  convert_70_cut: number | null;
  risk_plus_5: number | null;
  risk_plus_4: number | null;
  risk_plus_3: number | null;
  risk_plus_2: number | null;
  risk_plus_1: number | null;
  risk_minus_1: number | null;
  risk_minus_2: number | null;
  risk_minus_3: number | null;
  risk_minus_4: number | null;
  risk_minus_5: number | null;
}

export interface IRecruitmentUnitMinimumGradeData {
  id: number;
  is_applied: 'Y' | 'N';
  description: string | null;
}

export interface IRecruitmentUnitInterviewData {
  id: number;
  is_reflected: number;
  interview_type: string | null;
  materials_used: string | null;
  interview_process: string | null;
  evaluation_content: string | null;
  interview_date: string | null;
  interview_time: string | null;
}

export interface IRecruitmentUnitPreviousResultData {
  id?: number;
  year: number;
  result_criteria: string;
  grade_cut: number | null;
  converted_score_cut: number | null;
  competition_ratio: number | null;
  recruitment_number: number | null;
}

export interface ICreateRecruitmentUnitDto {
  name: string;
  recruitment_number: number;
  admission_id: number;
  general_field_id?: number;
  minor_field_id?: number;
  scores?: Omit<IRecruitmentUnitScoreData, 'id'>;
  minimum_grade?: Omit<IRecruitmentUnitMinimumGradeData, 'id'>;
  interview?: Omit<IRecruitmentUnitInterviewData, 'id'>;
  previous_results?: Omit<IRecruitmentUnitPreviousResultData, 'id'>[];
}

export interface IUpdateRecruitmentUnitDto {
  name?: string;
  recruitment_number?: number;
  general_field_id?: number;
  minor_field_id?: number;
  scores?: Partial<Omit<IRecruitmentUnitScoreData, 'id'>>;
  minimum_grade?: Partial<Omit<IRecruitmentUnitMinimumGradeData, 'id'>>;
  interview?: Partial<Omit<IRecruitmentUnitInterviewData, 'id'>>;
  previous_results?: Partial<Omit<IRecruitmentUnitPreviousResultData, 'id'>>[];
}
