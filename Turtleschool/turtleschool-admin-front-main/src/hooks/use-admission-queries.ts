import { coreAdmissionEndpoints } from '@/api/endpoints/admission-endpoints';
import { ICreateAdmissionDto, IUpdateAdmissionDto } from '@/api/types/admission';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query Keys
const ADMISSION_KEYS = {
  all: ['admissions'] as const,
  byUniversity: (universityId: number) =>
    [...ADMISSION_KEYS.all, 'university', universityId] as const,
  details: (id: number) => [...ADMISSION_KEYS.all, id] as const,
};

// Queries
export const useAdmissionsByUniversity = (universityId: number) => {
  return useQuery({
    queryKey: ADMISSION_KEYS.byUniversity(universityId),
    queryFn: async () => {
      const result = await coreAdmissionEndpoints.getAllAdmissionsByUniversity(universityId);
      if (result.success) {
        return result.data;
      }
      return [];
    },
  });
};

export const useAdmission = (id: number) => {
  return useQuery({
    queryKey: ADMISSION_KEYS.details(id),
    queryFn: async () => {
      const result = await coreAdmissionEndpoints.getAdmissionById(id);
      if (result.success) {
        return result.data;
      }
      return null;
    },
  });
};

// Mutations
export const useCreateAdmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (admissionData: ICreateAdmissionDto) =>
      coreAdmissionEndpoints.createAdmission(admissionData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ADMISSION_KEYS.byUniversity(variables.university_id),
      });
    },
  });
};

export const useUpdateAdmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdateAdmissionDto }) =>
      coreAdmissionEndpoints.updateAdmission(id, data),
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMISSION_KEYS.details(variables.id) });
      if (result.success && result.data.university.id) {
        queryClient.invalidateQueries({
          queryKey: ADMISSION_KEYS.byUniversity(result.data.university.id),
        });
      }
    },
  });
};

export const useDeleteAdmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coreAdmissionEndpoints.deleteAdmission,
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: ADMISSION_KEYS.all });
    },
  });
};

export const useUploadSubjectFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coreAdmissionEndpoints.uploadSubjectFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMISSION_KEYS.all });
    },
  });
};

export const useUploadComprehensiveFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coreAdmissionEndpoints.uploadComprehensiveFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMISSION_KEYS.all });
    },
  });
};
