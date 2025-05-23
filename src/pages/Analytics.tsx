
import React, { useState, useMemo } from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, PieChart, Pie, Area, AreaChart } from 'recharts';
import { formatDate, getToday, formatDateYYYYMMDD } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, BarChart3, TrendingUp, Target, Activity, Calendar, Award, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

const Analytics = () => {
  const { getDailyNutrition, dailyGoal, getMealsForDate } = useNutrition();
  const { theme } = useTheme();
  const [view, setView] = useState<'week' | 'month'>('week');
  const [metric, setMetric] = useState<'calories' | 'macros' | 'meals'>('calories');
  
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
  
  const analyticsData = useMemo(() => {
    return dates.map(date => {
      const nutrition = getDailyNutrition(date);
      const meals = getMealsForDate(date);
      const caloriePercentage = Math.round((nutrition.calories / dailyGoal.calories) * 100);
      
      return {
        date,
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,
        caloriePercentage,
        mealsCount: meals.length,
        goal: dailyGoal.calories,
        proteinGoal: dailyGoal.protein,
        carbsGoal: dailyGoal.carbs,
        fatGoal: dailyGoal.fat,
        isComplete: caloriePercentage >= 80
      };
    });
  }, [dates, getDailyNutrition, dailyGoal, getMealsForDate]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalDays = analyticsData.length;
    const completeDays = analyticsData.filter(d => d.isComplete).length;
    const avgCalories = Math.round(analyticsData.reduce((acc, d) => acc + d.calories, 0) / totalDays);
    const avgProtein = Math.round(analyticsData.reduce((acc, d) => acc + d.protein, 0) / totalDays);
    const avgMeals = Math.round(analyticsData.reduce((acc, d) => acc + d.mealsCount, 0) / totalDays * 10) / 10;
    const streak = calculateStreak(analyticsData);
    
    return {
      completeDays,
      totalDays,
      avgCalories,
      avgProtein,
      avgMeals,
      streak,
      successRate: Math.round((completeDays / totalDays) * 100)
    };
  }, [analyticsData]);

  function calculateStreak(data: any[]) {
    let streak = 0;
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].isComplete) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }
  
  const navigateTime = (direction: 'prev' | 'next') => {
    const newDate = new Date(endDate);
    if (direction === 'prev') {
      newDate.setDate(endDate.getDate() - daysToShow);
    } else {
      newDate.setDate(endDate.getDate() + daysToShow);
      if (newDate > currentDate) {
        newDate.setTime(currentDate.getTime());
      }
    }
    setEndDate(newDate);
  };
  
  const resetToToday = () => {
    setEndDate(currentDate);
  };
  
  const formatXAxisTick = (date: string) => {
    const d = new Date(date);
    return view === 'week' 
      ? d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)
      : d.getDate().toString();
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dateLabel = formatDate(label);
      const data = payload[0].payload;
      
      return (
        <div className={cn(
          "p-4 rounded-xl border shadow-lg backdrop-blur-sm",
          theme === 'light' ? "bg-white border-gray-200" : "bg-gray-900/90 border-gray-700"
        )}>
          <p className="font-semibold mb-2 text-card-foreground">{dateLabel}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span style={{ color: entry.color }}>
                {entry.name}: {entry.value} 
                {entry.name === 'Calorias' ? ' kcal' : 
                 entry.name === 'Refeições' ? '' : 'g'}
              </span>
            </p>
          ))}
          {data.caloriePercentage && (
            <p className="text-xs text-muted-foreground mt-2 border-t border-border pt-2">
              Meta: {data.caloriePercentage}% atingida
            </p>
          )}
        </div>
      );
    }
    
    return null;
  };

  const getCardStyles = () => {
    if (theme === 'vibrant') {
      return "bg-gray-900/60 border-purple-500/30 backdrop-blur-xl";
    }
    return theme === 'light' ? "bg-white border-gray-200" : "bg-gray-800/50 border-gray-700/50";
  };
  
  return (
    <div className="pt-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-xl",
            theme === 'light' ? "bg-blue-100" : "bg-blue-500/20"
          )}>
            <BarChart3 className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Análise Nutricional
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe seu progresso e tendências
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={cn("p-4 rounded-xl border", getCardStyles())}>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</span>
          </div>
          <div className="text-2xl font-bold text-emerald-500">{stats.successRate}%</div>
          <p className="text-xs text-muted-foreground">{stats.completeDays}/{stats.totalDays} dias</p>
        </div>

        <div className={cn("p-4 rounded-xl border", getCardStyles())}>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-muted-foreground">Sequência</span>
          </div>
          <div className="text-2xl font-bold text-amber-500">{stats.streak}</div>
          <p className="text-xs text-muted-foreground">dias consecutivos</p>
        </div>

        <div className={cn("p-4 rounded-xl border", getCardStyles())}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-muted-foreground">Média Calorias</span>
          </div>
          <div className="text-2xl font-bold text-blue-500">{stats.avgCalories}</div>
          <p className="text-xs text-muted-foreground">kcal/dia</p>
        </div>

        <div className={cn("p-4 rounded-xl border", getCardStyles())}>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium text-muted-foreground">Refeições/Dia</span>
          </div>
          <div className="text-2xl font-bold text-purple-500">{stats.avgMeals}</div>
          <p className="text-xs text-muted-foreground">média</p>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex justify-between items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateTime('prev')}
          className="h-10 w-10 rounded-full"
        >
          <ChevronLeft size={18} />
        </Button>
        
        <div className="flex items-center gap-3">
          <Select value={view} onValueChange={(value: 'week' | 'month') => setView(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semanal</SelectItem>
              <SelectItem value="month">Mensal</SelectItem>
            </SelectContent>
          </Select>

          <Select value={metric} onValueChange={(value: 'calories' | 'macros' | 'meals') => setMetric(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Métrica" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calories">Calorias</SelectItem>
              <SelectItem value="macros">Macros</SelectItem>
              <SelectItem value="meals">Refeições</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={resetToToday}
            className="text-xs"
          >
            <Calendar className="w-3 h-3 mr-1" />
            Atual
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigateTime('next')}
          disabled={formatDateYYYYMMDD(endDate) === getToday()}
          className="h-10 w-10 rounded-full"
        >
          <ChevronRight size={18} />
        </Button>
      </div>
      
      {/* Main Chart */}
      <div className={cn("p-6 rounded-xl border", getCardStyles())}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-card-foreground">
            {metric === 'calories' ? 'Consumo de Calorias' :
             metric === 'macros' ? 'Macronutrientes' : 'Número de Refeições'}
          </h3>
          <Badge variant="secondary" className="flex items-center gap-1">
            <BarChart3 className="w-3 h-3" />
            {view === 'week' ? 'Últimos 7 dias' : 'Últimos 30 dias'}
          </Badge>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {metric === 'calories' ? (
              <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <defs>
                  <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxisTick}
                  stroke={theme === 'light' ? "#6b7280" : "#9ca3af"}
                  fontSize={12}
                />
                <YAxis stroke={theme === 'light' ? "#6b7280" : "#9ca3af"} fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="calories"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#caloriesGradient)"
                  name="Calorias"
                />
                <Line
                  type="monotone"
                  dataKey="goal"
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  name="Meta"
                  dot={false}
                />
              </AreaChart>
            ) : metric === 'macros' ? (
              <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxisTick}
                  stroke={theme === 'light' ? "#6b7280" : "#9ca3af"}
                  fontSize={12}
                />
                <YAxis stroke={theme === 'light' ? "#6b7280" : "#9ca3af"} fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="protein" name="Proteínas" fill="#10b981" radius={[2, 2, 0, 0]} />
                <Bar dataKey="carbs" name="Carboidratos" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="fat" name="Gorduras" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxisTick}
                  stroke={theme === 'light' ? "#6b7280" : "#9ca3af"}
                  fontSize={12}
                />
                <YAxis stroke={theme === 'light' ? "#6b7280" : "#9ca3af"} fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="mealsCount" name="Refeições" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                  {analyticsData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={entry.mealsCount >= 3 ? "#10b981" : "#f59e0b"}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
