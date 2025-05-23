
import { Food, Meal, DailyGoal, NutritionSummary, NutritionPlan } from '@/types';

export interface NutritionContextType {
  foods: Food[];
  meals: Meal[];
  dailyGoal: DailyGoal;
  nutritionPlans: NutritionPlan[];
  activePlanId: string | null;
  addFood: (food: Omit<Food, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFood: (food: Food) => void;
  deleteFood: (id: string) => void;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  updateMeal: (meal: Meal) => void;
  deleteMeal: (id: string) => void;
  getDailyNutrition: (date: string) => NutritionSummary;
  updateDailyGoal: (goal: DailyGoal) => void;
  getFood: (id: string) => Food | undefined;
  getMealsForDate: (date: string) => Meal[];
  addNutritionPlan: (plan: Omit<NutritionPlan, 'id'>) => void;
  updateNutritionPlan: (plan: NutritionPlan) => void;
  deleteNutritionPlan: (id: string) => void;
  setActivePlan: (planId: string | null) => void;
  getActivePlanGoals: (date: string) => DailyGoal | null;
}
