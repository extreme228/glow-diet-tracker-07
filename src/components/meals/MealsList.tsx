
import React from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { Link } from 'react-router-dom';
import { Plus, Clock, Utensils, ChevronRight, Coffee, Sun, Sunset, Moon, TrendingUp } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface MealsListProps {
  date: string;
}

const getMealIcon = (time: string) => {
  const hour = parseInt(time.split(':')[0]);
  
  if (hour >= 5 && hour < 10) return Coffee;
  if (hour >= 10 && hour < 15) return Sun;
  if (hour >= 15 && hour < 20) return Sunset;
  return Moon;
};

const getMealPeriod = (time: string) => {
  const hour = parseInt(time.split(':')[0]);
  
  if (hour >= 5 && hour < 10) return { name: 'Café da Manhã', color: 'text-amber-500 bg-amber-500/20' };
  if (hour >= 10 && hour < 15) return { name: 'Almoço', color: 'text-blue-500 bg-blue-500/20' };
  if (hour >= 15 && hour < 20) return { name: 'Lanche', color: 'text-purple-500 bg-purple-500/20' };
  return { name: 'Jantar', color: 'text-indigo-500 bg-indigo-500/20' };
};

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

  const totalCalories = meals.reduce((total, meal) => {
    const nutrition = calculateMealNutrition(meal.id);
    return total + nutrition.calories;
  }, 0);

  const getCardStyles = () => {
    if (theme === 'vibrant') {
      return "bg-gray-900/60 border-purple-500/30 backdrop-blur-xl";
    }
    return theme === 'light' ? "bg-white border-gray-200" : "bg-gray-800/50 border-gray-700/50";
  };

  return (
    <div className={cn(
      "p-6 rounded-xl border transition-all duration-300",
      getCardStyles()
    )}>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            theme === 'light' ? "bg-green-100" : "bg-green-500/20"
          )}>
            <Utensils className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Refeições do Dia</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="w-3 h-3" />
              <span>{totalCalories} kcal consumidas</span>
            </div>
          </div>
        </div>
        <Link to={`/add-meal?date=${date}`}>
          <Button 
            variant="outline" 
            size="sm" 
            className={cn(
              "flex items-center gap-2 transition-all duration-200 hover:scale-105",
              theme === 'vibrant' && "hover:border-emerald-500/50 hover:bg-emerald-500/10"
            )}
          >
            <Plus size={16} />
            <span>Adicionar</span>
          </Button>
        </Link>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-16">
          <div className={cn(
            "w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center",
            theme === 'light' ? "bg-gray-100" : "bg-secondary"
          )}>
            <Utensils className="w-10 h-10 text-muted-foreground" />
          </div>
          <h4 className="text-lg font-semibold mb-2">Nenhuma refeição registrada</h4>
          <p className="text-muted-foreground mb-4">
            Comece registrando sua primeira refeição do dia
          </p>
          <Link to={`/add-meal?date=${date}`}>
            <Button className={cn(
              "flex items-center gap-2",
              theme === 'vibrant' && "bg-gradient-to-r from-emerald-500 to-blue-500 hover:shadow-glow-vibrant"
            )}>
              <Plus size={16} />
              Adicionar Refeição
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {meals
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((meal) => {
              const nutrition = calculateMealNutrition(meal.id);
              const period = getMealPeriod(meal.time);
              const MealIcon = getMealIcon(meal.time);
              
              return (
                <Link
                  key={meal.id}
                  to={`/edit-meal/${meal.id}`}
                  className={cn(
                    "block p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] group relative overflow-hidden",
                    theme === 'light' 
                      ? "bg-gray-50 border-gray-200 hover:bg-gray-100 hover:shadow-md" 
                      : "bg-secondary/30 border-border hover:bg-secondary/50",
                    theme === 'vibrant' && "hover:border-emerald-500/50 hover:shadow-glow-vibrant/20"
                  )}
                >
                  {theme === 'vibrant' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
                            period.color
                          )}>
                            <MealIcon className="w-3 h-3" />
                            <span>{period.name}</span>
                          </div>
                          
                          <div className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full text-xs",
                            theme === 'light' 
                              ? "bg-blue-100 text-blue-600" 
                              : "bg-blue-500/20 text-blue-400"
                          )}>
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(meal.time)}</span>
                          </div>
                        </div>
                        
                        <h4 className="font-semibold text-lg text-card-foreground mb-2">{meal.name}</h4>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <Utensils className="w-4 h-4" />
                          <span>{meal.items.length} {meal.items.length === 1 ? 'alimento' : 'alimentos'}</span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            {nutrition.calories} kcal
                          </Badge>
                          <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            P: {nutrition.protein}g
                          </Badge>
                          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            C: {nutrition.carbs}g
                          </Badge>
                          <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            G: {nutrition.fat}g
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-card-foreground">
                            {nutrition.calories}
                          </div>
                          <div className="text-xs text-muted-foreground">kcal</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-card-foreground transition-colors" />
                      </div>
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
