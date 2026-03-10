import { IBaseAPIResponse, ISuccessResponse } from '../types/response-types';
import { nestApiClient } from '../utils/api-client';
import { handleApiError } from '../utils/common-utils';
import {
  IMajorFieldData,
  IMidFieldData,
  IMinorFieldData,
  IGeneralFieldData,
} from '../types/fields-types';

export const coreFieldsEndpoints = {
  // Major Fields
  getAllMajorFields: async (): Promise<IBaseAPIResponse<IMajorFieldData[]>> => {
    try {
      const response =
        await nestApiClient.get<ISuccessResponse<IMajorFieldData[]>>('/core/fields/major');
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  getMajorFieldById: async (id: number): Promise<IBaseAPIResponse<IMajorFieldData>> => {
    try {
      const response = await nestApiClient.get<ISuccessResponse<IMajorFieldData>>(
        `/core/fields/major/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  createMajorField: async (data: { name: string }): Promise<IBaseAPIResponse<IMajorFieldData>> => {
    try {
      const response = await nestApiClient.post<ISuccessResponse<IMajorFieldData>>(
        '/core/fields/major',
        data
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  updateMajorField: async (
    id: number,
    data: { name?: string }
  ): Promise<IBaseAPIResponse<IMajorFieldData>> => {
    try {
      const response = await nestApiClient.patch<ISuccessResponse<IMajorFieldData>>(
        `/core/fields/major/${id}`,
        data
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  deleteMajorField: async (id: number): Promise<IBaseAPIResponse<void>> => {
    try {
      const response = await nestApiClient.delete<ISuccessResponse<void>>(
        `/core/fields/major/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  // Mid Fields
  getAllMidFields: async (): Promise<IBaseAPIResponse<IMidFieldData[]>> => {
    try {
      const response =
        await nestApiClient.get<ISuccessResponse<IMidFieldData[]>>('/core/fields/mid');
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  getMidFieldById: async (id: number): Promise<IBaseAPIResponse<IMidFieldData>> => {
    try {
      const response = await nestApiClient.get<ISuccessResponse<IMidFieldData>>(
        `/core/fields/mid/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  createMidField: async (data: {
    name: string;
    majorFieldId: number;
  }): Promise<IBaseAPIResponse<IMidFieldData>> => {
    try {
      const response = await nestApiClient.post<ISuccessResponse<IMidFieldData>>(
        '/core/fields/mid',
        data
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  updateMidField: async (
    id: number,
    data: {
      name?: string;
      majorFieldId?: number;
    }
  ): Promise<IBaseAPIResponse<IMidFieldData>> => {
    try {
      const response = await nestApiClient.patch<ISuccessResponse<IMidFieldData>>(
        `/core/fields/mid/${id}`,
        data
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  deleteMidField: async (id: number): Promise<IBaseAPIResponse<void>> => {
    try {
      const response = await nestApiClient.delete<ISuccessResponse<void>>(`/core/fields/mid/${id}`);
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  // Minor Fields
  getAllMinorFields: async (): Promise<IBaseAPIResponse<IMinorFieldData[]>> => {
    try {
      const response =
        await nestApiClient.get<ISuccessResponse<IMinorFieldData[]>>('/core/fields/minor');
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  getMinorFieldById: async (id: number): Promise<IBaseAPIResponse<IMinorFieldData>> => {
    try {
      const response = await nestApiClient.get<ISuccessResponse<IMinorFieldData>>(
        `/core/fields/minor/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  createMinorField: async (data: {
    name: string;
    midFieldId: number;
  }): Promise<IBaseAPIResponse<IMinorFieldData>> => {
    try {
      const response = await nestApiClient.post<ISuccessResponse<IMinorFieldData>>(
        '/core/fields/minor',
        data
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  updateMinorField: async (
    id: number,
    data: {
      name?: string;
      midFieldId?: number;
    }
  ): Promise<IBaseAPIResponse<IMinorFieldData>> => {
    try {
      const response = await nestApiClient.patch<ISuccessResponse<IMinorFieldData>>(
        `/core/fields/minor/${id}`,
        data
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  deleteMinorField: async (id: number): Promise<IBaseAPIResponse<void>> => {
    try {
      const response = await nestApiClient.delete<ISuccessResponse<void>>(
        `/core/fields/minor/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  // General Fields
  getAllGeneralFields: async (): Promise<IBaseAPIResponse<IGeneralFieldData[]>> => {
    try {
      const response =
        await nestApiClient.get<ISuccessResponse<IGeneralFieldData[]>>('/core/fields/general');
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  getGeneralFieldById: async (id: number): Promise<IBaseAPIResponse<IGeneralFieldData>> => {
    try {
      const response = await nestApiClient.get<ISuccessResponse<IGeneralFieldData>>(
        `/core/fields/general/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  createGeneralField: async (
    data: Omit<IGeneralFieldData, 'id'>
  ): Promise<IBaseAPIResponse<IGeneralFieldData>> => {
    try {
      const response = await nestApiClient.post<ISuccessResponse<IGeneralFieldData>>(
        '/core/fields/general',
        data
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  updateGeneralField: async (
    id: number,
    data: Partial<IGeneralFieldData>
  ): Promise<IBaseAPIResponse<IGeneralFieldData>> => {
    try {
      const response = await nestApiClient.patch<ISuccessResponse<IGeneralFieldData>>(
        `/core/fields/general/${id}`,
        data
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  deleteGeneralField: async (id: number): Promise<IBaseAPIResponse<void>> => {
    try {
      const response = await nestApiClient.delete<ISuccessResponse<void>>(
        `/core/fields/general/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
};
