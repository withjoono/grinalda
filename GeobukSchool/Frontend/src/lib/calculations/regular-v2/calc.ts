import { IEnrichedMockExamScore } from "@/lib/utils/services/mock-exam";
import { lazy점수표, lazy조건 } from "./lazy-load";
import {
  정시점수계산결과,
  정시점수계산Params,
  과목점수Type,
  점수표Type,
  학교조건Type,
  환산점수계산Params,
} from "./types";
import { 고려세과탐변환점수, 고려세사탐변환점수 } from "./고려세변환점수";
import { 고려세영어변환점수 } from "./고려세변환점수";
import {
  경기자전영어변환점수,
  경기자전한국사변환점수,
} from "./경기자전변환점수";
import {
  이화간호영어변환점수,
  이화간호한국사인문변환점수,
  이화간호한국사자연변환점수,
} from "./이화간호변환점수";

let 점수표: 점수표Type;
let 학교조건: 학교조건Type;

const ensureDataLoaded = async () => {
  if (!점수표) 점수표 = await lazy점수표();
  if (!학교조건) 학교조건 = await lazy조건();
};

// 표점합 계산 (국어, 수학, 탐구 2개)
export const calc표점합 = (
  mockExamScores: IEnrichedMockExamScore[],
): number => {
  let koreanScore = 0;
  let mathScore = 0;
  const electiveScores: number[] = [];

  mockExamScores.forEach((score) => {
    const standardScore = parseInt(score.standard_score);

    switch (score.subject_category) {
      case "kor":
        koreanScore = standardScore;
        break;
      case "math":
        mathScore = standardScore;
        break;
      case "society":
      case "science":
        electiveScores.push(standardScore);
        break;
    }
  });

  const topTwoElectiveScores = electiveScores.sort((a, b) => b - a).slice(0, 2);

  const totalScore =
    koreanScore +
    mathScore +
    topTwoElectiveScores.reduce((sum, score) => sum + score, 0);

  return totalScore;
};

export const prepare정시환산점수 = (
  mockExamScores: IEnrichedMockExamScore[],
  item: { score_calculation: string; major: string },
): 정시점수계산Params => {
  const params: 정시점수계산Params = {
    학교: item.score_calculation,
    이문과: item.major,
    국어: { 과목: "", 표준점수: 0, 등급: 0, 백분위: 0 },
    수학: { 과목: "", 표준점수: 0, 등급: 0, 백분위: 0 },
    영어: { 과목: "", 표준점수: 0, 등급: 0, 백분위: 0 },
    한국사: { 과목: "", 표준점수: 0, 등급: 0, 백분위: 0 },
    과탐1: undefined,
    과탐2: undefined,
    사탐1: undefined,
    사탐2: undefined,
    제2외국어: undefined,
  };

  mockExamScores.forEach((score) => {
    const subjectScore: 과목점수Type = {
      과목: score.subject_name,
      표준점수: parseInt(score.standard_score),
      등급: score.grade,
      백분위: score.percentile,
    };

    switch (score.subject_category) {
      case "kor":
        subjectScore.과목 = "국어";
        params.국어 = subjectScore;
        break;
      case "math":
        subjectScore.과목 = `수학(${score.subject_name})`;
        params.수학 = subjectScore;
        break;
      case "eng":
        params.영어 = subjectScore;
        break;
      case "history":
        params.한국사 = subjectScore;
        break;
      case "society":
        if (!params.사탐1) params.사탐1 = subjectScore;
        else if (!params.사탐2) params.사탐2 = subjectScore;
        break;
      case "science":
        if (!params.과탐1) params.과탐1 = subjectScore;
        else if (!params.과탐2) params.과탐2 = subjectScore;
        break;
      case "lang":
        params.제2외국어 = subjectScore;
        break;
    }
  });

  return params;
};

