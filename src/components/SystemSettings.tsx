
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  EyeOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SystemSettings = () => {
  const [showPasswords, setShowPasswords] = useState(false);
  const [settings, setSettings] = useState({
    // Configurações de banco
    dbHost: "localhost",
    dbPort: "1433",
    dbName: "nfse_db",
    dbUser: "admin",
    dbPassword: "****",
    
    // Configurações de API
    apiUrl: "https://api.plugnotas.com.br/nfse",
    apiKey: "****",
    
    // Configurações de email
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "sistema@empresa.com",
    smtpPassword: "****",
    smtpFromName: "Sistema NFSe",
    
    // Configurações de agendamento
    scheduledTime: "18:00",
    timezone: "America/Sao_Paulo",
    retryAttempts: "3",
    retryInterval: "30"
  });

  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações foram atualizadas com sucesso",
    });
  };

  const testConnection = (type: string) => {
    toast({
      title: `Testando ${type}...`,
      description: "Verificando conectividade...",
    });
    
    // Simular teste
    setTimeout(() => {
      toast({
        title: `Teste de ${type} concluído`,
        description: "Conexão estabelecida com sucesso",
      });
    }, 2000);
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

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
                value={settings.dbHost}
                onChange={(e) => updateSetting("dbHost", e.target.value)}
                placeholder="localhost ou IP do servidor"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dbPort">Porta</Label>
              <Input
                id="dbPort"
                value={settings.dbPort}
                onChange={(e) => updateSetting("dbPort", e.target.value)}
                placeholder="1433"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dbName">Nome do Banco</Label>
              <Input
                id="dbName"
                value={settings.dbName}
                onChange={(e) => updateSetting("dbName", e.target.value)}
                placeholder="nome_do_banco"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dbUser">Usuário</Label>
              <Input
                id="dbUser"
                value={settings.dbUser}
                onChange={(e) => updateSetting("dbUser", e.target.value)}
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
                value={settings.dbPassword}
                onChange={(e) => updateSetting("dbPassword", e.target.value)}
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
              value={settings.apiUrl}
              onChange={(e) => updateSetting("apiUrl", e.target.value)}
              placeholder="https://api.plugnotas.com.br/nfse"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">Chave da API</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showPasswords ? "text" : "password"}
                value={settings.apiKey}
                onChange={(e) => updateSetting("apiKey", e.target.value)}
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
                value={settings.smtpHost}
                onChange={(e) => updateSetting("smtpHost", e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPort">Porta SMTP</Label>
              <Input
                id="smtpPort"
                value={settings.smtpPort}
                onChange={(e) => updateSetting("smtpPort", e.target.value)}
                placeholder="587"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpUser">Email Remetente</Label>
              <Input
                id="smtpUser"
                type="email"
                value={settings.smtpUser}
                onChange={(e) => updateSetting("smtpUser", e.target.value)}
                placeholder="sistema@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtpPassword">Senha do Email</Label>
              <Input
                id="smtpPassword"
                type={showPasswords ? "text" : "password"}
                value={settings.smtpPassword}
                onChange={(e) => updateSetting("smtpPassword", e.target.value)}
                placeholder="senha_ou_app_password"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="smtpFromName">Nome do Remetente</Label>
            <Input
              id="smtpFromName"
              value={settings.smtpFromName}
              onChange={(e) => updateSetting("smtpFromName", e.target.value)}
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
                value={settings.scheduledTime}
                onChange={(e) => updateSetting("scheduledTime", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Sao_Paulo">America/São_Paulo (BRT)</SelectItem>
                  <SelectItem value="America/Fortaleza">America/Fortaleza (BRT)</SelectItem>
                  <SelectItem value="America/Manaus">America/Manaus (AMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="retryAttempts">Tentativas de Reenvio</Label>
              <Input
                id="retryAttempts"
                type="number"
                min="1"
                max="10"
                value={settings.retryAttempts}
                onChange={(e) => updateSetting("retryAttempts", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retryInterval">Intervalo entre Tentativas (min)</Label>
              <Input
                id="retryInterval"
                type="number"
                min="1"
                max="120"
                value={settings.retryInterval}
                onChange={(e) => updateSetting("retryInterval", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Arquivo .env de exemplo */}
      <Card>
        <CardHeader>
          <CardTitle>Exemplo de arquivo .env</CardTitle>
          <CardDescription>
            Use este modelo para configurar suas variáveis de ambiente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
            <pre>{`# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=1433
DB_NAME=nfse_db
DB_USER=admin
DB_PASSWORD=sua_senha_banco

# Configurações da API PlugNotas
API_URL=https://api.plugnotas.com.br/nfse
API_KEY=sua_chave_api_plugnotas

# Configurações de Email SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=sistema@empresa.com
SMTP_PASSWORD=sua_senha_email
SMTP_FROM_NAME=Sistema NFSe

# Configurações de Agendamento
SCHEDULED_TIME=18:00
TIMEZONE=America/Sao_Paulo
RETRY_ATTEMPTS=3
RETRY_INTERVAL=30

# Configurações de Segurança
JWT_SECRET=seu_jwt_secret_aqui
ENCRYPTION_KEY=sua_chave_criptografia`}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Botão de Salvar */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default SystemSettings;
