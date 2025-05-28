
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  FileText, 
  Send, 
  Settings
} from "lucide-react";

interface MainControlsProps {
  isSystemActive: boolean;
  onSystemToggle: () => void;
  onManualExecution: () => void;
}

const MainControls = ({ 
  isSystemActive, 
  onSystemToggle, 
  onManualExecution 
}: MainControlsProps) => {
  return (
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
            onCheckedChange={onSystemToggle}
          />
        </div>
        
        <div className="flex gap-4">
          <Button 
            onClick={onManualExecution}
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
  );
};

export default MainControls;
