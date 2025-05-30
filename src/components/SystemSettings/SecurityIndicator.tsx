
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const SecurityIndicator = () => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Shield className="h-5 w-5" />
          Sistema Seguro Ativado
        </CardTitle>
        <CardDescription className="text-green-700">
          Todas as configurações sensíveis são automaticamente criptografadas e protegidas
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default SecurityIndicator;
