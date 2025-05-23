
import React, { useState } from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { useTheme } from '@/context/ThemeContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Moon, Sun, Sparkles } from 'lucide-react';

const Settings = () => {
  const { dailyGoal, updateDailyGoal } = useNutrition();
  const { theme, setTheme } = useTheme();
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
      description: "Suas metas nutricionais foram salvas com sucesso."
    });
  };
  
  return (
    <div className="pt-4">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>
      
      <div className="glow-card p-5 mb-5">
        <h2 className="text-lg font-semibold mb-4">Tema</h2>
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => setTheme('light')}
            className="flex flex-col items-center gap-2 py-6 h-auto"
          >
            <Sun size={24} />
            <span>Claro</span>
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => setTheme('dark')}
            className="flex flex-col items-center gap-2 py-6 h-auto"
          >
            <Moon size={24} />
            <span>Escuro</span>
          </Button>
          <Button
            variant={theme === 'vibrant' ? 'default' : 'outline'}
            onClick={() => setTheme('vibrant')}
            className="flex flex-col items-center gap-2 py-6 h-auto"
          >
            <Sparkles size={24} />
            <span>Vibrante</span>
          </Button>
        </div>
      </div>
      
      <div className="glow-card p-5 mb-5">
        <h2 className="text-lg font-semibold mb-4">Metas Nutricionais</h2>
        
        <form onSubmit={handleUpdateGoals} className="space-y-4">
          <div>
            <Label htmlFor="calories">Meta de Calorias Diárias (kcal)</Label>
            <Input
              id="calories"
              type="number"
              required
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              min="0"
              step="50"
              className="bg-card border-border text-foreground focus:border-primary"
            />
          </div>
          
          <Separator className="bg-border my-4" />
          
          <h3 className="text-sm font-medium mb-3">Macronutrientes (g)</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="protein" className="text-primary">Proteínas</Label>
              <Input
                id="protein"
                type="number"
                required
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                min="0"
                step="1"
                className="bg-card border-border text-foreground focus:border-primary"
              />
            </div>
            
            <div>
              <Label htmlFor="carbs" className="text-blue-500">Carboidratos</Label>
              <Input
                id="carbs"
                type="number"
                required
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                min="0"
                step="1"
                className="bg-card border-border text-foreground focus:border-blue-500"
              />
            </div>
            
            <div>
              <Label htmlFor="fat" className="text-accent">Gorduras</Label>
              <Input
                id="fat"
                type="number"
                required
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                min="0"
                step="1"
                className="bg-card border-border text-foreground focus:border-accent"
              />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button type="submit" className="glow-button-primary">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
      
      <div className="glow-card p-5">
        <h2 className="text-lg font-semibold mb-2">Sobre o NutriTrack</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Versão 1.0.0
        </p>
        <p className="text-sm text-muted-foreground">
          Aplicativo de controle de alimentação e acompanhamento nutricional.
          Todos os dados são armazenados localmente no seu dispositivo.
        </p>
      </div>
    </div>
  );
};

export default Settings;
