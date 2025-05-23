
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

export interface DailyGoal {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionSummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
