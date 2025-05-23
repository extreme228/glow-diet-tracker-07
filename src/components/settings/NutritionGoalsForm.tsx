
import React, { useState } from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { useTheme } from '@/context/ThemeContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DailyGoal } from '@/types'; 

const NutritionGoalsForm = () => {
  const { dailyGoal, updateDailyGoal } = useNutrition();
  const { theme } = useTheme();
  const { toast } = useToast();
  
  const [calories, setCalories] = useState(dailyGoal.calories.toString());
  const [protein, setProtein] = useState(dailyGoal.protein.toString());
  const [carbs, setCarbs] = useState(dailyGoal.carbs.toString());
  const [fat, setFat] = useState(dailyGoal.fat.toString());
  
  const handleUpdateGoals = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateDailyGoal({
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      carbs: parseFloat(carbs),
      fat: parseFloat(fat)
    });
    
    toast({
      title: "Metas atualizadas",
      description: "Suas metas nutricionais foram salvas com sucesso.",
    });
  };
  
  return (
    <form onSubmit={handleUpdateGoals} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="calories" className="text-card-foreground font-medium">
          Meta de Calorias Diárias (kcal)
        </Label>
        <Input
          id="calories"
          type="number"
          required
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          min="0"
          step="50"
          className={cn(
            "transition-all duration-200 focus:scale-[1.01]",
            theme === 'vibrant' && "focus:border-primary focus:shadow-glow-vibrant/50"
          )}
        />
      </div>
      
      <Separator className="bg-border" />
      
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-card-foreground flex items-center gap-2">
          <span>Macronutrientes (g)</span>
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="protein" className="text-green-500 font-medium flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Proteínas
            </Label>
            <Input
              id="protein"
              type="number"
              required
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              min="0"
              step="1"
              className={cn(
                "transition-all duration-200 focus:scale-[1.01]",
                theme === 'vibrant' && "focus:border-green-500 focus:shadow-glow-green/50"
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="carbs" className="text-blue-500 font-medium flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              Carboidratos
            </Label>
            <Input
              id="carbs"
              type="number"
              required
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              min="0"
              step="1"
              className={cn(
                "transition-all duration-200 focus:scale-[1.01]",
                theme === 'vibrant' && "focus:border-blue-500 focus:shadow-glow-blue/50"
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fat" className="text-purple-500 font-medium flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500" />
              Gorduras
            </Label>
            <Input
              id="fat"
              type="number"
              required
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              min="0"
              step="1"
              className={cn(
                "transition-all duration-200 focus:scale-[1.01]",
                theme === 'vibrant' && "focus:border-purple-500 focus:shadow-glow-purple/50"
              )}
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <Button 
          type="submit" 
          className={cn(
            "flex items-center gap-2 transition-all duration-200 hover:scale-105",
            theme === 'vibrant' && "bg-primary hover:bg-primary/90 shadow-glow-vibrant"
          )}
        >
          <Save className="w-4 h-4" />
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
};

export default NutritionGoalsForm;
