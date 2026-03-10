/**
 * 플래너 기능 API 함수
 */

import { makeApiCall } from "../../common-utils";
import {
  IRoutine,
  ICreateRoutineRequest,
  IUpdateRoutineRequest,
  IPlan,
  ICreatePlanRequest,
  IUpdatePlanRequest,
  IUpdatePlanProgressRequest,
  IPlannerItem,
  ICreatePlannerItemRequest,
  IUpdatePlannerItemRequest,
  IWeeklyProgress,
  IPlannerMentor,
  INotice,
  IRankInfo,
  IPlannerClass,
  IClassMember,
  ISetPlannerClassRequest,
  ICreateFeedbackRequest,
  IUpdateMissionAchievementRequest,
  PrimaryType,
} from "./interfaces";

// ============================================
// 루틴 API
// ============================================

/**
 * 루틴 목록 조회
 */
const fetchRoutinesAPI = async (): Promise<IRoutine[]> => {
  const res = await makeApiCall<void, IRoutine[]>(
    "GET",
    "/planner/routine",
    undefined,
    undefined,
    'nest'
  );
  console.log('[fetchRoutinesAPI] Response:', res);
  if (res.success && res.data) {
    // days 배열 변환 (백엔드에서는 개별 필드로 옴)
    const transformed = res.data.map(routine => ({
      ...routine,
      days: [
        routine.sun ?? false,
        routine.mon ?? false,
        routine.tues ?? false,
        routine.wed ?? false,
        routine.thurs ?? false,
        routine.fri ?? false,
        routine.sat ?? false,
      ],
    }));
    console.log('[fetchRoutinesAPI] Transformed:', transformed);
    return transformed;
  }
  return [];
};

/**
 * 루틴 생성
 */
