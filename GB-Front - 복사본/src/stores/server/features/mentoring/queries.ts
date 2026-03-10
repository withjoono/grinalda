/**
 * 멘토링 기능 React Query Hooks
 */

import { useQuery } from "@tanstack/react-query";
import { MENTORING_API } from "./apis";
import { useGetCurrentUser } from "../me/queries";

// Query Keys
export const mentoringQueryKeys = {
  all: ["mentoring"] as const,
  linkedStudents: () => [...mentoringQueryKeys.all, "linkedStudents"] as const,
  linkedChildren: () => [...mentoringQueryKeys.all, "linkedChildren"] as const,
  linkedMentors: () => [...mentoringQueryKeys.all, "linkedMentors"] as const,
  memos: (studentId: string) => [...mentoringQueryKeys.all, "memos", studentId] as const,
  relation: (studentId: string) => [...mentoringQueryKeys.all, "relation", studentId] as const,
};

/**
 * 연동된 학생 목록 조회 (선생님용)
 */
export const useGetLinkedStudents = () => {
  const { data: currentUser } = useGetCurrentUser();

  return useQuery({
    queryKey: mentoringQueryKeys.linkedStudents(),
    queryFn: MENTORING_API.fetchLinkedStudentsAPI,
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

/**
 * 연동된 자녀 목록 조회 (학부모용)
 */
export const useGetLinkedChildren = () => {
  const { data: currentUser } = useGetCurrentUser();

  return useQuery({
    queryKey: mentoringQueryKeys.linkedChildren(),
    queryFn: MENTORING_API.fetchLinkedChildrenAPI,
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

/**
 * 연동된 멘토 목록 조회 (학생용)
 */
export const useGetLinkedMentors = () => {
  const { data: currentUser } = useGetCurrentUser();

  return useQuery({
    queryKey: mentoringQueryKeys.linkedMentors(),
    queryFn: MENTORING_API.fetchLinkedMentorsAPI,
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

/**
 * 메모 목록 조회
 */
export const useGetMemos = (studentId: string) => {
  const { data: currentUser } = useGetCurrentUser();

  return useQuery({
    queryKey: mentoringQueryKeys.memos(studentId),
    queryFn: () => MENTORING_API.fetchMemosAPI(studentId),
    enabled: !!currentUser && !!studentId,
    staleTime: 1 * 60 * 1000, // 1분
    refetchInterval: 30 * 1000, // 30초마다 자동 갱신
  });
};

/**
 * 멘토링 관계 조회
 */
export const useGetMentoringRelation = (studentId: string) => {
  const { data: currentUser } = useGetCurrentUser();

  return useQuery({
    queryKey: mentoringQueryKeys.relation(studentId),
    queryFn: () => MENTORING_API.fetchMentoringRelationAPI(studentId),
    enabled: !!currentUser && !!studentId,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

/**
 * 사용자 관계 타입 반환
 */
export const useGetUserRelationType = () => {
  const { data: currentUser } = useGetCurrentUser();

  // memberType 기반으로 관계 타입 반환
  if (!currentUser) return null;

  const memberType = currentUser.memberType;
  switch (memberType) {
    case 'teacher':
      return 'teacher';
    case 'parent':
      return 'parent';
    case 'student':
    default:
      return 'student';
  }
};
