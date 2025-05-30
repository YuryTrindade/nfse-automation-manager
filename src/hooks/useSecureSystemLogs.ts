
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SecureLogEntry {
  timestamp: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'security';
  message: string;
  details?: string;
  notes_count?: number;
  http_code?: number;
  user_agent?: string;
  ip_address?: string;
}

export const useAddSecureSystemLog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (logEntry: SecureLogEntry) => {
      // Adicionar informações de segurança automaticamente
      const enhancedLog = {
        ...logEntry,
        user_agent: navigator.userAgent,
        ip_address: 'client', // Será substituído por IP real no backend se necessário
        timestamp: logEntry.timestamp || new Date().toISOString(),
      };

      // Sanitizar dados sensíveis das mensagens de log
      const sanitizedLog = {
        ...enhancedLog,
        message: sanitizeLogMessage(enhancedLog.message),
        details: enhancedLog.details ? sanitizeLogMessage(enhancedLog.details) : undefined,
      };

      const { data, error } = await supabase
        .from('system_logs')
        .insert([sanitizedLog])
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

// Função para sanitizar mensagens de log removendo dados sensíveis
function sanitizeLogMessage(message: string): string {
  if (!message) return message;
  
  // Remover possíveis senhas, tokens e chaves API das mensagens
  return message
    .replace(/password["\s]*[:=]["\s]*[^"\s,}]+/gi, 'password: [REDACTED]')
    .replace(/token["\s]*[:=]["\s]*[^"\s,}]+/gi, 'token: [REDACTED]')
    .replace(/key["\s]*[:=]["\s]*[^"\s,}]+/gi, 'key: [REDACTED]')
    .replace(/secret["\s]*[:=]["\s]*[^"\s,}]+/gi, 'secret: [REDACTED]')
    .replace(/api[_-]?key["\s]*[:=]["\s]*[^"\s,}]+/gi, 'api_key: [REDACTED]')
    .replace(/bearer\s+[a-zA-Z0-9._-]+/gi, 'bearer [REDACTED]')
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\b/g, '[CARD_NUMBER_REDACTED]'); // Números de cartão
}

export const useLogSecurityEvent = () => {
  const addLog = useAddSecureSystemLog();
  
  return (event: string, details?: string) => {
    addLog.mutate({
      timestamp: new Date().toISOString(),
      type: 'security',
      message: `Evento de Segurança: ${event}`,
      details: details,
    });
  };
};
