
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, TestTube } from "lucide-react";

interface EmailSettingsProps {
  getSetting: (key: string, defaultValue?: string) => string;
  updateSetting: (key: string, value: string) => void;
  showPasswords: boolean;
  onTestConnection: (type: string) => void;
}

const EmailSettings = ({ 
  getSetting, 
  updateSetting, 
  showPasswords, 
  onTestConnection 
}: EmailSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Configurações de Email (Seguras)
        </CardTitle>
        <CardDescription>
          Configurações SMTP para envio de notificações - dados sensíveis criptografados
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
          onClick={() => onTestConnection("Email")}
          className="flex items-center gap-2"
        >
          <TestTube className="h-4 w-4" />
          Testar Email Seguro
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmailSettings;
