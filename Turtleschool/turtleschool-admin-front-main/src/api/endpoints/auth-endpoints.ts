import { IBaseAPIResponse, ISuccessResponse } from '../types/response-types';
import { IAuthTokenData, ILoginRequest } from '../types/auth-types';
import { nestApiClient } from '../utils/api-client';
import { handleApiError } from '../utils/common-utils';

export const authEndpoints = {
  login: async (data: ILoginRequest): Promise<IBaseAPIResponse<IAuthTokenData>> => {
    try {
      const response = await nestApiClient.post<ISuccessResponse<IAuthTokenData>>(
        '/auth/login/email',
        data
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
};
