import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Api } from '../../utils';
import { toUrl } from '@/lib/utils';
import { AdminApiRoutes } from '@/constants/routes';
import { boardsKeys, Inquiry } from '../use-boards';

export const adminInquiryKeys = {
  allInquiry: ['all-inquiry'] as const,
};

// [GET] /inquiries 전체 문의 조회
export const useAllInquiry = () => {
  return useQuery({
    queryKey: adminInquiryKeys.allInquiry,
    queryFn: () => {
      return Api.get<Inquiry[]>(toUrl(AdminApiRoutes.BOARDS.INQUIRY.ALL));
    },
  });
};

// [PATCH] /inquiries/:id/replies 문의 답변 생성
export const useCreateInquiryReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string; inquiryId: number }) => {
      const { inquiryId, ...rest } = data;
      return Api.post<Inquiry>(
        toUrl(AdminApiRoutes.BOARDS.INQUIRY.CREATE, {
          id: inquiryId.toString(),
        }),
        rest
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminInquiryKeys.allInquiry });
      queryClient.invalidateQueries({ queryKey: boardsKeys.myInquiry });
    },
  });
};

// [DELETE] /inquiries/:id/replies/:replyId 답변 삭제
export const useDeleteInquiryReply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: number; replyId: number }) => {
      const { id, replyId } = data;
      return Api.delete(
        toUrl(AdminApiRoutes.BOARDS.INQUIRY.DELETE, {
          id: id.toString(),
          replyId: replyId.toString(),
        })
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminInquiryKeys.allInquiry });
      queryClient.invalidateQueries({ queryKey: boardsKeys.myInquiry });
    },
  });
};
