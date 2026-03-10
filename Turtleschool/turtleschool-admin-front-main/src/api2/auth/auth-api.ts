import { BaseResponse } from '../types/base-response';
import { axiosInstance } from '../axios-instance';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenExpiry: number;
}

interface LoginBody {
  email: string;
  password: string;
}

export const emailLoginAPI = async (body: LoginBody): Promise<BaseResponse<LoginResponse>> => {
  try {
    const res = await axiosInstance.post<BaseResponse<LoginResponse>>(`/auth/login/email`, body);
    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (emailLoginAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};
