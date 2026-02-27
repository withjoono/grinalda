import { useQuery } from '@tanstack/react-query';
import { Api } from '../utils';
import { toUrl } from '@/lib/utils';
import { ApiRoutes } from '@/constants/routes';

export const evaluationKeys = {
  teachers: ['teachers'] as const,
};

export interface Teacher {
  id: number;
  name: string;
  profileImage: string;
}

// [GET] /evaluations/teachers 모든 선생님 조회
export const useAllTeachers = () => {
  return useQuery({
    queryKey: evaluationKeys.teachers,
    queryFn: () => {
      return Api.get<Teacher[]>(toUrl(ApiRoutes.EVALUATION.TEACHERS));
    },
  });
};