export const calc정시환산점수 = async (
  params: 정시점수계산Params,
): Promise<정시점수계산결과> => {
  await ensureDataLoaded();
  const { 학교, 수학, 과탐1, 과탐2, 사탐1, 사탐2 } = params;

  try {
    const 학교필수과목 = 학교조건[학교]?.필수과목;
    if (!학교필수과목) throw new Error("학교 조건 없음");

    if (학교필수과목.미적기하 && 수학.과목 === "수학(확통)") {
      return { success: false, result: "미적기하필수" };
    }
    if (학교필수과목.확통 && 수학.과목 !== "수학(확통)") {
      return { success: false, result: "확통필수" };
    }
    if (학교필수과목.사탐 && (!사탐1 || !사탐2)) {
      return { success: false, result: "사탐두개필수" };
    }
    if (학교필수과목.과탐 && (!과탐1 || !과탐2)) {
      return { success: false, result: "과탐두개필수" };
    }

    const 환산점수Params: 환산점수계산Params = {
      ...params,
      국어환산점수: 환산점수계산기(params.국어, 학교),
      수학환산점수: 환산점수계산기(params.수학, 학교),
      영어환산점수: 환산점수계산기(params.영어, 학교),
      한국사환산점수: 환산점수계산기(params.한국사, 학교),
      과탐1환산점수: 과탐1 ? 환산점수계산기(과탐1, 학교) : null,
      과탐2환산점수: 과탐2 ? 환산점수계산기(과탐2, 학교) : null,
      사탐1환산점수: 사탐1 ? 환산점수계산기(사탐1, 학교) : null,
      사탐2환산점수: 사탐2 ? 환산점수계산기(사탐2, 학교) : null,
      제2외국어환산점수: params.제2외국어
        ? 환산점수계산기(params.제2외국어, 학교)
        : null,
    };

    let myScore =
      수능환산필수계산기(환산점수Params) +
      수능환산선택계산기(환산점수Params) +
      수능환산가중택계산기(환산점수Params) +
      추가가감계산기(환산점수Params);
    if (Number.isNaN(myScore)) {
      return { success: false, result: "계산식 오류" };
    }

    const 탐구표준점수 = [과탐1, 과탐2, 사탐1, 사탐2]
      .filter((과목): 과목 is 과목점수Type => !!과목)
      .map((과목) => 과목.표준점수 || 0)
      .sort((a, b) => b - a);

    const 탐구표준점수합계 = 탐구표준점수
      .slice(0, 2)
      .reduce((sum, score) => sum + score, 0);

    const 표점합 =
      (params.국어.표준점수 || 0) +
      (params.수학.표준점수 || 0) +
      탐구표준점수합계;

    // console.log("학교: ", params.학교);
    // console.log("표점합 : ", 표점합);
    // console.log("국어환산점수: ", 환산점수Params.국어환산점수);
    // console.log("수학환산점수: ", 환산점수Params.수학환산점수);
    // console.log("과학환산점수: ", 환산점수Params.한국사환산점수);
    // console.log("과탐1환산점수: ", 환산점수Params.과탐1환산점수);
    // console.log("과탐2환산점수: ", 환산점수Params.과탐2환산점수);
    // console.log("사탐1환산점수: ", 환산점수Params.사탐1환산점수);
    // console.log("사탐2환산점수: ", 환산점수Params.사탐2환산점수);
    // console.log("한국사환삼점수: ", 환산점수Params.한국사환산점수);
    // console.log("외국어환삼점수: ", 환산점수Params.제2외국어환산점수);

    return { success: true, 내점수: myScore, 표점합 };
  } catch (e) {
    return {
      success: false,
      result: e instanceof Error ? e.message : "시스템 오류",
    };
  }
};

// 점수표 JSON 에서 해당 학교/과목/점수의 환산점수를 가져옴
const 환산점수계산기 = (과목: 과목점수Type, 학교: string): number => {
  if (!과목.과목 || !과목.등급) {
    throw new Error(`${과목.과목 || "과목"} 성적 없음`);
  }

  const 과목데이터 = 점수표[과목.과목];
  if (!과목데이터) throw new Error("과목 데이터 없음");

  const 표준점수데이터 = 과목데이터[String(과목.표준점수)];
  if (!표준점수데이터) throw new Error("표준점수 데이터 없음");

  const 환산점수 = 표준점수데이터[학교];
  if (환산점수 === undefined) throw new Error("환산점수 데이터 없음");

  return typeof 환산점수 === "string" ? 0 : 환산점수;
};

