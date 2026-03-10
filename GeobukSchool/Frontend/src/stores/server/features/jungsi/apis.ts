import { makeApiCall } from "@/stores/server/common-utils";
import {
  IRegularAdmission,
  IRegularAdmissionDetail,
  IRegularCombination,
} from "./interfaces";

/**
 * [정시] 전형 조회 API
 */
const fetchRegularAPI = async ({
  year,
  admission_type,
}: {
  year: number;
  admission_type: string;
}): Promise<IRegularAdmission[]> => {
  const res = await makeApiCall<void, { items: IRegularAdmission[] }>(
    "GET",
    `/explore/regular`,
    undefined,
    {
      params: {
        year,
        admission_type,
      },
    },
  );
  if (res.success) {
    return res.data.items;
  }
  return [];
};

/**
 * [관심대학] 정시 전형 조회
 */
const fetchInterestRegularAPI = async (
  memberId: string,
  admissionType: "가" | "나" | "다",
) => {
  const res = await makeApiCall<void, IRegularAdmission[]>(
    "GET",
    `/members/${memberId}/regular-interests`,
    undefined,
    {
      params: {
        admissionType: admissionType,
      },
    },
  );

  if (res.success) {
    return res.data;
  }
  return [];
};

const fetchRegularCombinationsAPI = async (memberId: string) => {
  const res = await makeApiCall<void, IRegularCombination[]>(
    "GET",
    `/members/${memberId}/regular-combinations`,
  );

  if (res.success) {
    return res.data;
  }
  return [];
};

const createRegularCombinationAPI = async (
  memberId: string,
  body: {
    name: string;
    ids: number[];
  },
) => {
  const res = await makeApiCall<
    {
      name: string;
      ids: number[];
    },
    IRegularCombination
  >("POST", `/members/${memberId}/regular-combinations`, body);

  if (res.success) {
    return res.data;
  }
  return null;
};

const updateRegularCombinationAPI = async (
  memberId: string,
  combinationId: number,
  body: {
    name: string;
  },
) => {
  const res = await makeApiCall<
    {
      name: string;
    },
    IRegularCombination
  >(
    "PATCH",
    `/members/${memberId}/regular-combinations/${combinationId}`,
    body,
  );

  if (res.success) {
    return res.data;
  }
  return null;
};

const deleteRegularCombinationAPI = async (
  memberId: string,
  combinationId: number,
) => {
  const res = await makeApiCall<void, void>(
    "DELETE",
    `/members/${memberId}/regular-combinations/${combinationId}`,
  );

  return res.success;
};

const fetchRegularDetailAPI = async ({ id }: { id: number }) => {
  const res = await makeApiCall<void, IRegularAdmissionDetail>(
    "GET",
    `/explore/regular/${id}`,
    undefined,
  );

  if (res.success) {
    return res.data;
  }
  return null;
};

export const JUNGSI_APIS = {
  fetchRegularAPI,
  fetchInterestRegularAPI,
  fetchRegularCombinationsAPI,
  createRegularCombinationAPI,
  updateRegularCombinationAPI,
  deleteRegularCombinationAPI,
  fetchRegularDetailAPI,
};
