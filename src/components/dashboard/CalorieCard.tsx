
import React from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { Progress } from '@/components/ui/progress';

interface CalorieCardProps {
  date: string;
}

export const CalorieCard: React.FC<CalorieCardProps> = ({ date }) => {
  const { getDailyNutrition, dailyGoal } = useNutrition();
  const dailyNutrition = getDailyNutrition(date);
  
  const caloriePercentage = Math.min(Math.round((dailyNutrition.calories / dailyGoal.calories) * 100), 100);
  const caloriesRemaining = dailyGoal.calories - dailyNutrition.calories;
  
  return (
    <div className="glow-card p-5 mb-5 animate-float">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Calorias</h3>
          <p className="text-sm text-gray-400">Meta Diária</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{dailyNutrition.calories} <span className="text-xs text-gray-400">/ {dailyGoal.calories}</span></p>
          <p className="text-sm text-gray-400">
            {caloriesRemaining > 0 
              ? `${caloriesRemaining} restantes` 
              : `${Math.abs(caloriesRemaining)} excedidas`}
          </p>
        </div>
      </div>
      
      <Progress 
        value={caloriePercentage} 
        className="h-2.5 bg-gray-700"
        indicatorClassName={cn(
          "transition-all",
          caloriePercentage > 100 
            ? "bg-nutritrack-coral shadow-glow-coral" 
            : "bg-gradient-to-r from-nutritrack-green to-nutritrack-blue shadow-glow-green"
        )}
      />
    </div>
  );
};

import { cn } from '@/lib/utils';
