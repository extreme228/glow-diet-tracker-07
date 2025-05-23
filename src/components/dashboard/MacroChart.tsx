
import React from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

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
        protein: '#2CDA9D',
        carbs: '#22A2E0',
        fat: '#8062D6'
      };
    } else {
      return {
        protein: '#2CDA9D',
        carbs: '#22A2E0',
        fat: '#8062D6'
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
    },
    {
      name: 'Carboidratos',
      value: dailyNutrition.carbs,
      color: colors.carbs,
      unit: 'g',
    },
    {
      name: 'Gorduras',
      value: dailyNutrition.fat,
      color: colors.fat,
      unit: 'g',
    },
  ];

  const total = data.reduce((acc, item) => acc + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={cn(
          "p-2 text-sm rounded-lg shadow-lg",
          theme === 'light' 
            ? "bg-white text-gray-800 border border-gray-200" 
            : theme === 'vibrant'
              ? "bg-nutritrack-vibrant-card text-white border border-nutritrack-vibrant-green/20" 
              : "glow-card"
        )}>
          <p className="font-semibold">{`${data.name}: ${data.value}${data.unit}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn(
      "p-5 mb-5 rounded-xl shadow-lg relative overflow-hidden",
      theme === 'light' 
        ? "bg-white border border-gray-200" 
        : theme === 'vibrant'
          ? "glow-card bg-nutritrack-vibrant-card border-nutritrack-vibrant-green/20" 
          : "glow-card"
    )}>
      <h3 className={cn(
        "text-lg font-semibold mb-4",
        theme === 'light' ? "text-gray-800" : "text-white"
      )}>Macronutrientes</h3>

      <div className="flex flex-col items-center">
        <div className="w-full h-48 mb-4">
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
                      className={cn(
                        "transition-all duration-300",
                        theme === 'vibrant' ? "filter drop-shadow-lg hover:filter hover:brightness-110" : ""
                      )}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <p>Sem dados para exibir</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {data.map((macro, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-3 h-3 rounded-full mx-auto mb-1 shadow-md"
                style={{ backgroundColor: macro.color }}
              />
              <p className="text-xs text-muted-foreground">{macro.name}</p>
              <p className={cn(
                "font-semibold",
                theme === 'light' ? "text-gray-800" : "text-white"
              )}>{macro.value}g</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
