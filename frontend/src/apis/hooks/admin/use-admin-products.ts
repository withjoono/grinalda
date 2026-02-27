import { useMutation, useQuery } from '@tanstack/react-query';
import { AdminApiRoutes } from '@/constants/routes';
import { useQueryClient } from '@tanstack/react-query';
import { toUrl } from '@/lib/utils';
import { Product, productKeys } from '../use-products';
import { Api } from '@/apis/utils';

export const adminProductKeys = {
  all: ['admin-products'] as const,
};

export interface AdminProduct extends Product {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  active: boolean;
}

// [GET] /products 전체 상품 조회
export const useAllProducts = () => {
  return useQuery({
    queryKey: adminProductKeys.all,
    queryFn: () => {
      return Api.get<AdminProduct[]>(toUrl(AdminApiRoutes.DATA.PRODUCTS.GET));
    },
  });
};

// [POST] /products 상품 추가
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<
        AdminProduct,
        | 'name'
        | 'description'
        | 'subText'
        | 'subTextAccent'
        | 'popular'
        | 'features'
        | 'price'
        | 'term'
        | 'categoryCode'
        | 'serviceCode'
        | 'externalUrl'
        | 'active'
      >
    ) => {
      return Api.post<AdminProduct>(
        toUrl(AdminApiRoutes.DATA.PRODUCTS.CREATE),
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.activeProducts });
    },
  });
};

// [PATCH] /products/:id 상품 수정
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<
        AdminProduct,
        | 'id'
        | 'name'
        | 'description'
        | 'subText'
        | 'subTextAccent'
        | 'popular'
        | 'features'
        | 'price'
        | 'term'
        | 'categoryCode'
        | 'serviceCode'
        | 'externalUrl'
        | 'active'
      >
    ) => {
      const { id, ...rest } = data;
      return Api.patch<AdminProduct>(
        toUrl(AdminApiRoutes.DATA.PRODUCTS.UPDATE, { id: id.toString() }),
        rest
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.activeProducts });
    },
  });
};

// [DELETE] /products/:id 상품 삭제
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      Api.delete(
        toUrl(AdminApiRoutes.DATA.PRODUCTS.DELETE, { id: id.toString() })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminProductKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.activeProducts });
    },
  });
};
