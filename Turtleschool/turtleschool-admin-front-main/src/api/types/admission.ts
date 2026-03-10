import { IAdmissionCategoryData } from './admission-category';
import { IAdmissionSubtypeData } from './admission-subtypes';
import { IRecruitmentUnitData } from './recruitment';
import { IUniversityData } from './university-types';

export interface IAdmissionData {
  id: number;
  name: string;
  year: number;
  basic_type: '일반' | '특별';
  university: IUniversityData;
  category: IAdmissionCategoryData;
  method: IAdmissionMethodData;
  subtypes: IAdmissionSubtypeData[];
  recruitment_units: IRecruitmentUnitData[];
}

export interface IAdmissionMethodData {
  id: number;
  method_description: string;
  subject_ratio: number | null;
  document_ratio: number | null;
  interview_ratio: number | null;
  practical_ratio: number | null;
  other_details: string | null;
  second_stage_first_ratio: number | null;
  second_stage_interview_ratio: number | null;
  second_stage_other_ratio: number | null;
  second_stage_other_details: string | null;
  eligibility: string;
  school_record_evaluation_score: string | null;
  school_record_evaluation_elements: string | null;
}

export interface ICreateAdmissionDto {
  name: string;
  year: number;
  basic_type: '일반' | '특별';
  university_id: number;
  category_id: number;
  subtype_ids?: number[];
  method: Omit<IAdmissionMethodData, 'id'>;
}

export interface IUpdateAdmissionDto {
  name?: string;
  year?: number;
  basic_type?: '일반' | '특별';
  university_id?: number;
  category_id?: number;
  subtype_ids?: number[];
  method?: Partial<Omit<IAdmissionMethodData, 'id'>>;
}
