
import React, { useEffect, useState } from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { useTheme } from '@/context/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Calendar, InfoIcon, ListChecks, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const NutritionPlanSelector = () => {
  const { nutritionPlans, activePlanId, setActivePlan } = useNutrition();
  const { theme } = useTheme();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    console.log('NutritionPlanSelector - Nutrition Plans:', nutritionPlans);
    console.log('NutritionPlanSelector - Plans length:', nutritionPlans?.length);
    console.log('NutritionPlanSelector - Active Plan ID:', activePlanId);
    
    // Verificar todas as chaves do localStorage que contêm "plan"
    const allKeys = Object.keys(localStorage).filter(key => 
      key.toLowerCase().includes('plan') || 
      key.toLowerCase().includes('nutri')
    );
    console.log('NutritionPlanSelector - All plan-related localStorage keys:', allKeys);
    
    // Verificar especificamente a chave que aparece nos logs
    const customPlans = localStorage.getItem('nutritionCustomPlans');
    console.log('NutritionPlanSelector - nutritionCustomPlans content:', customPlans);
  }, [nutritionPlans, activePlanId]);
  
  // Função para traduzir a categoria do plano para português
  const getPlanCategoryLabel = (category?: string) => {
    switch(category) {
      case 'bulking': return 'Bulking';
      case 'cutting': return 'Cutting';
      case 'carb-cycling': return 'Ciclo de Carboidratos';
      case 'maintenance': return 'Manutenção';
      case 'peak-week': return 'Semana de Pico';
      default: return 'Personalizado';
    }
  };
  
  // Função para traduzir o tipo do plano
  const getPlanTypeLabel = (type?: string) => {
    return type === 'weekly' ? 'Semanal' : 'Diário';
  };

  // Encontre o plano ativo
  const activePlan = nutritionPlans.find(p => p.id === activePlanId);

  // Verifique se há algum plano disponível
  const hasPlans = nutritionPlans && nutritionPlans.length > 0;
  
  // Função para sincronizar planos - agora procura especificamente por nutritionCustomPlans
  const syncPlans = () => {
    setIsLoading(true);
    console.log('Sincronizando planos...');
    
    setTimeout(() => {
      // Verificar a chave específica que aparece nos logs
      const customPlansData = localStorage.getItem('nutritionCustomPlans');
      console.log('Raw nutritionCustomPlans data:', customPlansData);
      
      let foundPlans = [];
      
      if (customPlansData && customPlansData !== '[]' && customPlansData !== 'null') {
        try {
          const parsed = JSON.parse(customPlansData);
          console.log('Parsed nutritionCustomPlans:', parsed);
          
          if (Array.isArray(parsed) && parsed.length > 0) {
            foundPlans = parsed;
            console.log('Found plans in nutritionCustomPlans:', foundPlans);
            
            // Migrar para a chave correta do contexto
            localStorage.setItem('nutritrack_nutrition_plans', JSON.stringify(foundPlans));
            console.log('Plans migrated to nutritrack_nutrition_plans');
            
            toast({
              title: `${foundPlans.length} planos encontrados e sincronizados`,
              description: "Recarregando a página para aplicar as mudanças...",
            });
            
            // Recarregar a página para forçar o contexto a ler os novos dados
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.log('Erro ao parsear nutritionCustomPlans:', e);
        }
      }
      
      // Se não encontrou planos na chave principal, verificar outras chaves
      const possibleKeys = [
        'nutritrack_nutrition_plans',
        'nutrition_plans',
        'plans',
        'customPlans'
      ];
      
      for (const key of possibleKeys) {
        const stored = localStorage.getItem(key);
        if (stored && stored !== '[]' && stored !== 'null') {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              foundPlans = parsed;
              console.log(`Found plans in ${key}:`, parsed);
              break;
            }
          } catch (e) {
            console.log(`Erro ao parsear planos da chave ${key}:`, e);
          }
        }
      }
      
      console.log('Total plans found:', foundPlans.length);
      
      toast({
        title: foundPlans.length > 0
          ? `${foundPlans.length} planos encontrados`
          : "Nenhum plano encontrado",
        description: foundPlans.length > 0
          ? "Planos sincronizados com sucesso."
          : "Visite a aba Avançados para criar novos planos.",
      });
      
      setIsLoading(false);
    }, 600);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Escolha um plano nutricional criado na guia Avançados para ser usado como meta em vez das configurações padrão.
        </p>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={syncPlans}
          disabled={isLoading}
          className={cn(
            "flex items-center gap-1",
            theme === 'vibrant' && "hover:border-primary hover:text-primary"
          )}
        >
          <RefreshCw className={cn(
            "w-3.5 h-3.5",
            isLoading && "animate-spin"
          )} />
          <span>Sincronizar</span>
        </Button>
      </div>
      
      {!hasPlans ? (
        <div className={cn(
          "px-4 py-3 rounded-lg text-sm",
          theme === 'light' 
            ? "bg-amber-50 text-amber-700 border border-amber-200" 
            : "bg-amber-950/30 text-amber-400 border border-amber-900/50"
        )}>
          <div className="flex items-start gap-2">
            <InfoIcon className="w-4 h-4 mt-0.5" />
            <p>
              Você ainda não criou nenhum plano nutricional. Visite a aba "Avançados" para criar planos personalizados.
            </p>
          </div>
        </div>
      ) : (
        <Select
          value={activePlanId || "default"}
          onValueChange={(value) => setActivePlan(value === "default" ? null : value)}
        >
          <SelectTrigger className={cn(
            "w-full transition-all",
            theme === 'vibrant' && "hover:border-primary focus:border-primary focus:ring-primary/20"
          )}>
            <SelectValue placeholder="Selecione um plano nutricional" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Padrão (Configurações Gerais)</SelectItem>
            {nutritionPlans.map(plan => (
              <SelectItem key={plan.id} value={plan.id}>
                {plan.name} - {getPlanCategoryLabel(plan.category)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      {activePlanId && activePlan && (
        <div className={cn(
          "mt-4 p-4 rounded-lg space-y-3",
          theme === 'light' 
            ? "bg-blue-50 border border-blue-100" 
            : "bg-blue-950/30 border border-blue-900/50"
        )}>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <ListChecks className="w-4 h-4" />
            <h4 className="font-semibold">Plano Ativo: {activePlan.name}</h4>
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Tipo:</span>
              <span className="font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {getPlanTypeLabel(activePlan.type)}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Categoria:</span>
              <span className="font-medium">{getPlanCategoryLabel(activePlan.category)}</span>
            </div>
            
            {activePlan.type === 'weekly' && (
              <div className={cn(
                "p-3 rounded-md text-sm mt-1",
                theme === 'light' ? "bg-amber-50" : "bg-amber-950/30"
              )}>
                <div className="flex items-start gap-2">
                  <InfoIcon className="w-4 h-4 text-amber-500 mt-0.5" />
                  <p className="text-xs">
                    Este plano tem valores diferentes para cada dia da semana.
                    O dia da semana será identificado automaticamente para aplicar as metas corretas.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionPlanSelector;
