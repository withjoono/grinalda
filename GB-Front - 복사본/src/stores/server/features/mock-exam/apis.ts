import { makeApiCall } from "../../common-utils";
import { IMockExamRawScore, IMockExamScore } from "./interfaces";

/**
 * 모의고사 점수 조회
 */
const fetchMockExamStandardScoresAPI = async () => {
  const res = await makeApiCall<void, IMockExamScore[]>(
    "GET",
    "/mock-exam/standard",
  );
  if (res.success) {
    return res.data;
  }
  return [];
};

/**
 * 모의고사 원점수 조회
 */
const fetchMockExamRawScoresAPI = async () => {
  const res = await makeApiCall<void, IMockExamRawScore[]>(
    "GET",
    "/mock-exam/raw",
  );
  if (res.success) {
    return res.data;
  }
  return [];
};

export const MOCK_EXAM_APIS = {
  fetchMockExamStandardScoresAPI,
  fetchMockExamRawScoresAPI,
};
