import { useQuery } from '@tanstack/react-query';
import { Api } from '../utils';
import { toUrl } from '@/lib/utils';
import { ApiRoutes } from '@/constants/routes';

export const searchTagKeys = {
  all: ['all-search-tags'] as const,
};

export interface SearchTag {
  id: number;
  name: string;
  earlyAdmissionCount?: number;
}

// [GET] /search-tags 모든 검색 태그 조회
export const useAllSearchTags = () => {
  return useQuery({
    queryKey: searchTagKeys.all,
    queryFn: () => {
      return Api.get<SearchTag[]>(toUrl(ApiRoutes.DATA.SEARCH_TAGS));
    },
  });
};
