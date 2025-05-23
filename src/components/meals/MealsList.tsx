
import React from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MealsListProps {
  date: string;
}

export const MealsList: React.FC<MealsListProps> = ({ date }) => {
  const { getMealsForDate, getFood } = useNutrition();
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
    <div className="glow-card p-5 mb-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Refeições de Hoje</h3>
        <Link to={`/add-meal?date=${date}`}>
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-nutritrack-blue/10 border-nutritrack-blue/20 hover:bg-nutritrack-blue/20 text-nutritrack-blue hover:text-white">
            <Plus size={16} />
            <span>Adicionar</span>
          </Button>
        </Link>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma refeição registrada hoje</p>
          <p className="text-sm mt-2">Adicione sua primeira refeição</p>
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
                  className="block bg-nutritrack-card/50 rounded-lg p-3 border border-white/5 hover:border-nutritrack-green/30 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-nutritrack-blue/20 text-nutritrack-blue rounded-full">
                          {formatTime(meal.time)}
                        </span>
                        <h4 className="font-medium">{meal.name}</h4>
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        {meal.items.length} {meal.items.length === 1 ? 'alimento' : 'alimentos'}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{nutrition.calories} kcal</p>
                      <div className="flex items-center justify-end gap-2 mt-1 text-xs text-gray-400">
                        <span>P: {nutrition.protein}g</span>
                        <span>C: {nutrition.carbs}g</span>
                        <span>G: {nutrition.fat}g</span>
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

// Vamos estender o utils.ts para incluir a função formatTime
