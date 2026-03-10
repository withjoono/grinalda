import { systemEndpoints } from '@/api/endpoints/system-endpoints';
import { useAuthStore } from '@/stores/useAuthStore';
import { useQuery } from '@tanstack/react-query';

export const usePing = () => {
  return useQuery({
    queryKey: ['ping'],
    queryFn: systemEndpoints.ping,
    retry: false,
  });
};

export const usePingAdmin = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  return useQuery({
    queryKey: ['pingAdmin', accessToken],
    queryFn: systemEndpoints.pingAdmin,
    retry: false,
  });
};
