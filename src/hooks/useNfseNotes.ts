
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NfseNote {
  id: string;
  numero_rps: string;
  serie_rps: string;
  data_emissao: string;
  cnpj_prestador: string;
  razao_social_tomador: string;
  valor_servicos: number;
  cd_servico: string;
  status: 'Pendente' | 'Erro' | 'Processando' | 'Enviado' | 'Cancelado';
  motivo_erro?: string;
  created_at: string;
  updated_at: string;
}

export interface NfseNoteFilters {
  cnpjPrestador?: string;
  status?: string;
  dataInicio?: string;
  dataFim?: string;
  cdServico?: string;
}

export const useNfseNotes = (filters?: NfseNoteFilters) => {
  return useQuery({
    queryKey: ['nfse-notes', filters],
    queryFn: async () => {
      let query = supabase
        .from('nfse_notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.cnpjPrestador) {
        query = query.ilike('cnpj_prestador', `%${filters.cnpjPrestador}%`);
      }

      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      if (filters?.dataInicio) {
        query = query.gte('data_emissao', filters.dataInicio);
      }

      if (filters?.dataFim) {
        query = query.lte('data_emissao', filters.dataFim);
      }

      if (filters?.cdServico) {
        query = query.eq('cd_servico', filters.cdServico);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as NfseNote[];
    },
  });
};

export const useAddNfseNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (note: Omit<NfseNote, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('nfse_notes')
        .insert([note])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nfse-notes'] });
    },
  });
};

export const useUpdateNfseNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<NfseNote> }) => {
      const { data, error } = await supabase
        .from('nfse_notes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nfse-notes'] });
    },
  });
};

export const useDeleteNfseNote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('nfse_notes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nfse-notes'] });
    },
  });
};
