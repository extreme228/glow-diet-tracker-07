
import React from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface CalorieCardProps {
  date: string;
}

export const CalorieCard: React.FC<CalorieCardProps> = ({ date }) => {
  const { getDailyNutrition, dailyGoal } = useNutrition();
  const { theme } = useTheme();
  const dailyNutrition = getDailyNutrition(date);
  
  const caloriePercentage = Math.min(Math.round((dailyNutrition.calories / dailyGoal.calories) * 100), 100);
  const caloriesRemaining = dailyGoal.calories - dailyNutrition.calories;
  
  return (
    <div className="glow-card p-5 mb-5 animate-float">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Calorias</h3>
          <p className="text-sm text-muted-foreground">Meta Diária</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{dailyNutrition.calories} <span className="text-xs text-muted-foreground">/ {dailyGoal.calories}</span></p>
          <p className="text-sm text-muted-foreground">
            {caloriesRemaining > 0 
              ? `${caloriesRemaining} restantes` 
              : `${Math.abs(caloriesRemaining)} excedidas`}
          </p>
        </div>
      </div>
      
      <Progress 
        value={caloriePercentage} 
        className={cn(
          "h-2.5 bg-muted",
          "[&>div]:transition-all",
          theme === 'vibrant' 
            ? caloriePercentage > 100 
              ? "[&>div]:bg-nutritrack-coral [&>div]:shadow-glow-vibrant" 
              : "[&>div]:bg-gradient-to-r [&>div]:from-nutritrack-vibrant-green [&>div]:to-nutritrack-vibrant-blue [&>div]:shadow-glow-vibrant"
            : caloriePercentage > 100 
              ? "[&>div]:bg-nutritrack-coral [&>div]:shadow-glow-coral" 
              : "[&>div]:bg-gradient-to-r [&>div]:from-nutritrack-green [&>div]:to-nutritrack-blue [&>div]:shadow-glow-green"
        )}
      />
    </div>
  );
};
