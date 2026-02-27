import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Api } from '../../utils';
import { toUrl } from '@/lib/utils';
import { AdminApiRoutes } from '@/constants/routes';
import {
  SchoolSubject,
  SchoolSubjectGroup,
  subjectKeys,
} from '../use-subjects';

// [POST] /school-subjects/groups 과목 그룹 추가
export const useCreateSubjectGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Pick<SchoolSubjectGroup, 'name' | 'code'>) => {
      return Api.post<SchoolSubjectGroup>(
        toUrl(AdminApiRoutes.DATA.SCHOOL_SUBJECT_GROUPS.CREATE),
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
};

// [PATCH] /school-subjects/groups/:id 과목 그룹 수정
export const useUpdateSubjectGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Pick<SchoolSubjectGroup, 'id' | 'name' | 'code'>) => {
      const { id, ...rest } = data;
      return Api.patch<SchoolSubjectGroup>(
        toUrl(AdminApiRoutes.DATA.SCHOOL_SUBJECT_GROUPS.UPDATE, {
          id: id.toString(),
        }),
        rest
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
};

// [DELETE] /school-subjects/groups/:id 과목 그룹 삭제
export const useDeleteSubjectGroup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      Api.delete(
        toUrl(AdminApiRoutes.DATA.SCHOOL_SUBJECT_GROUPS.DELETE, {
          id: id.toString(),
        })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
};

// [POST] /school-subjects/subjects 과목 추가
export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<SchoolSubject, 'name' | 'code' | 'typeCode' | 'subjectGroupId'>
    ) => {
      return Api.post<SchoolSubject>(
        toUrl(AdminApiRoutes.DATA.SCHOOL_SUBJECTS.CREATE),
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
};

// [PATCH] /school-subjects/subjects/:id 과목 수정
export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (
      data: Pick<
        SchoolSubject,
        'id' | 'name' | 'code' | 'typeCode' | 'subjectGroupId'
      >
    ) => {
      const { id, ...rest } = data;
      return Api.patch<SchoolSubject>(
        toUrl(AdminApiRoutes.DATA.SCHOOL_SUBJECTS.UPDATE, {
          id: id.toString(),
        }),
        rest
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
};

// [DELETE] /school-subjects/subjects/:id 과목 삭제
export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      Api.delete(
        toUrl(AdminApiRoutes.DATA.SCHOOL_SUBJECTS.DELETE, { id: id.toString() })
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.all });
    },
  });
};
