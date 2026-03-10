import { IAdmissionData, ICreateAdmissionDto, IUpdateAdmissionDto } from '../types/admission';
import { IBaseAPIResponse, ISuccessResponse } from '../types/response-types';
import { nestApiClient } from '../utils/api-client';
import { handleApiError } from '../utils/common-utils';

export const coreAdmissionEndpoints = {
  getAllAdmissionsByUniversity: async (
    universityId: number
  ): Promise<IBaseAPIResponse<IAdmissionData[]>> => {
    try {
      const response = await nestApiClient.get<ISuccessResponse<IAdmissionData[]>>(
        `/core/admission?university_id=${universityId}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  getAdmissionById: async (id: number): Promise<IBaseAPIResponse<IAdmissionData>> => {
    try {
      const response = await nestApiClient.get<ISuccessResponse<IAdmissionData>>(
        `/core/admission/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  createAdmission: async (
    admissionData: ICreateAdmissionDto
  ): Promise<IBaseAPIResponse<IAdmissionData>> => {
    try {
      const response = await nestApiClient.post<ISuccessResponse<IAdmissionData>>(
        '/core/admission',
        admissionData
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  updateAdmission: async (
    id: number,
    admissionData: IUpdateAdmissionDto
  ): Promise<IBaseAPIResponse<IAdmissionData>> => {
    try {
      const response = await nestApiClient.patch<ISuccessResponse<IAdmissionData>>(
        `/core/admission/${id}`,
        admissionData
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  deleteAdmission: async (id: number): Promise<IBaseAPIResponse<void>> => {
    try {
      const response = await nestApiClient.delete<ISuccessResponse<void>>(`/core/admission/${id}`);
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  uploadSubjectFile: async (file: File): Promise<IBaseAPIResponse<{ message: string }>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await nestApiClient.post<ISuccessResponse<{ message: string }>>(
        '/core/admission/upload/subject',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  uploadComprehensiveFile: async (file: File): Promise<IBaseAPIResponse<{ message: string }>> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await nestApiClient.post<ISuccessResponse<{ message: string }>>(
        '/core/admission/upload/comprehensive',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
};
