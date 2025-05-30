
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface ScheduleSettingsProps {
  getSetting: (key: string, defaultValue?: string) => string;
  updateSetting: (key: string, value: string) => void;
}

const ScheduleSettings = ({ getSetting, updateSetting }: ScheduleSettingsProps) => {
  return (
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
  );
};

export default ScheduleSettings;
