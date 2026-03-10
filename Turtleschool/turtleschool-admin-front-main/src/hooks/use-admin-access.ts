import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePingAdmin } from './use-system';
import { useAuthStore } from '@/stores/useAuthStore';
import { toast } from 'sonner';

export const useAdminAccess = () => {
  const { data, isLoading, isError, isPending } = usePingAdmin();
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isPending) {
      if (isError || (data && !data.success)) {
        // 어드민이 아니거나 에러 발생 시 홈페이지로 리다이렉트
        clearTokens();
        toast.error('페이지에 접근 할 권한이 없습니다.');
        navigate('/sign-in');
      }
    }
  }, [data, isLoading, isPending, isError, navigate]);

  return { isLoading, isAdmin: data?.success };
};
