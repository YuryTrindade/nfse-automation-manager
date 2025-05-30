
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key, TestTube } from "lucide-react";

interface ApiSettingsProps {
  getSetting: (key: string, defaultValue?: string) => string;
  updateSetting: (key: string, value: string) => void;
  showPasswords: boolean;
  onTestConnection: (type: string) => void;
}

const ApiSettings = ({ 
  getSetting, 
  updateSetting, 
  showPasswords, 
  onTestConnection 
}: ApiSettingsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Configurações da API PlugNotas (Seguras)
        </CardTitle>
        <CardDescription>
          Configurações de integração com a API de NFSe - dados sensíveis criptografados
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
          onClick={() => onTestConnection("API")}
          className="flex items-center gap-2"
        >
          <TestTube className="h-4 w-4" />
          Testar API Segura
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApiSettings;
