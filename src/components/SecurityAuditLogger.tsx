
import { useEffect } from 'react';
import { useLogSecurityEvent } from '@/hooks/useSecureSystemLogs';

const SecurityAuditLogger = () => {
  const logSecurityEvent = useLogSecurityEvent();

  useEffect(() => {
    // Log de acesso à aplicação
    logSecurityEvent('Acesso à aplicação', `User Agent: ${navigator.userAgent}`);

    // Detectar tentativas de acesso ao console do desenvolvedor
    let devtools = {
      open: false,
      orientation: null as string | null
    };

    const threshold = 160;

    const detectDevTools = () => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          logSecurityEvent('Console de desenvolvedor detectado', 'Possível tentativa de inspeção');
        }
      } else {
        devtools.open = false;
      }
    };

    // Detectar tentativas de cópia de dados sensíveis
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection()?.toString();
      if (selection && selection.length > 50) {
        logSecurityEvent('Cópia de dados detectada', `Tamanho: ${selection.length} caracteres`);
      }
    };

    // Detectar tentativas de impressão
    const handlePrint = () => {
      logSecurityEvent('Tentativa de impressão detectada');
    };

    // Detectar mudanças de foco (possível saída da aplicação)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logSecurityEvent('Usuário saiu da aplicação');
      } else {
        logSecurityEvent('Usuário retornou à aplicação');
      }
    };

    // Event listeners
    window.addEventListener('resize', detectDevTools);
    document.addEventListener('copy', handleCopy);
    window.addEventListener('beforeprint', handlePrint);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('resize', detectDevTools);
      document.removeEventListener('copy', handleCopy);
      window.removeEventListener('beforeprint', handlePrint);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [logSecurityEvent]);

  return null; // Componente invisível para auditoria
};

export default SecurityAuditLogger;
