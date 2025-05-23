
import React from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { Calendar, TrendingUp, Target, BarChart3 } from 'lucide-react';

interface WeeklyProgressProps {
  currentDate: string;
}

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ currentDate }) => {
  const { getDailyNutrition, dailyGoal, getActivePlanGoals } = useNutrition();
  const { theme } = useTheme();

  // Get the last 7 days including current date
  const getWeekDates = () => {
    const dates = [];
    const today = new Date(currentDate);
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const weekDates = getWeekDates();
  
  const weekData = weekDates.map(date => {
    const nutrition = getDailyNutrition(date);
    
    // Obter metas do plano ativo para cada data ou usar metas padrão
    const activePlanGoals = getActivePlanGoals(date);
    const targetGoals = activePlanGoals || dailyGoal;
    
    const caloriePercentage = Math.round((nutrition.calories / targetGoals.calories) * 100);
    const dayName = new Date(date).toLocaleDateString('pt-BR', { weekday: 'short' });
    
    return {
      date,
      dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
      calories: nutrition.calories,
      caloriePercentage,
      isToday: date === currentDate,
      isComplete: caloriePercentage >= 80
    };
  });

  const weekAverage = Math.round(
    weekData.reduce((acc, day) => acc + day.caloriePercentage, 0) / weekData.length
  );

  const completeDays = weekData.filter(day => day.isComplete).length;

  const getCardStyles = () => {
    if (theme === 'vibrant') {
      return "bg-gray-900/60 border-purple-500/30 backdrop-blur-xl";
    }
    return theme === 'light' ? "bg-white border-gray-200" : "bg-gray-800/50 border-gray-700/50";
  };

  const getBarColor = (percentage: number, isToday: boolean) => {
    if (isToday) {
      return theme === 'vibrant' 
        ? "bg-gradient-to-t from-emerald-500 to-blue-500 shadow-glow-vibrant"
        : "bg-gradient-to-t from-emerald-500 to-blue-500";
    }
    
    if (percentage >= 100) return "bg-emerald-500";
    if (percentage >= 80) return "bg-blue-500";
    if (percentage >= 50) return "bg-amber-500";
    return "bg-gray-400";
  };

  return (
    <div className={cn(
      "p-6 rounded-xl border transition-all duration-300",
      getCardStyles()
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            theme === 'light' ? "bg-blue-100" : "bg-blue-500/20"
          )}>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Progresso Semanal</h3>
            <p className="text-sm text-muted-foreground">
              {completeDays}/7 dias com meta atingida
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <Target className="w-3 h-3" />
            <span>Média da semana</span>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            weekAverage >= 80 ? "text-emerald-500" : "text-amber-500"
          )}>
            {weekAverage}%
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between gap-2 h-32">
          {weekData.map((day, index) => (
            <div key={day.date} className="flex flex-col items-center flex-1 max-w-[40px]">
              <div className="relative h-24 w-full flex items-end">
                <div
                  className={cn(
                    "w-full rounded-t-md transition-all duration-500 relative overflow-hidden",
                    getBarColor(day.caloriePercentage, day.isToday)
                  )}
                  style={{ height: `${Math.max(day.caloriePercentage, 5)}%` }}
                >
                  {day.isToday && theme === 'vibrant' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent animate-shimmer" />
                  )}
                </div>
                
                {day.isToday && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                  </div>
                )}
              </div>
              
              <div className="mt-2 text-center">
                <div className={cn(
                  "text-xs font-medium mb-1",
                  day.isToday ? "text-emerald-500" : "text-muted-foreground"
                )}>
                  {day.dayName}
                </div>
                <div className="text-xs text-muted-foreground">
                  {day.caloriePercentage}%
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span>Meta atingida (100%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span>Bom progresso (80%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-amber-500" />
            <span>Progresso moderado</span>
          </div>
        </div>
      </div>
    </div>
  );
};
