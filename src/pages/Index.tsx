
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Send, 
  Settings, 
  Mail, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EmailManagement from "@/components/EmailManagement";
import CustomSend from "@/components/CustomSend";
import SystemSettings from "@/components/SystemSettings";
import LogViewer from "@/components/LogViewer";

const Index = () => {
  const [isSystemActive, setIsSystemActive] = useState(true);
  const [lastExecution, setLastExecution] = useState("2024-05-28 08:30:00");
  const [totalSentToday, setTotalSentToday] = useState(15);
  const [totalErrors, setTotalErrors] = useState(2);
  const { toast } = useToast();

  const handleSystemToggle = () => {
    setIsSystemActive(!isSystemActive);
    toast({
      title: isSystemActive ? "Sistema Desativado" : "Sistema Ativado",
      description: isSystemActive 
        ? "O envio automático de NFSe foi desativado" 
        : "O envio automático de NFSe foi ativado",
      variant: isSystemActive ? "destructive" : "default",
    });
  };

  const handleManualExecution = () => {
    toast({
      title: "Execução Iniciada",
      description: "O processo de envio manual foi iniciado. Você receberá um email com o relatório.",
    });
    // Aqui seria implementada a chamada para o backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de Gerenciamento NFSe
          </h1>
          <p className="text-lg text-gray-600">
            Controle e automação do envio de Notas Fiscais de Serviço Eletrônico
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status do Sistema</CardTitle>
              {isSystemActive ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Badge variant={isSystemActive ? "default" : "destructive"}>
                  {isSystemActive ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Última Execução</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">{lastExecution}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enviadas Hoje</CardTitle>
              <Send className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{totalSentToday}</div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Erros</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totalErrors}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Controles Principais
            </CardTitle>
            <CardDescription>
              Ative/desative o sistema e execute envios manuais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium">Envio Automático</h3>
                <p className="text-sm text-gray-600">
                  Executa automaticamente todo fim de dia
                </p>
              </div>
              <Switch
                checked={isSystemActive}
                onCheckedChange={handleSystemToggle}
              />
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={handleManualExecution}
                className="flex items-center gap-2"
                disabled={!isSystemActive}
              >
                <Send className="h-4 w-4" />
                Executar Agora
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Ver Relatórios
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs para diferentes funcionalidades */}
        <Tabs defaultValue="emails" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="emails" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Emails
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Envio Personalizado
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="emails">
            <EmailManagement isSystemActive={isSystemActive} />
          </TabsContent>

          <TabsContent value="custom">
            <CustomSend />
          </TabsContent>

          <TabsContent value="logs">
            <LogViewer />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
