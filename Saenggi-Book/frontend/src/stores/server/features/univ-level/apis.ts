import { hubApiClient } from "../../hub-api-client";

export interface IUnivLevel {
  univName: string;
  univCode: string;
  region: string;
  univLevel: number;
}

export const UNIV_LEVEL_APIS = {
  /**
   * 전체 대학 목록 조회 (Hub Backend)
   * GET /univ-dept/universities
   */
  fetchUniversities: async (): Promise<IUnivLevel[]> => {
    const res = await hubApiClient.get("/univ-dept/universities");
    return res.data?.data || res.data || [];
  },
};
