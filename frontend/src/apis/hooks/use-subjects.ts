import { useQuery } from '@tanstack/react-query';
import { Api } from '../utils';
import { toUrl } from '@/lib/utils';
import { ApiRoutes } from '@/constants/routes';

export const subjectKeys = {
  all: ['all-subjects-groups'] as const,
};

export interface SchoolSubject {
  id: number;
  name: string;
  code: string;
  typeCode: number;
  subjectGroupId: number;
}

export interface SchoolSubjectGroup {
  id: number;
  code: string;
  name: string;
  subjects: SchoolSubject[];
}

// [GET] /subjects 모든 과목 그룹 조회
export const useAllSubjects = () => {
  return useQuery({
    queryKey: subjectKeys.all,
    queryFn: () => {
      return Api.get<SchoolSubjectGroup[]>(
        toUrl(ApiRoutes.DATA.SCHOOL_SUBJECTS)
      );
    },
  });
};
