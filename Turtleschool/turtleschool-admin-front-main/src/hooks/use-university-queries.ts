import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IUniversityData } from '@/api/types/university-types';
import { coreUniversityEndpoints } from '@/api/endpoints/core-university-endpoints';

// 쿼리 키 관리
const UNIVERSITY_QUERY_KEYS = {
  ALL_UNIVERSITIES: ['universities'] as const,
  UNIVERSITY: (id: number) => ['university', id] as const,
};

// 모든 대학 조회
export const useUniversities = (page: number = 1, limit: number = 15) => {
  return useQuery({
    queryKey: [...UNIVERSITY_QUERY_KEYS.ALL_UNIVERSITIES, page, limit],
    queryFn: async () => {
      const result = await coreUniversityEndpoints.getAllUniversities(page, limit);
      if (result.success) {
        return result.data;
      }
      return { universities: [], total: 0, page: page, limit: limit };
    },
  });
};

// 특정 대학 조회
export const useUniversity = (id: number) => {
  return useQuery({
    queryKey: UNIVERSITY_QUERY_KEYS.UNIVERSITY(id),
    queryFn: async () => {
      const result = await coreUniversityEndpoints.getUniversityById(id);
      if (result.success) {
        return result.data;
      }
      return null;
    },
  });
};

// 대학 생성
export const useCreateUniversity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coreUniversityEndpoints.createUniversity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNIVERSITY_QUERY_KEYS.ALL_UNIVERSITIES });
    },
  });
};

// 대학 수정
export const useUpdateUniversity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IUniversityData> }) =>
      coreUniversityEndpoints.updateUniversity(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: UNIVERSITY_QUERY_KEYS.UNIVERSITY(variables.id) });
      queryClient.invalidateQueries({ queryKey: UNIVERSITY_QUERY_KEYS.ALL_UNIVERSITIES });
    },
  });
};

// 대학 삭제
export const useDeleteUniversity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: coreUniversityEndpoints.deleteUniversity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: UNIVERSITY_QUERY_KEYS.ALL_UNIVERSITIES });
    },
  });
};
