import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { User } from '@/types';

export function useUser() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: () => api.getCurrentUser(),
    retry: false,
    staleTime: Infinity,
  });

  return {
    user: data?.data as User | null,
    isLoading,
    error,
    isAuthenticated: !!data?.data,
  };
}
