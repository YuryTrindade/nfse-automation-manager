
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

interface Note {
  id: string;
  numeroRps: string;
  serieRps: string;
  dataEmissao: string;
  cnpjPrestador: string;
  razaoSocialTomador: string;
  valorServicos: number;
  cdServico: string;
  status: 'Pendente' | 'Erro' | 'Processando';
  motivoErro?: string;
}

const NotesAvailable = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    cnpjPrestador: '',
    status: '',
    dataInicio: '',
    dataFim: ''
  });
  const { toast } = useToast();
  const addLogMutation = useAddSystemLog();

  // Dados simulados para demonstração
  const mockNotes: Note[] = [
    {
      id: "1",
      numeroRps: "001",
      serieRps: "A1",
      dataEmissao: "2024-05-28",
      cnpjPrestador: "12.345.678/0001-90",
      razaoSocialTomador: "Empresa ABC Ltda",
      valorServicos: 1500.00,
      cdServico: "101",
      status: "Pendente"
    },
    {
      id: "2",
      numeroRps: "002",
      serieRps: "A1",
      dataEmissao: "2024-05-28",
      cnpjPrestador: "12.345.678/0001-90",
      razaoSocialTomador: "Empresa XYZ S.A.",
      valorServicos: 2300.00,
      cdServico: "201",
      status: "Pendente"
    },
    {
      id: "3",
      numeroRps: "003",
      serieRps: "A1",
      dataEmissao: "2024-05-27",
      cnpjPrestador: "98.765.432/0001-10",
      razaoSocialTomador: "Empresa 123 Ltda",
      valorServicos: 850.00,
      cdServico: "301",
      status: "Erro",
      motivoErro: "CNPJ inválido"
    },
    {
      id: "4",
      numeroRps: "004",
      serieRps: "B1",
      dataEmissao: "2024-05-27",
      cnpjPrestador: "12.345.678/0001-90",
      razaoSocialTomador: "Empresa DEF S.A.",
      valorServicos: 3200.00,
      cdServico: "101",
      status: "Pendente"
    }
  ];

  const handleSearch = async () => {
    setLoading(true);

    try {
      await addLogMutation.mutateAsync({
        timestamp: new Date().toISOString(),
        type: 'info',
        message: 'Consulta de notas disponíveis iniciada',
        details: `Filtros aplicados: CNPJ: ${filters.cnpjPrestador || 'Todos'}, Status: ${filters.status || 'Todos'}`,
      });

      // Simular consulta ao banco de dados
      setTimeout(async () => {
        let filteredNotes = mockNotes;

        if (filters.cnpjPrestador) {
          filteredNotes = filteredNotes.filter(note => 
            note.cnpjPrestador.includes(filters.cnpjPrestador)
          );
        }

        if (filters.status) {
          filteredNotes = filteredNotes.filter(note => note.status === filters.status);
        }

        setNotes(filteredNotes);
        setLoading(false);

        await addLogMutation.mutateAsync({
          timestamp: new Date().toISOString(),
          type: 'success',
          message: 'Consulta de notas concluída',
          details: `${filteredNotes.length} notas encontradas`,
          notes_count: filteredNotes.length,
        });

        toast({
          title: "Consulta realizada",
          description: `${filteredNotes.length} notas encontradas`,
        });
      }, 1000);

    } catch (error) {
      setLoading(false);
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

      await addLogMutation.mutateAsync({
        timestamp: new Date().toISOString(),
        type: 'info',
        message: 'Envio individual de nota iniciado',
        details: `RPS: ${note.numeroRps}/${note.serieRps} - ${note.razaoSocialTomador}`,
        notes_count: 1,
      });

      toast({
        title: "Nota enviada",
        description: `RPS ${note.numeroRps}/${note.serieRps} foi enviada para processamento`,
      });

      // Atualizar status da nota
      setNotes(prev => prev.map(n => 
        n.id === noteId ? { ...n, status: 'Processando' as const } : n
      ));

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
      'Processando': 'secondary'
    } as const;

    return (
      <div className="flex flex-col gap-1">
        <Badge variant={variants[status as keyof typeof variants]}>
          {status}
        </Badge>
        {motivoErro && (
          <span className="text-xs text-red-600">{motivoErro}</span>
        )}
      </div>
    );
  };

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
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Erro">Erro</SelectItem>
                  <SelectItem value="Processando">Processando</SelectItem>
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
            disabled={loading}
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            {loading ? "Consultando..." : "Consultar Notas"}
          </Button>
        </CardContent>
      </Card>

      {notes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Notas Encontradas</CardTitle>
            <CardDescription>
              {notes.length} nota(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                      {note.numeroRps}/{note.serieRps}
                    </TableCell>
                    <TableCell>{note.dataEmissao}</TableCell>
                    <TableCell>{note.cnpjPrestador}</TableCell>
                    <TableCell>{note.razaoSocialTomador}</TableCell>
                    <TableCell>R$ {note.valorServicos.toFixed(2)}</TableCell>
                    <TableCell>{note.cdServico}</TableCell>
                    <TableCell>
                      {getStatusBadge(note.status, note.motivoErro)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Detalhes da Nota",
                              description: `RPS: ${note.numeroRps}/${note.serieRps} - Valor: R$ ${note.valorServicos.toFixed(2)}`,
                            });
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {note.status === 'Pendente' && (
                          <Button
                            size="sm"
                            onClick={() => handleSendNote(note.id)}
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotesAvailable;
