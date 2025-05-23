
import React from 'react';
import { Settings as SettingsIcon, Target, Info, ListChecks, Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

// Import the smaller components
import ThemeSelector from '@/components/settings/ThemeSelector';
import NutritionPlanSelector from '@/components/settings/NutritionPlanSelector';
import NutritionGoalsForm from '@/components/settings/NutritionGoalsForm';
import AboutSection from '@/components/settings/AboutSection';
import SettingsCard from '@/components/settings/SettingsCard';

const Settings = () => {
  const { theme } = useTheme();
  
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
      
      <SettingsCard 
        icon={Sparkles} 
        title="Tema" 
        iconColor="text-purple-500" 
        iconBgClass={theme === 'light' ? "bg-purple-100" : "bg-purple-500/20"}
      >
        <ThemeSelector />
      </SettingsCard>

      <SettingsCard 
        icon={ListChecks} 
        title="Plano Nutricional Ativo" 
        iconColor="text-amber-500" 
        iconBgClass={theme === 'light' ? "bg-amber-100" : "bg-amber-500/20"}
      >
        <NutritionPlanSelector />
      </SettingsCard>
      
      <SettingsCard 
        icon={Target} 
        title="Metas Nutricionais Padrão" 
        iconColor="text-green-500" 
        iconBgClass={theme === 'light' ? "bg-green-100" : "bg-green-500/20"}
      >
        <NutritionGoalsForm />
      </SettingsCard>
      
      <SettingsCard 
        icon={Info} 
        title="Sobre o Dieta do Murilao" 
        iconColor="text-blue-500" 
        iconBgClass={theme === 'light' ? "bg-blue-100" : "bg-blue-500/20"}
      >
        <AboutSection />
      </SettingsCard>
    </div>
  );
};

export default Settings;
