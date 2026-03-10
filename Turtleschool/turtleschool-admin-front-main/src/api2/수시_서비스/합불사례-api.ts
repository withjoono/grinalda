import { CommonSearchQueryDto } from '../types/search-query';
import { BaseResponse } from '../types/base-response';
import { axiosInstance } from '../axios-instance';
import { SusiPassRecord } from '../types/susi-pass-record';

interface AdminSusiPassRecordResponse {
  list: SusiPassRecord[];
  totalCount: number;
}

export const getAdminSusiPassRecordAPI = async (
  query: CommonSearchQueryDto
): Promise<BaseResponse<AdminSusiPassRecordResponse>> => {
  try {
    const res = await axiosInstance.get<BaseResponse<AdminSusiPassRecordResponse>>(
      `/admin/susi/pass-record`,
      {
        params: query,
      }
    );
    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (getAdminSusiPassRecordAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};

interface UploadResponse {
  message: string;
}

export const uploadSusiPassRecordFileAPI = async (
  file: File
): Promise<BaseResponse<UploadResponse>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axiosInstance.post<BaseResponse<UploadResponse>>(
      '/admin/susi/pass-record/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (uploadSusiPassRecordFileAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};
