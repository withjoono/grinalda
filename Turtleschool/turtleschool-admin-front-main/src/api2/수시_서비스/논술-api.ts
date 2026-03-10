import { EarlydEssay, EssayLowestGrade } from '../types/earlyd-essay';
import { CommonSearchQueryDto } from '../types/search-query';
import { axiosInstance } from '../axios-instance';
import { BaseResponse } from '../types/base-response';

interface AdminEarlydEssayResponse {
  list: (EarlydEssay & EssayLowestGrade)[];
  totalCount: number;
}

export const getAdminEarlydEssayListAPI = async (
  query: CommonSearchQueryDto
): Promise<BaseResponse<AdminEarlydEssayResponse>> => {
  try {
    const res = await axiosInstance.get<BaseResponse<AdminEarlydEssayResponse>>(
      `/admin/earlyd/essay`,
      {
        params: query,
      }
    );
    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (getAdminEarlydEssayListAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};
