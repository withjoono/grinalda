import { useQuery } from '@tanstack/react-query';
import { Api } from '../utils';
import { toUrl } from '@/lib/utils';
import { ApiRoutes } from '@/constants/routes';

export const regionKeys = {
  all: ['all-regions'] as const,
};

export interface Region {
  id: number;
  name: string;
  universityCount?: number;
}

// [GET] /regions 모든 지역 조회
export const useAllRegions = () => {
  return useQuery({
    queryKey: regionKeys.all,
    queryFn: () => {
      return Api.get<Region[]>(toUrl(ApiRoutes.DATA.REGIONS));
    },
  });
};
