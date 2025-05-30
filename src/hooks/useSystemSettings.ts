
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
      // Buscar configurações usando função que descriptografa automaticamente
      const { data, error } = await supabase.rpc('get_all_decrypted_settings');
      
      if (error) {
        console.error('Erro ao buscar configurações:', error);
        // Fallback para busca tradicional se a função não existir
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('system_settings')
          .select('*')
          .order('key');
        
        if (fallbackError) throw fallbackError;
        return fallbackData as SystemSetting[];
      }
      
      return data as SystemSetting[];
    },
  });
};

export const useUpdateSystemSetting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      // Verificar se a configuração é sensível
      const { data: settingInfo } = await supabase
        .from('system_settings')
        .select('is_sensitive')
        .eq('key', key)
        .single();

      let updateData;
      
      if (settingInfo?.is_sensitive) {
        // Para dados sensíveis, usar função de criptografia
        const { data, error } = await supabase.rpc('update_encrypted_setting', {
          setting_key: key,
          setting_value: value
        });
        
        if (error) {
          // Fallback para atualização tradicional (o trigger irá criptografar)
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('system_settings')
            .update({ value, updated_at: new Date().toISOString() })
            .eq('key', key)
            .select()
            .single();
          
          if (fallbackError) throw fallbackError;
          return fallbackData;
        }
        return data;
      } else {
        // Para dados não sensíveis, atualização normal
        const { data, error } = await supabase
          .from('system_settings')
          .update({ value, updated_at: new Date().toISOString() })
          .eq('key', key)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
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
      const { data, error } = await supabase.rpc('get_decrypted_setting', {
        setting_key: key
      });
      
      if (error) {
        console.error('Erro ao buscar configuração descriptografada:', error);
        // Fallback para busca tradicional
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', key)
          .single();
        
        if (fallbackError) throw fallbackError;
        return fallbackData.value;
      }
      
      return data;
    },
    enabled: !!key,
  });
};
