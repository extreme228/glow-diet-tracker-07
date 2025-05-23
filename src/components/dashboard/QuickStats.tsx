
import React, { useState } from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { Activity, Flame, Target, TrendingUp, Clock, Award, ListChecks, Settings } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuickStatsProps {
  date: string;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ date }) => {
  const { getDailyNutrition, dailyGoal, getMealsForDate, getActivePlanGoals, activePlanId, nutritionPlans, setActivePlan } = useNutrition();
  const { theme } = useTheme();
  const dailyNutrition = getDailyNutrition(date);
  const meals = getMealsForDate(date);
  
  // Obter metas do plano ativo para a data específica ou usar as metas padrão
  const activePlanGoals = getActivePlanGoals(date);
  const targetGoals = activePlanGoals || dailyGoal;
  
  const caloriePercentage = Math.round((dailyNutrition.calories / targetGoals.calories) * 100);
  const proteinPercentage = Math.round((dailyNutrition.protein / targetGoals.protein) * 100);
  
  const lastMealTime = meals.length > 0 
    ? meals.sort((a, b) => b.time.localeCompare(a.time))[0].time
    : null;
    
  const activePlan = activePlanId ? nutritionPlans.find(p => p.id === activePlanId) : null;
  const usingActivePlan = activePlanGoals !== null;

  const stats = [
    {
      icon: Flame,
      label: 'Calorias',
      value: dailyNutrition.calories,
      target: targetGoals.calories,
      percentage: caloriePercentage,
      color: 'text-orange-500',
      bgColor: theme === 'light' ? 'bg-orange-100' : 'bg-orange-500/20',
      unit: 'kcal',
      config: true // Indica que este stat deve ter o botão de configuração
    },
    {
      icon: Activity,
      label: 'Proteína',
      value: dailyNutrition.protein,
      target: targetGoals.protein,
      percentage: proteinPercentage,
      color: 'text-emerald-500',
      bgColor: theme === 'light' ? 'bg-emerald-100' : 'bg-emerald-500/20',
      unit: 'g'
    },
    {
      icon: Target,
      label: 'Meta Atingida',
      value: caloriePercentage,
      target: 100,
      percentage: caloriePercentage,
      color: caloriePercentage >= 100 ? 'text-emerald-500' : 'text-amber-500',
      bgColor: caloriePercentage >= 100 
        ? (theme === 'light' ? 'bg-emerald-100' : 'bg-emerald-500/20')
        : (theme === 'light' ? 'bg-amber-100' : 'bg-amber-500/20'),
      unit: '%'
    },
    {
      icon: Clock,
      label: 'Refeições',
      value: meals.length,
      target: 4,
      percentage: Math.round((meals.length / 4) * 100),
      color: 'text-blue-500',
      bgColor: theme === 'light' ? 'bg-blue-100' : 'bg-blue-500/20',
      unit: meals.length === 1 ? 'refeição' : 'refeições'
    }
  ];

  const getCardStyles = () => {
    if (theme === 'vibrant') {
      return "bg-gray-900/60 border-purple-500/30 backdrop-blur-xl";
    }
    return theme === 'light' ? "bg-white border-gray-200" : "bg-gray-800/50 border-gray-700/50";
  };

  return (
    <div className="space-y-3">
      {usingActivePlan && (
        <div className={cn(
          "flex items-center justify-between p-3 rounded-lg text-sm", 
          theme === 'light' ? 'bg-amber-50 text-amber-700' : 'bg-amber-900/20 text-amber-400'
        )}>
          <div className="flex items-center gap-2">
            <ListChecks className="w-4 h-4" />
            <span className="font-medium">
              Plano ativo: {activePlan?.name}
            </span>
          </div>
          {activePlan?.type === 'weekly' && (
            <div className="text-xs">
              Usando metas para {new Date(date).toLocaleDateString('pt-BR', {weekday: 'long'})}
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              "p-4 rounded-xl border transition-all duration-300 hover:scale-105 relative overflow-hidden",
              getCardStyles()
            )}
          >
            {theme === 'vibrant' && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-50" />
            )}
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
                <div className="flex items-center gap-2">
                  {stat.percentage >= 100 && stat.label !== 'Meta Atingida' && (
                    <Award className="w-4 h-4 text-amber-500" />
                  )}
                  {stat.config && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className={cn(
                          "p-1 rounded-md hover:bg-muted",
                          theme === 'vibrant' && "hover:bg-purple-500/20"
                        )}>
                          <Settings className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-72" 
                        align="end"
                        sideOffset={5}
                      >
                        <div className="space-y-4">
                          <h4 className="font-medium text-sm">Fonte dos dados nutricionais</h4>
                          <p className="text-xs text-muted-foreground">
                            Escolha de onde puxar suas metas nutricionais
                          </p>
                          <RadioGroup 
                            defaultValue={activePlanId || "default"} 
                            onValueChange={(value) => setActivePlan(value === "default" ? null : value)}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="default" id="default" />
                              <Label htmlFor="default">Padrão (Configurações)</Label>
                            </div>
                            
                            {nutritionPlans.map(plan => (
                              <div key={plan.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={plan.id} id={plan.id} />
                                <Label htmlFor={plan.id}>
                                  {plan.name}
                                  <span className="ml-1 text-xs text-muted-foreground">
                                    ({plan.category === 'bulking' ? 'Bulking' : 
                                     plan.category === 'cutting' ? 'Cutting' : 
                                     plan.category === 'carb-cycling' ? 'Ciclo de Carboidratos' : 
                                     plan.category === 'maintenance' ? 'Manutenção' : 'Personalizado'})
                                  </span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-card-foreground">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {stat.unit}
                  </span>
                </div>
                
                {stat.label !== 'Meta Atingida' && (
                  <div className="flex items-center gap-2 text-xs">
                    <div className={cn(
                      "h-1.5 rounded-full flex-1",
                      theme === 'light' ? "bg-gray-200" : "bg-gray-700"
                    )}>
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          stat.percentage >= 100 ? "bg-emerald-500" : "bg-gradient-to-r from-blue-500 to-purple-500"
                        )}
                        style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                      />
                    </div>
                    <span className={cn(
                      "font-medium",
                      stat.percentage >= 100 ? "text-emerald-500" : "text-muted-foreground"
                    )}>
                      {stat.percentage}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
