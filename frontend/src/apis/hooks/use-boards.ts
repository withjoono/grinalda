import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Api } from '../utils';
import { toUrl } from '@/lib/utils';
import { ApiRoutes } from '@/constants/routes';
import { adminInquiryKeys } from './admin/use-admin-inquiry';

export const boardsKeys = {
  faq: ['all-faq'] as const,
  notice: ['all-notice'] as const,
  noticeDetail: (id: number) => ['notice-detail', id] as const,
  noticeCategory: ['all-notice-category'] as const,
  myInquiry: ['my-inquiry'] as const,
};

export interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export interface Notice {
  id: number;
  title: string;
  content: string;
  category: NoticeCategory;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeCategory {
  id: number;
  name: string;
  backgroundColor: string;
  textColor: string;
}

export interface Inquiry {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
    email?: string | null;
  };
  replies: {
    id: number;
    content: string;
    createdAt: string;
  }[];
}

// [GET] /faq FAQ 조회
export const useAllFaq = () => {
  return useQuery({
    queryKey: boardsKeys.faq,
    queryFn: () => {
      return Api.get<FAQ[]>(toUrl(ApiRoutes.BOARDS.FAQ));
    },
  });
};

// [GET] /notice 공지사항 조회
export const useAllNotice = () => {
  return useQuery({
    queryKey: boardsKeys.notice,
    queryFn: () => {
      return Api.get<Notice[]>(toUrl(ApiRoutes.BOARDS.NOTICE));
    },
  });
};

// [GET] /notice-category 공지사항 카테고리 조회
export const useAllNoticeCategory = () => {
  return useQuery({
    queryKey: boardsKeys.noticeCategory,
    queryFn: () => {
      return Api.get<NoticeCategory[]>(toUrl(ApiRoutes.BOARDS.NOTICE_CATEGORY));
    },
  });
};

// [GET] /notice/:id 공지사항 상세 조회
export const useNoticeDetail = (id: number) => {
  return useQuery({
    queryKey: boardsKeys.noticeDetail(id),
    queryFn: () => {
      return Api.get<Notice>(
        toUrl(ApiRoutes.BOARDS.NOTICE_DETAIL, { id: id.toString() })
      );
    },
  });
};

// [POST] /inquiry 문의 등록
export const useCreateMyInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; content: string }) =>
      Api.post(toUrl(ApiRoutes.BOARDS.CREATE_INQUIRY), data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: boardsKeys.myInquiry,
      });
      queryClient.invalidateQueries({
        queryKey: adminInquiryKeys.allInquiry,
      });
    },
  });
};

// [DELETE] /inquiry/:id 문의 삭제
export const useDeleteMyInquiry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: number }) =>
      Api.delete(
        toUrl(ApiRoutes.BOARDS.DELETE_INQUIRY, { id: data.id.toString() })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: boardsKeys.myInquiry,
      });
      queryClient.invalidateQueries({
        queryKey: adminInquiryKeys.allInquiry,
      });
    },
  });
};

// [GET] /inquiries/my 내 문의 조회
export const useMyInquiry = () => {
  return useQuery({
    queryKey: boardsKeys.myInquiry,
    queryFn: () => {
      return Api.get<Inquiry[]>(toUrl(ApiRoutes.BOARDS.MY_INQUIRY));
    },
  });
};
