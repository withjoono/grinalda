import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Api } from '../../utils';
import { toUrl } from '@/lib/utils';
import { AdminApiRoutes } from '@/constants/routes';
import { FAQ, boardsKeys } from '../use-boards';

// [POST] /faq FAQ 추가
export const useCreateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Pick<FAQ, 'question' | 'answer'>) => {
      return Api.post<FAQ>(toUrl(AdminApiRoutes.BOARDS.FAQ.CREATE), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardsKeys.faq });
    },
  });
};

// [PATCH] /faq/:id FAQ 수정
export const useUpdateFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Pick<FAQ, 'id' | 'question' | 'answer'>) => {
      const { id, ...rest } = data;
      return Api.patch<FAQ>(
        toUrl(AdminApiRoutes.BOARDS.FAQ.UPDATE, { id: id.toString() }),
        rest
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardsKeys.faq });
    },
  });
};

// [DELETE] /faq/:id FAQ 삭제
export const useDeleteFaq = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      Api.delete(
        toUrl(AdminApiRoutes.BOARDS.FAQ.DELETE, { id: id.toString() })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardsKeys.faq });
    },
  });
};
