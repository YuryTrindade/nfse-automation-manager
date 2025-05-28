
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Calendar,
  FileSearch,
  FileText,
  Settings
} from "lucide-react";
import EmailManagement from "@/components/EmailManagement";
import CustomSend from "@/components/CustomSend";
import SystemSettings from "@/components/SystemSettings";
import LogViewer from "@/components/LogViewer";
import NotesAvailable from "@/components/NotesAvailable";

interface DashboardTabsProps {
  isSystemActive: boolean;
}

const DashboardTabs = ({ isSystemActive }: DashboardTabsProps) => {
  return (
    <Tabs defaultValue="emails" className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="emails" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Emails
        </TabsTrigger>
        <TabsTrigger value="custom" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Envio Personalizado
        </TabsTrigger>
        <TabsTrigger value="available" className="flex items-center gap-2">
          <FileSearch className="h-4 w-4" />
          Notas Disponíveis
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

      <TabsContent value="available">
        <NotesAvailable />
      </TabsContent>

      <TabsContent value="logs">
        <LogViewer />
      </TabsContent>

      <TabsContent value="settings">
        <SystemSettings />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
