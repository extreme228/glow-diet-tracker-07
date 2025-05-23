
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChartContainer } from '@/components/ui/chart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  Activity, Calendar as CalendarIcon, ChevronDown, ChevronUp, 
  Trash2, TrendingDown, TrendingUp, Scale, ChartLineUp 
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Tipo para os registros de peso
type WeightRecord = {
  id: string;
  date: string;
  weight: number;
  notes?: string;
};

export default function Weight() {
  const [date, setDate] = useState<Date>(new Date());
  const [weight, setWeight] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(() => {
    const saved = localStorage.getItem('weightRecords');
    return saved ? JSON.parse(saved) : [];
  });
  const { theme } = useTheme();
  
  // Salvar os registros no localStorage quando houver mudanças
  React.useEffect(() => {
    localStorage.setItem('weightRecords', JSON.stringify(weightRecords));
  }, [weightRecords]);
  
  // Adicionar um novo registro de peso
  const addWeightRecord = () => {
    if (!weight) {
      toast.error("Por favor, insira seu peso");
      return;
    }
    
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) {
      toast.error("Por favor, insira um peso válido");
      return;
    }
    
    const newRecord: WeightRecord = {
      id: crypto.randomUUID(),
      date: format(date, 'yyyy-MM-dd'),
      weight: weightValue,
      notes: notes.trim() || undefined,
    };
    
    // Verificar se já existe um registro para esta data
    const existingIndex = weightRecords.findIndex(record => record.date === newRecord.date);
    
    if (existingIndex >= 0) {
      // Substituir o registro existente
      const updatedRecords = [...weightRecords];
      updatedRecords[existingIndex] = newRecord;
      setWeightRecords(updatedRecords);
      toast.success("Registro de peso atualizado");
    } else {
      // Adicionar novo registro
      setWeightRecords(prev => [...prev, newRecord].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ));
      toast.success("Registro de peso adicionado");
    }
    
    // Limpar campos
    setWeight('');
    setNotes('');
  };
  
  // Remover um registro de peso
  const deleteWeightRecord = (id: string) => {
    setWeightRecords(prev => prev.filter(record => record.id !== id));
    toast.success("Registro removido");
  };
  
  // Preparar os dados para os gráficos
  const prepareChartData = (days: number) => {
    const sortedRecords = [...weightRecords].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return sortedRecords
      .filter(record => new Date(record.date) >= cutoffDate)
      .map(record => ({
        date: format(new Date(record.date), 'dd/MM'),
        peso: record.weight,
      }));
  };
  
  const weeklyData = prepareChartData(7);
  const monthlyData = prepareChartData(30);
  
  // Calcular estatísticas
  const calculateStats = () => {
    if (weightRecords.length === 0) return null;
    
    const sortedRecords = [...weightRecords].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    const firstWeight = sortedRecords[0].weight;
    const lastWeight = sortedRecords[sortedRecords.length - 1].weight;
    const weightDiff = lastWeight - firstWeight;
    const isGain = weightDiff > 0;
    
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    const recordsLast30Days = sortedRecords.filter(
      record => new Date(record.date) >= thirtyDaysAgo
    );
    
    const weightValues = recordsLast30Days.map(r => r.weight);
    const min = Math.min(...weightValues);
    const max = Math.max(...weightValues);
    
    return { 
      firstWeight, 
      lastWeight, 
      weightDiff: Math.abs(weightDiff), 
      isGain,
      recordsCount: weightRecords.length,
      min,
      max
    };
  };
  
  const stats = calculateStats();
  
  return (
    <div className="pt-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-2xl relative overflow-hidden",
            theme === 'light' ? "bg-gradient-to-r from-blue-100 to-purple-100" : "bg-gradient-to-r from-blue-500/20 to-purple-500/20"
          )}>
            {theme === 'vibrant' && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 animate-pulse" />
            )}
            <Scale className="w-7 h-7 text-blue-500 relative z-10" />
          </div>
          <div>
            <h1 className={cn(
              "text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r",
              theme === 'light' 
                ? "from-gray-800 to-gray-600" 
                : "from-blue-400 via-indigo-400 to-purple-400"
            )}>
              Controle de Peso
            </h1>
            <div className="text-sm text-muted-foreground">
              Acompanhe sua evolução ao longo do tempo
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Adicionar Registro de Peso
          </CardTitle>
          <CardDescription>
            Registre seu peso diariamente para acompanhar sua evolução
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecione uma data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="0"
                placeholder="Ex: 75.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Input
                id="notes"
                type="text"
                placeholder="Ex: Após exercícios"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          <Button 
            className="mt-4 w-full md:w-auto" 
            onClick={addWeightRecord}
          >
            Salvar Registro
          </Button>
        </CardContent>
      </Card>

      {/* Estatísticas Rápidas */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className={cn(
            "transition-all duration-300 hover:scale-105",
            theme === 'vibrant' ? "bg-gray-900/60 border-purple-500/30 backdrop-blur-xl" : ""
          )}>
            {theme === 'vibrant' && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50 rounded-xl" />
            )}
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Peso Inicial</p>
                <div className={cn("p-2 rounded-lg", theme === 'light' ? "bg-blue-100" : "bg-blue-500/20")}>
                  <Scale className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{stats.firstWeight.toFixed(1)} kg</p>
            </CardContent>
          </Card>
          
          <Card className={cn(
            "transition-all duration-300 hover:scale-105",
            theme === 'vibrant' ? "bg-gray-900/60 border-purple-500/30 backdrop-blur-xl" : ""
          )}>
            {theme === 'vibrant' && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50 rounded-xl" />
            )}
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Peso Atual</p>
                <div className={cn("p-2 rounded-lg", theme === 'light' ? "bg-emerald-100" : "bg-emerald-500/20")}>
                  <Activity className="w-4 h-4 text-emerald-500" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{stats.lastWeight.toFixed(1)} kg</p>
            </CardContent>
          </Card>
          
          <Card className={cn(
            "transition-all duration-300 hover:scale-105",
            theme === 'vibrant' ? "bg-gray-900/60 border-purple-500/30 backdrop-blur-xl" : ""
          )}>
            {theme === 'vibrant' && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50 rounded-xl" />
            )}
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Diferença</p>
                <div className={cn(
                  "p-2 rounded-lg", 
                  stats.isGain 
                    ? theme === 'light' ? "bg-amber-100" : "bg-amber-500/20" 
                    : theme === 'light' ? "bg-emerald-100" : "bg-emerald-500/20"
                )}>
                  {stats.isGain 
                    ? <TrendingUp className="w-4 h-4 text-amber-500" /> 
                    : <TrendingDown className="w-4 h-4 text-emerald-500" />}
                </div>
              </div>
              <div className="flex items-baseline gap-1 mt-2">
                <p className="text-2xl font-bold">{stats.weightDiff.toFixed(1)} kg</p>
                <span className={cn(
                  "text-xs font-medium",
                  stats.isGain ? "text-amber-500" : "text-emerald-500"
                )}>
                  {stats.isGain ? '+' : '-'}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card className={cn(
            "transition-all duration-300 hover:scale-105",
            theme === 'vibrant' ? "bg-gray-900/60 border-purple-500/30 backdrop-blur-xl" : ""
          )}>
            {theme === 'vibrant' && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50 rounded-xl" />
            )}
            <CardContent className="p-4 relative z-10">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Registros</p>
                <div className={cn("p-2 rounded-lg", theme === 'light' ? "bg-purple-100" : "bg-purple-500/20")}>
                  <ChartLineUp className="w-4 h-4 text-purple-500" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{stats.recordsCount}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráficos */}
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="weekly">Semanal</TabsTrigger>
          <TabsTrigger value="monthly">Mensal</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartLineUp className="w-5 h-5 text-primary" />
                Evolução Semanal
              </CardTitle>
              <CardDescription>
                Acompanhe seu peso nos últimos 7 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              {weeklyData.length > 1 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? "#e5e7eb" : "#374151"} />
                      <XAxis 
                        dataKey="date" 
                        stroke={theme === 'light' ? "#6b7280" : "#9ca3af"} 
                      />
                      <YAxis 
                        stroke={theme === 'light' ? "#6b7280" : "#9ca3af"} 
                        domain={['dataMin - 1', 'dataMax + 1']} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme === 'light' ? "#fff" : "#1f2937", 
                          borderColor: theme === 'light' ? "#e5e7eb" : "#4b5563", 
                          color: theme === 'light' ? "#1f2937" : "#f9fafb" 
                        }}
                        formatter={(value: number) => [`${value} kg`, "Peso"]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="peso" 
                        stroke={theme === 'light' ? "#3b82f6" : "#60a5fa"} 
                        strokeWidth={2} 
                        dot={{ 
                          stroke: theme === 'light' ? "#3b82f6" : "#60a5fa", 
                          strokeWidth: 2, 
                          r: 4 
                        }} 
                        activeDot={{ r: 6, fill: theme === 'light' ? "#3b82f6" : "#60a5fa" }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Scale className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">
                    {weightRecords.length === 0 
                      ? "Nenhum registro de peso encontrado" 
                      : "Adicione mais registros para visualizar o gráfico semanal"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChartLineUp className="w-5 h-5 text-primary" />
                Evolução Mensal
              </CardTitle>
              <CardDescription>
                Acompanhe seu peso nos últimos 30 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyData.length > 1 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? "#e5e7eb" : "#374151"} />
                      <XAxis 
                        dataKey="date" 
                        stroke={theme === 'light' ? "#6b7280" : "#9ca3af"} 
                      />
                      <YAxis 
                        stroke={theme === 'light' ? "#6b7280" : "#9ca3af"} 
                        domain={['dataMin - 1', 'dataMax + 1']} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: theme === 'light' ? "#fff" : "#1f2937", 
                          borderColor: theme === 'light' ? "#e5e7eb" : "#4b5563", 
                          color: theme === 'light' ? "#1f2937" : "#f9fafb" 
                        }}
                        formatter={(value: number) => [`${value} kg`, "Peso"]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="peso" 
                        stroke={theme === 'light' ? "#8b5cf6" : "#a78bfa"} 
                        strokeWidth={2} 
                        dot={{ 
                          stroke: theme === 'light' ? "#8b5cf6" : "#a78bfa", 
                          strokeWidth: 2, 
                          r: 4 
                        }} 
                        activeDot={{ r: 6, fill: theme === 'light' ? "#8b5cf6" : "#a78bfa" }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Scale className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">
                    {weightRecords.length === 0 
                      ? "Nenhum registro de peso encontrado" 
                      : "Adicione mais registros para visualizar o gráfico mensal"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Histórico de Registros
              </CardTitle>
              <CardDescription>
                Todos os seus registros de peso
              </CardDescription>
            </CardHeader>
            <CardContent>
              {weightRecords.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Peso (kg)</TableHead>
                        <TableHead>Observações</TableHead>
                        <TableHead className="w-[100px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weightRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            {format(new Date(record.date), 'dd/MM/yyyy')}
                          </TableCell>
                          <TableCell className="font-medium">
                            {record.weight.toFixed(1)}
                          </TableCell>
                          <TableCell>{record.notes || "-"}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteWeightRecord(record.id)}
                              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10">
                  <Scale className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-lg">
                    Nenhum registro de peso encontrado
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
