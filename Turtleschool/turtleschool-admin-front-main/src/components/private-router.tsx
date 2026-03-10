import { useAdminAccess } from '@/hooks/use-admin-access';
import { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isLoading, isAdmin } = useAdminAccess();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isAdmin) {
    return null; // 이 부분은 실행되지 않음. useEffect에서 리다이렉트 처리됨
  }

  return children;
};

export default PrivateRoute;
