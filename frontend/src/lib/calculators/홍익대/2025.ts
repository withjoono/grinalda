import { UserSchoolRecord } from '@/apis/hooks/use-school-record';
import { CalcSubjectPayload, CalcSubjectResult } from '../calc-subject';
import { getReflectionScores, getTotalScore } from '../common';

export const calc_2025_홍익대 = (
  schoolRecord: UserSchoolRecord,
  data: CalcSubjectPayload
): CalcSubjectResult => {
  const totalScore = getTotalScore(data.studentRecordRatio);
  if (data.admissionName === '학교장추천자') {
    if (data.departmentName === '서울캠퍼스자율전공_자연.예능') {
      const { score } = calcType1({
        schoolRecord,
        subjectConvertScore: [100, 96, 89, 77, 60, 40, 23, 11, 0],
        selectSubjectConvertScore: {
          A: 10,
          B: 9,
          C: 7,
        },
        grade: 3,
        semester: 1,
        subjectCodes: ['HH1', 'HH3', 'HH2', 'HH5'], // 국어, 영어, 수학, 과학
      });

      return {
        success: true,
        score: score,
        totalScore,
      };
    } else if (
      data.departmentName === '서울캠퍼스자율전공_인문.예능' ||
      data.departmentName === '예술학과'
    ) {
      const { score } = calcType1({
        schoolRecord,
        subjectConvertScore: [100, 96, 89, 77, 60, 40, 23, 11, 0],
        selectSubjectConvertScore: {
          A: 10,
          B: 9,
          C: 7,
        },
        grade: 3,
        semester: 1,
        subjectCodes: ['HH1', 'HH3', 'HH2', 'HH4', 'HH7'], // 국어, 영어, 수학, (한국사 포함)
      });

      return {
        success: true,
        score: score,
        totalScore,
      };
    }
  } else if (
    data.admissionName === '외_농어촌학생' ||
    data.admissionName === '미술우수자'
  ) {
    if (data.departmentName === '예술학과') {
      const { score } = calcType1({
        schoolRecord,
        subjectConvertScore: [100, 96, 89, 77, 60, 40, 23, 11, 0],
        selectSubjectConvertScore: {
          A: 10,
          B: 9,
          C: 7,
        },
        grade: 3,
        semester: 1,
        subjectCodes: ['HH1', 'HH3', 'HH2', 'HH4', 'HH7'], // 국어, 영어, 수학, (한국사 포함)
      });

      return {
        success: true,
        score: score,
        totalScore,
      };
    } else {
      const { score } = calcType2({
        schoolRecord,
        subjectConvertScore: [100, 99, 97, 95, 93, 90, 70, 40, 0],
        grade: 3,
        semester: 1,
      });

      return {
        success: true,
        score: score,
        totalScore,
      };
    }
  } else if (data.admissionName === '논술전형') {
    const { score } = calcType3({
      schoolRecord,
      subjectConvertScore: [100, 99, 97, 94, 90, 85, 60, 30, 0],
      grade: 3,
      semester: 1,
    });

    return {
      success: true,
      score: score,
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

const calcType1 = ({
  schoolRecord,
  subjectConvertScore,
  selectSubjectConvertScore,
  grade,
  semester,
  subjectCodes,
}: {
  schoolRecord: UserSchoolRecord;
  subjectConvertScore: number[];
  selectSubjectConvertScore: Record<string, number>;
  grade: number;
  semester: number;
  subjectCodes: string[]; // 반영할 교과목 코드들
}): {
  score: number;
} => {
  const { scores, selectScores } = getReflectionScores({
    grade,
    semester,
    schoolRecord,
  });

  let totalSubjectScore = 0;
  let totalSubjectUnits = 0;
  let totalSelectSubjectScore = 0;
  let totalSelectSubjectUnits = 0;

  // 일반교과 점수 계산
  scores.forEach((score) => {
    if (!score.gradeRank || score.gradeRank < 1 || 9 < score.gradeRank) return; // 석차등급이 있는 과목만 반영
    if (subjectCodes.includes(score.subjectGroup.code)) {
      totalSubjectScore +=
        score.units * (subjectConvertScore[score.gradeRank - 1] || 0);
      totalSubjectUnits += score.units;
    }
  });

  // 진로선택 점수 계산
  selectScores.forEach((selectSubject) => {
    if (!['A', 'B', 'C'].includes(selectSubject.achievement)) return; // 성취도가 A, B, C가 아닌 과목은 반영하지 않음
    if (subjectCodes.includes(selectSubject.subjectGroup.code)) {
      totalSelectSubjectScore +=
        selectSubject.units *
        (selectSubjectConvertScore[selectSubject.achievement] || 0);
      totalSelectSubjectUnits += selectSubject.units;
    }
  });

  const subjectScoreAvg = totalSubjectScore / totalSubjectUnits || 0;
  const selectSubjectScoreAvg =
    totalSelectSubjectScore / totalSelectSubjectUnits || 0;
  const _totalUnits = totalSubjectUnits + totalSelectSubjectUnits;
  const totalUnits = _totalUnits > 100 ? 100 : _totalUnits; // 반영교과 이수단위합의 최대값은 100

  // 교과성적 = [일반교과 평균 × 0.9 + 진로선택 평균] × (총이수단위/1000 + 0.9)
  const score =
    (subjectScoreAvg * 0.9 + selectSubjectScoreAvg) * (totalUnits / 1000 + 0.9);

  return {
    score,
  };
};

const calcType2 = ({
  schoolRecord,
  subjectConvertScore,
  grade,
  semester,
}: {
  schoolRecord: UserSchoolRecord;
  subjectConvertScore: number[];
  grade: number;
  semester: number;
}): {
  score: number;
} => {
  const { scores } = getReflectionScores({
    grade,
    semester,
    schoolRecord,
  });

  let totalSubjectScore = 0;
  let totalSubjectUnits = 0;

  // 일반교과 점수 계산 (국어, 영어)
  scores.forEach((score) => {
    if (!score.gradeRank || score.gradeRank < 1 || 9 < score.gradeRank) return; // 석차등급이 있는 과목만 반영
    if (['HH1', 'HH3'].includes(score.subjectGroup.code)) {
      totalSubjectScore +=
        score.units * (subjectConvertScore[score.gradeRank - 1] || 0);
      totalSubjectUnits += score.units;
    }
  });

  // 일반교과 점수 계산 (수학)
  let totalMathScore = 0;
  let totalMathUnits = 0;
  scores.forEach((score) => {
    if (!score.gradeRank || score.gradeRank < 1 || 9 < score.gradeRank) return; // 석차등급이 있는 과목만 반영
    if (['HH2'].includes(score.subjectGroup.code)) {
      totalMathScore +=
        score.units * (subjectConvertScore[score.gradeRank - 1] || 0);
      totalMathUnits += score.units;
    }
  });

  // 일반교과 점수 계산 (사회)
  let totalSocialScore = 0;
  let totalSocialUnits = 0;
  scores.forEach((score) => {
    if (!score.gradeRank || score.gradeRank < 1 || 9 < score.gradeRank) return; // 석차등급이 있는 과목만 반영
    if (['HH4', 'HH7'].includes(score.subjectGroup.code)) {
      totalSocialScore +=
        score.units * (subjectConvertScore[score.gradeRank - 1] || 0);
      totalSocialUnits += score.units;
    }
  });

  // 일반교과 점수 계산 (과학)
  let totalScienceScore = 0;
  let totalScienceUnits = 0;
  scores.forEach((score) => {
    if (!score.gradeRank || score.gradeRank < 1 || 9 < score.gradeRank) return; // 석차등급이 있는 과목만 반영
    if (['HH5'].includes(score.subjectGroup.code)) {
      totalScienceScore +=
        score.units * (subjectConvertScore[score.gradeRank - 1] || 0);
      totalScienceUnits += score.units;
    }
  });

  const reflectionScore = [
    { score: totalMathScore, units: totalMathUnits },
    { score: totalSocialScore, units: totalSocialUnits },
    { score: totalScienceScore, units: totalScienceUnits },
  ].sort((a, b) => {
    if (a.units === b.units) {
      return b.score - a.score;
    }
    return b.units - a.units;
  })[0];

  totalSubjectScore += reflectionScore.score;
  totalSubjectUnits += reflectionScore.units;

  const subjectScoreAvg = totalSubjectScore / totalSubjectUnits || 0;

  const score = subjectScoreAvg;

  return {
    score,
  };
};

const calcType3 = ({
  schoolRecord,
  subjectConvertScore,
  grade,
  semester,
}: {
  schoolRecord: UserSchoolRecord;
  subjectConvertScore: number[];
  grade: number;
  semester: number;
}): {
  score: number;
} => {
  const { scores } = getReflectionScores({
    grade,
    semester,
    schoolRecord,
  });

  // a.gradeRank가 낮은 순서로 정렬 (없으면 뒤로)
  scores.sort((a, b) => {
    if (a.gradeRank && b.gradeRank) {
      return a.gradeRank - b.gradeRank;
    }
    return 1;
  });

  const checkCount: Record<string, number> = {
    HH1: 0,
    HH3: 0,
    HH2: 0,
    HH4: 0,
    HH5: 0,
  };

  let totalSubjectScore = 0;
  let totalSubjectCount = 0;

  // 일반교과 점수 계산 (국어, 영어, 수학) 과목별 상위 3과목만 반영
  scores.forEach((score) => {
    if (!score.gradeRank || score.gradeRank < 1 || 9 < score.gradeRank) return; // 석차등급이 있는 과목만 반영
    if (['HH1', 'HH3', 'HH2'].includes(score.subjectGroup.code)) {
      checkCount[score.subjectGroup.code] += 1;
      if (checkCount[score.subjectGroup.code] <= 3) {
        totalSubjectScore += subjectConvertScore[score.gradeRank - 1] || 0;
        totalSubjectCount += 1;
      }
    }
  });

  // 일반교과 점수 계산 (사회)
  let totalSocialScore = 0;
  let totalSocialCount = 0;
  let _totalSocialUnits = 0;
  scores.forEach((score) => {
    if (!score.gradeRank || score.gradeRank < 1 || 9 < score.gradeRank) return; // 석차등급이 있는 과목만 반영
    if (['HH4', 'HH7'].includes(score.subjectGroup.code)) {
      checkCount['HH4'] += 1;
      if (checkCount['HH4'] <= 3 && checkCount['HH4'] > 0) {
        totalSocialScore += subjectConvertScore[score.gradeRank - 1] || 0;
        totalSocialCount += 1;
      }
      _totalSocialUnits += score.units;
    }
  });

  // 일반교과 점수 계산 (과학)
  let totalScienceScore = 0;
  let totalScienceCount = 0;
  let _totalScienceUnits = 0;
  scores.forEach((score) => {
    if (!score.gradeRank || score.gradeRank < 1 || 9 < score.gradeRank) return; // 석차등급이 있는 과목만 반영
    if (['HH5'].includes(score.subjectGroup.code)) {
      checkCount['HH5'] += 1;
      if (checkCount['HH5'] <= 3 && checkCount['HH5'] > 0) {
        totalScienceScore += subjectConvertScore[score.gradeRank - 1] || 0;
        totalScienceCount += 1;
      }
      _totalScienceUnits += score.units;
    }
  });

  const reflectionScore = [
    {
      score: totalSocialScore,
      count: totalSocialCount,
      totalUnits: _totalSocialUnits,
    },
    {
      score: totalScienceScore,
      count: totalScienceCount,
      totalUnits: _totalScienceUnits,
    },
  ].sort((a, b) => {
    if (a.totalUnits === b.totalUnits) {
      return b.score - a.score;
    }
    return b.totalUnits - a.totalUnits;
  })[0];

  totalSubjectScore += reflectionScore.score;
  totalSubjectCount += reflectionScore.count;

  const subjectScoreAvg = totalSubjectScore / totalSubjectCount || 0;

  const score = subjectScoreAvg;

  return {
    score,
  };
};
