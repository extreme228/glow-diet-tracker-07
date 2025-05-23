
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Food, Meal, DailyGoal, NutritionSummary } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface NutritionContextType {
  foods: Food[];
  meals: Meal[];
  dailyGoal: DailyGoal;
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
}

const defaultDailyGoal: DailyGoal = {
  calories: 2000,
  protein: 120,
  carbs: 200,
  fat: 70,
};

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>(defaultDailyGoal);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const storedFoods = localStorage.getItem('nutritrack_foods');
    const storedMeals = localStorage.getItem('nutritrack_meals');
    const storedGoal = localStorage.getItem('nutritrack_goal');

    if (storedFoods) setFoods(JSON.parse(storedFoods));
    if (storedMeals) setMeals(JSON.parse(storedMeals));
    if (storedGoal) setDailyGoal(JSON.parse(storedGoal));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('nutritrack_foods', JSON.stringify(foods));
  }, [foods]);

  useEffect(() => {
    localStorage.setItem('nutritrack_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('nutritrack_goal', JSON.stringify(dailyGoal));
  }, [dailyGoal]);

  const addFood = (food: Omit<Food, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newFood: Food = {
      id: crypto.randomUUID(),
      ...food,
      createdAt: now,
      updatedAt: now,
    };
    setFoods((prev) => [...prev, newFood]);
    toast({
      title: 'Alimento adicionado',
      description: `${food.name} foi adicionado com sucesso.`,
    });
  };

  const updateFood = (updatedFood: Food) => {
    setFoods((prev) =>
      prev.map((food) =>
        food.id === updatedFood.id
          ? { ...updatedFood, updatedAt: new Date().toISOString() }
          : food
      )
    );
    toast({
      title: 'Alimento atualizado',
      description: `${updatedFood.name} foi atualizado com sucesso.`,
    });
  };

  const deleteFood = (id: string) => {
    const food = foods.find(f => f.id === id);
    setFoods((prev) => prev.filter((food) => food.id !== id));
    toast({
      title: 'Alimento removido',
      description: food ? `${food.name} foi removido.` : 'Alimento removido com sucesso.',
      variant: 'destructive',
    });
  };

  const addMeal = (meal: Omit<Meal, 'id'>) => {
    const newMeal = {
      id: crypto.randomUUID(),
      ...meal,
    };
    setMeals((prev) => [...prev, newMeal]);
    toast({
      title: 'Refeição adicionada',
      description: `${meal.name} foi adicionada com sucesso.`,
    });
  };

  const updateMeal = (updatedMeal: Meal) => {
    setMeals((prev) =>
      prev.map((meal) => (meal.id === updatedMeal.id ? updatedMeal : meal))
    );
    toast({
      title: 'Refeição atualizada',
      description: `${updatedMeal.name} foi atualizada com sucesso.`,
    });
  };

  const deleteMeal = (id: string) => {
    const meal = meals.find(m => m.id === id);
    setMeals((prev) => prev.filter((meal) => meal.id !== id));
    toast({
      title: 'Refeição removida',
      description: meal ? `${meal.name} foi removida.` : 'Refeição removida com sucesso.',
      variant: 'destructive',
    });
  };

  const getFood = (id: string): Food | undefined => {
    return foods.find((food) => food.id === id);
  };

  const getMealsForDate = (date: string): Meal[] => {
    return meals.filter((meal) => meal.date === date);
  };

  const getDailyNutrition = (date: string): NutritionSummary => {
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

  const updateDailyGoal = (goal: DailyGoal) => {
    setDailyGoal(goal);
    toast({
      title: 'Metas atualizadas',
      description: 'Suas metas nutricionais foram atualizadas.',
    });
  };

  return (
    <NutritionContext.Provider
      value={{
        foods,
        meals,
        dailyGoal,
        addFood,
        updateFood,
        deleteFood,
        addMeal,
        updateMeal,
        deleteMeal,
        getDailyNutrition,
        updateDailyGoal,
        getFood,
        getMealsForDate,
      }}
    >
      {children}
    </NutritionContext.Provider>
  );
};

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
};
