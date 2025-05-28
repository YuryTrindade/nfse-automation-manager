
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailManagementProps {
  isSystemActive: boolean;
}

const EmailManagement = ({ isSystemActive }: EmailManagementProps) => {
  const [emails, setEmails] = useState([
    "admin@empresa.com",
    "financeiro@empresa.com"
  ]);
  const [newEmail, setNewEmail] = useState("");
  const { toast } = useToast();

  const addEmail = () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido",
        variant: "destructive",
      });
      return;
    }

    if (emails.includes(newEmail)) {
      toast({
        title: "Email já cadastrado",
        description: "Este email já está na lista",
        variant: "destructive",
      });
      return;
    }

    setEmails([...emails, newEmail]);
    setNewEmail("");
    toast({
      title: "Email adicionado",
      description: "Email adicionado com sucesso à lista de notificações",
    });
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
    toast({
      title: "Email removido",
      description: "Email removido da lista de notificações",
    });
  };

  const sendTestEmail = () => {
    toast({
      title: "Email de teste enviado",
      description: "Um email de teste foi enviado para todos os destinatários",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Gestão de Emails de Notificação
          </CardTitle>
          <CardDescription>
            Configure os emails que receberão relatórios de envio e notificações do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSystemActive && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 font-medium">
                ⚠️ Sistema desativado - Os emails configurados receberão notificações sobre o status
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="newEmail">Adicionar novo email</Label>
            <div className="flex gap-2">
              <Input
                id="newEmail"
                type="email"
                placeholder="exemplo@empresa.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addEmail()}
              />
              <Button onClick={addEmail} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Emails cadastrados ({emails.length})</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {emails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{email}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Ativo</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEmail(email)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {emails.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Nenhum email cadastrado
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={sendTestEmail}
              variant="outline"
              className="w-full"
              disabled={emails.length === 0}
            >
              Enviar Email de Teste
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tipos de Notificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-medium text-green-800">Envio Bem-sucedido</h4>
                <p className="text-sm text-green-600">Quando as NFSe são enviadas com sucesso</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Ativo</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <h4 className="font-medium text-red-800">Erros de Envio</h4>
                <p className="text-sm text-red-600">Quando ocorrem erros durante o envio</p>
              </div>
              <Badge className="bg-red-100 text-red-800">Ativo</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div>
                <h4 className="font-medium text-amber-800">Sistema Desativado</h4>
                <p className="text-sm text-amber-600">Notificação diária quando o sistema está inativo</p>
              </div>
              <Badge className="bg-amber-100 text-amber-800">Ativo</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailManagement;
