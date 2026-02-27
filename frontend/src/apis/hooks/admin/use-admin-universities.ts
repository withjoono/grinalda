import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Api } from '../../utils';
import { toUrl } from '@/lib/utils';
import { AdminApiRoutes } from '@/constants/routes';
import { University, universityKeys } from '../use-universities';

// [POST] /universities 대학 추가
export const useCreateUniversity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<University, 'name' | 'address' | 'homepage'> & {
        regionId: number;
      }
    ) => {
      return Api.post<University>(
        toUrl(AdminApiRoutes.DATA.UNIVERSITIES.CREATE),
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: universityKeys.all });
    },
  });
};

// [PATCH] /universities/:id 대학 수정
export const useUpdateUniversity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<University, 'id' | 'name' | 'address' | 'homepage'> & {
        regionId: number;
      }
    ) => {
      const { id, ...rest } = data;
      return Api.patch<University>(
        toUrl(AdminApiRoutes.DATA.UNIVERSITIES.UPDATE, { id: id.toString() }),
        rest
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: universityKeys.all });
    },
  });
};

// [DELETE] /universities/:id 대학 삭제
export const useDeleteUniversity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      Api.delete(
        toUrl(AdminApiRoutes.DATA.UNIVERSITIES.DELETE, { id: id.toString() })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: universityKeys.all });
    },
  });
};
