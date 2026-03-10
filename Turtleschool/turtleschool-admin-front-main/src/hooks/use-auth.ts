import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authEndpoints } from '../api/endpoints/auth-endpoints';
import { IAuthTokenData, ILoginRequest } from '@/api/types/auth-types';
import { IBaseAPIResponse } from '@/api/types/response-types';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useLogin = () => {
  const setTokens = useAuthStore((state) => state.setTokens);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<IBaseAPIResponse<IAuthTokenData>, Error, ILoginRequest>({
    mutationFn: authEndpoints.login,
    onSuccess: async (data) => {
      if (data.success) {
        const { accessToken, refreshToken, tokenExpiry } = data.data;
        setTokens(accessToken, refreshToken, tokenExpiry);
        toast.success('로그인 성공');

        // adminPing 쿼리 무효화
        await queryClient.invalidateQueries({ queryKey: ['pingAdmin'] });

        // 관리자 페이지로 리다이렉트
        navigate('/');
      } else {
        toast.error(`로그인 실패: ${data.error}`);
      }
    },
    onError: (error) => {
      // 이 경우는 네트워크 오류 등 예외적인 상황에서만 발생
      if (import.meta.env.DEV) {
        console.error('Unexpected error:', error);
      }
      toast.error('예기치 않은 오류가 발생했습니다.');
    },
  });
};

export const useLogout = () => {
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    try {
      clearTokens();
      queryClient.clear();
      toast.success('로그아웃 되었습니다.');

      navigate('/sign-in');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Logout error:', error);
      }
      toast.error('로그아웃 중 오류가 발생했습니다.');
    }
  }, [clearTokens, navigate, queryClient]);

  return logout;
};
