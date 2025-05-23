
import React, { useState } from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatDate, getToday, formatDateYYYYMMDD } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Analytics = () => {
  const { getDailyNutrition, dailyGoal } = useNutrition();
  const [view, setView] = useState<'week' | 'month'>('week');
  
  // Get dates for the last 7 days or 30 days depending on view
  const daysToShow = view === 'week' ? 7 : 30;
  const currentDate = new Date();
  
  const [endDate, setEndDate] = useState<Date>(currentDate);
  
  const getDatesArray = () => {
    let dates = [];
    let startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (daysToShow - 1));
    
    for (let i = 0; i < daysToShow; i++) {
      let currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      dates.push(formatDateYYYYMMDD(currentDate));
    }
    
    return dates;
  };
  
  const dates = getDatesArray();
  
  const calorieData = dates.map(date => {
    const nutrition = getDailyNutrition(date);
    return {
      date,
      calories: nutrition.calories,
      goal: dailyGoal.calories
    };
  });
  
  const macrosData = dates.map(date => {
    const nutrition = getDailyNutrition(date);
    return {
      date,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      proteinGoal: dailyGoal.protein,
      carbsGoal: dailyGoal.carbs,
      fatGoal: dailyGoal.fat
    };
  });
  
  // Navigation between weeks/months
  const navigateTime = (direction: 'prev' | 'next') => {
    const newDate = new Date(endDate);
    if (direction === 'prev') {
      newDate.setDate(endDate.getDate() - daysToShow);
    } else {
      newDate.setDate(endDate.getDate() + daysToShow);
      // Don't allow navigation into the future beyond today
      if (newDate > currentDate) {
        newDate.setTime(currentDate.getTime());
      }
    }
    setEndDate(newDate);
  };
  
  // Reset to current week/month
  const resetToToday = () => {
    setEndDate(currentDate);
  };
  
  const formatXAxisTick = (date: string) => {
    const d = new Date(date);
    return d.getDate().toString();
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dateLabel = formatDate(label);
      
      return (
        <div className="glow-card p-3 text-sm">
          <p className="font-semibold mb-1">{dateLabel}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} 
              {entry.name === 'Calorias' ? ' kcal' : 'g'}
            </p>
          ))}
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="pt-4">
      <h1 className="text-2xl font-bold mb-6">Análise Nutricional</h1>
      
      <div className="flex justify-between items-center mb-4 gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateTime('prev')}
          className="h-8 w-8 rounded-full bg-nutritrack-card hover:bg-nutritrack-purple/20 hover:text-nutritrack-purple"
        >
          <ChevronLeft size={18} />
        </Button>
        
        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={(value: 'week' | 'month') => setView(value)}>
            <SelectTrigger className="w-[120px] bg-nutritrack-card border-white/10">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent className="bg-nutritrack-card border-white/10 text-white">
              <SelectItem value="week" className="cursor-pointer">Semanal</SelectItem>
              <SelectItem value="month" className="cursor-pointer">Mensal</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetToToday}
            className="text-xs bg-nutritrack-card hover:bg-nutritrack-green/10 hover:text-nutritrack-green"
          >
            Atual
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateTime('next')}
          disabled={formatDateYYYYMMDD(endDate) === getToday()}
          className="h-8 w-8 rounded-full bg-nutritrack-card hover:bg-nutritrack-purple/20 hover:text-nutritrack-purple disabled:opacity-50"
        >
          <ChevronRight size={18} />
        </Button>
      </div>
      
      <div className="glow-card p-5 mb-5">
        <h3 className="text-lg font-semibold mb-4">Calorias Consumidas</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={calorieData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxisTick}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="calories" 
                name="Calorias"
                radius={[4, 4, 0, 0]}
                className="animate-pulse-glow"
              >
                {calorieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.calories > entry.goal ? "#FF6B6B" : "#2CDA9D"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="glow-card p-5 mb-5">
        <h3 className="text-lg font-semibold mb-4">Consumo de Macronutrientes</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={macrosData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <XAxis 
                dataKey="date" 
                tickFormatter={formatXAxisTick}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="protein" 
                name="Proteínas"
                fill="#2CDA9D" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="carbs" 
                name="Carboidratos"
                fill="#22A2E0" 
                radius={[4, 4, 0, 0]} 
              />
              <Bar 
                dataKey="fat" 
                name="Gorduras"
                fill="#8062D6" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
