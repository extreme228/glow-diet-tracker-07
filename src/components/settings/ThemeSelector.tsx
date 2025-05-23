
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  
  return (
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
  );
};

export default ThemeSelector;