// 환산식에 맞춰 수능환산(필수) 계산 {여기서 기본점수 더함}
const 수능환산필수계산기 = (params: 환산점수계산Params): number => {
  const { 탐구과목수 = 0, 기본점수 = 0 } = 학교조건[params.학교] || {};
  const 환산식 = 학교조건[params.학교]?.환산식코드;

  if (!환산식) throw new Error("계산식 오류");

  const 탐구점수 = [
    params.사탐1환산점수,
    params.사탐2환산점수,
    params.과탐1환산점수,
    params.과탐2환산점수,
  ]
    .filter((score): score is number => score !== null)
    .sort((a, b) => b - a)
    .slice(0, 탐구과목수);

  const 탐구과목별계산값 = 탐구점수.reduce((sum, score) => sum + score, 0);

  let result = 0;

  switch (환산식) {
    case 1:
    case 49:
    case 50:
    case 51:
    case 52:
    case 53:
    case 54:
    case 55:
    case 56:
    case 57:
    case 58:
    case 59:
    case 60:
    case 61:
    case 62:
    case 63:
    case 64:
    case 65:
    case 66:
    case 67:
    case 68:
    case 69:
      result =
        params.국어환산점수 +
        params.수학환산점수 +
        params.영어환산점수 +
        params.한국사환산점수 +
        (params.제2외국어환산점수 ?? 0) +
        탐구과목별계산값;
      break;
    case 2:
      result =
        params.국어환산점수 +
        params.영어환산점수 +
        params.한국사환산점수 +
        (params.제2외국어환산점수 ?? 0);
      break;
    case 3:
    case 4:
      result =
        params.국어환산점수 +
        params.한국사환산점수 +
        (params.제2외국어환산점수 ?? 0);
      break;
    case 5:
      result =
        params.수학환산점수 +
        params.영어환산점수 +
        params.한국사환산점수 +
        (params.제2외국어환산점수 ?? 0);
      break;
    case 6:
      result =
        params.수학환산점수 +
        탐구과목별계산값 +
        params.한국사환산점수 +
        (params.제2외국어환산점수 ?? 0);
      break;
    case 7:
    case 8:
      result =
        params.수학환산점수 +
        params.한국사환산점수 +
        (params.제2외국어환산점수 ?? 0);
      break;
    case 9:
    case 10:
    case 11:
      result =
        params.영어환산점수 +
        탐구과목별계산값 +
        params.한국사환산점수 +
        (params.제2외국어환산점수 ?? 0);
      break;
    case 12:
      result =
        params.영어환산점수 +
        params.한국사환산점수 +
        (params.제2외국어환산점수 ?? 0);
      break;
    case 13:
      result = 탐구과목별계산값 + (params.제2외국어환산점수 ?? 0);
      break;
    case 14:
    case 15:
      result =
        탐구과목별계산값 +
        params.한국사환산점수 +
        (params.제2외국어환산점수 ?? 0);
      break;
    case 16:
    case 17:
    case 18:
    case 19:
    case 20:
    case 21:
    case 22:
    case 23:
    case 24:
    case 25:
    case 26:
    case 27:
    case 28:
    case 29:
    case 30:
    case 31:
    case 32:
    case 33:
    case 34:
    case 35:
      result = params.한국사환산점수 + (params.제2외국어환산점수 ?? 0);
      break;
    // 36 ~ 43 = X

    case 44:
      /**
       * 고려세빅데사
       */
      result = 고려세계산기(params, 0.2, 0.35, 0.2, 0.25);
      break;
    case 45:
      /**
       * 고려세기계
       */
      result = 고려세계산기(params, 0.2, 0.35, 0.2, 0.25);
      break;
    case 46:
      /**
       * 고려세경통
       */
      result = 고려세계산기(params, 0.3, 0.3, 0.2, 0.2);
      break;
    case 47:
      /**
       * 고려세문화
       */
      result = 고려세계산기(params, 0.35, 0.2, 0.2, 0.25);
      break;
    case 48:
      /**
       * 경기자전
       */
      result = Math.max(
        경기자전계산기(params, 0.3, 0.35, 0.2, 0.15),
        경기자전계산기(params, 0.35, 0.3, 0.2, 0.15),
      );
      break;
    case 481:
      /**
       * 이화간호
       */
      result = Math.max(
        이화간호계산기(params, 0.3, 0.3, 0.2, 0.2, false),
        이화간호계산기(params, 0.25, 0.3, 0.2, 0.25, true),
      );
      break;
    default:
      break;
  }

  return result + 기본점수;
};

