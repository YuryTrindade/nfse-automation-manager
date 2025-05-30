
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SystemSetting {
  id: string;
  key: string;
  value: string | null;
  description: string | null;
  is_sensitive: boolean;
  updated_at: string;
  created_at: string;
}

export const useSystemSettings = () => {
  return useQuery({
    queryKey: ['system-settings'],
    queryFn: async () => {
      // Buscar configurações usando consulta tradicional
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .order('key');
      
      if (error) throw error;
      return data as SystemSetting[];
    },
  });
};

export const useUpdateSystemSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      // Atualização tradicional (o trigger irá criptografar se necessário)
      const { data, error } = await supabase
        .from('system_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
    },
  });
};

export const useGetDecryptedSetting = (key: string) => {
  return useQuery({
    queryKey: ['decrypted-setting', key],
    queryFn: async () => {
      // Busca tradicional
      const { data, error } = await supabase
        .from('system_settings')
        .select('value')
        .eq('key', key)
        .single();
      
      if (error) throw error;
      return data.value;
    },
    enabled: !!key,
  });
};
