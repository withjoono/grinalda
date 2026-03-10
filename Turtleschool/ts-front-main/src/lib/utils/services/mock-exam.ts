import { MOCK_EXAM_SUBJECT_CODE } from "@/constants/mock-exam-subject-code";
import { IMockExamScore } from "@/stores/server/features/mock-exam/interfaces";

export interface IEnrichedMockExamScore extends IMockExamScore {
  subject_name: string;
  subject_category: string;
}

// 문이과
export type IAcademicDivision = "NaturalSciences" | "LiberalArts";

export interface IEnrichedMockExamScoreResponse {
  data: IEnrichedMockExamScore[];
  academic_division: IAcademicDivision;
}

/**
 * 모의고사 표준점수 조회결과에 과목명과 카테고리(kor, math 등)을 추가
 */
export const enrichScoreData = (
  scores: IMockExamScore[],
): IEnrichedMockExamScore[] => {
  return scores.map((score) => {
    let subject_name = "";
    let subject_category = "";

    for (const [category, data] of Object.entries(MOCK_EXAM_SUBJECT_CODE)) {
      if (data.require && data.require.subjectCode === score.code) {
        subject_name = data.require.label;
        subject_category = category;
        break;
      }
      if (data.select) {
        const selectedSubject = data.select.find(
          (subject) => subject.subjectCode === score.code,
        );
        if (selectedSubject) {
          subject_name = selectedSubject.label;
          subject_category = category;
          break;
        }
      }
    }

    return {
      ...score,
      subject_name,
      subject_category,
    };
  });
};

export const determineAcademicDivision = (
  scores: IEnrichedMockExamScore[],
): IAcademicDivision => {
  const selectedSubjects = scores.map((score) => score.code);
  const hasMathCalc = selectedSubjects.includes("S4"); // 미적
  const hasMathGeo = selectedSubjects.includes("S5"); // 기하

  const scienceSubjects = scores.filter(
    (score) => score.subject_category === "science",
  ); // 과탐 갯수
  const socialSubjects = scores.filter(
    (score) => score.subject_category === "society",
  ); // 사탐 갯수

  // 미적/기하 중 하나를 선택했으면서 과탐 2개를 선택한 경우 이과
  // 그외 문과로 처리
  if (
    (hasMathCalc || hasMathGeo) &&
    scienceSubjects.length === 2 &&
    socialSubjects.length === 0
  ) {
    return "NaturalSciences";
  } else {
    return "LiberalArts";
  }
};

export const processMockExamScores = (apiResponse: {
  data: IMockExamScore[];
}): IEnrichedMockExamScoreResponse => {
  const enrichedData = enrichScoreData(apiResponse.data);
  const academic_division = determineAcademicDivision(enrichedData);

  return {
    data: enrichedData,
    academic_division,
  };
};
