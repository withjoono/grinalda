import { axiosInstance } from '../axios-instance';
import { BaseResponse } from '../types/base-response';
import { PayOrderSearchQueryDto } from '../types/search-query';
import { PayOrder } from '../types/pay-order';

interface AdminPayOrdersResponse {
  list: PayOrder[];
  totalCount: number;
}

// 모든 주문 목록 조회
export const getAdminPayOrdersAPI = async (
  query: PayOrderSearchQueryDto
): Promise<BaseResponse<AdminPayOrdersResponse>> => {
  try {
    const res = await axiosInstance.get<BaseResponse<AdminPayOrdersResponse>>(
      `/admin/payments/orders`,
      {
        params: query,
      }
    );
    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (getAdminPayOrdersAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};