// 환산식에 맞춰 수능환산(선택) 계산
const 수능환산선택계산기 = (params: 환산점수계산Params): number => {
  const { 탐구과목수 = 0 } = 학교조건[params.학교] || {};
  const 환산식 = 학교조건[params.학교]?.환산식코드;

  if (!환산식) throw new Error("계산식 오류");

  const 탐구점수 = [
    params.사탐1환산점수,
    params.사탐2환산점수,
    params.과탐1환산점수,
    params.과탐2환산점수,
  ]
    .filter((score): score is number => score !== null)
    .sort((a, b) => b - a)
    .slice(0, 탐구과목수);

  const 탐구과목별계산값 = 탐구점수.reduce((sum, score) => sum + score, 0);

  const 국수영환산점수내림차순배열 = [
    params.국어환산점수,
    params.수학환산점수,
    params.영어환산점수,
  ].sort((a, b) => b - a);

  const 국수영탐환산점수내림차순배열 = [
    params.국어환산점수,
    params.수학환산점수,
    params.영어환산점수,
    탐구과목별계산값,
  ].sort((a, b) => b - a);

  const 국영탐환산점수내림차순배열 = [
    params.국어환산점수,
    params.영어환산점수,
    탐구과목별계산값,
  ].sort((a, b) => b - a);

  const 국수탐환산점수내림차순배열 = [
    params.국어환산점수,
    params.수학환산점수,
    탐구과목별계산값,
  ].sort((a, b) => b - a);

  const 수영탐환산점수내림차순배열 = [
    params.수학환산점수,
    params.영어환산점수,
    탐구과목별계산값,
  ].sort((a, b) => a - b);

  const 국수최대값 = Math.max(params.국어환산점수, params.수학환산점수);
  const 국수최소값 = Math.min(params.국어환산점수, params.수학환산점수);

  let result = 0;

  switch (환산식) {
    case 2:
      result = Math.max(params.수학환산점수, 탐구과목별계산값);
      break;
    case 3:
      result =
        수영탐환산점수내림차순배열[0] * 3 +
        수영탐환산점수내림차순배열[1] * 2.5 +
        수영탐환산점수내림차순배열[2] * 1.5;
      break;
    case 4:
      result = 수영탐환산점수내림차순배열[0] + 수영탐환산점수내림차순배열[1];
      break;
    case 5:
      result = Math.max(params.국어환산점수, 탐구과목별계산값);
      break;
    case 6:
      result = Math.max(params.국어환산점수, params.영어환산점수);
      break;
    case 7:
      result =
        국영탐환산점수내림차순배열[0] * 3 +
        국영탐환산점수내림차순배열[1] * 2.5 +
        국영탐환산점수내림차순배열[2] * 1.5;
      break;
    case 8:
      result = 국영탐환산점수내림차순배열[0] + 국영탐환산점수내림차순배열[1];
      break;
    case 9:
    case 10:
      result = 국수최대값 * 3.5 + 국수최소값 * 2.5;
      break;
    case 11:
      result = 국수최대값;
      break;
    case 12:
      result = 국수탐환산점수내림차순배열[0] + 국수탐환산점수내림차순배열[1];
      break;
    case 13:
    case 14:
      result = 국수영환산점수내림차순배열[0] + 국수영환산점수내림차순배열[1];
      break;
    case 15:
      result = 국수영환산점수내림차순배열[0];
      break;
    case 16:
      result =
        국수영탐환산점수내림차순배열[0] + 국수영탐환산점수내림차순배열[1];
      break;
    case 17:
    case 18:
      result =
        국수영탐환산점수내림차순배열[0] +
        국수영탐환산점수내림차순배열[1] +
        국수영탐환산점수내림차순배열[2];
      break;
    case 19:
      result = 국수탐환산점수내림차순배열[0] + 국수탐환산점수내림차순배열[1];
      break;
    case 20:
      result =
        국수탐환산점수내림차순배열[0] +
        국수탐환산점수내림차순배열[1] +
        Math.max(params.영어환산점수, params.한국사환산점수);
      break;
    // 21 ~ 35 없음
    case 36:
      result =
        국수영환산점수내림차순배열[0] * 6 +
        Math.max(
          국수영환산점수내림차순배열[1],
          Math.max(탐구과목별계산값, params.한국사환산점수),
        ) *
          4;
      break;
    case 37:
      result =
        국수탐환산점수내림차순배열[0] +
        국수탐환산점수내림차순배열[1] +
        Math.max(params.영어환산점수, params.한국사환산점수);
      break;
    case 38:
      result =
        국수최대값 +
        Math.max(params.영어환산점수, 탐구과목별계산값, params.한국사환산점수);
      break;
    // 39 ~ 69 없음
    default:
      break;
  }

  return result;
};

