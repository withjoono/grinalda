import { useQuery } from '@tanstack/react-query';
import { Api } from '../utils';
import { toUrl } from '@/lib/utils';
import { ApiRoutes } from '@/constants/routes';

export const admissionTypeKeys = {
  all: ['all-admission-types'] as const,
};

export interface AdmissionType {
  id: number;
  name: string;
  earlyAdmissionCount?: number;
}

// [GET] /admission-types 모든 입학 유형 조회
export const useAllAdmissionTypes = () => {
  return useQuery({
    queryKey: admissionTypeKeys.all,
    queryFn: () => {
      return Api.get<AdmissionType[]>(toUrl(ApiRoutes.DATA.ADMISSION_TYPES));
    },
  });
};
