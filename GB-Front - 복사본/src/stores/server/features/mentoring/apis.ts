/**
 * 멘토링 기능 API 함수
 */

import { makeApiCall } from "../../common-utils";
import {
  ILinkedStudent,
  ILinkedChild,
  ILinkedMentor,
  IMemo,
  IGenerateCodeResponse,
  IVerifyCodeResponse,
  ILinkAccountRequest,
  ILinkAccountResponse,
  IUpdateServicePermissionRequest,
  ICreateMemoRequest,
  IUpdateMemoRequest,
  IMentoringRelation,
  IAddStudentRequest,
  IAddClassRequest,
  IDeleteClassRequest,
} from "./interfaces";

/**
 * 연동된 학생 목록 조회 (선생님용)
 */
const fetchLinkedStudentsAPI = async (): Promise<ILinkedStudent[]> => {
  const res = await makeApiCall<void, ILinkedStudent[]>(
    "GET",
    "/mentoring/students",
    undefined,
    undefined,
    'nest'
  );
  if (res.success && res.data) {
    return res.data;
  }
  return [];
};

/**
 * 연동된 자녀 목록 조회 (학부모용)
 */
const fetchLinkedChildrenAPI = async (): Promise<ILinkedChild[]> => {
  const res = await makeApiCall<void, ILinkedChild[]>(
    "GET",
    "/mentoring/children",
    undefined,
    undefined,
    'nest'
  );
  if (res.success && res.data) {
    return res.data;
  }
  return [];
};

/**
 * 연동된 멘토 목록 조회 (학생용)
 */
const fetchLinkedMentorsAPI = async (): Promise<ILinkedMentor[]> => {
  const res = await makeApiCall<void, ILinkedMentor[]>(
    "GET",
    "/mentoring/mentors",
    undefined,
    undefined,
    'nest'
  );
  if (res.success && res.data) {
    return res.data;
  }
  return [];
};

/**
 * 연계 코드 생성
 */
const generateLinkCodeAPI = async (): Promise<IGenerateCodeResponse | null> => {
  const res = await makeApiCall<void, IGenerateCodeResponse>(
    "POST",
    "/mentoring/code/generate",
    undefined,
    undefined,
    'nest'
  );
  if (res.success && res.data) {
    return res.data;
  }
  return null;
};

/**
 * 연계 코드 검증
 */
const verifyLinkCodeAPI = async (code: string): Promise<IVerifyCodeResponse | null> => {
  const res = await makeApiCall<{ code: string }, IVerifyCodeResponse>(
    "POST",
    "/mentoring/code/verify",
    { code },
    undefined,
    'nest'
  );
  if (res.success && res.data) {
    return res.data;
  }
  return null;
};

/**
 * 계정 연동
 */
const linkAccountAPI = async (request: ILinkAccountRequest): Promise<ILinkAccountResponse | null> => {
  const res = await makeApiCall<ILinkAccountRequest, ILinkAccountResponse>(
    "POST",
    "/mentoring/link",
    request,
    undefined,
    'nest'
  );
  if (res.success && res.data) {
    return res.data;
  }
  return null;
};

/**
 * 계정 연동 해제
 */
const unlinkAccountAPI = async (linkId: number): Promise<boolean> => {
  const res = await makeApiCall<void, { success: boolean }>(
    "DELETE",
    `/mentoring/link/${linkId}`,
    undefined,
    undefined,
    'nest'
  );
  return res.success === true;
};

/**
 * 서비스 권한 설정
 */
const updateServicePermissionAPI = async (
  request: IUpdateServicePermissionRequest
): Promise<boolean> => {
  const res = await makeApiCall<IUpdateServicePermissionRequest, { success: boolean }>(
    "PATCH",
    `/mentoring/link/${request.linkId}/permissions`,
    request,
    undefined,
    'nest'
  );
  return res.success === true;
};

/**
 * 멘토링 관계 조회
 */
const fetchMentoringRelationAPI = async (studentId: string): Promise<IMentoringRelation | null> => {
  const res = await makeApiCall<void, IMentoringRelation>(
    "GET",
    `/mentoring/relation/${studentId}`,
    undefined,
    undefined,
    'nest'
  );
  if (res.success && res.data) {
    return res.data;
  }
  return null;
};

// ============= 메모 API =============

/**
 * 메모 목록 조회
 */
