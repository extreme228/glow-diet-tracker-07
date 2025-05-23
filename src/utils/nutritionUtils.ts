
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

  console.log('getActivePlanGoalsForDate - activePlan:', activePlan);
  console.log('getActivePlanGoalsForDate - date:', date);

  // Verificar se o plano tem a estrutura nova (da aba "Meu Planejamento")
  if ((activePlan as any).days && Array.isArray((activePlan as any).days)) {
    const planDays = (activePlan as any).days;
    console.log('getActivePlanGoalsForDate - planDays:', planDays);
    
    // Mapear dias da semana para o formato correto
    const dayOfWeekMap: { [key: string]: number } = {
      'sunday': 0,
      'second': 1,
      'third': 2,
      'fourth': 3,
      'fifth': 4,
      'sixth': 5,
      'saturday': 6
    };
    
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay(); // 0 = domingo, 1 = segunda, ... 6 = sábado
    console.log('getActivePlanGoalsForDate - dayOfWeek:', dayOfWeek);
    
    // Encontrar o dia correspondente no plano
    const dayData = planDays.find((day: any) => {
      const mappedDay = dayOfWeekMap[day.dayOfWeek];
      console.log(`getActivePlanGoalsForDate - comparing ${day.dayOfWeek} (${mappedDay}) with ${dayOfWeek}`);
      return mappedDay === dayOfWeek;
    });
    
    console.log('getActivePlanGoalsForDate - dayData found:', dayData);
    
    if (dayData) {
      const goals: DailyGoal = {
        calories: dayData.calories || 0,
        protein: dayData.protein || 0,
        carbs: dayData.carbs || 0,
        fat: dayData.fats || 0 // Note: 'fats' no formato original
      };
      console.log('getActivePlanGoalsForDate - returning goals:', goals);
      return goals;
    }
  }

  // Formato antigo (se existir)
  if (activePlan.type === 'daily') {
    console.log('getActivePlanGoalsForDate - using daily goals:', activePlan.goals);
    return activePlan.goals || null;
  } else if (activePlan.type === 'weekly') {
    const targetDate = new Date(date);
    const dayOfWeek = targetDate.getDay();
    
    if (activePlan.weeklyGoals && activePlan.weeklyGoals[dayOfWeek]) {
      console.log('getActivePlanGoalsForDate - using weekly goals:', activePlan.weeklyGoals[dayOfWeek]);
      return activePlan.weeklyGoals[dayOfWeek];
    }
  }
  
  console.log('getActivePlanGoalsForDate - no goals found, returning null');
  return null;
};