const createRoutineAPI = async (request: ICreateRoutineRequest): Promise<number | null> => {
  const res = await makeApiCall<ICreateRoutineRequest, number>(
    "POST",
    "/planner/routine",
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
 * 루틴 수정
 */
const updateRoutineAPI = async (request: IUpdateRoutineRequest): Promise<boolean> => {
  const res = await makeApiCall<IUpdateRoutineRequest, { success: boolean }>(
    "POST",
    "/planner/routine/update",
    request,
    undefined,
    'nest'
  );
  return res.success === true;
};

/**
 * 루틴 삭제
 */
const deleteRoutineAPI = async (routineId: number): Promise<boolean> => {
  const res = await makeApiCall<void, { success: boolean }>(
    "DELETE",
    `/planner/routine/${routineId}`,
    undefined,
    undefined,
    'nest'
  );
  return res.success === true;
};

// ============================================
// 장기 계획 API
// ============================================

/**
 * 장기 계획 목록 조회
 */
const fetchPlansAPI = async (): Promise<IPlan[]> => {
  const res = await makeApiCall<void, IPlan[]>(
    "GET",
    "/planner/plan",
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
 * 장기 계획 생성/수정
 */
const createOrUpdatePlanAPI = async (request: ICreatePlanRequest | IUpdatePlanRequest): Promise<number | boolean> => {
  const res = await makeApiCall<ICreatePlanRequest | IUpdatePlanRequest, number>(
    "POST",
    "/planner/plan",
    request,
    undefined,
    'nest'
  );
  if (res.success) {
    return res.data ?? true;
  }
  return false;
};

/**
 * 장기 계획 진행률 업데이트
 */
const updatePlanProgressAPI = async (request: IUpdatePlanProgressRequest): Promise<boolean> => {
  const params = new URLSearchParams();
  if (request.id) params.append('id', request.id.toString());
  params.append('itemId', request.itemId.toString());
  params.append('done', request.done.toString());

  const res = await makeApiCall<void, { success: boolean }>(
    "GET",
    `/planner/plan/progress?${params.toString()}`,
    undefined,
    undefined,
    'nest'
  );
  return res.success === true;
};

/**
 * 장기 계획 삭제
 */
const deletePlanAPI = async (planId: number): Promise<boolean> => {
  const res = await makeApiCall<void, { success: boolean }>(
    "DELETE",
    `/planner/plan/${planId}`,
    undefined,
    undefined,
    'nest'
  );
  return res.success === true;
};

// ============================================
// 플래너 아이템 (일정) API
// ============================================

/**
 * 플래너 아이템 목록 조회
 */
const fetchPlannerItemsAPI = async (): Promise<IPlannerItem[]> => {
  const res = await makeApiCall<void, IPlannerItem[]>(
    "GET",
    "/planner/item",
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
 * 플래너 아이템 생성/수정
 */
const createOrUpdatePlannerItemAPI = async (
  request: ICreatePlannerItemRequest | IUpdatePlannerItemRequest
): Promise<number | boolean> => {
  const res = await makeApiCall<ICreatePlannerItemRequest | IUpdatePlannerItemRequest, number>(
    "POST",
    "/planner/item",
    request,
    undefined,
    'nest'
  );
  if (res.success) {
    return res.data ?? true;
  }
  return false;
};

/**
 * 플래너 아이템 삭제
 */
const deletePlannerItemAPI = async (itemId: number): Promise<boolean> => {
  const res = await makeApiCall<void, { success: boolean }>(
    "DELETE",
    `/planner/item/${itemId}`,
    undefined,
    undefined,
    'nest'
  );
  return res.success === true;
};

/**
 * 성취도 업데이트
 */
const updateMissionAchievementAPI = async (request: IUpdateMissionAchievementRequest): Promise<boolean> => {
  const res = await makeApiCall<IUpdateMissionAchievementRequest, { success: boolean }>(
    "POST",
    "/planner/item",
    {
      id: request.itemId,
      progress: request.progress,
      description: request.description,
    } as any,
    undefined,
    'nest'
  );
  return res.success === true;
};

// ============================================
// 주간 성취도 API
// ============================================

/**
 * 주간 성취도 조회
 */
const fetchWeeklyProgressAPI = async (primaryType: PrimaryType): Promise<IWeeklyProgress[]> => {
  const res = await makeApiCall<void, IWeeklyProgress[]>(
    "GET",
    `/planner/progress/weekly?primaryType=${encodeURIComponent(primaryType)}`,
    undefined,
    undefined,
    'nest'
  );
  if (res.success && res.data) {
    return res.data;
  }
  return [];
};

// ============================================
// 멘토/클래스 관련 API
// ============================================

/**
 * 담당 멘토 목록 조회
 */
const fetchPlannerMentorsAPI = async (): Promise<IPlannerMentor[]> => {
  const res = await makeApiCall<void, IPlannerMentor[]>(
    "GET",
    "/planner/planners",
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
 * 공지사항 목록 조회
 */
const fetchNoticesAPI = async (): Promise<INotice[]> => {
  const res = await makeApiCall<void, INotice[]>(
    "GET",
    "/planner/notice",
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
 * 성취도 랭킹 조회
 */
const fetchRankAPI = async (periodType: 'D' | 'W' | 'M' = 'W'): Promise<IRankInfo | null> => {
  const res = await makeApiCall<void, IRankInfo>(
    "GET",
    `/planner/rank?str_dwm=${periodType}`,
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
 * 플래너 클래스 목록 조회 (관리자용)
 */
const fetchPlannerClassesAPI = async (dvsn?: string): Promise<IPlannerClass[]> => {
  const url = dvsn ? `/planner/class/list?dvsn=${dvsn}` : '/planner/class/list';
  const res = await makeApiCall<void, IPlannerClass[]>(
    "GET",
    url,
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
 * 클래스 멤버 조회
 */
const fetchClassMembersAPI = async (plannerId: number): Promise<IClassMember[]> => {
  const res = await makeApiCall<void, IClassMember[]>(
    "GET",
    `/planner/class/members?plannerId=${plannerId}`,
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
 * 플래너 클래스 설정
 */
const setPlannerClassAPI = async (request: ISetPlannerClassRequest): Promise<boolean> => {
  const res = await makeApiCall<ISetPlannerClassRequest, { success: boolean }>(
    "POST",
    "/planner/class",
    request,
    undefined,
    'nest'
  );
  return res.success === true;
};

/**
 * 멘토 피드백 저장
 */
const saveFeedbackAPI = async (request: ICreateFeedbackRequest): Promise<boolean> => {
  const res = await makeApiCall<any, { success: boolean }>(
    "POST",
    "/planner/item",
    {
      id: request.itemId,
      mentorRank: request.mentorRank ?? request.rating,
      mentorDesc: request.comment,
    },
    undefined,
    'nest'
  );
  return res.success === true;
};

// ============================================
// Export
// ============================================

export const PLANNER_API = {
  // 루틴
  fetchRoutinesAPI,
  createRoutineAPI,
  updateRoutineAPI,
  deleteRoutineAPI,
  // 장기 계획
  fetchPlansAPI,
  createOrUpdatePlanAPI,
  updatePlanProgressAPI,
  deletePlanAPI,
  // 플래너 아이템
  fetchPlannerItemsAPI,
  createOrUpdatePlannerItemAPI,
  deletePlannerItemAPI,
  updateMissionAchievementAPI,
  // 주간 성취도
  fetchWeeklyProgressAPI,
  // 멘토/클래스
  fetchPlannerMentorsAPI,
  fetchNoticesAPI,
  fetchRankAPI,
  fetchPlannerClassesAPI,
  fetchClassMembersAPI,
  setPlannerClassAPI,
  saveFeedbackAPI,
};