// 환산식에 맞춰 수능환산(가중택) 계산
const 수능환산가중택계산기 = (params: 환산점수계산Params): number => {
  const { 탐구과목수 = 0 } = 학교조건[params.학교] || {};
  const 환산식 = 학교조건[params.학교]?.환산식코드;

  if (!환산식) throw new Error("계산식 오류");

  const 탐구점수 = [
    params.사탐1환산점수,
    params.사탐2환산점수,
    params.과탐1환산점수,
    params.과탐2환산점수,
  ]
    .filter((score): score is number => score !== null)
    .sort((a, b) => b - a)
    .slice(0, 탐구과목수);

  const 탐구과목별계산값 = 탐구점수.reduce((sum, score) => sum + score, 0);

  const 국수영탐환산점수내림차순배열 = [
    params.국어환산점수,
    params.수학환산점수,
    params.영어환산점수,
    탐구과목별계산값,
  ].sort((a, b) => b - a);

  const 국수영탐한환산점수내림차순배열 = [
    params.국어환산점수,
    params.수학환산점수,
    params.영어환산점수,
    탐구과목별계산값,
    params.한국사환산점수,
  ].sort((a, b) => b - a);
  const 전과목환산점수내림차순배열 = [
    params.국어환산점수,
    params.수학환산점수,
    params.영어환산점수,
    params.제2외국어환산점수 ?? 0,
    params.한국사환산점수,
    ...탐구점수,
  ].sort((a, b) => b - a);

  let result = 0;

  switch (환산식) {
    case 21:
      result =
        4 * 국수영탐환산점수내림차순배열[0] +
        3.5 * 국수영탐환산점수내림차순배열[1] +
        2.5 * 국수영탐환산점수내림차순배열[2];
      break;

    case 22:
      result =
        4.5 * 국수영탐환산점수내림차순배열[0] +
        3.5 * 국수영탐환산점수내림차순배열[1] +
        2 * 국수영탐환산점수내림차순배열[2];
      break;
    case 23:
      result =
        6 * 국수영탐환산점수내림차순배열[0] +
        4 * 국수영탐환산점수내림차순배열[1];
      break;

    case 24:
      result =
        8 * 국수영탐환산점수내림차순배열[0] +
        2 * 국수영탐환산점수내림차순배열[1];
      break;

    case 25:
      result =
        3.5 * 국수영탐환산점수내림차순배열[0] +
        3.5 * 국수영탐환산점수내림차순배열[1] +
        2 * 국수영탐환산점수내림차순배열[2] +
        1 * 국수영탐환산점수내림차순배열[3];
      break;

    case 26:
      result =
        4.5 * 국수영탐환산점수내림차순배열[0] +
        3.5 * 국수영탐환산점수내림차순배열[1] +
        2 * 국수영탐환산점수내림차순배열[2];
      break;
    case 27:
      result =
        4.5 * 국수영탐환산점수내림차순배열[0] +
        3.5 * 국수영탐환산점수내림차순배열[1] +
        2 * 국수영탐환산점수내림차순배열[2];
      break;

    case 28:
      result =
        4 * 국수영탐환산점수내림차순배열[0] +
        3 * 국수영탐환산점수내림차순배열[1] +
        2 * 국수영탐환산점수내림차순배열[2] +
        국수영탐환산점수내림차순배열[3];
      break;
    case 29:
      result =
        5 * 국수영탐환산점수내림차순배열[0] +
        3 * 국수영탐환산점수내림차순배열[1] +
        2 * 국수영탐환산점수내림차순배열[2];
      break;
    case 30:
      result =
        8 * 국수영탐환산점수내림차순배열[0] +
        2 * 국수영탐환산점수내림차순배열[1];
      break;
    case 31:
      result = Math.max(
        params.국어환산점수 * 2.5 +
          params.수학환산점수 * 4 +
          params.영어환산점수 +
          탐구과목별계산값 * 2.5,
        params.국어환산점수 * 2.5 +
          params.수학환산점수 * 3.5 +
          params.영어환산점수 +
          탐구과목별계산값 * 3,
      );
      break;
    case 32:
      result = Math.max(
        params.국어환산점수 * 2 +
          params.수학환산점수 * 4 +
          params.영어환산점수 +
          탐구과목별계산값 * 3,
        params.국어환산점수 * 3 +
          params.수학환산점수 * 4 +
          params.영어환산점수 +
          탐구과목별계산값 * 2,
      );
      break;
    case 33:
      result = Math.max(
        params.국어환산점수 * 3.5 +
          params.수학환산점수 * 2.5 +
          params.영어환산점수 +
          탐구과목별계산값 * 3,
        params.국어환산점수 * 3 +
          params.수학환산점수 * 4 +
          params.영어환산점수 +
          탐구과목별계산값 * 2,
      );
      break;
    case 34:
      result = Math.max(
        params.국어환산점수 * 3.5 +
          params.수학환산점수 * 3 +
          params.영어환산점수 +
          탐구과목별계산값 * 2.5,
        params.국어환산점수 * 3 +
          params.수학환산점수 * 3 +
          params.영어환산점수 +
          탐구과목별계산값 * 3,
      );
      break;
    case 35:
      result = Math.max(
        params.국어환산점수 * 4 +
          params.수학환산점수 * 3 +
          params.영어환산점수 +
          탐구과목별계산값,
        params.국어환산점수 * 3 +
          params.수학환산점수 * 4 +
          params.영어환산점수 +
          탐구과목별계산값,
      );
      break;

    // 36 ~ 38 없음
    case 39:
      result =
        4 * 국수영탐한환산점수내림차순배열[0] +
        3 * 국수영탐한환산점수내림차순배열[1] +
        2 * 국수영탐한환산점수내림차순배열[2] +
        국수영탐한환산점수내림차순배열[3];
      break;
    case 40:
      result =
        4 * Math.max(params.국어환산점수, params.영어환산점수) +
        3 *
          Math.max(
            Math.min(params.국어환산점수, params.영어환산점수),
            탐구과목별계산값,
          );
      break;
    case 41:
      result =
        4 * 국수영탐한환산점수내림차순배열[0] +
        3 * 국수영탐한환산점수내림차순배열[1] +
        2 * 국수영탐한환산점수내림차순배열[2] +
        국수영탐한환산점수내림차순배열[3];
      break;
    case 42:
      result =
        5 * 국수영탐한환산점수내림차순배열[0] +
        3 * 국수영탐한환산점수내림차순배열[1] +
        2 * 국수영탐한환산점수내림차순배열[2];
      break;
    case 43:
      result =
        6 * 전과목환산점수내림차순배열[0] + 4 * 전과목환산점수내림차순배열[1];
      break;
    default:
      break;
  }

  return result;
};

