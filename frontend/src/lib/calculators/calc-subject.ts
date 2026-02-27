import { UserSchoolRecord } from '@/apis/hooks/use-school-record';
import { calc_홍익대 } from './홍익대';
import { calc_연세대 } from './연세대';

export interface CalcSubjectPayload {
  id: number;
  year: number;
  departmentName: string;
  admissionName: string;
  studentRecordRatio: string;
  convertCut: string;
  gradeCut: string;
  universityName: string;
}

export interface CalcSubjectResult {
  success: boolean;
  score: number;
  error?: string;
  totalScore: number;
}

export const calcSubject = (
  schoolRecord: UserSchoolRecord,
  data: CalcSubjectPayload
): CalcSubjectResult => {
  // 홍익대 (서울)
  if (data.universityName === '홍익대') {
    return calc_홍익대(schoolRecord, data);
  } else if (data.universityName === '연세대') {
    return calc_연세대(schoolRecord, data);
  }

  return {
    success: false,
    score: 0,
    totalScore: 0,
    error: '대학 정보가 없습니다.',
  };
};
