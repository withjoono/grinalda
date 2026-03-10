import { IAdmissionSubtypeData } from '../types/admission-subtypes';
import { IBaseAPIResponse, ISuccessResponse } from '../types/response-types';
import { nestApiClient } from '../utils/api-client';
import { handleApiError } from '../utils/common-utils';

export const coreAdmissionSubtypeEndpoints = {
  getAllAdmissionSubtypes: async (): Promise<IBaseAPIResponse<IAdmissionSubtypeData[]>> => {
    try {
      const response = await nestApiClient.get<ISuccessResponse<IAdmissionSubtypeData[]>>(
        '/core/admission-subtypes'
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  getAdmissionSubtypeById: async (id: number): Promise<IBaseAPIResponse<IAdmissionSubtypeData>> => {
    try {
      const response = await nestApiClient.get<ISuccessResponse<IAdmissionSubtypeData>>(
        `/core/admission-subtypes/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  createAdmissionSubtype: async (
    subtypeData: IAdmissionSubtypeData
  ): Promise<IBaseAPIResponse<IAdmissionSubtypeData>> => {
    try {
      const response = await nestApiClient.post<ISuccessResponse<IAdmissionSubtypeData>>(
        '/core/admission-subtypes',
        subtypeData
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  updateAdmissionSubtype: async (
    id: number,
    subtypeData: Omit<Partial<IAdmissionSubtypeData>, 'id'>
  ): Promise<IBaseAPIResponse<IAdmissionSubtypeData>> => {
    try {
      const response = await nestApiClient.patch<ISuccessResponse<IAdmissionSubtypeData>>(
        `/core/admission-subtypes/${id}`,
        {
          name: subtypeData.name,
        }
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  deleteAdmissionSubtype: async (id: number): Promise<IBaseAPIResponse<void>> => {
    try {
      const response = await nestApiClient.delete<ISuccessResponse<void>>(
        `/core/admission-subtypes/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
};