// 환산식에 맞춰 추가가감 계산
const 추가가감계산기 = (params: 환산점수계산Params): number => {
  const { 탐구과목수 = 0 } = 학교조건[params.학교] || {};
  const 환산식 = 학교조건[params.학교]?.환산식코드;

  if (!환산식) throw new Error("계산식 오류");

  const 탐구점수 = [
    params.사탐1환산점수,
    params.사탐2환산점수,
    params.과탐1환산점수,
    params.과탐2환산점수,
  ]
    .filter((score): score is number => score !== null)
    .sort((a, b) => b - a)
    .slice(0, 탐구과목수);

  const 탐구백분위 = [
    params.과탐1?.백분위,
    params.과탐2?.백분위,
    params.사탐1?.백분위,
    params.사탐2?.백분위,
  ]
    .filter((n) => n !== undefined)
    .sort((a, b) => b - a)
    .slice(0, 탐구과목수);

  const 탐구과목별계산값 = 탐구점수.reduce((sum, score) => sum + score, 0);

  const 국수영탐환산점수내림차순배열 = [
    params.국어환산점수,
    params.수학환산점수,
    params.영어환산점수,
    탐구과목별계산값,
  ].sort((a, b) => b - a);

  const 과탐선택목록 = [params.과탐1, params.과탐2].filter(
    (과목): 과목 is NonNullable<typeof 과목> => !!과목,
  );

  const 과탐환산점수 = [params.과탐1환산점수, params.과탐2환산점수]
    .filter((score): score is number => score !== null)
    .sort((a, b) => b - a);

  // const 물리화학선택개수 = 과탐선택목록.filter(
  //   (과목) => 과목.과목.includes("물리학") || 과목.과목.includes("화학"),
  // ).length;

  const 과탐선택개수 = 과탐선택목록.length;

  const 미적분기하선택여부 =
    params.수학?.과목?.includes("미적") || params.수학?.과목?.includes("기하");

  let result = 0;

  switch (환산식) {
    case 9:
      // 수학 점수가 국어 점수보다 높은지 확인
      if (미적분기하선택여부 && params.수학환산점수 > params.국어환산점수) {
        // 수학 환산점수 * 3.5 * 0.05
        result = params.수학환산점수 * 3.5 * 0.05;
      }
      break;
    case 17:
      // 물리학이나 화학을 2과목 선택했고, 탐구점수가 국수영탐 중 상위 3개 점수보다 크면
      if (
        과탐선택개수 === 2 &&
        탐구과목별계산값 > 국수영탐환산점수내림차순배열[2]
      ) {
        result = params.수학환산점수;
      }
      break;
    case 26:
      if (
        미적분기하선택여부 &&
        params.수학환산점수 > 국수영탐환산점수내림차순배열[2]
      ) {
        result = (params.수학.백분위 ?? 0) * 0.1;
      }
      break;
    case 49:
      if (탐구점수.length === 2) {
        result = 탐구과목별계산값 * 0.03;
      }
      break;
    case 50:
      if (과탐선택개수 === 2) {
        result = 탐구과목별계산값 * 0.03;
      }
      break;
    case 51:
      if (과탐선택개수 === 2) {
        result = 탐구과목별계산값 * 0.05;
      }
      break;
    case 52:
      if (과탐선택개수 === 2) {
        result = 탐구과목별계산값 * 0.1;
      }
      break;

    case 53:
      if (과탐선택개수 === 2) {
        result = 2 * 0.05 * 탐구백분위.reduce((acc, cur) => acc + cur, 0);
      }
      break;
    case 54:
      if (과탐선택개수 === 2) {
        result = 탐구과목별계산값 * 0.05;
      }
      break;
    case 55:
      if (과탐선택목록.length === 2) {
        result = 탐구과목별계산값 * 0.05;
      }
      break;
    case 56:
      if (과탐선택개수 === 2) {
        result = 탐구과목별계산값 * 0.07;
      }
      break;
    case 57:
      if (과탐선택개수 === 2) {
        const 과탐전체과목수 = 과탐선택목록.filter(
          (과목) =>
            과목.과목.includes("물리학") ||
            과목.과목.includes("생명과학") ||
            과목.과목.includes("지구과학") ||
            과목.과목.includes("화학"),
        ).length;

        result = 과탐전체과목수 === 2 ? 5 : 과탐전체과목수 === 1 ? 3 : 0;
      }
      break;
    case 58:
      if (탐구점수.length === 2) {
        // 화학II 또는 생명과학II 포함 여부 체크
        const 화학생명포함 = [params.과탐1, params.과탐2]
          .filter((과목): 과목 is NonNullable<typeof 과목> => !!과목)
          .some(
            (과목) =>
              과목.과목.includes("화학 Ⅱ") || 과목.과목.includes("생명과학 Ⅱ"),
          );

        result = 탐구과목별계산값 * (화학생명포함 ? 0.07 : 0.05);
      }
      break;
    case 59:
      if (과탐선택개수 === 2) {
        result = 탐구백분위.reduce((acc, cur) => acc + cur, 0) * 0.1;
      } else if (과탐선택개수 === 1) {
        result = 탐구백분위.reduce((acc, cur) => acc + cur, 0) * 0.05;
      } else {
        result = 0;
      }
      break;
    case 60:
      // 물리학이나 화학 2과목 선택시 수학 미적분 점수 가산
      if (과탐선택개수 === 2 && params.수학?.과목?.includes("미적")) {
        result = params.수학환산점수;
      }
      break;

    case 61:
      // 해당 과탐 과목 하나라도 선택했는지 확인
      const 과탐2존재 = [params.과탐1, params.과탐2]
        .filter((과목): 과목 is NonNullable<typeof 과목> => !!과목)
        .some(
          (과목) =>
            과목.과목.includes("물리학 Ⅱ") ||
            과목.과목.includes("생명과학 Ⅱ") ||
            과목.과목.includes("지구과학 Ⅱ") ||
            과목.과목.includes("화학 Ⅱ"),
        );

      if (과탐2존재) {
        const 가산점적용점수 = (탐구과목별계산값 + 0.5) * 0.6;
        result = 가산점적용점수 - 탐구과목별계산값; // 차이만 더해야함
      }
      break;

    case 62:
      const 미적기하선택 =
        params.수학?.과목?.includes("미적") ||
        params.수학?.과목?.includes("기하");

      if (미적기하선택) {
        result = (params.수학.백분위 ?? 0) * 0.1;
      }
      break;

    case 63:
      if (0 < 과탐환산점수.length) {
        result = 과탐환산점수[0] * 0.1;
      }
      break;
    case 64:
      const 물리학12선택 =
        과탐선택목록.filter((과목) => 과목.과목.includes("물리학")).length ===
        2;

      if (물리학12선택) {
        result = 탐구백분위.reduce((acc, cur) => acc + cur, 0) * 0.05;
      }
      break;
    case 65:
      const 생명과학12선택 =
        과탐선택목록.filter((과목) => 과목.과목.includes("생명과학")).length ===
        2;

      if (생명과학12선택) {
        result = 탐구백분위.reduce((acc, cur) => acc + cur, 0) * 0.05;
      }
      break;
    case 66:
      const 지구과학12선택 =
        과탐선택목록.filter((과목) => 과목.과목.includes("지구과학")).length ===
        2;

      if (지구과학12선택) {
        result = 탐구백분위.reduce((acc, cur) => acc + cur, 0) * 0.05;
      }
      break;
    case 67:
      const 화학12선택 =
        과탐선택목록.filter((과목) => 과목.과목.includes("화학")).length === 2;

      if (화학12선택) {
        result = 탐구백분위.reduce((acc, cur) => acc + cur, 0) * 0.05;
      }
      break;
    // TODO 68 SUM(물리학 :34)/SUM(물리학 :34)*60
    case 69:
      if (탐구점수.length === 2) {
        // 과탐 II가 하나라도 있는지 또는 과탐 I,II 조합인지 확인
        const 과탐II존재 = [params.과탐1, params.과탐2]
          .filter((과목): 과목 is NonNullable<typeof 과목> => !!과목)
          .some((과목) => 과목.과목.includes("Ⅱ"));

        if (과탐II존재) {
          result = 탐구과목별계산값 * 0.05;
        }
      }
      break;

    default:
      break;
  }

  return result;
};

