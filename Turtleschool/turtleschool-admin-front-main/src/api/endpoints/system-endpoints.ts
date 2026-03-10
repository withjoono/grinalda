import { IBaseAPIResponse, ISuccessResponse } from '../types/response-types';
import { nestApiClient } from '../utils/api-client';
import { handleApiError } from '../utils/common-utils';

export const systemEndpoints = {
  ping: async (): Promise<IBaseAPIResponse<boolean>> => {
    try {
      const response = await nestApiClient.get<IBaseAPIResponse<boolean>>('/ping');
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
  pingAdmin: async (): Promise<IBaseAPIResponse<boolean>> => {
    try {
      const response = await nestApiClient.get<ISuccessResponse<boolean>>('/ping-admin');
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
};
