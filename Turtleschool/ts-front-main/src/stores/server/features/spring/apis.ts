import { springApiClient } from "../../api-client";

export interface IOfficerApplyListInfo {
  studentId: string;
  // 평가자이름
  studentName: string;
  series: string;
  // 평가자프로파일
  progressStatus: string;
  //대기자 수
  readyCount: string;
  phone: string;
  email: string;
}
/**
 * 평가자가 평가 신청 목록 조회
 */
const fetchOfficerApplyListAPI = async (): Promise<IOfficerApplyListInfo> => {
  const res = await springApiClient.get<IOfficerApplyListInfo>(
    "/officer/apply/student/info",
  );
  return res.data;
};

export type IEvaludationListItem = {
  studentId: string;
  studentName: string;
  completeDt: string;
  series: string;
  phone: string;
  email: string;
};

/**
 * 평가자가 평가 완료 목록 조회
 */
export const fetchCompleteEvaluationList = async () => {
  const res = await springApiClient.get<IEvaludationListItem[]>(
    "/officer/survey/complete/list",
    {},
  );
  return res.data;
};

export interface IEvaluationStudentInfo {
  studentName: string;
  series: string;
}

export interface IOfficerEvaluationResponse {
  status: boolean;
  officerSurveyList: {
    surveyId: string;
    score: string;
  }[];
  officerCommentList: {
    comment: string;
    mainSurveyType: string;
  }[];
}

/**
 * 평가 설문지 조회
 */
export const fetchSurveyScoreList = async (
  studentId: string | undefined | null,
): Promise<IOfficerEvaluationResponse> => {
  const res = await springApiClient.get("/officer/survey/score/list", {
    params: { studentId },
  });
  return res.data;
};

/**
 * 평가 설문지 사용자 정보 조회
 */
export const fetchStudentInfo = async (
  studentId: string | undefined | null,
): Promise<IEvaluationStudentInfo> => {
  const res = await springApiClient.get("/officer/survey/student/info", {
    params: { studentId },
  });
  return res.data;
};

/**
 * 평가자 프로필 저장
 */
const updateOfficerProfileAPI = async (
  name: string | undefined,
  university: string | undefined,
  education: string | undefined,
  files: File | null,
): Promise<{
  status: boolean;
  message: string;
}> => {
  const formData = new FormData();
  if (files != null) {
    const file = files;
    formData.append("file", file);
  }
  const data = {
    name: name,
    university: university,
    education: education,
    seriesList: [],
  };
  formData.append("data", JSON.stringify(data));

  const res = await springApiClient.post("/officer/profile/save", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const uploadEarlyThreeGradeHtmlFile = async (
  file: File,
): Promise<{ code: string; message: string; status: boolean }> => {
  const form = new FormData();
  form.append("file", file);
  const res = await springApiClient.post(
    "/earlyd/three/grade/html/fileupload",
    form,
  );

  return res.data;
};

export const uploadEarlyThreeGradeGraduatePdfFile = async (
  file: File,
): Promise<{ code: string; message: string; status: boolean }> => {
  const form = new FormData();
  form.append("file", file);
  const res = await springApiClient.post(
    "/earlyd/three/graduate/pdf/fileupload",
    form,
  );

  return res.data;
};

export const checkEarlydStudentSchoolRecordFileUpload = async (
  selectFileType: string,
): Promise<{
  code: string;
  message: string;
  status: boolean;
}> => {
  const res = await springApiClient.get(
    "/earlyd/student/schoolrecord/fileupload/check",
    {
      params: {
        selectFileType: selectFileType,
      },
    },
  );
  return res.data;
};

export const SPRING_API = {
  fetchOfficerApplyListAPI,
  fetchCompleteEvaluationList,
  fetchSurveyScoreList,
  fetchStudentInfo,
  updateOfficerProfileAPI,

  uploadEarlyThreeGradeGraduatePdfFile,
  uploadEarlyThreeGradeHtmlFile,
  checkEarlydStudentSchoolRecordFileUpload,
};