const 고려세계산기 = (
  params: 환산점수계산Params,
  국어비율: number,
  수학비율: number,
  영어비율: number,
  탐구비율: number,
): number => {
  const 사탐1변환점수 = params.사탐1?.백분위
    ? 고려세사탐변환점수[params.사탐1.백분위]
    : null;
  const 사탐2변환점수 = params.사탐2?.백분위
    ? 고려세사탐변환점수[params.사탐2.백분위]
    : null;
  const 과탐1변환점수 = params.과탐1?.백분위
    ? 고려세과탐변환점수[params.과탐1.백분위]
    : null;
  const 과탐2변환점수 = params.과탐2?.백분위
    ? 고려세과탐변환점수[params.과탐2.백분위]
    : null;
  const 탐구변환점수합 = [
    사탐1변환점수,
    사탐2변환점수,
    과탐1변환점수,
    과탐2변환점수,
  ]
    .filter((score): score is number => score !== null)
    .reduce((sum, score) => sum + score, 0);

  const 영어변환점수 = params.영어?.등급
    ? 고려세영어변환점수[params.영어.등급 - 1]
    : null;

  const 탐구변환점수최대값 = Math.max(
    고려세사탐변환점수[100],
    고려세과탐변환점수[100],
  );
  const 국어최대표점 = 139;
  const 수학최대표점 = 139;
  const 영어최대표점 = 영어변환점수 ?? 0;
  const top =
    (params.국어.표준점수 ?? 0) * 국어비율 +
    (params.수학.표준점수 ?? 0) * 수학비율 +
    (영어변환점수 ?? 0) * 영어비율 +
    탐구변환점수합 * 탐구비율;
  const bottom =
    국어최대표점 * 국어비율 +
    수학최대표점 * 수학비율 +
    영어최대표점 * 영어비율 +
    탐구변환점수최대값 * 탐구비율 * 2;

  return (top / bottom) * 1000;
};

