
import React from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface MacroChartProps {
  date: string;
}

export const MacroChart: React.FC<MacroChartProps> = ({ date }) => {
  const { getDailyNutrition } = useNutrition();
  const dailyNutrition = getDailyNutrition(date);

  const data = [
    {
      name: 'Proteínas',
      value: dailyNutrition.protein,
      color: '#2CDA9D',
      unit: 'g',
    },
    {
      name: 'Carboidratos',
      value: dailyNutrition.carbs,
      color: '#22A2E0',
      unit: 'g',
    },
    {
      name: 'Gorduras',
      value: dailyNutrition.fat,
      color: '#8062D6',
      unit: 'g',
    },
  ];

  const total = data.reduce((acc, item) => acc + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glow-card p-2 text-sm">
          <p className="font-semibold">{`${data.name}: ${data.value}${data.unit}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glow-card p-5 mb-5">
      <h3 className="text-lg font-semibold mb-4 text-white">Macronutrientes</h3>

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
                      className="filter drop-shadow-md hover:filter hover:drop-shadow-xl transition-all duration-300"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <p>Sem dados para exibir</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {data.map((macro, index) => (
            <div key={index} className="text-center">
              <div 
                className={cn(
                  "w-3 h-3 rounded-full mx-auto mb-1",
                  `bg-[${macro.color}]`,
                  "shadow-md"
                )}
                style={{ backgroundColor: macro.color }}
              />
              <p className="text-xs text-gray-400">{macro.name}</p>
              <p className="font-semibold">{macro.value}g</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
