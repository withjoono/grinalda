import { useQuery } from '@tanstack/react-query';
import { Api } from '../utils';
import { toUrl } from '@/lib/utils';
import { ApiRoutes } from '@/constants/routes';

export const universityKeys = {
  all: ['all-universities'] as const,
};

export interface University {
  id: number;
  name: string;
  address: string;
  homepage: string;
  region: {
    id: number;
    name: string;
  };
  earlyAdmissionCount?: number;
}

// [GET] /universities 모든 대학 조회
export const useAllUniversities = () => {
  return useQuery({
    queryKey: universityKeys.all,
    queryFn: () => {
      return Api.get<University[]>(toUrl(ApiRoutes.DATA.UNIVERSITIES));
    },
  });
};
