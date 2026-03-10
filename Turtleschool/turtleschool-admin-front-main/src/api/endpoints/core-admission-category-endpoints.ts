import { IAdmissionCategoryData } from '../types/admission-category';
import { IBaseAPIResponse, ISuccessResponse } from '../types/response-types';
import { nestApiClient } from '../utils/api-client';
import { handleApiError } from '../utils/common-utils';

export const coreAdmissionCategoryEndpoints = {
  getAllAdmissionCategories: async (): Promise<IBaseAPIResponse<IAdmissionCategoryData[]>> => {
    try {
      const response = await nestApiClient.get<ISuccessResponse<IAdmissionCategoryData[]>>(
        '/core/admission-categories'
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  getAdmissionCategoryById: async (
    id: number
  ): Promise<IBaseAPIResponse<IAdmissionCategoryData>> => {
    try {
      const response = await nestApiClient.get<ISuccessResponse<IAdmissionCategoryData>>(
        `/core/admission-categories/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  createAdmissionCategory: async (
    categoryData: Omit<IAdmissionCategoryData, 'id'>
  ): Promise<IBaseAPIResponse<IAdmissionCategoryData>> => {
    try {
      const response = await nestApiClient.post<ISuccessResponse<IAdmissionCategoryData>>(
        '/core/admission-categories',
        categoryData
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  updateAdmissionCategory: async (
    id: number,
    categoryData: Omit<Partial<IAdmissionCategoryData>, 'id'>
  ): Promise<IBaseAPIResponse<IAdmissionCategoryData>> => {
    try {
      const response = await nestApiClient.patch<ISuccessResponse<IAdmissionCategoryData>>(
        `/core/admission-categories/${id}`,
        categoryData
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  deleteAdmissionCategory: async (id: number): Promise<IBaseAPIResponse<void>> => {
    try {
      const response = await nestApiClient.delete<ISuccessResponse<void>>(
        `/core/admission-categories/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
};
