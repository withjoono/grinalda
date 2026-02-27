import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Api } from '../../utils';
import { toUrl } from '@/lib/utils';
import { AdminApiRoutes } from '@/constants/routes';
import { AdmissionType, admissionTypeKeys } from '../use-admission-types';

// [POST] /admission-types 입학 유형 추가
export const useCreateAdmissionType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Pick<AdmissionType, 'name'>) => {
      return Api.post<AdmissionType>(
        toUrl(AdminApiRoutes.DATA.ADMISSION_TYPES.CREATE),
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: admissionTypeKeys.all });
    },
  });
};

// [PATCH] /admission-types/:id 입학 유형 수정
export const useUpdateAdmissionType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Pick<AdmissionType, 'id' | 'name'>) => {
      const { id, ...rest } = data;
      return Api.patch<AdmissionType>(
        toUrl(AdminApiRoutes.DATA.ADMISSION_TYPES.UPDATE, {
          id: id.toString(),
        }),
        rest
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: admissionTypeKeys.all });
    },
  });
};

// [DELETE] /admission-types/:id 입학 유형 삭제
export const useDeleteAdmissionType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      Api.delete(
        toUrl(AdminApiRoutes.DATA.ADMISSION_TYPES.DELETE, { id: id.toString() })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: admissionTypeKeys.all });
    },
  });
};
