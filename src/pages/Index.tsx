import React, { useState } from 'react';
import { CalorieCard } from '@/components/dashboard/CalorieCard';
import { MacroChart } from '@/components/dashboard/MacroChart';
import { MealsList } from '@/components/meals/MealsList';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { WeeklyProgress } from '@/components/dashboard/WeeklyProgress';
import { formatDate, getToday } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, Target, Zap, Apple, ListChecks, Utensils } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { useNutrition } from '@/context/NutritionContext';

const Index = () => {
  const [currentDate, setCurrentDate] = useState<string>(getToday());
  const {
    theme
  } = useTheme();
  const {
    activePlanId,
    nutritionPlans
  } = useNutrition();

  // Function to navigate dates
  const changeDate = (direction: 'prev' | 'next') => {
    const date = new Date(currentDate);
    const newDate = new Date(date);
    if (direction === 'prev') {
      newDate.setDate(date.getDate() - 1);
    } else {
      newDate.setDate(date.getDate() + 1);
    }
    setCurrentDate(newDate.toISOString().split('T')[0]);
  };
  const isToday = currentDate === getToday();

  // Obtenha o plano ativo para mostrar no cabeçalho quando aplicável
  const activePlan = activePlanId ? nutritionPlans.find(p => p.id === activePlanId) : null;
  return <div className="pt-4 space-y-6">
      {/* Header with enhanced design */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={cn(
            "p-3 rounded-2xl relative overflow-hidden", 
            theme === 'light' 
              ? "bg-gradient-to-r from-green-100 to-emerald-100" 
              : "bg-gradient-to-r from-green-500/20 to-emerald-500/20"
          )}>
            {theme === 'vibrant' && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 animate-pulse" />
            )}
            <Apple className="w-7 h-7 text-green-500 relative z-10" />
          </div>
          <div>
            <h1 className={cn(
              "text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r", 
              theme === 'light' 
                ? "from-gray-800 to-gray-600" 
                : "from-green-400 via-emerald-400 to-green-300"
            )}>
              Dieta Do Murilao
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{isToday ? 'Hoje' : formatDate(currentDate)}</span>
              {!isToday && <Zap className="w-3 h-3 text-amber-500" />}
              {activePlan && (
                <>
                  <span className="mx-1">•</span>
                  <ListChecks className="w-3 h-3 text-emerald-500" />
                  <span className="text-emerald-500 font-medium">{activePlan.name}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => changeDate('prev')} className={cn("h-10 w-10 rounded-full border-border hover:bg-secondary transition-all duration-200", theme === 'vibrant' && "hover:bg-purple-500/20 hover:border-purple-500/50 hover:shadow-glow-vibrant-purple/30")}>
            <ChevronLeft size={18} />
          </Button>
          
          <Button variant={isToday ? "default" : "outline"} size="sm" onClick={() => setCurrentDate(getToday())} className={cn("text-sm px-4 transition-all duration-200", isToday && theme === 'vibrant' && "bg-gradient-to-r from-emerald-500 to-blue-500 hover:shadow-glow-vibrant")}>
            <Target className="w-4 h-4 mr-2" />
            {isToday ? 'Hoje' : 'Ir para hoje'}
          </Button>
          
          <Button variant="outline" size="icon" onClick={() => changeDate('next')} className={cn("h-10 w-10 rounded-full border-border hover:bg-secondary transition-all duration-200", theme === 'vibrant' && "hover:bg-purple-500/20 hover:border-purple-500/50 hover:shadow-glow-vibrant-purple/30")}>
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        <Button variant="outline" size="sm" className={cn("flex items-center gap-2 whitespace-nowrap transition-all duration-200", theme === 'vibrant' && "hover:bg-emerald-500/20 hover:border-emerald-500/50")} onClick={() => window.location.href = '/add-meal'}>
          <Utensils className="w-4 h-4" />
          Adicionar Refeição
        </Button>
        <Button variant="outline" size="sm" className={cn("flex items-center gap-2 whitespace-nowrap transition-all duration-200", theme === 'vibrant' && "hover:bg-blue-500/20 hover:border-blue-500/50")} onClick={() => window.location.href = '/foods'}>
          <Apple className="w-4 h-4" />
          Gerenciar Alimentos
        </Button>
        {activePlan && <Button variant="outline" size="sm" className={cn("flex items-center gap-2 whitespace-nowrap transition-all duration-200", theme === 'vibrant' && "hover:bg-amber-500/20 hover:border-amber-500/50")} onClick={() => window.location.href = '/advanced'}>
            <ListChecks className="w-4 h-4" />
            Editar Plano Ativo
          </Button>}
      </div>
      
      {/* Quick Stats */}
      <QuickStats date={currentDate} />
      
      {/* Main Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalorieCard date={currentDate} />
        <MacroChart date={currentDate} />
      </div>
      
      {/* Weekly Progress */}
      <WeeklyProgress currentDate={currentDate} />
      
      {/* Meals List */}
      <MealsList date={currentDate} />
    </div>;
};
export default Index;
