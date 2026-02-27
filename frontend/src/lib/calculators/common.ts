import { UserSchoolRecord } from '@/apis/hooks/use-school-record';

/**
 * 학생부 반영 비율에서 총점 추출
 * "300/400" -> 300, "300" -> 300, "/400" -> 0, "" -> 0
 */
export const getTotalScore = (studentRecordRatio: string) => {
  const arr = studentRecordRatio?.split('/') || [];
  const totalScore = Number(arr[0]) || 0;

  return totalScore;
};

/**
 * 학생부 반영 범위의 성적만 추출
 * 예를들어 3학년 1학기면 1학년 1학기 ~ 3학년 1학기 성적 추출
 */
export const getReflectionScores = ({
  grade,
  semester,
  schoolRecord,
}: {
  grade: number;
  semester: number;
  schoolRecord: UserSchoolRecord;
}) => {
  const { subjects, selectSubjects } = schoolRecord;

  const scores = subjects.filter((subject) => {
    if (subject.grade < grade) {
      return true;
    }
    if (subject.grade === grade) {
      return subject.semester <= semester;
    }
    return false;
  });
  const selectScores = selectSubjects.filter((subject) => {
    if (subject.grade < grade) {
      return true;
    }
    if (subject.grade === grade) {
      return subject.semester <= semester;
    }
    return false;
  });

  return { scores, selectScores };
};
