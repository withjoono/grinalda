import { useQuery } from '@tanstack/react-query';
import { Api } from '../../utils';
import { toUrl } from '@/lib/utils';
import { AdminApiRoutes } from '@/constants/routes';

const adminStatisticsKeys = {
  recentPayments: ['admin-recent-payments'] as const,
  signups: ['admin-signups'] as const,
  sales: ['admin-sales'] as const,
  pendingInquiries: ['admin-pending-inquiries'] as const,
  activeSubscriptions: ['admin-active-subscriptions'] as const,
};

export interface RecentPayment {
  id: number;
  amount: number;
  status: string;
  paidAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  product: {
    id: number;
    name: string;
  };
}

export interface Signups {
  [key: string]: number;
}

export interface Sales {
  [key: string]: number;
}

// [GET] /admin/statistics/recent-payments 최근 결제 20개 조회
export const useGetRecentPayments = () => {
  return useQuery({
    queryKey: adminStatisticsKeys.recentPayments,
    queryFn: () => {
      return Api.get<RecentPayment[]>(
        toUrl(AdminApiRoutes.STATISTICS.RECENT_PAYMENTS)
      );
    },
  });
};

// [GET] /admin/statistics/signups 가입 통계 조회
export const useGetSignups = () => {
  return useQuery({
    queryKey: adminStatisticsKeys.signups,
    queryFn: () => {
      return Api.get<Signups>(toUrl(AdminApiRoutes.STATISTICS.SIGNUPS));
    },
  });
};

// [GET] /admin/statistics/sales 판매 통계 조회
export const useGetSales = () => {
  return useQuery({
    queryKey: adminStatisticsKeys.sales,
    queryFn: () => {
      return Api.get<Sales>(toUrl(AdminApiRoutes.STATISTICS.SALES));
    },
  });
};

// [GET] /admin/statistics/pending-inquiries 미처리 문의 수 조회
export const useGetPendingInquiries = () => {
  return useQuery({
    queryKey: adminStatisticsKeys.pendingInquiries,
    queryFn: () => {
      return Api.get<number>(
        toUrl(AdminApiRoutes.STATISTICS.PENDING_INQUIRIES)
      );
    },
  });
};

// [GET] /admin/statistics/active-subscriptions 활성 구독 수 조회
export const useGetActiveSubscriptions = () => {
  return useQuery({
    queryKey: adminStatisticsKeys.activeSubscriptions,
    queryFn: () => {
      return Api.get<number>(
        toUrl(AdminApiRoutes.STATISTICS.ACTIVE_SUBSCRIPTIONS)
      );
    },
  });
};
