
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Search, Send, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAddSystemLog } from "@/hooks/useSystemLogs";
import { useNfseNotes, useUpdateNfseNote, type NfseNoteFilters } from "@/hooks/useNfseNotes";

const NotesAvailable = () => {
  const [filters, setFilters] = useState<NfseNoteFilters>({
    cnpjPrestador: '',
    status: '',
    dataInicio: '',
    dataFim: ''
  });
  const [searchExecuted, setSearchExecuted] = useState(false);
  const { toast } = useToast();
  const addLogMutation = useAddSystemLog();
  const updateNoteMutation = useUpdateNfseNote();

  const { data: notes = [], isLoading, error, refetch } = useNfseNotes(searchExecuted ? filters : undefined);

  const handleSearch = async () => {
    try {
      await addLogMutation.mutateAsync({
        timestamp: new Date().toISOString(),
        type: 'info',
        message: 'Consulta de notas disponíveis iniciada',
        details: `Filtros aplicados: CNPJ: ${filters.cnpjPrestador || 'Todos'}, Status: ${filters.status || 'Todos'}`,
      });

      setSearchExecuted(true);
      await refetch();

      await addLogMutation.mutateAsync({
        timestamp: new Date().toISOString(),
        type: 'success',
        message: 'Consulta de notas concluída',
        details: `${notes.length} notas encontradas`,
        notes_count: notes.length,
      });

      toast({
        title: "Consulta realizada",
        description: `${notes.length} notas encontradas`,
      });

    } catch (error) {
      await addLogMutation.mutateAsync({
        timestamp: new Date().toISOString(),
        type: 'error',
        message: 'Erro na consulta de notas',
        details: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });

      toast({
        title: "Erro na consulta",
        description: "Não foi possível consultar as notas",
        variant: "destructive",
      });
    }
  };

  const handleSendNote = async (noteId: string) => {
    try {
      const note = notes.find(n => n.id === noteId);
      if (!note) return;

      await updateNoteMutation.mutateAsync({
        id: noteId,
        updates: { status: 'Processando' }
      });

      await addLogMutation.mutateAsync({
        timestamp: new Date().toISOString(),
        type: 'info',
        message: 'Envio individual de nota iniciado',
        details: `RPS: ${note.numero_rps}/${note.serie_rps} - ${note.razao_social_tomador}`,
        notes_count: 1,
      });

      toast({
        title: "Nota enviada",
        description: `RPS ${note.numero_rps}/${note.serie_rps} foi enviada para processamento`,
      });

    } catch (error) {
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar a nota",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string, motivoErro?: string) => {
    const variants = {
      'Pendente': 'default',
      'Erro': 'destructive',
      'Processando': 'secondary',
      'Enviado': 'default',
      'Cancelado': 'outline'
    } as const;

    return (
      <div className="flex flex-col gap-1">
        <Badge variant={variants[status as keyof typeof variants] || 'default'}>
          {status}
        </Badge>
        {motivoErro && (
          <span className="text-xs text-red-600">{motivoErro}</span>
        )}
      </div>
    );
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            Erro ao carregar notas: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Consultar Notas Disponíveis
          </CardTitle>
          <CardDescription>
            Consulte e gerencie as notas disponíveis para envio de NFSe
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnpjFilter">CNPJ do Prestador</Label>
              <Input
                id="cnpjFilter"
                placeholder="00.000.000/0000-00"
                value={filters.cnpjPrestador}
                onChange={(e) => setFilters(prev => ({ ...prev, cnpjPrestador: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Erro">Erro</SelectItem>
                  <SelectItem value="Processando">Processando</SelectItem>
                  <SelectItem value="Enviado">Enviado</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataInicio">Data Início</Label>
              <Input
                id="dataInicio"
                type="date"
                value={filters.dataInicio}
                onChange={(e) => setFilters(prev => ({ ...prev, dataInicio: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataFim">Data Fim</Label>
              <Input
                id="dataFim"
                type="date"
                value={filters.dataFim}
                onChange={(e) => setFilters(prev => ({ ...prev, dataFim: e.target.value }))}
              />
            </div>
          </div>

          <Button 
            onClick={handleSearch}
            className="w-full flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {isLoading ? "Consultando..." : "Consultar Notas"}
          </Button>
        </CardContent>
      </Card>

      {searchExecuted && (
        <Card>
          <CardHeader>
            <CardTitle>Notas Encontradas</CardTitle>
            <CardDescription>
              {notes.length} nota(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RPS</TableHead>
                    <TableHead>Data Emissão</TableHead>
                    <TableHead>CNPJ Prestador</TableHead>
                    <TableHead>Tomador</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notes.map((note) => (
                    <TableRow key={note.id}>
                      <TableCell className="font-medium">
                        {note.numero_rps}/{note.serie_rps}
                      </TableCell>
                      <TableCell>{note.data_emissao}</TableCell>
                      <TableCell>{note.cnpj_prestador}</TableCell>
                      <TableCell>{note.razao_social_tomador}</TableCell>
                      <TableCell>R$ {note.valor_servicos.toFixed(2)}</TableCell>
                      <TableCell>{note.cd_servico}</TableCell>
                      <TableCell>
                        {getStatusBadge(note.status, note.motivo_erro)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              toast({
                                title: "Detalhes da Nota",
                                description: `RPS: ${note.numero_rps}/${note.serie_rps} - Valor: R$ ${note.valor_servicos.toFixed(2)}`,
                              });
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {note.status === 'Pendente' && (
                            <Button
                              size="sm"
                              onClick={() => handleSendNote(note.id)}
                              disabled={updateNoteMutation.isPending}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma nota encontrada com os filtros aplicados</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotesAvailable;
