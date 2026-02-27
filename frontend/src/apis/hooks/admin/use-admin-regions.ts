import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Api } from '../../utils';
import { toUrl } from '@/lib/utils';
import { AdminApiRoutes } from '@/constants/routes';
import { Region, regionKeys } from '../use-regions';

// [POST] /regions 지역 추가
export const useCreateRegion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Pick<Region, 'name'>) => {
      return Api.post<Region>(toUrl(AdminApiRoutes.DATA.REGIONS.CREATE), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionKeys.all });
    },
  });
};

// [PATCH] /regions/:id 지역 수정
export const useUpdateRegion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Pick<Region, 'id' | 'name'>) => {
      const { id, ...rest } = data;
      return Api.patch<Region>(
        toUrl(AdminApiRoutes.DATA.REGIONS.UPDATE, { id: id.toString() }),
        rest
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionKeys.all });
    },
  });
};

// [DELETE] /regions/:id 지역 삭제
export const useDeleteRegion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      Api.delete(
        toUrl(AdminApiRoutes.DATA.REGIONS.DELETE, { id: id.toString() })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionKeys.all });
    },
  });
};
