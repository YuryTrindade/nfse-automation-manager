
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DashboardHeader from "@/components/DashboardHeader";
import StatusCards from "@/components/StatusCards";
import MainControls from "@/components/MainControls";
import DashboardTabs from "@/components/DashboardTabs";
import SecurityAuditLogger from "@/components/SecurityAuditLogger";

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
      <SecurityAuditLogger />
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader />
        
        <StatusCards 
          isSystemActive={isSystemActive}
          lastExecution={lastExecution}
          totalSentToday={totalSentToday}
          totalErrors={totalErrors}
        />

        <MainControls 
          isSystemActive={isSystemActive}
          onSystemToggle={handleSystemToggle}
          onManualExecution={handleManualExecution}
        />

        <DashboardTabs isSystemActive={isSystemActive} />
      </div>
    </div>
  );
};

export default Index;
