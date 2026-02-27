import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toUrl } from '@/lib/utils';
import { ApiRoutes } from '@/constants/routes';
import { Api } from '../utils';

export const meKeys = {
  myProfile: ['my-profile'] as const,
  myTermsAgreement: ['my-terms-agreement'] as const,
};

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
  grade: number;
}

export interface UserTermsAgreement {
  termsOfService: boolean;
  privacyPolicy: boolean;
  marketingConsent: boolean;
}

export interface UpdateProfileRequest {
  name: string;
  grade: number;
}

// [GET] /me 내 정보 조회
export const useMyProfile = () => {
  return useQuery({
    queryKey: meKeys.myProfile,
    queryFn: () => {
      return Api.get<UserProfile>(toUrl(ApiRoutes.USER.ME));
    },
  });
};

// [PATCH] /admin/accounts/:id 계정 업데이트
export const useUpdateMyProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => {
      return Api.patch<UserProfile>(toUrl(ApiRoutes.USER.ME), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: meKeys.myProfile,
      });
    },
  });
};

// [GET] /accounts/terms-agreement 내 약관 동의 조회
export const useMyTermsAgreement = () => {
  return useQuery({
    queryKey: meKeys.myTermsAgreement,
    queryFn: () => {
      return Api.get<UserTermsAgreement>(
        toUrl(ApiRoutes.AUTH.GET_TERMS_AGREEMENT)
      );
    },
  });
};

// [PATCH] /accounts/marketing-consent 마케팅 동의 업데이트
export const useUpdateMarketingConsent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { marketingConsent: boolean }) => {
      return Api.patch<{ message: string }>(
        toUrl(ApiRoutes.AUTH.UPDATE_MARKETING_CONSENT),
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: meKeys.myTermsAgreement,
      });
    },
  });
};

// [PATCH] /accounts/password 비밀번호 업데이트
export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: { newPassword: string }) => {
      return Api.patch<{ message: string }>(
        toUrl(ApiRoutes.AUTH.CHANGE_PASSWORD),
        data
      );
    },
  });
};
