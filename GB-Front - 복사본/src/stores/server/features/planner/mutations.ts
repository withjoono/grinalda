/**
 * 플래너 기능 React Query Mutations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PLANNER_API } from "./apis";
import { plannerQueryKeys } from "./queries";
import {
  ICreateRoutineRequest,
  IUpdateRoutineRequest,
  ICreatePlanRequest,
  IUpdatePlanRequest,
  IUpdatePlanProgressRequest,
  ICreatePlannerItemRequest,
  IUpdatePlannerItemRequest,
  IUpdateMissionAchievementRequest,
  ISetPlannerClassRequest,
  ICreateFeedbackRequest,
} from "./interfaces";
import { toast } from "sonner";

// ============================================
// 루틴 Mutations
// ============================================

/**
 * 루틴 생성
 */
export const useCreateRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ICreateRoutineRequest) => PLANNER_API.createRoutineAPI(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.routines() });
      toast.success("루틴이 생성되었습니다.");
    },
    onError: () => {
      toast.error("루틴 생성에 실패했습니다.");
    },
  });
};

/**
 * 루틴 수정
 */
export const useUpdateRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: IUpdateRoutineRequest) => PLANNER_API.updateRoutineAPI(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.routines() });
      toast.success("루틴이 수정되었습니다.");
    },
    onError: () => {
      toast.error("루틴 수정에 실패했습니다.");
    },
  });
};

/**
 * 루틴 삭제
 */
export const useDeleteRoutine = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (routineId: number) => PLANNER_API.deleteRoutineAPI(routineId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.routines() });
      toast.success("루틴이 삭제되었습니다.");
    },
    onError: () => {
      toast.error("루틴 삭제에 실패했습니다.");
    },
  });
};

// ============================================
// 장기 계획 Mutations
// ============================================

/**
 * 장기 계획 생성
 */
export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ICreatePlanRequest) => PLANNER_API.createOrUpdatePlanAPI(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.plans() });
      toast.success("계획이 생성되었습니다.");
    },
    onError: () => {
      toast.error("계획 생성에 실패했습니다.");
    },
  });
};

/**
 * 장기 계획 수정
 */
export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: IUpdatePlanRequest) => PLANNER_API.createOrUpdatePlanAPI(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.plans() });
      toast.success("계획이 수정되었습니다.");
    },
    onError: () => {
      toast.error("계획 수정에 실패했습니다.");
    },
  });
};

/**
 * 장기 계획 진행률 업데이트
 */
export const useUpdatePlanProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: IUpdatePlanProgressRequest) => PLANNER_API.updatePlanProgressAPI(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.plans() });
    },
    onError: () => {
      toast.error("진행률 업데이트에 실패했습니다.");
    },
  });
};

/**
 * 장기 계획 삭제
 */
export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (planId: number) => PLANNER_API.deletePlanAPI(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.plans() });
      toast.success("계획이 삭제되었습니다.");
    },
    onError: () => {
      toast.error("계획 삭제에 실패했습니다.");
    },
  });
};

// ============================================
// 플래너 아이템 Mutations
// ============================================

/**
 * 플래너 아이템 생성
 */
export const useCreatePlannerItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ICreatePlannerItemRequest) => PLANNER_API.createOrUpdatePlannerItemAPI(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.items() });
      toast.success("일정이 생성되었습니다.");
    },
    onError: () => {
      toast.error("일정 생성에 실패했습니다.");
    },
  });
};

/**
 * 플래너 아이템 수정
 */
export const useUpdatePlannerItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: IUpdatePlannerItemRequest) => PLANNER_API.createOrUpdatePlannerItemAPI(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.items() });
      toast.success("일정이 수정되었습니다.");
    },
    onError: () => {
      toast.error("일정 수정에 실패했습니다.");
    },
  });
};

/**
 * 플래너 아이템 삭제
 */
export const useDeletePlannerItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => PLANNER_API.deletePlannerItemAPI(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.items() });
      toast.success("일정이 삭제되었습니다.");
    },
    onError: () => {
      toast.error("일정 삭제에 실패했습니다.");
    },
  });
};

/**
 * 성취도 업데이트
 */
export const useUpdateAchievement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: IUpdateMissionAchievementRequest) => 
      PLANNER_API.updateMissionAchievementAPI(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.items() });
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all });
      toast.success("성취도가 저장되었습니다.");
    },
    onError: () => {
      toast.error("성취도 저장에 실패했습니다.");
    },
  });
};

// ============================================
// 멘토/클래스 Mutations
// ============================================

/**
 * 플래너 클래스 설정
 */
export const useSetPlannerClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ISetPlannerClassRequest) => PLANNER_API.setPlannerClassAPI(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.classes() });
      toast.success("클래스가 설정되었습니다.");
    },
    onError: () => {
      toast.error("클래스 설정에 실패했습니다.");
    },
  });
};

/**
 * 멘토 피드백 저장
 */
export const useSaveFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ICreateFeedbackRequest) => PLANNER_API.saveFeedbackAPI(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.items() });
      toast.success("피드백이 저장되었습니다.");
    },
    onError: () => {
      toast.error("피드백 저장에 실패했습니다.");
    },
  });
};

// ============================================
// 복합 Mutations
// ============================================

/**
 * 미션 완료 처리 (성취도 100% + 상태 완료)
 */
export const useCompleteMission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: number) => {
      return PLANNER_API.updateMissionAchievementAPI({
        itemId,
        progress: 100,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.items() });
      queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all });
      toast.success("미션을 완료했습니다! 🎉");
    },
    onError: () => {
      toast.error("미션 완료 처리에 실패했습니다.");
    },
  });
};




