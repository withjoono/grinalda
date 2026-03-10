import { coreRecruitmentEndpoints } from '@/api/endpoints/recruitment-endpoints';
import { ICreateRecruitmentUnitDto, IUpdateRecruitmentUnitDto } from '@/api/types/recruitment';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query Keys
const RECRUITMENT_UNIT_KEYS = {
  all: ['recruitmentUnits'] as const,
  byAdmission: (admissionId: number) =>
    [...RECRUITMENT_UNIT_KEYS.all, 'admission', admissionId] as const,
  details: (id: number) => [...RECRUITMENT_UNIT_KEYS.all, id] as const,
};

// Queries
export const useRecruitmentUnitsByAdmission = (admissionId: number) => {
  return useQuery({
    queryKey: RECRUITMENT_UNIT_KEYS.byAdmission(admissionId),
    queryFn: async () => {
      const result = await coreRecruitmentEndpoints.getAllRecruitmentUnitsByAdmission(admissionId);
      if (result.success) {
        return result.data;
      }
      return [];
    },
  });
};

export const useRecruitmentUnit = (id: number) => {
  return useQuery({
    queryKey: RECRUITMENT_UNIT_KEYS.details(id),
    queryFn: async () => {
      const result = await coreRecruitmentEndpoints.getRecruitmentUnitById(id);
      if (result.success) {
        return result.data;
      }
      return null;
    },
  });
};

// Mutations
export const useCreateRecruitmentUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recruitmentUnitData: ICreateRecruitmentUnitDto) =>
      coreRecruitmentEndpoints.createRecruitmentUnit(recruitmentUnitData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: RECRUITMENT_UNIT_KEYS.byAdmission(variables.admission_id),
      });
    },
  });
};

export const useUpdateRecruitmentUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateRecruitmentUnitDto }) =>
      coreRecruitmentEndpoints.updateRecruitmentUnit(id, data),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: RECRUITMENT_UNIT_KEYS.details(variables.id) });
      if (result.success && result.data.admission.id) {
        queryClient.invalidateQueries({
          queryKey: RECRUITMENT_UNIT_KEYS.byAdmission(result.data.admission.id),
        });
      }
    },
  });
};

export const useDeleteRecruitmentUnit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coreRecruitmentEndpoints.deleteRecruitmentUnit,
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: RECRUITMENT_UNIT_KEYS.all });
    },
  });
};
