import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from "@/components/ui/card";
import { 
  Form, FormControl, FormDescription, FormField, FormItem, 
  FormLabel, FormMessage 
} from "@/components/ui/form";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { 
  Calculator, Flame, ChevronDown, ChevronUp, 
  Activity, Target, Dumbbell, ArrowUpDown, Minus, Plus,
  Zap, Calendar, LineChart, Scale, Heart, PieChart 
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Schema para validação do formulário de TMB
const tmrFormSchema = z.object({
  gender: z.enum(['male', 'female']),
  age: z.coerce.number().min(10).max(100),
  weight: z.coerce.number().min(30).max(250),
  height: z.coerce.number().min(100).max(250),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very-active']),
});

// Type para o resultado da calculadora
type TmrResult = {
  bmr: number;
  tdee: number;
  maintenance: number;
  deficit: number;
  surplus: number;
  protein: { min: number; max: number };
  carbs: { min: number; max: number };
  fats: { min: number; max: number };
};

// Type para o plano alimentar
type DietPlan = {
  id: string;
  name: string;
  description: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  meals: number;
  notes: string[];
};

export default function Advanced() {
  const { theme } = useTheme();
  const [tmrResult, setTmrResult] = useState<TmrResult | null>(null);
  const [selectedDietPlan, setSelectedDietPlan] = useState<string | null>(null);
  const [carbCyclingDay, setCarbCyclingDay] = useState<'low' | 'medium' | 'high'>('low');
  
  // Form para calculadora TMB
  const form = useForm<z.infer<typeof tmrFormSchema>>({
    resolver: zodResolver(tmrFormSchema),
    defaultValues: {
      gender: 'male',
      age: 30,
      weight: 70,
      height: 170,
      activityLevel: 'moderate',
    },
  });
  
  // Calcular TMB e TDEE
  const calculateTMR = (data: z.infer<typeof tmrFormSchema>) => {
    let bmr = 0;
    
    // Fórmula de Harris-Benedict
    if (data.gender === 'male') {
      bmr = 88.362 + (13.397 * data.weight) + (4.799 * data.height) - (5.677 * data.age);
    } else {
      bmr = 447.593 + (9.247 * data.weight) + (3.098 * data.height) - (4.330 * data.age);
    }
    
    // Multiplicador de atividade física
    const activityMultipliers = {
      'sedentary': 1.2,      // Pouco ou nenhum exercício
      'light': 1.375,        // Exercício leve 1-3x por semana
      'moderate': 1.55,      // Exercício moderado 3-5x por semana
      'active': 1.725,       // Exercício pesado 6-7x por semana
      'very-active': 1.9     // Exercício físico muito pesado, trabalho físico
    };
    
    const tdee = Math.round(bmr * activityMultipliers[data.activityLevel]);
    const maintenance = tdee;
    const deficit = Math.round(maintenance * 0.8); // 20% de déficit
    const surplus = Math.round(maintenance * 1.1); // 10% de superávit
    
    // Cálculo de macronutrientes
    const proteinMin = Math.round(data.weight * 1.6); // 1.6g por kg
    const proteinMax = Math.round(data.weight * 2.2); // 2.2g por kg
    
    // Macros para manutenção
    const proteinCalories = Math.round((proteinMin + proteinMax) / 2 * 4); // Média de proteína * 4 calorias/g
    const fatsMin = Math.round(data.weight * 0.8); // 0.8g por kg
    const fatsMax = Math.round(data.weight * 1); // 1g por kg
    const fatsCalories = Math.round((fatsMin + fatsMax) / 2 * 9); // Média de gordura * 9 calorias/g
    const remainingCalories = maintenance - proteinCalories - fatsCalories;
    const carbsMin = Math.round(remainingCalories * 0.8 / 4); // 80% das calorias restantes, dividido por 4 calorias/g
    const carbsMax = Math.round(remainingCalories * 1.2 / 4); // 120% das calorias restantes, dividido por 4 calorias/g
    
    setTmrResult({
      bmr: Math.round(bmr),
      tdee,
      maintenance,
      deficit,
      surplus,
      protein: { min: proteinMin, max: proteinMax },
      carbs: { min: carbsMin, max: carbsMax },
      fats: { min: fatsMin, max: fatsMax },
    });
    
    toast.success("Cálculo realizado com sucesso!");
  };

  // Planos de dieta disponíveis
  const dietPlans: DietPlan[] = [
    {
      id: 'cutting',
      name: 'Cutting (Perda de Peso)',
      description: 'Plano para redução de gordura corporal preservando a massa muscular',
      calories: 'Déficit de 20-25% das calorias de manutenção',
      protein: 'Alto: 2.0-2.5g por kg de peso corporal',
      carbs: 'Moderado: 2-3g por kg de peso corporal',
      fats: 'Baixo a moderado: 0.8-1g por kg de peso corporal',
      meals: 4,
      notes: [
        'Priorize proteínas em todas as refeições para preservar massa muscular',
        'Foque em alimentos de baixa densidade calórica e alto volume',
        'Inclua carboidratos principalmente antes e depois dos treinos',
        'Mantenha o consumo adequado de gorduras para funções hormonais',
        'Considere jejum intermitente (janela de alimentação de 8-10 horas)',
        'Faça treinos de força 3-5x por semana',
        'Adicione cardio de baixa intensidade (30-45min) 3-4x por semana'
      ]
    },
    {
      id: 'maintenance',
      name: 'Manutenção',
      description: 'Plano para manter o peso e composição corporal atuais',
      calories: 'Calorias de manutenção (TDEE)',
      protein: 'Moderado a alto: 1.6-2.0g por kg de peso corporal',
      carbs: 'Moderado: 3-5g por kg de peso corporal',
      fats: 'Moderado: 1g por kg de peso corporal',
      meals: 3,
      notes: [
        'Distribua proteínas ao longo do dia (20-30g por refeição)',
        'Ajuste carboidratos conforme nível de atividade diário',
        'Priorize gorduras saudáveis (ômega-3, abacate, azeite, nozes)',
        'Mantenha o consumo de fibras (25-35g diários)',
        'Hidrate-se adequadamente (35ml por kg de peso corporal)',
        'Faça treinos de força 3-4x por semana',
        'Adicione atividades cardiovasculares 2-3x por semana para saúde cardiovascular'
      ]
    },
    {
      id: 'bulking',
      name: 'Bulking (Ganho de Massa)',
      description: 'Plano para ganho de massa muscular com controle de gordura',
      calories: 'Superávit de 10-15% das calorias de manutenção',
      protein: 'Alto: 1.8-2.2g por kg de peso corporal',
      carbs: 'Alto: 4-7g por kg de peso corporal',
      fats: 'Moderado: 0.8-1.2g por kg de peso corporal',
      meals: 5,
      notes: [
        'Distribua as calorias em 4-6 refeições ao longo do dia',
        'Consuma proteínas de alta qualidade a cada 3-4 horas',
        'Aumente o consumo de carboidratos especialmente antes e depois dos treinos',
        'Utilize shakes de proteína/carboidratos após treinos intensos',
        'Monitore o ganho de peso (0.25-0.5kg por semana é ideal)',
        'Faça treinos de força intensos 4-5x por semana',
        'Limite o cardio a 1-2 sessões semanais para não comprometer o ganho'
      ]
    },
    {
      id: 'carb-cycling',
      name: 'Ciclo de Carboidratos',
      description: 'Estratégia que alterna dias de alto, médio e baixo consumo de carboidratos',
      calories: 'Varia conforme o dia (manutenção média semanal)',
      protein: 'Constante: 2.0-2.2g por kg de peso corporal em todos os dias',
      carbs: 'Variável: 0.5-1g/kg (baixo), 1-2g/kg (médio), 2-3g/kg (alto)',
      fats: 'Inverso aos carboidratos: alto em dias de baixo carbo, baixo em dias de alto carbo',
      meals: 4,
      notes: [
        'Alinhe dias de alto carboidrato com treinos mais intensos (pernas/costas)',
        'Programe dias de baixo carboidrato em descanso ou treinos leves',
        'Mantenha proteínas altas e constantes em todos os dias',
        'Ajuste gorduras inversamente aos carboidratos para equilíbrio calórico',
        'Concentre carboidratos ao redor dos treinos mesmo em dias de baixo carbo',
        'Ciclo típico: 2 dias baixo, 3 dias médio, 2 dias alto por semana',
        'Monitore energia, desempenho e recuperação para ajustes'
      ]
    },
    {
      id: 'peak-week',
      name: 'Peak Week',
      description: 'Estratégia para maximizar definição muscular e aparência para eventos específicos',
      calories: 'Varia durante a semana (redução gradual de carboidratos, carregamento final)',
      protein: 'Alto e constante: 2.2-2.5g por kg de peso corporal',
      carbs: 'Manipulação estratégica: redução gradual seguida de supercompensação',
      fats: 'Baixo a muito baixo, especialmente nos dias finais',
      meals: 6,
      notes: [
        '6-7 dias antes: Comece a reduzir sódio gradualmente e aumente água',
        '4-5 dias antes: Reduza carboidratos para 1-1.5g/kg, mantenha proteínas altas',
        '2-3 dias antes: Reduza água gradualmente, mantenha carboidratos baixos',
        '24-48h antes: Carregamento de carboidratos (3-5g/kg) com baixo sódio e fibra',
        '12-24h antes: Redução drástica de água, foco em carboidratos secos',
        'Evite novos alimentos ou suplementos durante toda a semana',
        'Não deve ser mantido por mais de uma semana - apenas para eventos específicos'
      ]
    },
  ];

  return (
    <div className="pt-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-2xl relative overflow-hidden",
            theme === 'light' ? "bg-gradient-to-r from-purple-100 to-indigo-100" : "bg-gradient-to-r from-purple-500/20 to-indigo-500/20"
          )}>
            {theme === 'vibrant' && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 animate-pulse" />
            )}
            <Calculator className="w-7 h-7 text-purple-500 relative z-10" />
          </div>
          <div>
            <h1 className={cn(
              "text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r",
              theme === 'light' 
                ? "from-gray-800 to-gray-600" 
                : "from-purple-400 via-indigo-400 to-blue-400"
            )}>
              Ferramentas Avançadas
            </h1>
            <div className="text-sm text-muted-foreground">
              Calculadoras e estratégias para otimizar seus resultados
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="calculator">
            <Calculator className="w-4 h-4 mr-2" />
            Calculadora TMB
          </TabsTrigger>
          <TabsTrigger value="strategies">
            <Target className="w-4 h-4 mr-2" />
            Estratégias Nutricionais
          </TabsTrigger>
          <TabsTrigger value="carb-cycling">
            <ArrowUpDown className="w-4 h-4 mr-2" />
            Ciclo de Carboidratos
          </TabsTrigger>
        </TabsList>
        
        {/* Tab Calculadora TMB */}
        <TabsContent value="calculator">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  Calculadora de Metabolismo
                </CardTitle>
                <CardDescription>
                  Calcule sua Taxa Metabólica Basal (TMB) e necessidades calóricas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(calculateTMR)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>Gênero</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-2"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="male" />
                                <FormLabel htmlFor="male" className="font-normal">
                                  Masculino
                                </FormLabel>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" />
                                <FormLabel htmlFor="female" className="font-normal">
                                  Feminino
                                </FormLabel>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Idade (anos)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={10} 
                              max={100} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Peso (kg)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={30} 
                              max={250} 
                              step="0.1"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Altura (cm)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={100} 
                              max={250} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="activityLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nível de Atividade</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sedentary">
                                Sedentário (pouco ou nenhum exercício)
                              </SelectItem>
                              <SelectItem value="light">
                                Levemente ativo (exercício leve 1-3x/semana)
                              </SelectItem>
                              <SelectItem value="moderate">
                                Moderadamente ativo (exercício moderado 3-5x/semana)
                              </SelectItem>
                              <SelectItem value="active">
                                Muito ativo (exercício pesado 6-7x/semana)
                              </SelectItem>
                              <SelectItem value="very-active">
                                Extremamente ativo (exercício muito pesado, trabalho físico)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Selecione o nível que melhor descreve sua rotina
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit" className="w-full">
                      Calcular
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {tmrResult ? (
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5 text-primary" />
                    Resultados do Cálculo
                  </CardTitle>
                  <CardDescription>
                    Suas necessidades calóricas e recomendações de macronutrientes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className={cn(
                      "p-4 rounded-lg border flex flex-col items-center justify-center text-center",
                      theme === 'vibrant' ? "bg-purple-500/10 border-purple-500/30" : ""
                    )}>
                      <span className="text-sm text-muted-foreground">TMB</span>
                      <span className="text-2xl font-bold">{tmrResult.bmr} kcal</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Calorias em repouso completo
                      </span>
                    </div>
                    <div className={cn(
                      "p-4 rounded-lg border flex flex-col items-center justify-center text-center",
                      theme === 'vibrant' ? "bg-blue-500/10 border-blue-500/30" : ""
                    )}>
                      <span className="text-sm text-muted-foreground">TDEE</span>
                      <span className="text-2xl font-bold">{tmrResult.tdee} kcal</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Gasto calórico diário total
                      </span>
                    </div>
                    <div className={cn(
                      "p-4 rounded-lg border flex flex-col items-center justify-center text-center",
                      theme === 'vibrant' ? "bg-emerald-500/10 border-emerald-500/30" : ""
                    )}>
                      <span className="text-sm text-muted-foreground">Manutenção</span>
                      <span className="text-2xl font-bold">{tmrResult.maintenance} kcal</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        Para manter seu peso atual
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Objetivos Calóricos</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="flex items-center">
                            <Minus className="w-4 h-4 mr-2 text-blue-500" />
                            Perda de Peso
                          </span>
                          <span className="font-medium">{tmrResult.deficit} kcal</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center">
                            <Activity className="w-4 h-4 mr-2 text-emerald-500" />
                            Manutenção
                          </span>
                          <span className="font-medium">{tmrResult.maintenance} kcal</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="flex items-center">
                            <Plus className="w-4 h-4 mr-2 text-amber-500" />
                            Ganho de Massa
                          </span>
                          <span className="font-medium">{tmrResult.surplus} kcal</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Recomendações de Macronutrientes</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nutriente</TableHead>
                            <TableHead>Quantidade (g)</TableHead>
                            <TableHead>% das Calorias</TableHead>
                            <TableHead>Calorias</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                <span>Proteínas</span>
                              </div>
                            </TableCell>
                            <TableCell>{tmrResult.protein.min}-{tmrResult.protein.max}g</TableCell>
                            <TableCell>
                              {Math.round(((tmrResult.protein.min + tmrResult.protein.max) / 2 * 4 / tmrResult.maintenance) * 100)}%
                            </TableCell>
                            <TableCell>
                              {Math.round(((tmrResult.protein.min + tmrResult.protein.max) / 2) * 4)} kcal
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mr-2"></div>
                                <span>Carboidratos</span>
                              </div>
                            </TableCell>
                            <TableCell>{tmrResult.carbs.min}-{tmrResult.carbs.max}g</TableCell>
                            <TableCell>
                              {Math.round(((tmrResult.carbs.min + tmrResult.carbs.max) / 2 * 4 / tmrResult.maintenance) * 100)}%
                            </TableCell>
                            <TableCell>
                              {Math.round(((tmrResult.carbs.min + tmrResult.carbs.max) / 2) * 4)} kcal
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                <span>Gorduras</span>
                              </div>
                            </TableCell>
                            <TableCell>{tmrResult.fats.min}-{tmrResult.fats.max}g</TableCell>
                            <TableCell>
                              {Math.round(((tmrResult.fats.min + tmrResult.fats.max) / 2 * 9 / tmrResult.maintenance) * 100)}%
                            </TableCell>
                            <TableCell>
                              {Math.round(((tmrResult.fats.min + tmrResult.fats.max) / 2) * 9)} kcal
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">TMB:</span> Taxa Metabólica Basal - calorias necessárias para funções vitais em repouso
                  </p>
                  <p>
                    <span className="font-medium">TDEE:</span> Gasto Energético Total Diário - inclui atividades e exercícios
                  </p>
                  <p className="text-xs mt-1">
                    * Estas são estimativas baseadas em fórmulas padrão. Ajustes podem ser necessários com base na resposta individual.
                  </p>
                </CardFooter>
              </Card>
            ) : (
              <Card className="md:col-span-2 flex flex-col items-center justify-center">
                <CardContent className="py-12 text-center">
                  <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Sem resultados ainda</h3>
                  <p className="text-muted-foreground">
                    Preencha o formulário e clique em "Calcular" para ver seus resultados
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Tab Estratégias Nutricionais */}
        <TabsContent value="strategies">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Estratégias Nutricionais
                </CardTitle>
                <CardDescription>
                  Selecione uma estratégia para ver detalhes e recomendações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dietPlans.map((plan) => (
                    <Button
                      key={plan.id}
                      variant={selectedDietPlan === plan.id ? "default" : "outline"}
                      className={cn(
                        "w-full justify-start text-left",
                        selectedDietPlan === plan.id && theme === 'vibrant' && "bg-primary/80"
                      )}
                      onClick={() => setSelectedDietPlan(plan.id)}
                    >
                      <div className="mr-2">
                        {plan.id === 'cutting' && <Minus className="w-4 h-4" />}
                        {plan.id === 'maintenance' && <Activity className="w-4 h-4" />}
                        {plan.id === 'bulking' && <Plus className="w-4 h-4" />}
                        {plan.id === 'carb-cycling' && <ArrowUpDown className="w-4 h-4" />}
                        {plan.id === 'peak-week' && <Zap className="w-4 h-4" />}
                      </div>
                      {plan.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedDietPlan ? (
              <Card className="md:col-span-2">
                {dietPlans.filter(p => p.id === selectedDietPlan).map((plan) => (
                  <React.Fragment key={plan.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {plan.id === 'cutting' && <Minus className="w-5 h-5 text-primary" />}
                            {plan.id === 'maintenance' && <Activity className="w-5 h-5 text-primary" />}
                            {plan.id === 'bulking' && <Plus className="w-5 h-5 text-primary" />}
                            {plan.id === 'carb-cycling' && <ArrowUpDown className="w-5 h-5 text-primary" />}
                            {plan.id === 'peak-week' && <Zap className="w-5 h-5 text-primary" />}
                            {plan.name}
                          </CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </div>
                        <div className={cn(
                          "p-2 rounded-full",
                          plan.id === 'cutting' && (theme === 'light' ? "bg-blue-100" : "bg-blue-500/20"),
                          plan.id === 'maintenance' && (theme === 'light' ? "bg-emerald-100" : "bg-emerald-500/20"),
                          plan.id === 'bulking' && (theme === 'light' ? "bg-amber-100" : "bg-amber-500/20"),
                          plan.id === 'carb-cycling' && (theme === 'light' ? "bg-indigo-100" : "bg-indigo-500/20"),
                          plan.id === 'peak-week' && (theme === 'light' ? "bg-purple-100" : "bg-purple-500/20")
                        )}>
                          {plan.id === 'cutting' && <Minus className="w-5 h-5 text-blue-500" />}
                          {plan.id === 'maintenance' && <Activity className="w-5 h-5 text-emerald-500" />}
                          {plan.id === 'bulking' && <Plus className="w-5 h-5 text-amber-500" />}
                          {plan.id === 'carb-cycling' && <ArrowUpDown className="w-5 h-5 text-indigo-500" />}
                          {plan.id === 'peak-week' && <Zap className="w-5 h-5 text-purple-500" />}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className={cn(
                            "p-4 rounded-lg border",
                            theme === 'vibrant' && "bg-background/30"
                          )}>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                              Calorias
                            </h4>
                            <p className="font-medium">{plan.calories}</p>
                          </div>
                          
                          <div className={cn(
                            "p-4 rounded-lg border",
                            theme === 'vibrant' && "bg-background/30"
                          )}>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                              Refeições Recomendadas
                            </h4>
                            <p className="font-medium">{plan.meals} refeições por dia</p>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Distribuição de Macros</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className={cn(
                              "p-4 rounded-lg border flex flex-col",
                              theme === 'vibrant' ? "bg-red-500/10 border-red-500/30" : ""
                            )}>
                              <span className="text-sm text-muted-foreground">Proteínas</span>
                              <span className="text-lg font-bold mt-1">{plan.protein}</span>
                            </div>
                            
                            <div className={cn(
                              "p-4 rounded-lg border flex flex-col",
                              theme === 'vibrant' ? "bg-amber-500/10 border-amber-500/30" : ""
                            )}>
                              <span className="text-sm text-muted-foreground">Carboidratos</span>
                              <span className="text-lg font-bold mt-1">{plan.carbs}</span>
                            </div>
                            
                            <div className={cn(
                              "p-4 rounded-lg border flex flex-col",
                              theme === 'vibrant' ? "bg-blue-500/10 border-blue-500/30" : ""
                            )}>
                              <span className="text-sm text-muted-foreground">Gorduras</span>
                              <span className="text-lg font-bold mt-1">{plan.fats}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium mb-2">Recomendações</h3>
                          <div className={cn(
                            "rounded-lg border p-4",
                            theme === 'vibrant' && "bg-background/30"
                          )}>
                            <ul className="space-y-2">
                              {plan.notes.map((note, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                  </div>
                                  <span className="text-sm">{note}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </React.Fragment>
                ))}
              </Card>
            ) : (
              <Card className="md:col-span-2 flex flex-col items-center justify-center">
                <CardContent className="py-12 text-center">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Selecione uma estratégia</h3>
                  <p className="text-muted-foreground">
                    Escolha uma estratégia nutricional à esquerda para ver detalhes e recomendações
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Tab Ciclo de Carboidratos */}
        <TabsContent value="carb-cycling">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpDown className="w-5 h-5 text-primary" />
                  Ciclo de Carboidratos
                </CardTitle>
                <CardDescription>
                  Planejador de ciclo de carboidratos para otimizar desempenho e composição corporal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Selecione o tipo de dia:</Label>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant={carbCyclingDay === 'low' ? "default" : "outline"}
                        className={cn(
                          "justify-start",
                          carbCyclingDay === 'low' && theme === 'vibrant' && "bg-red-500/80"
                        )}
                        onClick={() => setCarbCyclingDay('low')}
                      >
                        <Minus className="w-4 h-4 mr-2" />
                        Baixo Carboidrato
                      </Button>
                      
                      <Button
                        variant={carbCyclingDay === 'medium' ? "default" : "outline"}
                        className={cn(
                          "justify-start",
                          carbCyclingDay === 'medium' && theme === 'vibrant' && "bg-amber-500/80"
                        )}
                        onClick={() => setCarbCyclingDay('medium')}
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        Médio Carboidrato
                      </Button>
                      
                      <Button
                        variant={carbCyclingDay === 'high' ? "default" : "outline"}
                        className={cn(
                          "justify-start",
                          carbCyclingDay === 'high' && theme === 'vibrant' && "bg-green-500/80"
                        )}
                        onClick={() => setCarbCyclingDay('high')}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Alto Carboidrato
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <h3 className="text-lg font-medium">Plano Semanal Recomendado</h3>
                    <div className={cn(
                      "p-4 rounded-lg border",
                      theme === 'vibrant' && "bg-background/30"
                    )}>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Segunda-feira</span>
                          <span className={cn(
                            "px-2 py-0.5 text-xs rounded-full",
                            theme === 'light' ? "bg-amber-100 text-amber-700" : "bg-amber-500/20 text-amber-400"
                          )}>
                            Médio Carbo
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Terça-feira</span>
                          <span className={cn(
                            "px-2 py-0.5 text-xs rounded-full",
                            theme === 'light' ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400"
                          )}>
                            Alto Carbo
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Quarta-feira</span>
                          <span className={cn(
                            "px-2 py-0.5 text-xs rounded-full",
                            theme === 'light' ? "bg-red-100 text-red-700" : "bg-red-500/20 text-red-400"
                          )}>
                            Baixo Carbo
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Quinta-feira</span>
                          <span className={cn(
                            "px-2 py-0.5 text-xs rounded-full",
                            theme === 'light' ? "bg-amber-100 text-amber-700" : "bg-amber-500/20 text-amber-400"
                          )}>
                            Médio Carbo
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Sexta-feira</span>
                          <span className={cn(
                            "px-2 py-0.5 text-xs rounded-full",
                            theme === 'light' ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400"
                          )}>
                            Alto Carbo
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Sábado</span>
                          <span className={cn(
                            "px-2 py-0.5 text-xs rounded-full",
                            theme === 'light' ? "bg-amber-100 text-amber-700" : "bg-amber-500/20 text-amber-400"
                          )}>
                            Médio Carbo
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Domingo</span>
                          <span className={cn(
                            "px-2 py-0.5 text-xs rounded-full",
                            theme === 'light' ? "bg-red-100 text-red-700" : "bg-red-500/20 text-red-400"
                          )}>
                            Baixo Carbo
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      Alinhe dias de alto carboidrato com treinos de alta intensidade, e dias de baixo carboidrato com descanso ou treinos leves.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {carbCyclingDay === 'low' && <Minus className="w-5 h-5 text-primary" />}
                      {carbCyclingDay === 'medium' && <Activity className="w-5 h-5 text-primary" />}
                      {carbCyclingDay === 'high' && <Plus className="w-5 h-5 text-primary" />}
                      Dia de {carbCyclingDay === 'low' ? 'Baixo' : carbCyclingDay === 'medium' ? 'Médio' : 'Alto'} Carboidrato
                    </CardTitle>
                    <CardDescription>
                      Recomendações para um dia de {carbCyclingDay === 'low' ? 'baixo' : carbCyclingDay === 'medium' ? 'médio' : 'alto'} consumo de carboidratos
                    </CardDescription>
                  </div>
                  <div className={cn(
                    "p-2 rounded-full",
                    carbCyclingDay === 'low' && (theme === 'light' ? "bg-red-100" : "bg-red-500/20"),
                    carbCyclingDay === 'medium' && (theme === 'light' ? "bg-amber-100" : "bg-amber-500/20"),
                    carbCyclingDay === 'high' && (theme === 'light' ? "bg-green-100" : "bg-green-500/20")
                  )}>
                    {carbCyclingDay === 'low' && <Minus className="w-5 h-5 text-red-500" />}
                    {carbCyclingDay === 'medium' && <Activity className="w-5 h-5 text-amber-500" />}
                    {carbCyclingDay === 'high' && <Plus className="w-5 h-5 text-green-500" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {carbCyclingDay === 'low' && (
                      <>
                        <div className={cn(
                          "p-4 rounded-lg border flex flex-col",
                          theme === 'vibrant' ? "bg-red-500/10 border-red-500/30" : ""
                        )}>
                          <span className="text-sm text-muted-foreground">Proteínas</span>
                          <span className="text-lg font-bold mt-1">2.2-2.5g/kg</span>
                          <span className="text-xs text-muted-foreground mt-2">
                            Alta - ~35-40% das calorias
                          </span>
                        </div>
                        
                        <div className={cn(
                          "p-4 rounded-lg border flex flex-col",
                          theme === 'vibrant' ? "bg-amber-500/10 border-amber-500/30" : ""
                        )}>
                          <span className="text-sm text-muted-foreground">Carboidratos</span>
                          <span className="text-lg font-bold mt-1">0.5-1g/kg</span>
                          <span className="text-xs text-muted-foreground mt-2">
                            Baixo - ~10-20% das calorias
                          </span>
                        </div>
                        
                        <div className={cn(
                          "p-4 rounded-lg border flex flex-col",
                          theme === 'vibrant' ? "bg-blue-500/10 border-blue-500/30" : ""
                        )}>
                          <span className="text-sm text-muted-foreground">Gorduras</span>
                          <span className="text-lg font-bold mt-1">1.1-1.5g/kg</span>
                          <span className="text-xs text-muted-foreground mt-2">
                            Alta - ~45-55% das calorias
                          </span>
                        </div>
                      </>
                    )}
                    
                    {carbCyclingDay === 'medium' && (
                      <>
                        <div className={cn(
                          "p-4 rounded-lg border flex flex-col",
                          theme === 'vibrant' ? "bg-red-500/10 border-red-500/30" : ""
                        )}>
                          <span className="text-sm text-muted-foreground">Proteínas</span>
                          <span className="text-lg font-bold mt-1">2.0-2.2g/kg</span>
                          <span className="text-xs text-muted-foreground mt-2">
                            Moderada/Alta - ~30-35% das calorias
                          </span>
                        </div>
                        
                        <div className={cn(
                          "p-4 rounded-lg border flex flex-col",
                          theme === 'vibrant' ? "bg-amber-500/10 border-amber-500/30" : ""
                        )}>
                          <span className="text-sm text-muted-foreground">Carboidratos</span>
                          <span className="text-lg font-bold mt-1">1-2g/kg</span>
                          <span className="text-xs text-muted-foreground mt-2">
                            Moderado - ~30-40% das calorias
                          </span>
                        </div>
                        
                        <div className={cn(
                          "p-4 rounded-lg border flex flex-col",
                          theme === 'vibrant' ? "bg-blue-500/10 border-blue-500/30" : ""
                        )}>
                          <span className="text-sm text-muted-foreground">Gorduras</span>
                          <span className="text-lg font-bold mt-1">0.8-1.1g/kg</span>
                          <span className="text-xs text-muted-foreground mt-2">
                            Moderada - ~30-35% das calorias
                          </span>
                        </div>
                      </>
                    )}
                    
                    {carbCyclingDay === 'high' && (
                      <>
                        <div className={cn(
                          "p-4 rounded-lg border flex flex-col",
                          theme === 'vibrant' ? "bg-red-500/10 border-red-500/30" : ""
                        )}>
                          <span className="text-sm text-muted-foreground">Proteínas</span>
                          <span className="text-lg font-bold mt-1">1.8-2.0g/kg</span>
                          <span className="text-xs text-muted-foreground mt-2">
                            Moderada - ~25-30% das calorias
                          </span>
                        </div>
                        
                        <div className={cn(
                          "p-4 rounded-lg border flex flex-col",
                          theme === 'vibrant' ? "bg-amber-500/10 border-amber-500/30" : ""
                        )}>
                          <span className="text-sm text-muted-foreground">Carboidratos</span>
                          <span className="text-lg font-bold mt-1">2-3g/kg</span>
                          <span className="text-xs text-muted-foreground mt-2">
                            Alto - ~50-60% das calorias
                          </span>
                        </div>
                        
                        <div className={cn(
                          "p-4 rounded-lg border flex flex-col",
                          theme === 'vibrant' ? "bg-blue-500/10 border-blue-500/30" : ""
                        )}>
                          <span className="text-sm text-muted-foreground">Gorduras</span>
                          <span className="text-lg font-bold mt-1">0.5-0.8g/kg</span>
                          <span className="text-xs text-muted-foreground mt-2">
                            Baixa - ~15-20% das calorias
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Recomendações do Dia</h3>
                    <div className={cn(
                      "rounded-lg border p-4",
                      theme === 'vibrant' && "bg-background/30"
                    )}>
                      {carbCyclingDay === 'low' && (
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              Ideal para dias de descanso ou treinos leves de baixa intensidade.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              Foque em proteínas magras e gorduras saudáveis (peixe, ovos, abacate, azeite).
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              Limite carboidratos a vegetais fibrosos e pequenas porções de frutas de baixo índice glicêmico.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              Se exercitar, concentre os carboidratos apenas ao redor do treino.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              Aumente a ingestão de água e eletrólitos para manter a hidratação.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              3-4 refeições com intervalos de 4-5 horas podem ajudar com a saciedade.
                            </span>
                          </li>
                        </ul>
                      )}
                      
                      {carbCyclingDay === 'medium' && (
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              Ideal para treinos moderados ou dias de transição entre alto e baixo carbo.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              Distribua os carboidratos ao longo do dia, com maior concentração antes e depois do treino.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              Inclua carboidratos complexos como aveia, batata doce, arroz integral e quinoa.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              Mantenha um equilíbrio entre todos os macronutrientes em suas refeições.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              4-5 refeições distribuídas permite um bom aproveitamento dos nutrientes.
                            </span>
                          </li>
                        </ul>
                      )}
                      
                      {carbCyclingDay === 'high' && (
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              Ideal para dias de treinos intensos (pernas, costas ou treino composto).
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              Concentre mais carboidratos antes, durante e após o treino para máxima performance.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              Inclua carboidratos rápidos (banana, mel, sucos) no peri-treino para energia imediata.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              Reduza levemente as gorduras para compensar o aumento de carboidratos.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              5-6 refeições podem ajudar a distribuir melhor os carboidratos ao longo do dia.
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="p-1 mt-0.5 rounded-full bg-primary/10">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                            </div>
                            <span className="text-sm">
                              Aproveite este dia para recarregar os estoques de glicogênio muscular.
                            </span>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Exemplos de Alimentos Recomendados</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {carbCyclingDay === 'low' && (
                        <>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Proteínas</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1 text-sm">
                                <li>Frango/Peru sem pele</li>
                                <li>Peixe e frutos do mar</li>
                                <li>Cortes magros de carne</li>
                                <li>Claras de ovos</li>
                                <li>Tofu e tempeh</li>
                                <li>Whey protein isolado</li>
                              </ul>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Carboidratos</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1 text-sm">
                                <li>Vegetais folhosos</li>
                                <li>Brócolis, couve-flor</li>
                                <li>Pepino, abobrinha</li>
                                <li>Berries (em pequena quantidade)</li>
                                <li>Abacate (fonte também de gordura)</li>
                              </ul>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Gorduras</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1 text-sm">
                                <li>Azeite de oliva</li>
                                <li>Abacate</li>
                                <li>Ovos inteiros</li>
                                <li>Castanhas e sementes</li>
                                <li>Óleo de coco</li>
                                <li>Manteiga ghee</li>
                              </ul>
                            </CardContent>
                          </Card>
                        </>
                      )}
                      
                      {carbCyclingDay === 'medium' && (
                        <>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Proteínas</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1 text-sm">
                                <li>Peito de frango/peru</li>
                                <li>Peixe (atum, salmão)</li>
                                <li>Carne magra</li>
                                <li>Ovos</li>
                                <li>Queijos com baixo teor de gordura</li>
                                <li>Whey protein</li>
                              </ul>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Carboidratos</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1 text-sm">
                                <li>Batata doce</li>
                                <li>Arroz integral</li>
                                <li>Aveia</li>
                                <li>Frutas (maçã, banana)</li>
                                <li>Legumes variados</li>
                                <li>Pão integral (moderadamente)</li>
                              </ul>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Gorduras</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1 text-sm">
                                <li>Azeite de oliva (moderado)</li>
                                <li>Abacate (pequenas porções)</li>
                                <li>Oleaginosas (amêndoas, nozes)</li>
                                <li>Sementes de chia/linhaça</li>
                                <li>Óleo de peixe (suplemento)</li>
                              </ul>
                            </CardContent>
                          </Card>
                        </>
                      )}
                      
                      {carbCyclingDay === 'high' && (
                        <>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Proteínas</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1 text-sm">
                                <li>Frango/Peru</li>
                                <li>Carne vermelha (porções moderadas)</li>
                                <li>Ovo inteiro</li>
                                <li>Peixe</li>
                                <li>Whey protein</li>
                                <li>Iogurte grego</li>
                              </ul>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Carboidratos</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1 text-sm">
                                <li>Batata, batata doce</li>
                                <li>Arroz branco/integral</li>
                                <li>Massa</li>
                                <li>Pão</li>
                                <li>Cereais integrais</li>
                                <li>Frutas (banana, manga)</li>
                                <li>Mel, dextrose (peri-treino)</li>
                              </ul>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Gorduras</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-1 text-sm">
                                <li>Azeite (pequenas quantidades)</li>
                                <li>Oleaginosas (porções limitadas)</li>
                                <li>Gorduras naturalmente presentes nas carnes</li>
                                <li>Óleo de peixe (suplemento)</li>
                              </ul>
                            </CardContent>
                          </Card>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
