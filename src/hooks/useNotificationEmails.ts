
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NotificationEmail {
  id: string;
  email: string;
  name: string | null;
  is_active: boolean;
  created_at: string;
}

export const useNotificationEmails = () => {
  return useQuery({
    queryKey: ['notification-emails'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_emails')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as NotificationEmail[];
    },
  });
};

export const useAddNotificationEmail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (email: Omit<NotificationEmail, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('notification_emails')
        .insert([email])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-emails'] });
    },
  });
};

export const useUpdateNotificationEmail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NotificationEmail> & { id: string }) => {
      const { data, error } = await supabase
        .from('notification_emails')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-emails'] });
    },
  });
};

export const useDeleteNotificationEmail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notification_emails')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-emails'] });
    },
  });
};
