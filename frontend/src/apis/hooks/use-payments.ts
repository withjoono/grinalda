import { ApiRoutes } from '@/constants/routes';
import { toUrl } from '@/lib/utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Api } from '../utils';

export const paymentKeys = {
  history: ['payments-history'] as const,
  activeSubscriptions: ['active-subscriptions'] as const,
};

export enum PaymentStatus {
  PAID = 'paid', // 결제완료
  READY = 'ready', // 준비됨
  FAILED = 'failed', // 결제실패
  CANCELLED = 'cancelled', // 취소됨
  PARTIAL_CANCELLED = 'partialCancelled', // 부분 취소됨
  EXPIRED = 'expired', // 만료됨
}

export interface Payment {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    term: Date;
  };
  coupon?: {
    id: number;
    name: string;
    discountAmount: number;
  };

  // 결제 기본 정보
  amount: number; // amount: 1004
  goodsName: string; // goodsName: "나이스페이-상품"
  status: PaymentStatus;
  payMethod: string; // payMethod: "CARD"
  paidAt: Date; // paidAt: "2021-11-05T17:14:35.000+0900"

  // 카드 결제 정보
  cardCode: string; // card.cardCode: "04"
  cardName: string; // card.cardName: "삼성"
  cardNum: string; // card.cardNum: "12341234****1234"
  cardQuota: number; // card.cardQuota: 0
  cardType: string; // card.cardType: "credit"

  // 취소 정보
  cancelledAt: Date;
  cancelAmount: number;
  cancelledTid: string;

  // 기타 정보
  resultCode: string; // resultCode: "0000"

  createdAt: Date;
}

export interface Subscription {
  id: number;
  productName: string;
  productDescription: string;
  serviceCode: string;
  startDate: Date;
  endDate: Date;
}

// [GET] /payments/history 결제내역 조회
export const useGetPaymentHistory = () => {
  return useQuery({
    queryKey: paymentKeys.history,
    queryFn: () => Api.get<Payment[]>(toUrl(ApiRoutes.PAYMENTS.HISTORY)),
  });
};

// [GET] /payments/subscriptions 구독 내역 조회
export const useGetActiveSubscriptions = () => {
  return useQuery({
    queryKey: paymentKeys.activeSubscriptions,
    queryFn: () =>
      Api.get<Subscription[]>(toUrl(ApiRoutes.PAYMENTS.ACTIVE_SUBSCRIPTIONS)),
  });
};

// [POST] /coupons/check 쿠폰 검증
export const useCheckCoupon = () => {
  return useMutation({
    mutationFn: ({
      data,
    }: {
      data: { couponNumber: string; productId: number };
    }) =>
      Api.post<{
        isValid: boolean;
        coupon: { id: number; name: string; discountAmount: number };
      }>(toUrl(ApiRoutes.PAYMENTS.CHECK_COUPON), data),
  });
};

// [POST] /payments/prepare 결제 준비
export const usePreparePayment = () => {
  return useMutation({
    mutationFn: ({
      data,
    }: {
      data: { productId: number; couponNumber: string };
    }) =>
      Api.post<{
        orderId: string;
        productName: string;
        finalAmount: number;
        originalAmount: number;
        discountAmount: number;
      }>(toUrl(ApiRoutes.PAYMENTS.PREPARE), data),
  });
};

// [POST] /payments/free 무료 결제
export const useFreePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      data,
    }: {
      data: { productId: number; couponNumber: string };
    }) =>
      Api.post<{
        success: boolean;
        payment: {
          id: number;
          orderId: string;
          status: string;
          paidAt: Date;
        };
      }>(toUrl(ApiRoutes.PAYMENTS.FREE_PAYMENT), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.history });
      queryClient.invalidateQueries({
        queryKey: paymentKeys.activeSubscriptions,
      });
    },
  });
};
