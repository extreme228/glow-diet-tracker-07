
import React from 'react';
import { NavBar } from './NavBar';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export const AppLayout: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className={cn(
      "min-h-screen text-foreground transition-colors duration-300",
      "bg-background"
    )}>
      <main className="container mx-auto p-4 pb-24">
        <Outlet />
      </main>
      <NavBar />
    </div>
  );
};
