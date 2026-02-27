import { useQuery } from '@tanstack/react-query';
import { Api } from '../utils';
import { toUrl } from '@/lib/utils';
import { ApiRoutes } from '@/constants/routes';

export const productKeys = {
  activeProducts: ['active-products'] as const,
};

export interface Product {
  id: number;
  name: string; // 상품 이름 (수시예측 서비스)
  description: string; // 상품 설명
  subText: string; // 상품 추가 설명 (2025년 9월 15일까지 사용 가능 or 디자인 계열만 가능 등)
  subTextAccent: boolean; // subText 강조 여부(빨간색)
  popular: boolean; // 인기 상품 여부
  features: string[]; // 상품 특징
  price: number; // 상품가격 (원)
  term: Date; // 계약 만료일 (YYYY-MM-DD 까지 사용가능)
  categoryCode: string; // 상점 카테고리 코드 (S, C) (수시, 컨설팅)
  serviceCode: string; // 상품 타입 (S, C) (수시, 컨설팅)
  externalUrl: string; // 외부 링크 (네이버 예약)
}

// [GET] /products/active 활성 상품 조회
export const useActiveProducts = () => {
  return useQuery({
    queryKey: productKeys.activeProducts,
    queryFn: () => {
      return Api.get<Product[]>(toUrl(ApiRoutes.DATA.PRODUCTS));
    },
  });
};
