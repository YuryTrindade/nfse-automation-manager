
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Search, Send, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAddSystemLog } from "@/hooks/useSystemLogs";
import { useNfseNotes, useUpdateNfseNote, type NfseNoteFilters } from "@/hooks/useNfseNotes";

const CustomSend = () => {
  const [cnpjPrestador, setCnpjPrestador] = useState("");
  const [cdServico, setCdServico] = useState<string>("");
  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataFim, setDataFim] = useState<Date>();
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [searchExecuted, setSearchExecuted] = useState(false);
  const { toast } = useToast();
  const addLogMutation = useAddSystemLog();
  const updateNoteMutation = useUpdateNfseNote();

  const filters: NfseNoteFilters = {
    cnpjPrestador,
    cdServico,
    dataInicio: dataInicio ? format(dataInicio, 'yyyy-MM-dd') : undefined,
    dataFim: dataFim ? format(dataFim, 'yyyy-MM-dd') : undefined,
    status: 'Pendente' // Só buscar notas pendentes para envio personalizado
  };

  const { data: searchResults = [], isLoading: isSearching, refetch } = useNfseNotes(searchExecuted ? filters : undefined);

  const handleSearch = async () => {
    try {
      await addLogMutation.mutateAsync({
        timestamp: new Date().toISOString(),
        type: 'info',
        message: 'Busca personalizada de notas iniciada',
        details: `Filtros: CNPJ: ${cnpjPrestador}, Serviço: ${cdServico || 'N/A'}, Período: ${dataInicio ? format(dataInicio, 'dd/MM/yyyy') : 'N/A'} - ${dataFim ? format(dataFim, 'dd/MM/yyyy') : 'N/A'}`,
      });

      setSearchExecuted(true);
      await refetch();
      
      await addLogMutation.mutateAsync({
        timestamp: new Date().toISOString(),
        type: 'success',
        message: 'Busca personalizada concluída',
        details: `${searchResults.length} notas encontradas para os filtros aplicados`,
        notes_count: searchResults.length,
      });

      toast({
        title: "Busca concluída",
        description: `${searchResults.length} notas encontradas`,
      });
    } catch (error) {
      await addLogMutation.mutateAsync({
        timestamp: new Date().toISOString(),
        type: 'error',
        message: 'Erro na busca personalizada',
        details: `Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      });

      toast({
        title: "Erro na busca",
        description: "Não foi possível realizar a busca",
        variant: "destructive",
      });
    }
  };

  const toggleNoteSelection = (noteId: string) => {
    setSelectedNotes(prev =>
      prev.includes(noteId)
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const selectAll = () => {
    setSelectedNotes(searchResults.map(note => note.id));
  };

  const clearSelection = () => {
    setSelectedNotes([]);
  };

  const handleCustomSend = async () => {
    if (selectedNotes.length === 0) {
      toast({
        title: "Nenhuma nota selecionada",
        description: "Selecione pelo menos uma nota para envio",
        variant: "destructive",
      });
      return;
    }

    try {
      // Atualizar status de todas as notas selecionadas
      for (const noteId of selectedNotes) {
        await updateNoteMutation.mutateAsync({
          id: noteId,
          updates: { status: 'Processando' }
        });
      }

      await addLogMutation.mutateAsync({
        timestamp: new Date().toISOString(),
        type: 'success',
        message: 'Envio personalizado iniciado',
        details: `${selectedNotes.length} notas selecionadas para envio personalizado`,
        notes_count: selectedNotes.length,
      });

      toast({
        title: "Envio iniciado",
        description: `${selectedNotes.length} notas foram enviadas para processamento`,
      });
      
      setSelectedNotes([]);
      setSearchExecuted(false);
    } catch (error) {
      await addLogMutation.mutateAsync({
        timestamp: new Date().toISOString(),
        type: 'error',
        message: 'Erro no envio personalizado',
        details: `Erro ao enviar ${selectedNotes.length} notas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        notes_count: selectedNotes.length,
      });

      toast({
        title: "Erro no envio",
        description: "Houve um problema ao enviar as notas",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Envio Personalizado de NFSe
          </CardTitle>
          <CardDescription>
            Filtre e selecione notas específicas para envio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnpjPrestador">CNPJ do Prestador</Label>
              <Input
                id="cnpjPrestador"
                placeholder="00.000.000/0000-00"
                value={cnpjPrestador}
                onChange={(e) => setCnpjPrestador(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cdServico">Código do Serviço</Label>
              <Select value={cdServico} onValueChange={setCdServico}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o serviço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os serviços</SelectItem>
                  <SelectItem value="101">101 - Análise e desenvolvimento de sistemas</SelectItem>
                  <SelectItem value="201">201 - Serviços de informática</SelectItem>
                  <SelectItem value="301">301 - Consultoria</SelectItem>
                  <SelectItem value="401">401 - Treinamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataInicio}
                    onSelect={setDataInicio}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data de Fim</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataFim && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataFim ? format(dataFim, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dataFim}
                    onSelect={setDataFim}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button 
            onClick={handleSearch}
            className="w-full flex items-center gap-2"
            disabled={isSearching}
          >
            <Search className="h-4 w-4" />
            {isSearching ? "Buscando..." : "Buscar Notas"}
          </Button>
        </CardContent>
      </Card>

      {searchExecuted && searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Resultados da Busca</CardTitle>
                <CardDescription>
                  {searchResults.length} notas encontradas
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={selectAll}>
                  Selecionar Todos
                </Button>
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Limpar Seleção
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {searchResults.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    "p-4 border rounded-lg cursor-pointer transition-colors",
                    selectedNotes.includes(note.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  onClick={() => toggleNoteSelection(note.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">RPS {note.numero_rps}/{note.serie_rps}</span>
                        <Badge variant="secondary">{note.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{note.razao_social_tomador}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Data: {note.data_emissao}</span>
                        <span>Valor: R$ {note.valor_servicos.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedNotes.includes(note.id)}
                        onChange={() => toggleNoteSelection(note.id)}
                        className="h-4 w-4 text-blue-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedNotes.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedNotes.length} notas selecionadas
                  </span>
                  <Button 
                    onClick={handleCustomSend} 
                    className="flex items-center gap-2"
                    disabled={updateNoteMutation.isPending}
                  >
                    <Send className="h-4 w-4" />
                    Enviar Selecionadas
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {searchExecuted && searchResults.length === 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Nenhuma nota pendente encontrada com os filtros aplicados</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomSend;
