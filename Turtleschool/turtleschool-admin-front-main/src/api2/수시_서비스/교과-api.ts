import { CommonSearchQueryDto } from '../types/search-query';
import { SuSiSubject } from '../types/susi-subject';
import { BaseResponse } from '../types/base-response';
import { axiosInstance } from '../axios-instance';

interface AdminSusiSubjectResponse {
  list: SuSiSubject[];
  totalCount: number;
}

export const getAdminSusiSubjectListAPI = async (
  query: CommonSearchQueryDto
): Promise<BaseResponse<AdminSusiSubjectResponse>> => {
  try {
    const res = await axiosInstance.get<BaseResponse<AdminSusiSubjectResponse>>(
      `/admin/susi/subject`,
      {
        params: query,
      }
    );
    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (getAdminSusiSubjectListAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};

interface UploadResponse {
  message: string;
}

export const uploadSusiSubjectFileAPI = async (
  file: File
): Promise<BaseResponse<UploadResponse>> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axiosInstance.post<BaseResponse<UploadResponse>>(
      `/admin/susi/subject/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return res.data;
  } catch (e: any) {
    console.log('Error 발생 (uploadSusiSubjectFileAPI) - ', e);
    return { success: false, error: e.response?.data?.message || 'An error occurred' };
  }
};
