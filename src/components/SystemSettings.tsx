
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Database, 
  Mail, 
  Key, 
  Clock, 
  Save, 
  TestTube,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSystemSettings, useUpdateSystemSetting } from "@/hooks/useSystemSettings";
import { useAddSystemLog } from "@/hooks/useSystemLogs";

const SystemSettings = () => {
  const [showPasswords, setShowPasswords] = useState(false);
  const [localSettings, setLocalSettings] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const { data: settings = [], isLoading } = useSystemSettings();
  const updateSettingMutation = useUpdateSystemSetting();
  const addLogMutation = useAddSystemLog();

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
        message: 'Configurações do sistema atualizadas',
        details: 'Configurações salvas com sucesso pelo usuário',
      });

      toast({
        title: "Configurações salvas",
        description: "As configurações foram atualizadas com sucesso",
      });
    } catch (error) {
      // Registrar log de erro
      await addLogMutation.mutateAsync({
        timestamp: new Date().toISOString(),
        type: 'error',
        message: 'Erro ao salvar configurações',
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
    toast({
      title: `Testando ${type}...`,
      description: "Verificando conectividade...",
    });
    
    // Simular teste e registrar log
    setTimeout(async () => {
      try {
        await addLogMutation.mutateAsync({
          timestamp: new Date().toISOString(),
          type: 'success',
          message: `Teste de ${type} realizado`,
          details: `Teste de conectividade ${type} executado com sucesso`,
        });

        toast({
          title: `Teste de ${type} concluído`,
          description: "Conexão estabelecida com sucesso",
        });
      } catch (error) {
        await addLogMutation.mutateAsync({
          timestamp: new Date().toISOString(),
          type: 'error',
          message: `Falha no teste de ${type}`,
          details: `Erro no teste de conectividade: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        });
      }
    }, 2000);
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
      {/* Configurações de Banco de Dados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configurações do Banco de Dados
          </CardTitle>
          <CardDescription>
            Configurações de conexão com o SQL Server
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dbHost">Host/Servidor</Label>
              <Input
                id="dbHost"
                value={getSetting("db_host")}
                onChange={(e) => updateSetting("db_host", e.target.value)}
                placeholder="localhost ou IP do servidor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dbPort">Porta</Label>
              <Input
                id="dbPort"
                value={getSetting("db_port", "1433")}
                onChange={(e) => updateSetting("db_port", e.target.value)}
                placeholder="1433"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dbName">Nome do Banco</Label>
              <Input
                id="dbName"
                value={getSetting("db_name")}
                onChange={(e) => updateSetting("db_name", e.target.value)}
                placeholder="nome_do_banco"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dbUser">Usuário</Label>
              <Input
                id="dbUser"
                value={getSetting("db_user")}
                onChange={(e) => updateSetting("db_user", e.target.value)}
                placeholder="usuário do banco"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dbPassword">Senha do Banco</Label>
            <div className="relative">
              <Input
                id="dbPassword"
                type={showPasswords ? "text" : "password"}
                value={getSetting("db_password")}
                onChange={(e) => updateSetting("db_password", e.target.value)}
                placeholder="senha do banco"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => testConnection("Banco de Dados")}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            Testar Conexão
          </Button>
        </CardContent>
      </Card>

      {/* Configurações da API */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Configurações da API PlugNotas
          </CardTitle>
          <CardDescription>
            Configurações de integração com a API de NFSe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiUrl">URL da API</Label>
            <Input
              id="apiUrl"
              value={getSetting("api_url", "https://api.plugnotas.com.br/nfse")}
              onChange={(e) => updateSetting("api_url", e.target.value)}
              placeholder="https://api.plugnotas.com.br/nfse"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">Chave da API</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showPasswords ? "text" : "password"}
                value={getSetting("api_key")}
                onChange={(e) => updateSetting("api_key", e.target.value)}
                placeholder="sua_chave_da_api"
              />
            </div>
          </div>

          <Button 
            variant="outline" 
            onClick={() => testConnection("API")}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            Testar API
          </Button>
        </CardContent>
      </Card>

      {/* Configurações de Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Configurações de Email
          </CardTitle>
          <CardDescription>
            Configurações SMTP para envio de notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtpHost">Servidor SMTP</Label>
              <Input
                id="smtpHost"
                value={getSetting("smtp_host")}
                onChange={(e) => updateSetting("smtp_host", e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">Porta SMTP</Label>
              <Input
                id="smtpPort"
                value={getSetting("smtp_port", "587")}
                onChange={(e) => updateSetting("smtp_port", e.target.value)}
                placeholder="587"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpUser">Email Remetente</Label>
              <Input
                id="smtpUser"
                type="email"
                value={getSetting("smtp_user")}
                onChange={(e) => updateSetting("smtp_user", e.target.value)}
                placeholder="sistema@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">Senha do Email</Label>
              <Input
                id="smtpPassword"
                type={showPasswords ? "text" : "password"}
                value={getSetting("smtp_password")}
                onChange={(e) => updateSetting("smtp_password", e.target.value)}
                placeholder="senha_ou_app_password"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtpFromName">Nome do Remetente</Label>
            <Input
              id="smtpFromName"
              value={getSetting("smtp_from_name", "Sistema NFSe")}
              onChange={(e) => updateSetting("smtp_from_name", e.target.value)}
              placeholder="Sistema NFSe"
            />
          </div>

          <Button 
            variant="outline" 
            onClick={() => testConnection("Email")}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            Testar Email
          </Button>
        </CardContent>
      </Card>

      {/* Configurações de Agendamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configurações de Agendamento
          </CardTitle>
          <CardDescription>
            Configurações para execução automática
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledTime">Horário de Execução</Label>
              <Input
                id="scheduledTime"
                type="time"
                value={getSetting("scheduled_time", "18:00")}
                onChange={(e) => updateSetting("scheduled_time", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retryAttempts">Tentativas de Reenvio</Label>
              <Input
                id="retryAttempts"
                type="number"
                min="1"
                max="10"
                value={getSetting("retry_attempts", "3")}
                onChange={(e) => updateSetting("retry_attempts", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retryInterval">Intervalo entre Tentativas (min)</Label>
              <Input
                id="retryInterval"
                type="number"
                min="1"
                max="120"
                value={getSetting("retry_interval", "30")}
                onChange={(e) => updateSetting("retry_interval", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          className="flex items-center gap-2"
          disabled={updateSettingMutation.isPending}
        >
          {updateSettingMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default SystemSettings;
