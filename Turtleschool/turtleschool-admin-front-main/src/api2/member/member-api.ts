import { axiosInstance } from '../axios-instance';
import { BaseResponse } from '../types/base-response';
import { Member } from '../types/member';
import { CommonSearchQueryDto } from '../types/search-query';

interface AdminSusiSubjectResponse {
  list: Member[];
  totalCount: number;
}

export const getAdminMemberListAPI = async (
  query: CommonSearchQueryDto
): Promise<BaseResponse<AdminSusiSubjectResponse>> => {
  try {
    const res = await axiosInstance.get<BaseResponse<AdminSusiSubjectResponse>>(`/admin/members`, {
      params: query,
    });
    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (getAdminMemberListAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};
