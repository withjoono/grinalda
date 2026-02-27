import { useMutation, useQuery } from '@tanstack/react-query';
import { AdminApiRoutes } from '@/constants/routes';
import { useQueryClient } from '@tanstack/react-query';
import { toUrl } from '@/lib/utils';
import { Product } from '../use-products';
import { Api } from '@/apis/utils';

export const adminCouponKeys = {
  all: ['admin-coupons'] as const,
};

export interface Coupon {
  id: number;
  couponNumber: string;
  name: string;
  memo: string;
  discountAmount: number;
  quantity: number;
  isDeleted: boolean;
  product: Product;
}

// [GET] /coupons 전체 쿠폰 조회
export const useAllCoupons = () => {
  return useQuery({
    queryKey: adminCouponKeys.all,
    queryFn: () => {
      return Api.get<Coupon[]>(toUrl(AdminApiRoutes.DATA.COUPONS.GET));
    },
  });
};

// [POST] /coupons 쿠폰 추가
export const useCreateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<
        Coupon,
        'name' | 'memo' | 'discountAmount' | 'quantity' | 'isDeleted'
      > & {
        productId: number;
      }
    ) => {
      return Api.post<Coupon>(toUrl(AdminApiRoutes.DATA.COUPONS.CREATE), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCouponKeys.all });
    },
  });
};

// [PATCH] /coupons/:id 쿠폰 수정
export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<
        Coupon,
        'id' | 'name' | 'memo' | 'discountAmount' | 'quantity' | 'isDeleted'
      > & {
        productId: number;
      }
    ) => {
      const { id, ...rest } = data;
      return Api.patch<Coupon>(
        toUrl(AdminApiRoutes.DATA.COUPONS.UPDATE, { id: id.toString() }),
        rest
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCouponKeys.all });
    },
  });
};
