import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Api } from '../../utils';
import { toUrl } from '@/lib/utils';
import { AdminApiRoutes } from '@/constants/routes';
import { Notice, NoticeCategory, boardsKeys } from '../use-boards';

// [POST] /notice 공지사항 추가
export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<Notice, 'title' | 'content'> & { categoryId: number }
    ) => {
      return Api.post<Notice>(toUrl(AdminApiRoutes.BOARDS.NOTICE.CREATE), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardsKeys.notice });
    },
  });
};

// [PATCH] /notice/:id 공지사항 수정
export const useUpdateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<Notice, 'id' | 'title' | 'content'> & { categoryId: number }
    ) => {
      const { id, ...rest } = data;
      return Api.patch<Notice>(
        toUrl(AdminApiRoutes.BOARDS.NOTICE.UPDATE, { id: id.toString() }),
        rest
      );
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: boardsKeys.notice });
      queryClient.invalidateQueries({
        queryKey: boardsKeys.noticeDetail(data.id),
      });
    },
  });
};

// [DELETE] /notice/:id 공지사항 삭제
export const useDeleteNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      Api.delete(
        toUrl(AdminApiRoutes.BOARDS.NOTICE.DELETE, { id: id.toString() })
      ),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: boardsKeys.notice });
      queryClient.invalidateQueries({ queryKey: boardsKeys.noticeDetail(id) });
    },
  });
};

// [POST] /notice-category 공지사항 카테고리 추가
export const useCreateNoticeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<NoticeCategory, 'name' | 'backgroundColor' | 'textColor'>
    ) => {
      return Api.post<NoticeCategory>(
        toUrl(AdminApiRoutes.BOARDS.NOTICE_CATEGORIES.CREATE),
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardsKeys.notice });
      queryClient.invalidateQueries({ queryKey: boardsKeys.noticeCategory });
    },
  });
};

// [PATCH] /notice-category/:id 공지사항 카테고리 수정
export const useUpdateNoticeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<
        NoticeCategory,
        'id' | 'name' | 'backgroundColor' | 'textColor'
      >
    ) => {
      const { id, ...rest } = data;
      return Api.patch<NoticeCategory>(
        toUrl(AdminApiRoutes.BOARDS.NOTICE_CATEGORIES.UPDATE, {
          id: id.toString(),
        }),
        rest
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardsKeys.notice });
      queryClient.invalidateQueries({ queryKey: boardsKeys.noticeCategory });
    },
  });
};

// [DELETE] /notice-category/:id 공지사항 카테고리 삭제
export const useDeleteNoticeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      Api.delete(
        toUrl(AdminApiRoutes.BOARDS.NOTICE_CATEGORIES.DELETE, {
          id: id.toString(),
        })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardsKeys.notice });
      queryClient.invalidateQueries({ queryKey: boardsKeys.noticeCategory });
    },
  });
};
