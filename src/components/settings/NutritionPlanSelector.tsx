
import React from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { useTheme } from '@/context/ThemeContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const NutritionPlanSelector = () => {
  const { nutritionPlans, activePlanId, setActivePlan } = useNutrition();
  const { theme } = useTheme();
  
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Escolha um plano nutricional criado na guia Avançados para ser usado como meta em vez das configurações padrão.
      </p>
      
      <Select
        value={activePlanId || "default"}
        onValueChange={(value) => setActivePlan(value === "default" ? null : value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione um plano nutricional" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Padrão (Configurações Gerais)</SelectItem>
          {nutritionPlans.map(plan => (
            <SelectItem key={plan.id} value={plan.id}>
              {plan.name} - {plan.category === 'carb-cycling' ? 'Ciclo de Carboidratos' : 
                           plan.category === 'bulking' ? 'Bulking' :
                           plan.category === 'cutting' ? 'Cutting' :
                           plan.category === 'maintenance' ? 'Manutenção' : 'Personalizado'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {activePlanId && (
        <div className="mt-2 p-3 rounded-lg bg-muted/50 text-sm">
          <p className="font-medium text-card-foreground">
            Plano ativo: {nutritionPlans.find(p => p.id === activePlanId)?.name}
          </p>
          <p className="text-muted-foreground">
            {nutritionPlans.find(p => p.id === activePlanId)?.type === 'weekly' 
              ? 'Este plano usa valores diferentes para cada dia da semana.'
              : 'Este plano usa os mesmos valores para todos os dias.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NutritionPlanSelector;
