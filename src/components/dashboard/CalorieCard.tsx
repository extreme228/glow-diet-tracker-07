
import React from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { Flame, Target, TrendingUp } from 'lucide-react';

interface CalorieCardProps {
  date: string;
}

export const CalorieCard: React.FC<CalorieCardProps> = ({ date }) => {
  const { getDailyNutrition, dailyGoal, getActivePlanGoals } = useNutrition();
  const { theme } = useTheme();
  const dailyNutrition = getDailyNutrition(date);
  
  // Usar metas do plano ativo para a data específica ou as metas padrão
  const activePlanGoals = getActivePlanGoals(date);
  const targetGoals = activePlanGoals || dailyGoal;
  
  const caloriePercentage = Math.min(Math.round((dailyNutrition.calories / targetGoals.calories) * 100), 100);
  const caloriesRemaining = targetGoals.calories - dailyNutrition.calories;
  
  const getProgressStyles = () => {
    if (theme === 'vibrant') {
      return caloriePercentage > 100 
        ? "bg-destructive shadow-glow-coral" 
        : "bg-gradient-to-r from-primary to-accent shadow-glow-vibrant";
    } else if (theme === 'light') {
      return caloriePercentage > 100 
        ? "bg-destructive" 
        : "bg-gradient-to-r from-primary to-blue-500";
    } else {
      return caloriePercentage > 100 
        ? "bg-destructive shadow-glow-coral" 
        : "bg-gradient-to-r from-primary to-blue-500 shadow-glow-green";
    }
  };
  
  return (
    <div className={cn(
      "glow-card p-6 animate-float transition-all duration-300 hover:scale-[1.01]",
      theme === 'vibrant' && "hover:shadow-glow-vibrant/20"
    )}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            theme === 'light' ? "bg-orange-100" : "bg-orange-500/20"
          )}>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Calorias</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Target className="w-3 h-3" />
              <span>Meta Diária</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-card-foreground">
              {dailyNutrition.calories}
            </span>
            <span className="text-sm text-muted-foreground">/ {targetGoals.calories}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-3 h-3" />
            <span className={cn(
              caloriesRemaining > 0 ? "text-muted-foreground" : "text-destructive"
            )}>
              {caloriesRemaining > 0 
                ? `${caloriesRemaining} restantes` 
                : `${Math.abs(caloriesRemaining)} excedidas`}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium text-card-foreground">{caloriePercentage}%</span>
        </div>
        <div className="relative">
          <div className={cn(
            "h-3 rounded-full overflow-hidden",
            theme === 'light' ? "bg-gray-100" : "bg-secondary"
          )}>
            <div 
              className={cn(
                "h-full transition-all duration-500 rounded-full relative overflow-hidden",
                getProgressStyles()
              )}
              style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
            >
              {theme === 'vibrant' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
