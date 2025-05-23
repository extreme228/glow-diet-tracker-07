
import React, { useState } from 'react';
import { CalorieCard } from '@/components/dashboard/CalorieCard';
import { MacroChart } from '@/components/dashboard/MacroChart';
import { MealsList } from '@/components/meals/MealsList';
import { formatDate, getToday } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, Target } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

const Index = () => {
  const [currentDate, setCurrentDate] = useState<string>(getToday());
  const { theme } = useTheme();
  
  // Function to navigate dates
  const changeDate = (direction: 'prev' | 'next') => {
    const date = new Date(currentDate);
    const newDate = new Date(date);
    
    if (direction === 'prev') {
      newDate.setDate(date.getDate() - 1);
    } else {
      newDate.setDate(date.getDate() + 1);
    }
    
    setCurrentDate(newDate.toISOString().split('T')[0]);
  };
  
  const isToday = currentDate === getToday();
  
  return (
    <div className="pt-4 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-xl",
            theme === 'light' ? "bg-primary/10" : "bg-primary/20"
          )}>
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className={cn(
              "text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r",
              theme === 'light' 
                ? "from-gray-800 to-gray-600" 
                : "from-primary to-accent"
            )}>
              NutriTrack
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{isToday ? 'Hoje' : formatDate(currentDate)}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => changeDate('prev')}
            className={cn(
              "h-9 w-9 rounded-full border-border hover:bg-secondary",
              theme === 'vibrant' && "hover:bg-accent/20 hover:border-accent/50"
            )}
          >
            <ChevronLeft size={16} />
          </Button>
          
          <Button
            variant={isToday ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentDate(getToday())}
            className={cn(
              "text-xs px-3",
              isToday && theme === 'vibrant' && "bg-primary hover:bg-primary/90"
            )}
          >
            <Target className="w-3 h-3 mr-1" />
            Hoje
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => changeDate('next')}
            className={cn(
              "h-9 w-9 rounded-full border-border hover:bg-secondary",
              theme === 'vibrant' && "hover:bg-accent/20 hover:border-accent/50"
            )}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
      
      <CalorieCard date={currentDate} />
      
      <MacroChart date={currentDate} />
      
      <MealsList date={currentDate} />
    </div>
  );
};

export default Index;
