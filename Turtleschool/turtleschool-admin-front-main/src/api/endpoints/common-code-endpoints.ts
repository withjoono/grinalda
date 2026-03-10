import { BaseResponse } from '@/api2/types/base-response';
import { ISubjectCodeData } from '../types/common-code-types';
import { IBaseAPIResponse } from '../types/response-types';
import { nestApiClient } from '../utils/api-client';
import { handleApiError } from '../utils/common-utils';

export const commonCodeEndpoints = {
  getSubjectCodes: async () => {
    try {
      const response =
        await nestApiClient.get<IBaseAPIResponse<ISubjectCodeData[]>>('/common/subject-code');
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  uploadSubjectCodes: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await nestApiClient.post<
        BaseResponse<{
          message: string;
        }>
      >(`/common/subject-code/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data;
    } catch (e: any) {
      console.log('Error 발생 (uploadSubjectCodes API) - ', e);
      return { success: false, error: e.response?.data?.message || 'An error occurred' };
    }
  },
};
