
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: string;
  notes_count?: number;
  http_code?: number;
  created_at: string;
}

export const useSystemLogs = () => {
  return useQuery({
    queryKey: ['system-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_logs')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data as SystemLog[];
    },
  });
};

export const useAddSystemLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (log: Omit<SystemLog, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('system_logs')
        .insert([log])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-logs'] });
    },
  });
};
