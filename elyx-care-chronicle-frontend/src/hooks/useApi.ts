import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(apiCall: () => Promise<any>, deps: any[] = []) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await apiCall();
        
        if (isMounted) {
          setState({
            data: response.data,
            loading: false,
            error: null
          });
        }
      } catch (error: any) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error.response?.data?.message || error.message || 'An error occurred'
          });
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, deps);

  const refetch = () => {
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await apiCall();
        setState({
          data: response.data,
          loading: false,
          error: null
        });
      } catch (error: any) {
        setState({
          data: null,
          loading: false,
          error: error.response?.data?.message || error.message || 'An error occurred'
        });
      }
    };

    fetchData();
  };

  return { ...state, refetch };
}

// Specific hooks for different endpoints
export const useMembers = () => {
  return useApi(() => apiService.getAllMembersWithFullData());
};

export const useMember = (id: string) => {
  return useApi(() => apiService.getMemberById(id), [id]);
};

export const useHealthMetrics = () => {
  return useApi(() => apiService.getAllHealthMetrics());
};

export const useEpisodes = () => {
  return useApi(() => apiService.getAllEpisodes());
};

export const useConversations = () => {
  return useApi(() => apiService.getAllConversations());
};

export const useConversation = (id: string) => {
  return useApi(() => apiService.getConversationById(id), [id]);
};

export const useTeamMembers = () => {
  return useApi(() => apiService.getAllTeamMembers());
};

export const useAnalytics = () => {
  return useApi(() => apiService.getAnalyticsOverview());
};
