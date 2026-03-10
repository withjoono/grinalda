import { useQuery } from "@tanstack/react-query";
import { useGetCurrentUser } from "../me/queries";
import { JUNGSI_APIS } from "./apis";
import { IRegularAdmission, IRegularAdmissionDetail } from "./interfaces";

export const jungsiQueryKeys = {
  all: ["jungsi"] as const,
  admissions: (params: {
    year: number;
    admission_type: string; // 가,나,다 군
  }) => [...jungsiQueryKeys.all, params] as const,
  detail: (params: { admissionId: number }) =>
    [...jungsiQueryKeys.all, "detail", params] as const,
  interests: (params: {
    admission_type: string; // 가,나,다 군
  }) => [...jungsiQueryKeys.all, params] as const,

  combination: () => [...jungsiQueryKeys.all, "combination"] as const,
  combinationDetail: (id: number) =>
    [...jungsiQueryKeys.all, "combinationDetail", id] as const,
};

/**
 * [정시] 전형 조회
 */
export const useGetRegularAdmissions = (params: {
  year: number;
  admission_type: string; // 가,나,다 군
}) => {
  const { data: currentUser } = useGetCurrentUser();
  return useQuery<IRegularAdmission[]>({
    queryKey: jungsiQueryKeys.admissions(params),
    queryFn: () =>
      JUNGSI_APIS.fetchRegularAPI({
        ...params,
      }),
    enabled: !!currentUser,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * [정시] 전형 상세 조회
 */
export const useGetRegularAdmissionDetail = (params: {
  admissionId: number;
}) => {
  const { data: currentUser } = useGetCurrentUser();
  return useQuery<IRegularAdmissionDetail | null>({
    queryKey: jungsiQueryKeys.detail(params),
    queryFn: () =>
      JUNGSI_APIS.fetchRegularDetailAPI({ id: params.admissionId }),
    enabled: !!currentUser,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * [관심대학] 조회
 */
export const useGetInterestRegularAdmissions = (
  admissionType: "가" | "나" | "다",
) => {
  const { data: currentUser } = useGetCurrentUser();
  return useQuery({
    queryKey: jungsiQueryKeys.interests({ admission_type: admissionType }),
    queryFn: () =>
      JUNGSI_APIS.fetchInterestRegularAPI(currentUser?.id || "", admissionType),
    enabled: !!currentUser,
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
};

export const useGetRegularCombinations = () => {
  const { data: currentUser } = useGetCurrentUser();
  return useQuery({
    queryKey: jungsiQueryKeys.combination(),
    queryFn: () =>
      JUNGSI_APIS.fetchRegularCombinationsAPI(currentUser?.id || ""),
    enabled: !!currentUser,
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
};

export const useGetRegularCombination = (combinationId: number) => {
  const { data: currentUser } = useGetCurrentUser();
  return useQuery({
    queryKey: jungsiQueryKeys.combinationDetail(combinationId),
    queryFn: () =>
      JUNGSI_APIS.fetchRegularCombinationsAPI(currentUser?.id || "").then(
        (combinations) => combinations.find((c) => c.id === combinationId),
      ),
    enabled: !!currentUser && !!combinationId,
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
};
