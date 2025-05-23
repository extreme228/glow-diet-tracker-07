
export interface Food {
  id: string;
  name: string;
  calories: number; // per 100g
  protein: number; // in grams per 100g
  carbs: number; // in grams per 100g
  fat: number; // in grams per 100g
  servingSize: number; // in grams
  createdAt: string;
  updatedAt: string;
}

export interface MealItem {
  id: string;
  foodId: string;
  quantity: number; // in grams
}

export interface Meal {
  id: string;
  name: string;
  items: MealItem[];
  date: string;
  time: string;
}

export type DailyGoal = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type NutritionSummary = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type NutritionPlanCategory = 'bulking' | 'cutting' | 'maintenance' | 'carb-cycling' | 'peak-week' | 'custom';

export type NutritionPlan = {
  id: string;
  name: string;
  type: 'daily' | 'weekly'; // diário (mesmo valor todos os dias) ou semanal (valores diferentes por dia da semana)
  goals?: DailyGoal; // para planos do tipo 'daily'
  weeklyGoals?: { [key: number]: DailyGoal }; // para planos do tipo 'weekly', onde a chave é o dia da semana (0-6)
  description?: string;
  category?: NutritionPlanCategory;
};
