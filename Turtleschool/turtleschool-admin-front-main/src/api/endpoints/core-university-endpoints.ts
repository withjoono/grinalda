import { IBaseAPIResponse, ISuccessResponse } from '../types/response-types';
import { IUniversityData } from '../types/university-types';
import { nestApiClient } from '../utils/api-client';
import { handleApiError } from '../utils/common-utils';

export const coreUniversityEndpoints = {
  getAllUniversities: async (
    page: number = 1,
    limit: number = 15
  ): Promise<
    IBaseAPIResponse<{
      universities: IUniversityData[];
      total: number;
      page: number;
      limit: number;
    }>
  > => {
    try {
      const response = await nestApiClient.get<
        ISuccessResponse<{
          universities: IUniversityData[];
          total: number;
          page: number;
          limit: number;
        }>
      >('/core/universities', {
        params: { page, limit },
      });
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
  getUniversityById: async (id: number): Promise<IBaseAPIResponse<IUniversityData>> => {
    try {
      const response = await nestApiClient.get<ISuccessResponse<IUniversityData>>(
        `/core/universities/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  createUniversity: async (
    universityData: Omit<IUniversityData, 'id'>
  ): Promise<IBaseAPIResponse<IUniversityData>> => {
    try {
      const response = await nestApiClient.post<ISuccessResponse<IUniversityData>>(
        '/core/universities',
        universityData
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  updateUniversity: async (
    id: number,
    universityData: Partial<IUniversityData>
  ): Promise<IBaseAPIResponse<IUniversityData>> => {
    try {
      const response = await nestApiClient.patch<ISuccessResponse<IUniversityData>>(
        `/core/universities/${id}`,
        universityData
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  deleteUniversity: async (id: number): Promise<IBaseAPIResponse<void>> => {
    try {
      const response = await nestApiClient.delete<ISuccessResponse<void>>(
        `/core/universities/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
};
