import { IBaseAPIResponse } from '../types/response-types';
import { nestApiClient } from '../utils/api-client';
import { handleApiError } from '../utils/common-utils';
import { IMemberFile } from '../types/member-file';

export const memberFileEndpoints = {
  getMemberFiles: async ({
    page,
    limit,
    searchKey,
  }: {
    page: number;
    limit: number;
    searchKey?: string;
  }) => {
    try {
      const response = await nestApiClient.get<
        IBaseAPIResponse<{ files: IMemberFile[]; total: number; page: number; limit: number }>
      >('/schoolrecord/files', {
        params: {
          page: page,
          limit: limit,
          searchKey,
        },
      });
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  deleteFile: async ({ fileId }: { fileId: string }) => {
    try {
      const response = await nestApiClient.delete<IBaseAPIResponse<void>>(
        `/schoolrecord/${fileId}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
};
