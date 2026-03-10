/**
 * 플래너 기능 React Query Hooks
 */

import { useQuery } from "@tanstack/react-query";
import { PLANNER_API } from "./apis";
import { useGetCurrentUser } from "../me/queries";
import { PrimaryType } from "./interfaces";

// ============================================
// Query Keys
// ============================================

export const plannerQueryKeys = {
  all: ["planner"] as const,
  
  // 루틴
  routines: () => [...plannerQueryKeys.all, "routines"] as const,
  
  // 장기 계획
  plans: () => [...plannerQueryKeys.all, "plans"] as const,
  
  // 플래너 아이템
  items: () => [...plannerQueryKeys.all, "items"] as const,
  itemsByDate: (date: string) => [...plannerQueryKeys.items(), date] as const,
  
  // 주간 성취도
  weeklyProgress: (type: PrimaryType) => [...plannerQueryKeys.all, "weeklyProgress", type] as const,
  
  // 멘토/클래스
  mentors: () => [...plannerQueryKeys.all, "mentors"] as const,
  notices: () => [...plannerQueryKeys.all, "notices"] as const,
  rank: (period: string) => [...plannerQueryKeys.all, "rank", period] as const,
  classes: (dvsn?: string) => [...plannerQueryKeys.all, "classes", dvsn] as const,
  classMembers: (plannerId: number) => [...plannerQueryKeys.all, "classMembers", plannerId] as const,
};

// ============================================
// 루틴 Queries
// ============================================

/**
 * 루틴 목록 조회
 */
export const useGetRoutines = () => {
  const { data: currentUser } = useGetCurrentUser();

  return useQuery({
    queryKey: plannerQueryKeys.routines(),
    queryFn: PLANNER_API.fetchRoutinesAPI,
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// ============================================
// 장기 계획 Queries
// ============================================

/**
 * 장기 계획 목록 조회
 */
export const useGetPlans = () => {
  const { data: currentUser } = useGetCurrentUser();

  return useQuery({
    queryKey: plannerQueryKeys.plans(),
    queryFn: PLANNER_API.fetchPlansAPI,
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// 플래너 아이템 Queries
// ============================================

/**
 * 플래너 아이템 목록 조회
 */
export const useGetPlannerItems = () => {
  const { data: currentUser } = useGetCurrentUser();

  return useQuery({
    queryKey: plannerQueryKeys.items(),
    queryFn: PLANNER_API.fetchPlannerItemsAPI,
    enabled: !!currentUser,
    staleTime: 1 * 60 * 1000, // 1분
  });
};

/**
 * 특정 날짜의 플래너 아이템 조회 (클라이언트 필터링)
 */
export const useGetPlannerItemsByDate = (date: Date) => {
  const { data: items, ...rest } = useGetPlannerItems();
  
  const dateString = date.toISOString().split('T')[0];
  
  const filteredItems = items?.filter(item => {
    const itemDate = new Date(item.startDate).toISOString().split('T')[0];
    return itemDate === dateString;
  }) ?? [];

  return {
    data: filteredItems,
    ...rest,
  };
};

// ============================================
// 주간 성취도 Queries
// ============================================

/**
 * 주간 성취도 조회 (학습)
 */
export const useGetWeeklyStudyProgress = () => {
  const { data: currentUser } = useGetCurrentUser();

  return useQuery({
    queryKey: plannerQueryKeys.weeklyProgress('학습'),
    queryFn: () => PLANNER_API.fetchWeeklyProgressAPI('학습'),
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 주간 성취도 조회 (수업)
 */
export const useGetWeeklyClassProgress = () => {
  const { data: currentUser } = useGetCurrentUser();

  return useQuery({
    queryKey: plannerQueryKeys.weeklyProgress('수업'),
    queryFn: () => PLANNER_API.fetchWeeklyProgressAPI('수업'),
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// 멘토/클래스 Queries
// ============================================

/**
 * 담당 멘토 목록 조회
 */
export const useGetPlannerMentors = () => {
  const { data: currentUser } = useGetCurrentUser();

  return useQuery({
    queryKey: plannerQueryKeys.mentors(),
    queryFn: PLANNER_API.fetchPlannerMentorsAPI,
    enabled: !!currentUser,
    staleTime: 10 * 60 * 1000, // 10분
  });
};

/**
 * 공지사항 목록 조회
 */
export const useGetNotices = () => {
  const { data: currentUser } = useGetCurrentUser();

  return useQuery({
    queryKey: plannerQueryKeys.notices(),
    queryFn: PLANNER_API.fetchNoticesAPI,
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 성취도 랭킹 조회
 */
export const useGetRank = (periodType: 'D' | 'W' | 'M' = 'W') => {
  const { data: currentUser } = useGetCurrentUser();

  return useQuery({
    queryKey: plannerQueryKeys.rank(periodType),
    queryFn: () => PLANNER_API.fetchRankAPI(periodType),
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 플래너 클래스 목록 조회 (관리자용)
 */
export const useGetPlannerClasses = (dvsn?: string) => {
  const { data: currentUser } = useGetCurrentUser();

  return useQuery({
    queryKey: plannerQueryKeys.classes(dvsn),
    queryFn: () => PLANNER_API.fetchPlannerClassesAPI(dvsn),
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 클래스 멤버 조회
 */
export const useGetClassMembers = (plannerId: number) => {
  const { data: currentUser } = useGetCurrentUser();

  return useQuery({
    queryKey: plannerQueryKeys.classMembers(plannerId),
    queryFn: () => PLANNER_API.fetchClassMembersAPI(plannerId),
    enabled: !!currentUser && !!plannerId,
    staleTime: 5 * 60 * 1000,
  });
};

// ============================================
// 복합 데이터 Hooks
// ============================================

/**
 * 오늘의 대시보드 데이터
 */
export const useGetTodayDashboard = () => {
  const { data: items, isLoading: isItemsLoading } = useGetPlannerItems();
  const { data: rank, isLoading: isRankLoading } = useGetRank('D');
  const { data: studyProgress, isLoading: isProgressLoading } = useGetWeeklyStudyProgress();

  const today = new Date().toISOString().split('T')[0];
  
  const todayItems = items?.filter(item => {
    const itemDate = new Date(item.startDate).toISOString().split('T')[0];
    return itemDate === today;
  }) ?? [];

  const totalMissions = todayItems.length;
  const completedMissions = todayItems.filter(item => item.progress >= 100).length;
  const avgAchievement = totalMissions > 0
    ? Math.round(todayItems.reduce((sum, item) => sum + (item.progress || 0), 0) / totalMissions)
    : 0;

  return {
    data: {
      todayMissions: todayItems,
      totalMissions,
      completedMissions,
      avgAchievement,
      rank,
      weeklyProgress: studyProgress,
    },
    isLoading: isItemsLoading || isRankLoading || isProgressLoading,
  };
};




