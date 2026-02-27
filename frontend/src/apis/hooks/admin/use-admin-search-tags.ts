import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Api } from '../../utils';
import { toUrl } from '@/lib/utils';
import { AdminApiRoutes } from '@/constants/routes';
import { SearchTag, searchTagKeys } from '../use-search-tags';

// [POST] /search-tags 검색 태그 추가
export const useCreateSearchTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Pick<SearchTag, 'name'>) => {
      return Api.post<SearchTag>(
        toUrl(AdminApiRoutes.DATA.SEARCH_TAGS.CREATE),
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchTagKeys.all });
    },
  });
};

// [PATCH] /search-tags/:id 검색 태그 수정
export const useUpdateSearchTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Pick<SearchTag, 'id' | 'name'>) => {
      const { id, ...rest } = data;
      return Api.patch<SearchTag>(
        toUrl(AdminApiRoutes.DATA.SEARCH_TAGS.UPDATE, { id: id.toString() }),
        rest
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchTagKeys.all });
    },
  });
};

// [DELETE] /search-tags/:id 검색 태그 삭제
export const useDeleteSearchTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      Api.delete(
        toUrl(AdminApiRoutes.DATA.SEARCH_TAGS.DELETE, { id: id.toString() })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchTagKeys.all });
    },
  });
};
