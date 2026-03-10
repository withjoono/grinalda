import { axiosInstance } from '../axios-instance';
import { BaseResponse } from '../types/base-response';

export const getAdminRecentSignupsAPI = async (): Promise<BaseResponse<Record<string, number>>> => {
  try {
    const res = await axiosInstance.get<BaseResponse<Record<string, number>>>(
      `/admin/statistic/recent-signups`
    );
    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (getAdminRecentSignupsAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};

export const getAdminDailySalesAPI = async (): Promise<BaseResponse<Record<string, number>>> => {
  try {
    const res = await axiosInstance.get<BaseResponse<Record<string, number>>>(
      `/admin/statistic/daily-sales`
    );
    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (getAdminDailySalesAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};

export interface RecentPaymentType {
  name: string;
  email: string;
  amount: number;
  date: string;
  serviceName: string;
}

export const getAdminRecentPaymentsAPI = async (): Promise<BaseResponse<RecentPaymentType[]>> => {
  try {
    const res = await axiosInstance.get<BaseResponse<RecentPaymentType[]>>(
      `/admin/statistic/recent-payments`
    );
    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (getAdminRecentPaymentsAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};

export const getAdminActiveContractCountAPI = async (): Promise<BaseResponse<number>> => {
  try {
    const res = await axiosInstance.get<BaseResponse<number>>(`/admin/statistic/active-contract`);
    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (getAdminActiveContractCountAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};
