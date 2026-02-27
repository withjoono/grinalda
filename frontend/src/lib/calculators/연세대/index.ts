import { UserSchoolRecord } from '@/apis/hooks/use-school-record';
import { CalcSubjectPayload } from '../calc-subject';
import { calc_2025_연세대 } from './2025';

export const calc_연세대 = (
  schoolRecord: UserSchoolRecord,
  data: CalcSubjectPayload
) => {
  if (data.year === 2025) {
    return calc_2025_연세대(schoolRecord, data);
  }

  return {
    success: false,
    score: 0,
    totalScore: 0,
    error: `${data.year}년 연세대 계산식이 없습니다.`,
  };
};
