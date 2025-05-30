
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, TestTube, Shield, Eye, EyeOff } from "lucide-react";

interface DatabaseSettingsProps {
  getSetting: (key: string, defaultValue?: string) => string;
  updateSetting: (key: string, value: string) => void;
  showPasswords: boolean;
  onPasswordVisibilityToggle: () => void;
  onTestConnection: (type: string) => void;
}

const DatabaseSettings = ({ 
  getSetting, 
  updateSetting, 
  showPasswords, 
  onPasswordVisibilityToggle, 
  onTestConnection 
}: DatabaseSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Configurações do Banco de Dados (Seguras)
        </CardTitle>
        <CardDescription>
          Configurações de conexão com o SQL Server - dados sensíveis criptografados
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
          <Label htmlFor="dbPassword" className="flex items-center gap-2">
            Senha do Banco <Shield className="h-4 w-4 text-green-600" />
          </Label>
          <div className="relative">
            <Input
              id="dbPassword"
              type={showPasswords ? "text" : "password"}
              value={getSetting("db_password")}
              onChange={(e) => updateSetting("db_password", e.target.value)}
              placeholder="senha do banco (será criptografada)"
              className="bg-yellow-50 border-yellow-200"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={onPasswordVisibilityToggle}
            >
              {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => onTestConnection("Banco de Dados")}
          className="flex items-center gap-2"
        >
          <TestTube className="h-4 w-4" />
          Testar Conexão Segura
        </Button>
      </CardContent>
    </Card>
  );
};

export default DatabaseSettings;
