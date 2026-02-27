import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Api } from '../utils';
import { toUrl } from '@/lib/utils';
import { ApiRoutes } from '@/constants/routes';

export const bookmarkKeys = {
  all: ['my-bookmarks'] as const,
  preApplyIds: ['my-pre-apply-ids'] as const,
  preApplyScores: (earlyAdmissionId: number) =>
    ['pre-apply-scores', earlyAdmissionId] as const,
};

export interface Bookmark {
  id: number;
  earlyAdmission: {
    id: number;
    year: number;
    departmentName: string;
    admissionName: string;
    quota: string;
    competitionRate: string;
    studentRecordRatio: string;
    convertCut: string;
    gradeCut: string;
    university: {
      id: number;
      name: string;
      region: {
        name: string;
      };
    };
    admissionType: {
      name: string;
    };
    preApplies: { score: number }[];
  };
}

// [GET] /bookmarks 내 즐겨찾기 조회
export const useMyBookmarks = () => {
  return useQuery({
    queryKey: bookmarkKeys.all,
    queryFn: () => {
      return Api.get<Bookmark[]>(toUrl(ApiRoutes.USER.BOOKMARKS));
    },
  });
};

// [POST] /bookmarks 즐겨찾기 추가
export const useAddBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ealyAdmissionId: number) =>
      Api.post(
        toUrl(ApiRoutes.USER.ADD_BOOKMARK, {
          earlyAdmissionId: ealyAdmissionId.toString(),
        })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.preApplyIds });
    },
  });
};

// [DELETE] /bookmarks 즐겨찾기 삭제
export const useDeleteBookmark = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ealyAdmissionId: number) =>
      Api.delete(
        toUrl(ApiRoutes.USER.DELETE_BOOKMARK, {
          earlyAdmissionId: ealyAdmissionId.toString(),
        })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.preApplyIds });
    },
  });
};

// [GET] /pre-apply-ids 모의지원 아이디 조회
export const useMyPreApplyIds = () => {
  return useQuery({
    queryKey: bookmarkKeys.preApplyIds,
    queryFn: () => {
      return Api.get<{ ids: number[] }>(toUrl(ApiRoutes.USER.PRE_APPLY_IDS));
    },
  });
};

// [POST] /pre-applies/:earlyAdmissionId 모의지원 추가
export const useAddPreApply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { earlyAdmissionId: number; score: number }) =>
      Api.post(
        toUrl(ApiRoutes.USER.ADD_PRE_APPLY, {
          earlyAdmissionId: data.earlyAdmissionId.toString(),
        }),
        {
          score: data.score,
        }
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.preApplyIds });
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.preApplyScores(variables.earlyAdmissionId),
      });
    },
  });
};

// [DELETE] /pre-applies/:earlyAdmissionId 모의지원 삭제
export const useDeletePreApply = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (earlyAdmissionId: number) =>
      Api.delete(
        toUrl(ApiRoutes.USER.DELETE_PRE_APPLY, {
          earlyAdmissionId: earlyAdmissionId.toString(),
        })
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.preApplyIds });
      queryClient.invalidateQueries({
        queryKey: bookmarkKeys.preApplyScores(variables),
      });
    },
  });
};

// [GET] /pre-applies/:earlyAdmissionId 해당 전형 모의지원 조회
export const useGetPreApplyScores = (earlyAdmissionId: number) => {
  return useQuery({
    queryKey: bookmarkKeys.preApplyScores(earlyAdmissionId),
    queryFn: () => {
      return Api.get<{ scores: number[] }>(
        toUrl(ApiRoutes.USER.PRE_APPLY, {
          earlyAdmissionId: earlyAdmissionId.toString(),
        })
      );
    },
  });
};
