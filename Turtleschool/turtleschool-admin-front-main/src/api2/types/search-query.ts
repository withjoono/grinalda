export interface CommonSearchQueryDto {
  searchKey?: string;
  searchWord?: string;
  searchSort?: Record<string, string>;
  page?: number;
  pageSize?: number;
}

export interface PayOrderSearchQueryDto {
  orderState?: string; // COMPLETE, PENDING, CANCEL
  searchWord?: string; // 유저 이름/이메일 검색어
  page?: number;
  pageSize?: number;
}
