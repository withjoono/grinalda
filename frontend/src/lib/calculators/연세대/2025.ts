import { UserSchoolRecord } from '@/apis/hooks/use-school-record';
import { CalcSubjectPayload, CalcSubjectResult } from '../calc-subject';
import { getTotalScore } from '../common';

export const calc_2025_연세대 = (
  schoolRecord: UserSchoolRecord,
  data: CalcSubjectPayload
): CalcSubjectResult => {
  const totalScore = getTotalScore(data.studentRecordRatio);
  if (data.year === 2025) {
    return {
      success: true,
      score: 30,
      totalScore,
    };
  }

  return {
    success: false,
    score: 0,
    totalScore: 0,
    error: '해당 모집단위의 계산식이 없습니다.',
  };
};
