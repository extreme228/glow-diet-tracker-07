
import React, { createContext, useContext } from 'react';
import { Food, Meal, DailyGoal, NutritionPlan } from '@/types';
import { NutritionContextType } from '@/types/nutrition-context';
import { useToast } from '@/components/ui/use-toast';
import { calculateDailyNutrition, getActivePlanGoalsForDate } from '@/utils/nutritionUtils';
import { defaultDailyGoal } from '@/constants/nutrition';
import useLocalStorage from '@/hooks/useLocalStorage';

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foods, setFoods] = useLocalStorage<Food[]>('nutritrack_foods', []);
  const [meals, setMeals] = useLocalStorage<Meal[]>('nutritrack_meals', []);
  const [dailyGoal, setDailyGoal] = useLocalStorage<DailyGoal>('nutritrack_goal', defaultDailyGoal);
  const [nutritionPlans, setNutritionPlans] = useLocalStorage<NutritionPlan[]>('nutritrack_plans', []);
  const [activePlanId, setActivePlanId] = useLocalStorage<string | null>('nutritrack_active_plan', null);
  const { toast } = useToast();

  const addFood = (food: Omit<Food, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newFood: Food = {
      id: crypto.randomUUID(),
      ...food,
      createdAt: now,
      updatedAt: now,
    };
    setFoods([...foods, newFood]);
    toast({
      title: 'Alimento adicionado',
      description: `${food.name} foi adicionado com sucesso.`,
    });
  };

  const updateFood = (updatedFood: Food) => {
    setFoods(
      foods.map((food) =>
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
    setFoods(foods.filter((food) => food.id !== id));
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
    setMeals([...meals, newMeal]);
    toast({
      title: 'Refeição adicionada',
      description: `${meal.name} foi adicionada com sucesso.`,
    });
  };

  const updateMeal = (updatedMeal: Meal) => {
    setMeals(
      meals.map((meal) => (meal.id === updatedMeal.id ? updatedMeal : meal))
    );
    toast({
      title: 'Refeição atualizada',
      description: `${updatedMeal.name} foi atualizada com sucesso.`,
    });
  };

  const deleteMeal = (id: string) => {
    const meal = meals.find(m => m.id === id);
    setMeals(meals.filter((meal) => meal.id !== id));
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

  const getDailyNutrition = (date: string) => {
    return calculateDailyNutrition(date, meals, foods);
  };

  const updateDailyGoal = (goal: DailyGoal) => {
    setDailyGoal(goal);
    toast({
      title: 'Metas atualizadas',
      description: 'Suas metas nutricionais foram atualizadas.',
    });
  };

  const addNutritionPlan = (plan: Omit<NutritionPlan, 'id'>) => {
    const newPlan: NutritionPlan = {
      id: crypto.randomUUID(),
      ...plan,
    };
    setNutritionPlans([...nutritionPlans, newPlan]);
    toast({
      title: 'Plano adicionado',
      description: `${plan.name} foi adicionado com sucesso.`,
    });
  };

  const updateNutritionPlan = (updatedPlan: NutritionPlan) => {
    setNutritionPlans(
      nutritionPlans.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan))
    );
    toast({
      title: 'Plano atualizado',
      description: `${updatedPlan.name} foi atualizado com sucesso.`,
    });
  };

  const deleteNutritionPlan = (id: string) => {
    const plan = nutritionPlans.find(p => p.id === id);
    setNutritionPlans(nutritionPlans.filter((plan) => plan.id !== id));
    
    // Se o plano excluído for o ativo, desativa-o
    if (activePlanId === id) {
      setActivePlanId(null);
    }
    
    toast({
      title: 'Plano removido',
      description: plan ? `${plan.name} foi removido.` : 'Plano removido com sucesso.',
      variant: 'destructive',
    });
  };

  const setActivePlan = (planId: string | null) => {
    setActivePlanId(planId);
    if (planId) {
      const plan = nutritionPlans.find(p => p.id === planId);
      if (plan) {
        toast({
          title: 'Plano ativado',
          description: `${plan.name} foi definido como plano ativo.`,
        });
      }
    } else {
      toast({
        title: 'Plano padrão ativado',
        description: 'As metas nutricionais padrão foram ativadas.',
      });
    }
  };

  const getActivePlanGoals = (date: string) => {
    return getActivePlanGoalsForDate(date, activePlanId, nutritionPlans);
  };

  return (
    <NutritionContext.Provider
      value={{
        foods,
        meals,
        dailyGoal,
        nutritionPlans,
        activePlanId,
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
        addNutritionPlan,
        updateNutritionPlan,
        deleteNutritionPlan,
        setActivePlan,
        getActivePlanGoals,
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
