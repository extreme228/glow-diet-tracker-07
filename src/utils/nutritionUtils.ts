
import { Food, Meal, NutritionSummary, DailyGoal, NutritionPlan } from '@/types';

export const calculateDailyNutrition = (
  date: string, 
  meals: Meal[], 
  foods: Food[]
): NutritionSummary => {
  const dailyMeals = meals.filter((meal) => meal.date === date);
  
  const summary = dailyMeals.reduce(
    (acc, meal) => {
      const mealNutrition = meal.items.reduce(
        (mealAcc, item) => {
          const food = foods.find((f) => f.id === item.foodId);
          if (food) {
            // Calculate nutrients based on quantity and food's values per 100g
            const multiplier = item.quantity / 100;
            mealAcc.calories += food.calories * multiplier;
            mealAcc.protein += food.protein * multiplier;
            mealAcc.carbs += food.carbs * multiplier;
            mealAcc.fat += food.fat * multiplier;
          }
          return mealAcc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      acc.calories += mealNutrition.calories;
      acc.protein += mealNutrition.protein;
      acc.carbs += mealNutrition.carbs;
      acc.fat += mealNutrition.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return {
    calories: Math.round(summary.calories),
    protein: Math.round(summary.protein),
    carbs: Math.round(summary.carbs),
    fat: Math.round(summary.fat),
  };
};

export const getActivePlanGoalsForDate = (
  date: string,
  activePlanId: string | null,
  nutritionPlans: NutritionPlan[]
): DailyGoal | null => {
  if (!activePlanId) return null;
  
  const activePlan = nutritionPlans.find(p => p.id === activePlanId);
  if (!activePlan) return null;

  if (activePlan.type === 'daily') {
    // Para planos diários, retorna o mesmo valor para todos os dias
    return activePlan.goals;
  } else if (activePlan.type === 'weekly') {
    // Para planos semanais (como ciclo de carboidratos), determina o dia da semana
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay(); // 0 = domingo, 1 = segunda, ... 6 = sábado
    
    if (activePlan.weeklyGoals && activePlan.weeklyGoals[dayOfWeek]) {
      return activePlan.weeklyGoals[dayOfWeek];
    }
  }
  
  // Se não encontrou metas específicas para o dia ou tipo de plano não suportado
  return null;
};
