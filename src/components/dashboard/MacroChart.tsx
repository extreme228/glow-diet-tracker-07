
import React from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { Activity, Zap, Droplets } from 'lucide-react';

interface MacroChartProps {
  date: string;
}

export const MacroChart: React.FC<MacroChartProps> = ({ date }) => {
  const { getDailyNutrition } = useNutrition();
  const { theme } = useTheme();
  const dailyNutrition = getDailyNutrition(date);

  const getThemeColors = () => {
    if (theme === 'vibrant') {
      return {
        protein: '#00ff9d',
        carbs: '#00c3ff',
        fat: '#a64dff'
      };
    } else if (theme === 'light') {
      return {
        protein: '#10b981',
        carbs: '#3b82f6',
        fat: '#8b5cf6'
      };
    } else {
      return {
        protein: '#10b981',
        carbs: '#3b82f6',
        fat: '#8b5cf6'
      };
    }
  };

  const colors = getThemeColors();

  const data = [
    {
      name: 'Proteínas',
      value: dailyNutrition.protein,
      color: colors.protein,
      unit: 'g',
      icon: Activity,
    },
    {
      name: 'Carboidratos',
      value: dailyNutrition.carbs,
      color: colors.carbs,
      unit: 'g',
      icon: Zap,
    },
    {
      name: 'Gorduras',
      value: dailyNutrition.fat,
      color: colors.fat,
      unit: 'g',
      icon: Droplets,
    },
  ];

  const total = data.reduce((acc, item) => acc + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={cn(
          "p-3 text-sm rounded-lg shadow-lg border backdrop-blur-sm",
          theme === 'light' 
            ? "bg-white/90 text-gray-800 border-gray-200" 
            : "bg-card/90 text-card-foreground border-border"
        )}>
          <p className="font-semibold">{`${data.name}: ${data.value}${data.unit}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn(
      "glow-card p-6 transition-all duration-300 hover:scale-[1.01]",
      theme === 'vibrant' && "hover:shadow-glow-vibrant/20"
    )}>
      <div className="flex items-center gap-3 mb-6">
        <div className={cn(
          "p-2 rounded-lg",
          theme === 'light' ? "bg-blue-100" : "bg-blue-500/20"
        )}>
          <Activity className="w-5 h-5 text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-card-foreground">Macronutrientes</h3>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full h-48 mb-6">
          {total > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke={entry.color}
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Sem dados para exibir</p>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {data.map((macro, index) => (
            <div key={index} className={cn(
              "text-center p-3 rounded-lg border transition-all duration-200 hover:scale-105",
              theme === 'light' ? "bg-gray-50 border-gray-200" : "bg-secondary/50 border-border"
            )}>
              <div className="flex items-center justify-center mb-2">
                <div 
                  className="w-3 h-3 rounded-full shadow-md mr-2"
                  style={{ backgroundColor: macro.color }}
                />
                <macro.icon className="w-4 h-4" style={{ color: macro.color }} />
              </div>
              <p className="text-xs text-muted-foreground mb-1">{macro.name}</p>
              <p className="font-semibold text-card-foreground">{macro.value}g</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
