import { BaseResponse } from './types/base-response';
import { axiosInstance } from './axios-instance';

// 네트워크 체크
export const pingAPI = async (): Promise<BaseResponse<boolean>> => {
  try {
    const res = await axiosInstance.get<BaseResponse<boolean>>(`/ping`);
    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (pingAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};

// 어드민인지 체크
export const pingAdminAPI = async (): Promise<BaseResponse<boolean>> => {
  try {
    const res = await axiosInstance.get<BaseResponse<boolean>>(`/ping-admin`);
    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (pingAdminAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};
