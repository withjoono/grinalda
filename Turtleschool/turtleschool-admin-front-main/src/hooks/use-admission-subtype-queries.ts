import { coreAdmissionSubtypeEndpoints } from '@/api/endpoints/core-admission-subtype-endpoints';
import { IAdmissionSubtypeData } from '@/api/types/admission-subtypes';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query Keys
const ADMISSION_SUBTYPE_KEYS = {
  all: ['admissionSubtypes'] as const,
  details: (id: number) => [...ADMISSION_SUBTYPE_KEYS.all, id] as const,
};

// Queries
export const useAdmissionSubtypes = () => {
  return useQuery({
    queryKey: ADMISSION_SUBTYPE_KEYS.all,
    queryFn: async () => {
      const result = await coreAdmissionSubtypeEndpoints.getAllAdmissionSubtypes();
      if (result.success) {
        return result.data;
      }
      return [];
    },
  });
};

export const useAdmissionSubtype = (id: number) => {
  return useQuery({
    queryKey: ADMISSION_SUBTYPE_KEYS.details(id),
    queryFn: async () => {
      const result = await coreAdmissionSubtypeEndpoints.getAdmissionSubtypeById(id);
      if (result.success) {
        return result.data;
      }
      return null;
    },
  });
};

// Mutations
export const useCreateAdmissionSubtype = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coreAdmissionSubtypeEndpoints.createAdmissionSubtype,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMISSION_SUBTYPE_KEYS.all });
    },
  });
};

export const useUpdateAdmissionSubtype = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Partial<IAdmissionSubtypeData>, 'id'> }) =>
      coreAdmissionSubtypeEndpoints.updateAdmissionSubtype(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMISSION_SUBTYPE_KEYS.details(variables.id) });
      queryClient.invalidateQueries({ queryKey: ADMISSION_SUBTYPE_KEYS.all });
    },
  });
};

export const useDeleteAdmissionSubtype = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coreAdmissionSubtypeEndpoints.deleteAdmissionSubtype,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMISSION_SUBTYPE_KEYS.all });
    },
  });
};
