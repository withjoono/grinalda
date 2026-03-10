import { CommonSearchQueryDto } from '../types/search-query';
import { BaseResponse } from '../types/base-response';
import { axiosInstance } from '../axios-instance';
import { SusiComprehensive } from '../types/susi-comprehensive';

interface AdminSusiComprehensiveResponse {
  list: SusiComprehensive[];
  totalCount: number;
}

export const getAdminSusiComprehensiveAPI = async (
  query: CommonSearchQueryDto
): Promise<BaseResponse<AdminSusiComprehensiveResponse>> => {
  try {
    const res = await axiosInstance.get<BaseResponse<AdminSusiComprehensiveResponse>>(
      `/admin/susi/comprehensive`,
      {
        params: query,
      }
    );
    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (getAdminSusiComprehensiveAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};

interface UploadResponse {
  message: string;
}

export const uploadSusiComprehensiveFileAPI = async (
  file: File
): Promise<BaseResponse<UploadResponse>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axiosInstance.post<BaseResponse<UploadResponse>>(
      `/admin/susi/comprehensive/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (uploadSusiComprehensiveFileAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};
