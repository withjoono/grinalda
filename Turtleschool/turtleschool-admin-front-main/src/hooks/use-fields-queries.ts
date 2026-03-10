import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coreFieldsEndpoints } from '@/api/endpoints/core-fields-endpoints';
import { IGeneralFieldData } from '@/api/types/fields-types';

// Query Keys
const FIELD_KEYS = {
  majorFields: ['majorFields'] as const,
  majorField: (id: number) => [...FIELD_KEYS.majorFields, id] as const,
  midFields: ['midFields'] as const,
  midField: (id: number) => [...FIELD_KEYS.midFields, id] as const,
  minorFields: ['minorFields'] as const,
  minorField: (id: number) => [...FIELD_KEYS.minorFields, id] as const,
  generalFields: ['generalFields'] as const,
  generalField: (id: number) => [...FIELD_KEYS.generalFields, id] as const,
};

// Major Field Hooks
export const useMajorFields = () => {
  return useQuery({
    queryKey: FIELD_KEYS.majorFields,
    queryFn: async () => {
      const result = await coreFieldsEndpoints.getAllMajorFields();
      if (result.success) {
        return result.data;
      }
      return [];
    },
  });
};

export const useMajorField = (id: number) => {
  return useQuery({
    queryKey: FIELD_KEYS.majorField(id),
    queryFn: async () => {
      const result = await coreFieldsEndpoints.getMajorFieldById(id);
      if (result.success) {
        return result.data;
      }
      return null;
    },
  });
};

export const useCreateMajorField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string }) => coreFieldsEndpoints.createMajorField(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.majorFields });
    },
  });
};

export const useUpdateMajorField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name?: string } }) =>
      coreFieldsEndpoints.updateMajorField(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.majorField(variables.id) });
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.majorFields });
    },
  });
};

export const useDeleteMajorField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coreFieldsEndpoints.deleteMajorField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.majorFields });
    },
  });
};

// Mid Field Hooks
export const useMidFields = () => {
  return useQuery({
    queryKey: FIELD_KEYS.midFields,
    queryFn: async () => {
      const result = await coreFieldsEndpoints.getAllMidFields();
      if (result.success) {
        return result.data;
      }
      return [];
    },
  });
};

export const useMidField = (id: number) => {
  return useQuery({
    queryKey: FIELD_KEYS.midField(id),
    queryFn: async () => {
      const result = await coreFieldsEndpoints.getMidFieldById(id);
      if (result.success) {
        return result.data;
      }
      return null;
    },
  });
};

export const useCreateMidField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; majorFieldId: number }) =>
      coreFieldsEndpoints.createMidField(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.midFields });
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.majorFields });
    },
  });
};

export const useUpdateMidField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name?: string; majorFieldId?: number } }) =>
      coreFieldsEndpoints.updateMidField(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.midField(variables.id) });
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.midFields });
    },
  });
};

export const useDeleteMidField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coreFieldsEndpoints.deleteMidField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.midFields });
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.majorFields });
    },
  });
};

// Minor Field Hooks
export const useMinorFields = () => {
  return useQuery({
    queryKey: FIELD_KEYS.minorFields,
    queryFn: async () => {
      const result = await coreFieldsEndpoints.getAllMinorFields();
      if (result.success) {
        return result.data;
      }
      return [];
    },
  });
};

export const useMinorField = (id: number) => {
  return useQuery({
    queryKey: FIELD_KEYS.minorField(id),
    queryFn: async () => {
      const result = await coreFieldsEndpoints.getMinorFieldById(id);
      if (result.success) {
        return result.data;
      }
      return null;
    },
  });
};

export const useCreateMinorField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; midFieldId: number }) =>
      coreFieldsEndpoints.createMinorField(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.minorFields });
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.midFields });
    },
  });
};

export const useUpdateMinorField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name?: string; midFieldId?: number } }) =>
      coreFieldsEndpoints.updateMinorField(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.minorField(variables.id) });
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.minorFields });
    },
  });
};

export const useDeleteMinorField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coreFieldsEndpoints.deleteMinorField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.minorFields });
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.midFields });
    },
  });
};

// General Field Hooks
export const useGeneralFields = () => {
  return useQuery({
    queryKey: FIELD_KEYS.generalFields,
    queryFn: async () => {
      const result = await coreFieldsEndpoints.getAllGeneralFields();
      if (result.success) {
        return result.data;
      }
      return [];
    },
  });
};

export const useGeneralField = (id: number) => {
  return useQuery({
    queryKey: FIELD_KEYS.generalField(id),
    queryFn: async () => {
      const result = await coreFieldsEndpoints.getGeneralFieldById(id);
      if (result.success) {
        return result.data;
      }
      return null;
    },
  });
};

export const useCreateGeneralField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<IGeneralFieldData, 'id'>) =>
      coreFieldsEndpoints.createGeneralField(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.generalFields });
    },
  });
};

export const useUpdateGeneralField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IGeneralFieldData> }) =>
      coreFieldsEndpoints.updateGeneralField(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.generalField(variables.id) });
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.generalFields });
    },
  });
};

export const useDeleteGeneralField = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: coreFieldsEndpoints.deleteGeneralField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FIELD_KEYS.generalFields });
    },
  });
};
