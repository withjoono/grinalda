import { coreAdmissionCategoryEndpoints } from '@/api/endpoints/core-admission-category-endpoints';
import { IAdmissionCategoryData } from '@/api/types/admission-category';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const ADMISSION_CATEGORY_KEYS = {
  all: ['admissionCategories'] as const,
  details: (id: number) => [...ADMISSION_CATEGORY_KEYS.all, id] as const,
};

export const useAdmissionCategories = () => {
  return useQuery({
    queryKey: ADMISSION_CATEGORY_KEYS.all,
    queryFn: async () => {
      const result = await coreAdmissionCategoryEndpoints.getAllAdmissionCategories();
      if (result.success) {
        return result.data;
      }
      return [];
    },
  });
};

export const useAdmissionCategory = (id: number) => {
  return useQuery({
    queryKey: ADMISSION_CATEGORY_KEYS.details(id),
    queryFn: async () => {
      const result = await coreAdmissionCategoryEndpoints.getAdmissionCategoryById(id);
      if (result.success) {
        return result.data;
      }
      return null;
    },
  });
};

export const useCreateAdmissionCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coreAdmissionCategoryEndpoints.createAdmissionCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMISSION_CATEGORY_KEYS.all });
    },
  });
};

export const useUpdateAdmissionCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Omit<Partial<IAdmissionCategoryData>, 'id'> }) =>
      coreAdmissionCategoryEndpoints.updateAdmissionCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ADMISSION_CATEGORY_KEYS.details(variables.id) });
      queryClient.invalidateQueries({ queryKey: ADMISSION_CATEGORY_KEYS.all });
    },
  });
};

export const useDeleteAdmissionCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coreAdmissionCategoryEndpoints.deleteAdmissionCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMISSION_CATEGORY_KEYS.all });
    },
  });
};