const 경기자전계산기 = (
  params: 환산점수계산Params,
  국어비율: number,
  수학비율: number,
  영어비율: number,
  탐구비율: number,
): number => {
  const 사탐1백분위 = params.사탐1?.백분위;
  const 사탐2백분위 = params.사탐2?.백분위;
  const 과탐1백분위 = params.과탐1?.백분위;
  const 과탐2백분위 = params.과탐2?.백분위;
  const 탐구백분위최고 = [사탐1백분위, 사탐2백분위, 과탐1백분위, 과탐2백분위]
    .filter((score): score is number => score !== null)
    .sort((a, b) => b - a)
    .slice(0, 1)[0];

  const 영어변환점수 = params.영어?.등급
    ? 경기자전영어변환점수[params.영어.등급 - 1]
    : null;

  const 한국사변환점수 = params.한국사?.등급
    ? 경기자전한국사변환점수[params.한국사.등급 - 1]
    : null;

  return (
    (params.국어.백분위 ?? 0) * 국어비율 +
    (params.수학.백분위 ?? 0) * 수학비율 +
    (영어변환점수 ?? 0) * 영어비율 +
    (탐구백분위최고 ?? 0) * 탐구비율 -
    (한국사변환점수 ?? 0)
  );
};

const 이화간호계산기 = (
  params: 환산점수계산Params,
  국어비율: number,
  수학비율: number,
  영어비율: number,
  탐구비율: number,
  자연여부: boolean,
): number => {
  const 사탐1변환표준점수 = params.사탐1?.표준점수
    ? 고려세사탐변환점수[params.사탐1.표준점수]
    : null;
  const 사탐2변환표준점수 = params.사탐2?.표준점수
    ? 고려세사탐변환점수[params.사탐2.표준점수]
    : null;
  const 과탐1변환표준점수 = params.과탐1?.표준점수
    ? 자연여부
      ? 고려세과탐변환점수[params.과탐1.표준점수] * 1.06
      : 고려세과탐변환점수[params.과탐1.표준점수]
    : null;
  const 과탐2변환표준점수 = params.과탐2?.표준점수
    ? 자연여부
      ? 고려세과탐변환점수[params.과탐2.표준점수] * 1.06
      : 고려세과탐변환점수[params.과탐2.표준점수]
    : null;
  const 탐구변환표준점수합 = [
    사탐1변환표준점수,
    사탐2변환표준점수,
    과탐1변환표준점수,
    과탐2변환표준점수,
  ]
    .filter((score): score is number => score !== null)
    .reduce((sum, score) => sum + score, 0);

  const 영어변환점수 = params.영어?.등급
    ? 이화간호영어변환점수[params.영어.등급 - 1]
    : null;

  const 한국사변환점수 = params.한국사?.등급
    ? 자연여부
      ? 이화간호한국사자연변환점수[params.한국사.등급 - 1]
      : 이화간호한국사인문변환점수[params.한국사.등급 - 1]
    : null;

  const 국어최고표준점 = 139;
  const 수학최고표준점 = 139;
  const 탐구최고표준점 = Math.max(
    고려세사탐변환점수[100],
    고려세과탐변환점수[100],
  );

  const top =
    (params.국어.표준점수 ?? 0) * 국어비율 +
    (params.수학.표준점수 ?? 0) * 수학비율 +
    (탐구변환표준점수합 ?? 0) * 탐구비율;

  const bottom =
    국어최고표준점 * 국어비율 +
    수학최고표준점 * 수학비율 +
    탐구최고표준점 * 탐구비율 * 2;

  return (
    (top / bottom + ((영어변환점수 ?? 0) / 100) * 영어비율) * 1000 +
    (한국사변환점수 ?? 0)
  );
};
