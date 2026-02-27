import { UserSchoolRecord } from '@/apis/hooks/use-school-record';
import { CalcSubjectPayload, CalcSubjectResult } from '../calc-subject';
import { calc_2025_홍익대 } from './2025';

export const calc_홍익대 = (
  schoolRecord: UserSchoolRecord,
  data: CalcSubjectPayload
): CalcSubjectResult => {
  if (data.year === 2025) {
    return calc_2025_홍익대(schoolRecord, data);
  }

  return {
    success: false,
    score: 0,
    totalScore: 0,
    error: `${data.year}년 홍익대 계산식이 없습니다.`,
  };
};