const fetchMemosAPI = async (studentId: string): Promise<IMemo[]> => {
  const res = await makeApiCall<void, IMemo[]>(
    "GET",
    `/mentoring/memos/${studentId}`,
    undefined,
    undefined,
    'nest'
  );
  if (res.success && res.data) {
    return res.data;
  }
  return [];
};

/**
 * 메모 생성
 */
const createMemoAPI = async (request: ICreateMemoRequest): Promise<IMemo | null> => {
  const res = await makeApiCall<ICreateMemoRequest, IMemo>(
    "POST",
    "/mentoring/memos",
    request,
    undefined,
    'nest'
  );
  if (res.success && res.data) {
    return res.data;
  }
  return null;
};

/**
 * 메모 수정
 */
const updateMemoAPI = async (request: IUpdateMemoRequest): Promise<IMemo | null> => {
  const res = await makeApiCall<IUpdateMemoRequest, IMemo>(
    "PATCH",
    `/mentoring/memos/${request.memoId}`,
    request,
    undefined,
    'nest'
  );
  if (res.success && res.data) {
    return res.data;
  }
  return null;
};

/**
 * 메모 삭제
 */
const deleteMemoAPI = async (memoId: number): Promise<boolean> => {
  const res = await makeApiCall<void, { success: boolean }>(
    "DELETE",
    `/mentoring/memos/${memoId}`,
    undefined,
    undefined,
    'nest'
  );
  return res.success === true;
};

/**
 * 메모 읽음 처리
 */
const markMemoAsReadAPI = async (memoId: number): Promise<boolean> => {
  const res = await makeApiCall<void, { success: boolean }>(
    "PATCH",
    `/mentoring/memos/${memoId}/read`,
    undefined,
    undefined,
    'nest'
  );
  return res.success === true;
};

// ============= 학생/반 관리 API =============

/**
 * 학생 추가 (선생님용)
 */
const addStudentAPI = async (request: IAddStudentRequest): Promise<boolean> => {
  const res = await makeApiCall<IAddStudentRequest, { success: boolean }>(
    "POST",
    "/mentoring/students",
    request,
    undefined,
    'nest'
  );
  return res.success === true;
};

/**
 * 학생 삭제 (선생님용)
 */
const deleteStudentAPI = async (studentId: number): Promise<boolean> => {
  const res = await makeApiCall<void, { success: boolean }>(
    "DELETE",
    `/mentoring/students/${studentId}`,
    undefined,
    undefined,
    'nest'
  );
  return res.success === true;
};

/**
 * 반 추가 (선생님용)
 */
const addClassAPI = async (request: IAddClassRequest): Promise<boolean> => {
  const res = await makeApiCall<IAddClassRequest, { success: boolean }>(
    "POST",
    "/mentoring/classes",
    request,
    undefined,
    'nest'
  );
  return res.success === true;
};

/**
 * 반 삭제 (선생님용)
 */
const deleteClassAPI = async (request: IDeleteClassRequest): Promise<boolean> => {
  const res = await makeApiCall<IDeleteClassRequest, { success: boolean }>(
    "DELETE",
    "/mentoring/classes",
    request,
    undefined,
    'nest'
  );
  return res.success === true;
};

/**
 * 자녀 연동 해제 (학부모용)
 */
const deleteChildAPI = async (childId: number): Promise<boolean> => {
  const res = await makeApiCall<void, { success: boolean }>(
    "DELETE",
    `/mentoring/children/${childId}`,
    undefined,
    undefined,
    'nest'
  );
  return res.success === true;
};

export const MENTORING_API = {
  // 연동 관련
  fetchLinkedStudentsAPI,
  fetchLinkedChildrenAPI,
  fetchLinkedMentorsAPI,
  generateLinkCodeAPI,
  verifyLinkCodeAPI,
  linkAccountAPI,
  unlinkAccountAPI,
  updateServicePermissionAPI,
  fetchMentoringRelationAPI,
  // 메모 관련
  fetchMemosAPI,
  createMemoAPI,
  updateMemoAPI,
  deleteMemoAPI,
  markMemoAsReadAPI,
  // 학생/반 관리 관련
  addStudentAPI,
  deleteStudentAPI,
  addClassAPI,
  deleteClassAPI,
  // 학부모용 자녀 관리
  deleteChildAPI,
};
