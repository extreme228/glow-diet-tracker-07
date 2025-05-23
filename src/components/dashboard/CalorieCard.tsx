
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
      
      <Progress 
        value={caloriePercentage} 
        className={cn(
          "h-2.5",
          theme === 'light' ? "bg-gray-100" : "bg-muted",
          "[&>div]:transition-all"
        )}
      />
      
      <style jsx>{`
        .Progress > div {
          ${theme === 'vibrant' 
            ? caloriePercentage > 100 
              ? "background: #FF6B6B; box-shadow: 0 0 15px 2px rgba(255, 107, 107, 0.4);" 
              : "background: linear-gradient(to right, #00ff9d, #00c3ff); box-shadow: 0 0 20px 2px rgba(0, 255, 157, 0.6);"
            : theme === 'light'
              ? caloriePercentage > 100 
                ? "background: #FF6B6B;" 
                : "background: linear-gradient(to right, #2CDA9D, #22A2E0);"
              : caloriePercentage > 100 
                ? "background: #FF6B6B; box-shadow: 0 0 15px 2px rgba(255, 107, 107, 0.4);" 
                : "background: linear-gradient(to right, #2CDA9D, #22A2E0); box-shadow: 0 0 15px 2px rgba(44, 218, 157, 0.4);"
          }
        }
      `}</style>
    </div>
  );
};
