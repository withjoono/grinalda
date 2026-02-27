import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Api } from '../../utils';
import { toUrl } from '@/lib/utils';
import { AdminApiRoutes } from '@/constants/routes';

const adminAccountKeys = {
  all: ['admin-all-accounts'] as const,
  detail: (id: number) => ['admin-account-detail', id] as const,
};

export interface AccountForAdmin {
  id: number;
  user: {
    name: string;
    grade: number;
    profileImage: string | null;
  };
  role: string;
  email: string;
  termsAgreement: {
    marketingConsent: boolean;
    agreedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAccountRequest {
  id: number;
  role: string;
  name: string;
  grade: number;
  profileImage: string;
}

// [GET] /admin/accounts 모든 계정 조회
export const useAllAccounts = () => {
  return useQuery({
    queryKey: adminAccountKeys.all,
    queryFn: () => {
      return Api.get<AccountForAdmin[]>(toUrl(AdminApiRoutes.ACCOUNTS.ALL));
    },
  });
};

// [GET] /admin/accounts/:id 계정 상세 조회
export const useAccountDetail = (id: number) => {
  return useQuery({
    queryKey: adminAccountKeys.detail(id),
    queryFn: () => {
      return Api.get<AccountForAdmin>(
        toUrl(AdminApiRoutes.ACCOUNTS.DETAIL, { id: id.toString() })
      );
    },
  });
};

// [PATCH] /admin/accounts/:id 계정 업데이트
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateAccountRequest) => {
      const { id, ...rest } = data;
      return Api.patch<AccountForAdmin>(
        toUrl(AdminApiRoutes.ACCOUNTS.UPDATE, { id: id.toString() }),
        rest
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: adminAccountKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: adminAccountKeys.detail(data.id),
      });
    },
  });
};
