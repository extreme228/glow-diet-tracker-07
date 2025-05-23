
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
  
  // Definindo as cores do progresso baseado no tema
  const getProgressStyles = () => {
    if (theme === 'vibrant') {
      return caloriePercentage > 100 
        ? "bg-red-500 shadow-[0_0_15px_2px_rgba(255,107,107,0.4)]" 
        : "bg-gradient-to-r from-[#00ff9d] to-[#00c3ff] shadow-[0_0_20px_2px_rgba(0,255,157,0.6)]";
    } else if (theme === 'light') {
      return caloriePercentage > 100 
        ? "bg-red-500" 
        : "bg-gradient-to-r from-emerald-500 to-blue-500";
    } else {
      return caloriePercentage > 100 
        ? "bg-red-500 shadow-[0_0_15px_2px_rgba(255,107,107,0.4)]" 
        : "bg-gradient-to-r from-emerald-500 to-blue-500 shadow-[0_0_15px_2px_rgba(52,211,153,0.4)]";
    }
  };
  
  return (
    <div className={cn(
      "p-5 mb-5 animate-float rounded-xl shadow-lg relative overflow-hidden",
      theme === 'light' 
        ? "bg-white border border-gray-200" 
        : theme === 'vibrant'
          ? "glow-card bg-nutritrack-vibrant-card border-nutritrack-vibrant-green/20" 
          : "glow-card"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={cn(
            "text-lg font-semibold", 
            theme === 'light' ? "text-gray-800" : "text-foreground"
          )}>Calorias</h3>
          <p className="text-sm text-muted-foreground">Meta Diária</p>
        </div>
        <div className="text-right">
          <p className={cn(
            "text-2xl font-bold",
            theme === 'light' ? "text-gray-800" : "text-white"
          )}>
            {dailyNutrition.calories} <span className="text-xs text-muted-foreground">/ {dailyGoal.calories}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {caloriesRemaining > 0 
              ? `${caloriesRemaining} restantes` 
              : `${Math.abs(caloriesRemaining)} excedidas`}
          </p>
        </div>
      </div>
      
      <div className="relative">
        <div className={cn(
          "h-2.5 rounded-full overflow-hidden",
          theme === 'light' ? "bg-gray-100" : "bg-muted"
        )}>
          <div 
            className={cn(
              "h-full transition-all duration-300 rounded-full",
              getProgressStyles()
            )}
            style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
