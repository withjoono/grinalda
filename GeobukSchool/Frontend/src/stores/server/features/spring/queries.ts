import { useQuery } from "@tanstack/react-query";
import {
  IEvaluationStudentInfo,
  IOfficerEvaluationResponse,
  SPRING_API,
} from "./apis";
import { useGetCurrentUser } from "../me/queries";

export const springQueryKeys = {
  all: ["spring"] as const,
  officerApplyList: () =>
    [...springQueryKeys.all, "officer-apply-list"] as const,
  officerCompleteEvaluationList: () =>
    [...springQueryKeys.all, "officer-complete-evaluation-list"] as const,
  officerEvaluationStudentInfo: (studentId: string | undefined | null) =>
    [...springQueryKeys.all, "student-info", studentId] as const,
  officerEvaluationInfo: (studentId: string | undefined | null) =>
    [...springQueryKeys.all, "evaluation-info", studentId] as const,
};

/**
 * 평가자가 평가 목록 조회
 */
export const useGetOfficerApplyList = () => {
  const { data: currentUser } = useGetCurrentUser();
  return useQuery({
    queryKey: springQueryKeys.officerApplyList(),
    queryFn: SPRING_API.fetchOfficerApplyListAPI,
    enabled: !!currentUser,
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
};

/**
 * 평가자가 평가 완료 목록 조회
 */
export const useGetCompleteEvaluationList = () => {
  const { data: currentUser } = useGetCurrentUser();
  return useQuery({
    queryKey: springQueryKeys.officerCompleteEvaluationList(),
    queryFn: SPRING_API.fetchCompleteEvaluationList,
    enabled: !!currentUser,
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
};

/**
 * 평가자가 평가의 유저 정보 조회
 */
export const useGetEvaluationStudnetInfo = (
  studentId: string | undefined | null,
) => {
  const { data: currentUser } = useGetCurrentUser();
  return useQuery<IEvaluationStudentInfo>({
    queryKey: springQueryKeys.officerEvaluationStudentInfo(studentId),
    queryFn: () => SPRING_API.fetchStudentInfo(studentId),
    enabled: !!currentUser && !!studentId,
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
};

/**
 * 평가자가 평가 내역 조회
 */
export const useGetEvaluationInfo = (studentId: string | undefined | null) => {
  const { data: currentUser } = useGetCurrentUser();
  return useQuery<IOfficerEvaluationResponse>({
    queryKey: springQueryKeys.officerEvaluationInfo(studentId),
    queryFn: () => SPRING_API.fetchSurveyScoreList(studentId),
    enabled: !!currentUser && !!studentId,
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
};
