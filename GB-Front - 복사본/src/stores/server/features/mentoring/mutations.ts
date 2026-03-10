/**
 * 멘토링 기능 Mutations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MENTORING_API } from "./apis";
import { mentoringQueryKeys } from "./queries";
import {
  ILinkAccountRequest,
  ICreateMemoRequest,
  IUpdateMemoRequest,
  IUpdateServicePermissionRequest,
  IAddStudentRequest,
  IAddClassRequest,
  IDeleteClassRequest,
} from "./interfaces";

/**
 * 연계 코드 생성
 */
export const useGenerateLinkCode = () => {
  return useMutation({
    mutationFn: MENTORING_API.generateLinkCodeAPI,
    onSuccess: (data) => {
      if (data) {
        toast.success("연계 코드가 생성되었습니다.");
      }
    },
    onError: () => {
      toast.error("연계 코드 생성에 실패했습니다.");
    },
  });
};

/**
 * 연계 코드 검증
 */
export const useVerifyLinkCode = () => {
  return useMutation({
    mutationFn: (code: string) => MENTORING_API.verifyLinkCodeAPI(code),
    onError: () => {
      toast.error("코드 검증에 실패했습니다.");
    },
  });
};

/**
 * 계정 연동
 */
export const useLinkAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ILinkAccountRequest) => MENTORING_API.linkAccountAPI(request),
    onSuccess: (data) => {
      if (data?.success) {
        toast.success("계정이 연동되었습니다.");
        // 캐시 무효화
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.linkedStudents() });
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.linkedChildren() });
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.linkedMentors() });
      }
    },
    onError: () => {
      toast.error("계정 연동에 실패했습니다.");
    },
  });
};

/**
 * 계정 연동 해제
 */
export const useUnlinkAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkId: number) => MENTORING_API.unlinkAccountAPI(linkId),
    onSuccess: (success) => {
      if (success) {
        toast.success("계정 연동이 해제되었습니다.");
        // 캐시 무효화
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.linkedStudents() });
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.linkedChildren() });
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.linkedMentors() });
      }
    },
    onError: () => {
      toast.error("계정 연동 해제에 실패했습니다.");
    },
  });
};

/**
 * 서비스 권한 설정
 */
export const useUpdateServicePermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: IUpdateServicePermissionRequest) =>
      MENTORING_API.updateServicePermissionAPI(request),
    onSuccess: (success) => {
      if (success) {
        toast.success("서비스 권한이 업데이트되었습니다.");
        // 캐시 무효화
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.linkedStudents() });
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.linkedChildren() });
      }
    },
    onError: () => {
      toast.error("서비스 권한 업데이트에 실패했습니다.");
    },
  });
};

// ============= 메모 Mutations =============

/**
 * 메모 생성
 */
export const useCreateMemo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: ICreateMemoRequest) => MENTORING_API.createMemoAPI(request),
    onSuccess: (data, variables) => {
      if (data) {
        // 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: mentoringQueryKeys.memos(variables.targetStudentId),
        });
      }
    },
    onError: () => {
      toast.error("메모 전송에 실패했습니다.");
    },
  });
};

/**
 * 메모 수정
 */
export const useUpdateMemo = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: IUpdateMemoRequest) => MENTORING_API.updateMemoAPI(request),
    onSuccess: (data) => {
      if (data) {
        toast.success("메모가 수정되었습니다.");
        // 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: mentoringQueryKeys.memos(studentId),
        });
      }
    },
    onError: () => {
      toast.error("메모 수정에 실패했습니다.");
    },
  });
};

/**
 * 메모 삭제
 */
export const useDeleteMemo = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memoId: number) => MENTORING_API.deleteMemoAPI(memoId),
    onSuccess: (success) => {
      if (success) {
        toast.success("메모가 삭제되었습니다.");
        // 캐시 무효화
        queryClient.invalidateQueries({
          queryKey: mentoringQueryKeys.memos(studentId),
        });
      }
    },
    onError: () => {
      toast.error("메모 삭제에 실패했습니다.");
    },
  });
};

/**
 * 메모 읽음 처리
 */
export const useMarkMemoAsRead = (studentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memoId: number) => MENTORING_API.markMemoAsReadAPI(memoId),
    onSuccess: () => {
      // 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: mentoringQueryKeys.memos(studentId),
      });
    },
  });
};

// ============= 학생/반 관리 Mutations =============

/**
 * 학생 추가 (선생님용)
 */
export const useAddStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: IAddStudentRequest) => MENTORING_API.addStudentAPI(request),
    onSuccess: (success) => {
      if (success) {
        toast.success("학생이 추가되었습니다.");
        // 캐시 무효화
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.linkedStudents() });
      }
    },
    onError: () => {
      toast.error("학생 추가에 실패했습니다.");
    },
  });
};

/**
 * 학생 삭제 (선생님용)
 */
export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId: number) => MENTORING_API.deleteStudentAPI(studentId),
    onSuccess: (success) => {
      if (success) {
        toast.success("학생이 삭제되었습니다.");
        // 캐시 무효화
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.linkedStudents() });
      }
    },
    onError: () => {
      toast.error("학생 삭제에 실패했습니다.");
    },
  });
};

/**
 * 반 추가 (선생님용)
 */
export const useAddClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: IAddClassRequest) => MENTORING_API.addClassAPI(request),
    onSuccess: (success) => {
      if (success) {
        toast.success("반이 추가되었습니다.");
        // 캐시 무효화
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.linkedStudents() });
      }
    },
    onError: () => {
      toast.error("반 추가에 실패했습니다.");
    },
  });
};

/**
 * 반 삭제 (선생님용)
 */
export const useDeleteClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: IDeleteClassRequest) => MENTORING_API.deleteClassAPI(request),
    onSuccess: (success) => {
      if (success) {
        toast.success("반이 삭제되었습니다.");
        // 캐시 무효화
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.linkedStudents() });
      }
    },
    onError: () => {
      toast.error("반 삭제에 실패했습니다.");
    },
  });
};

/**
 * 자녀 연동 해제 (학부모용)
 */
export const useDeleteChild = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (childId: number) => MENTORING_API.deleteChildAPI(childId),
    onSuccess: (success) => {
      if (success) {
        toast.success("자녀 연동이 해제되었습니다.");
        // 캐시 무효화
        queryClient.invalidateQueries({ queryKey: mentoringQueryKeys.linkedChildren() });
      }
    },
    onError: () => {
      toast.error("자녀 연동 해제에 실패했습니다.");
    },
  });
};
