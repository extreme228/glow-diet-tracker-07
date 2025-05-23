
import React, { useState } from 'react';
import { CalorieCard } from '@/components/dashboard/CalorieCard';
import { MacroChart } from '@/components/dashboard/MacroChart';
import { MealsList } from '@/components/meals/MealsList';
import { formatDate, getToday } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Index = () => {
  const [currentDate, setCurrentDate] = useState<string>(getToday());
  
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
    <div className="pt-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nutritrack-green to-nutritrack-blue">
            NutriTrack
          </h1>
          <p className="text-gray-400 text-sm">
            {isToday ? 'Hoje' : formatDate(currentDate)}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => changeDate('prev')}
            className="h-8 w-8 rounded-full bg-nutritrack-card hover:bg-nutritrack-purple/20 hover:text-nutritrack-purple"
          >
            <ChevronLeft size={18} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(getToday())}
            className={`text-xs ${
              isToday ? 'bg-nutritrack-green/20 text-nutritrack-green' : 'bg-nutritrack-card hover:bg-nutritrack-green/10 hover:text-nutritrack-green'
            }`}
          >
            Hoje
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => changeDate('next')}
            className="h-8 w-8 rounded-full bg-nutritrack-card hover:bg-nutritrack-purple/20 hover:text-nutritrack-purple"
          >
            <ChevronRight size={18} />
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
