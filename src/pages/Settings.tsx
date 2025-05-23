
import React, { useState } from 'react';
import { useNutrition } from '@/context/NutritionContext';
import { useTheme } from '@/context/ThemeContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Moon, Sun, Sparkles, Settings as SettingsIcon, Target, Info, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      description: "Suas metas nutricionais foram salvas com sucesso.",
    });
  };
  
  return (
    <div className="pt-4 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={cn(
          "p-2 rounded-xl",
          theme === 'light' ? "bg-gray-100" : "bg-secondary"
        )}>
          <SettingsIcon className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-card-foreground">Configurações</h1>
      </div>
      
      <div className={cn(
        "glow-card p-6 transition-all duration-300 hover:scale-[1.01]",
        theme === 'vibrant' && "hover:shadow-glow-vibrant/20"
      )}>
        <div className="flex items-center gap-3 mb-6">
          <div className={cn(
            "p-2 rounded-lg",
            theme === 'light' ? "bg-purple-100" : "bg-purple-500/20"
          )}>
            <Sparkles className="w-5 h-5 text-purple-500" />
          </div>
          <h2 className="text-lg font-semibold text-card-foreground">Tema</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => setTheme('light')}
            className={cn(
              "flex flex-col items-center gap-3 py-8 h-auto transition-all duration-200 hover:scale-105",
              theme === 'light' && "bg-primary hover:bg-primary/90"
            )}
          >
            <Sun size={28} />
            <span className="font-medium">Claro</span>
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => setTheme('dark')}
            className={cn(
              "flex flex-col items-center gap-3 py-8 h-auto transition-all duration-200 hover:scale-105",
              theme === 'dark' && "bg-primary hover:bg-primary/90"
            )}
          >
            <Moon size={28} />
            <span className="font-medium">Escuro</span>
          </Button>
          <Button
            variant={theme === 'vibrant' ? 'default' : 'outline'}
            onClick={() => setTheme('vibrant')}
            className={cn(
              "flex flex-col items-center gap-3 py-8 h-auto transition-all duration-200 hover:scale-105",
              theme === 'vibrant' && "bg-primary hover:bg-primary/90 shadow-glow-vibrant"
            )}
          >
            <Sparkles size={28} />
            <span className="font-medium">Vibrante</span>
          </Button>
        </div>
      </div>
      
      <div className={cn(
        "glow-card p-6 transition-all duration-300 hover:scale-[1.01]",
        theme === 'vibrant' && "hover:shadow-glow-vibrant/20"
      )}>
        <div className="flex items-center gap-3 mb-6">
          <div className={cn(
            "p-2 rounded-lg",
            theme === 'light' ? "bg-green-100" : "bg-green-500/20"
          )}>
            <Target className="w-5 h-5 text-green-500" />
          </div>
          <h2 className="text-lg font-semibold text-card-foreground">Metas Nutricionais</h2>
        </div>
        
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
      </div>
      
      <div className={cn(
        "glow-card p-6 transition-all duration-300 hover:scale-[1.01]",
        theme === 'vibrant' && "hover:shadow-glow-vibrant/20"
      )}>
        <div className="flex items-center gap-3 mb-4">
          <div className={cn(
            "p-2 rounded-lg",
            theme === 'light' ? "bg-blue-100" : "bg-blue-500/20"
          )}>
            <Info className="w-5 h-5 text-blue-500" />
          </div>
          <h2 className="text-lg font-semibold text-card-foreground">Sobre o NutriTrack</h2>
        </div>
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">
            <span className="font-medium text-card-foreground">Versão 1.0.0</span>
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Aplicativo de controle de alimentação e acompanhamento nutricional.
            Todos os dados são armazenados localmente no seu dispositivo para total privacidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
