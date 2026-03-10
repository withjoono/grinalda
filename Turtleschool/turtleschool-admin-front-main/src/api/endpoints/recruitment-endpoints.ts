import {
  IRecruitmentUnitData,
  ICreateRecruitmentUnitDto,
  IUpdateRecruitmentUnitDto,
} from '../types/recruitment';
import { IBaseAPIResponse, ISuccessResponse } from '../types/response-types';
import { nestApiClient } from '../utils/api-client';
import { handleApiError } from '../utils/common-utils';

export const coreRecruitmentEndpoints = {
  getAllRecruitmentUnitsByAdmission: async (
    admissionId: number
  ): Promise<IBaseAPIResponse<IRecruitmentUnitData[]>> => {
    try {
      const response = await nestApiClient.get<ISuccessResponse<IRecruitmentUnitData[]>>(
        `/core/recruitment?admission_id=${admissionId}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  getRecruitmentUnitById: async (id: number): Promise<IBaseAPIResponse<IRecruitmentUnitData>> => {
    try {
      const response = await nestApiClient.get<ISuccessResponse<IRecruitmentUnitData>>(
        `/core/recruitment/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  createRecruitmentUnit: async (
    recruitmentUnitData: ICreateRecruitmentUnitDto
  ): Promise<IBaseAPIResponse<IRecruitmentUnitData>> => {
    try {
      const response = await nestApiClient.post<ISuccessResponse<IRecruitmentUnitData>>(
        '/core/recruitment',
        recruitmentUnitData
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  updateRecruitmentUnit: async (
    id: number,
    recruitmentUnitData: IUpdateRecruitmentUnitDto
  ): Promise<IBaseAPIResponse<IRecruitmentUnitData>> => {
    try {
      const response = await nestApiClient.patch<ISuccessResponse<IRecruitmentUnitData>>(
        `/core/recruitment/${id}`,
        recruitmentUnitData
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },

  deleteRecruitmentUnit: async (id: number): Promise<IBaseAPIResponse<void>> => {
    try {
      const response = await nestApiClient.delete<ISuccessResponse<void>>(
        `/core/recruitment/${id}`
      );
      return response.data;
    } catch (e) {
      return handleApiError(e);
    }
  },
};
