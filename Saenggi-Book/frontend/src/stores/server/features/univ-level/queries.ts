import { useQuery } from "@tanstack/react-query";
import { UNIV_LEVEL_APIS, IUnivLevel } from "./apis";

export const univLevelQueryKeys = {
  all: ["univLevel"] as const,
  universities: () => [...univLevelQueryKeys.all, "universities"] as const,
};

/**
 * 대학 목록을 Hub Backend에서 가져오는 React Query Hook
 */
export const useGetUniversities = () => {
  return useQuery<IUnivLevel[]>({
    queryKey: univLevelQueryKeys.universities(),
    queryFn: UNIV_LEVEL_APIS.fetchUniversities,
    staleTime: 60 * 60 * 1000, // 1시간 캐시
  });
};
