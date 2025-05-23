
import React from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { Link } from 'react-router-dom';
import { Plus, Clock, Utensils, ChevronRight } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface MealsListProps {
  date: string;
}

export const MealsList: React.FC<MealsListProps> = ({ date }) => {
  const { getMealsForDate, getFood } = useNutrition();
  const { theme } = useTheme();
  const meals = getMealsForDate(date);

  const calculateMealNutrition = (mealId: string) => {
    const meal = meals.find((m) => m.id === mealId);
    if (!meal) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

    return meal.items.reduce(
      (acc, item) => {
        const food = getFood(item.foodId);
        if (food) {
          const multiplier = item.quantity / 100;
          acc.calories += Math.round(food.calories * multiplier);
          acc.protein += Math.round(food.protein * multiplier);
          acc.carbs += Math.round(food.carbs * multiplier);
          acc.fat += Math.round(food.fat * multiplier);
        }
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  return (
    <div className={cn(
      "glow-card p-6 transition-all duration-300 hover:scale-[1.01]",
      theme === 'vibrant' && "hover:shadow-glow-vibrant/20"
    )}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            theme === 'light' ? "bg-green-100" : "bg-green-500/20"
          )}>
            <Utensils className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-card-foreground">Refeições de Hoje</h3>
        </div>
        <Link to={`/add-meal?date=${date}`}>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "flex items-center gap-2 transition-all duration-200 hover:scale-105",
              theme === 'vibrant' && "hover:border-primary hover:bg-primary/10"
            )}
          >
            <Plus size={16} />
            <span>Adicionar</span>
          </Button>
        </Link>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-12">
          <div className={cn(
            "w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
            theme === 'light' ? "bg-gray-100" : "bg-secondary"
          )}>
            <Utensils className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-2">Nenhuma refeição registrada hoje</p>
          <p className="text-sm text-muted-foreground">Adicione sua primeira refeição</p>
        </div>
      ) : (
        <div className="space-y-3">
          {meals
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((meal) => {
              const nutrition = calculateMealNutrition(meal.id);
              return (
                <Link
                  key={meal.id}
                  to={`/edit-meal/${meal.id}`}
                  className={cn(
                    "block p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] group",
                    theme === 'light' 
                      ? "bg-gray-50 border-gray-200 hover:bg-gray-100" 
                      : "bg-secondary/50 border-border hover:bg-secondary/80",
                    theme === 'vibrant' && "hover:border-primary/50 hover:shadow-glow-vibrant/20"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={cn(
                          "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                          theme === 'light' 
                            ? "bg-blue-100 text-blue-600" 
                            : "bg-blue-500/20 text-blue-400"
                        )}>
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(meal.time)}</span>
                        </div>
                        <h4 className="font-medium text-card-foreground">{meal.name}</h4>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Utensils className="w-3 h-3" />
                        <span>{meal.items.length} {meal.items.length === 1 ? 'alimento' : 'alimentos'}</span>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <div>
                        <p className="font-semibold text-card-foreground">{nutrition.calories} kcal</p>
                        <div className="flex items-center justify-end gap-2 mt-1 text-xs text-muted-foreground">
                          <span>P: {nutrition.protein}g</span>
                          <span>C: {nutrition.carbs}g</span>
                          <span>G: {nutrition.fat}g</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-card-foreground transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
};
