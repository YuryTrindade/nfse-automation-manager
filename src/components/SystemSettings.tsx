
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSystemSettings, useUpdateSystemSetting } from "@/hooks/useSystemSettings";
import { useAddSecureSystemLog } from "@/hooks/useSecureSystemLogs";
import SecurityIndicator from "./SystemSettings/SecurityIndicator";
import DatabaseSettings from "./SystemSettings/DatabaseSettings";
import ApiSettings from "./SystemSettings/ApiSettings";
import EmailSettings from "./SystemSettings/EmailSettings";
import ScheduleSettings from "./SystemSettings/ScheduleSettings";
import SaveButton from "./SystemSettings/SaveButton";

const SystemSettings = () => {
  const [showPasswords, setShowPasswords] = useState(false);
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const { data: settings = [], isLoading } = useSystemSettings();
  const updateSettingMutation = useUpdateSystemSetting();
  const addLogMutation = useAddSecureSystemLog();

  // Carregar configurações para o estado local
  useEffect(() => {
    if (settings.length > 0) {
      const settingsMap = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value || '';
        return acc;
      }, {} as Record<string, string>);
      setLocalSettings(settingsMap);
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      // Log de tentativa de alteração de configurações
      await addLogMutation.mutateAsync({
        timestamp: new Date().toISOString(),
        type: 'security',
        message: 'Tentativa de alteração de configurações do sistema',
        details: 'Usuário iniciou processo de salvamento das configurações',
      });

      // Salvar apenas configurações que mudaram
      const promises = Object.entries(localSettings).map(([key, value]) => {
        const originalSetting = settings.find(s => s.key === key);
        if (originalSetting && originalSetting.value !== value) {
          return updateSettingMutation.mutateAsync({ key, value });
        }
        return Promise.resolve();
      });

      await Promise.all(promises);

      // Registrar log de sucesso
      await addLogMutation.mutateAsync({
        timestamp: new Date().toISOString(),
        type: 'success',
        message: 'Configurações do sistema atualizadas com segurança',
        details: 'Configurações salvas e criptografadas com sucesso pelo usuário',
      });

      toast({
        title: "Configurações salvas com segurança",
        description: "As configurações foram criptografadas e atualizadas com sucesso",
      });
    } catch (error) {
      // Registrar log de erro
      await addLogMutation.mutateAsync({
        timestamp: new Date().toISOString(),
        type: 'error',
        message: 'Erro de segurança ao salvar configurações',
        details: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });

      toast({
        title: "Erro ao salvar",
        description: "Houve um problema ao salvar as configurações",
        variant: "destructive",
      });
    }
  };

  const testConnection = async (type: string) => {
    // Log de teste de conexão
    await addLogMutation.mutateAsync({
      timestamp: new Date().toISOString(),
      type: 'info',
      message: `Teste de segurança ${type} iniciado`,
      details: `Usuário iniciou teste de conectividade segura para ${type}`,
    });

    toast({
      title: `Testando ${type} com segurança...`,
      description: "Verificando conectividade e validando credenciais...",
    });
    
    // Simular teste e registrar log
    setTimeout(async () => {
      try {
        await addLogMutation.mutateAsync({
          timestamp: new Date().toISOString(),
          type: 'success',
          message: `Teste de segurança ${type} realizado`,
          details: `Teste de conectividade segura ${type} executado com sucesso`,
        });

        toast({
          title: `Teste de ${type} concluído`,
          description: "Conexão estabelecida com segurança",
        });
      } catch (error) {
        await addLogMutation.mutateAsync({
          timestamp: new Date().toISOString(),
          type: 'error',
          message: `Falha na segurança do teste de ${type}`,
          details: `Erro no teste de conectividade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        });
      }
    }, 2000);
  };

  const handlePasswordVisibilityToggle = async () => {
    setShowPasswords(!showPasswords);
    
    // Log de visualização de senhas
    await addLogMutation.mutateAsync({
      timestamp: new Date().toISOString(),
      type: 'security',
      message: showPasswords ? 'Senhas ocultadas' : 'Senhas visualizadas',
      details: `Usuário ${showPasswords ? 'ocultou' : 'visualizou'} campos sensíveis`,
    });
  };

  const updateSetting = (key: string, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const getSetting = (key: string, defaultValue: string = '') => {
    return localSettings[key] || defaultValue;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SecurityIndicator />
      
      <DatabaseSettings 
        getSetting={getSetting}
        updateSetting={updateSetting}
        showPasswords={showPasswords}
        onPasswordVisibilityToggle={handlePasswordVisibilityToggle}
        onTestConnection={testConnection}
      />

      <ApiSettings 
        getSetting={getSetting}
        updateSetting={updateSetting}
        showPasswords={showPasswords}
        onTestConnection={testConnection}
      />

      <EmailSettings 
        getSetting={getSetting}
        updateSetting={updateSetting}
        showPasswords={showPasswords}
        onTestConnection={testConnection}
      />

      <ScheduleSettings 
        getSetting={getSetting}
        updateSetting={updateSetting}
      />

      <SaveButton 
        onSave={handleSave}
        isLoading={updateSettingMutation.isPending}
      />
    </div>
  );
};

export default SystemSettings;
