
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Apple, PieChart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NavBar: React.FC = () => {
  const location = useLocation();
  
  const items = [
    {
      label: 'Início',
      icon: Home,
      path: '/',
    },
    {
      label: 'Alimentos',
      icon: Apple,
      path: '/foods',
    },
    {
      label: 'Análise',
      icon: PieChart,
      path: '/analytics',
    },
    {
      label: 'Configurações',
      icon: Settings,
      path: '/settings',
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-nutritrack-card bg-opacity-90 backdrop-blur-lg border-t border-white/10 z-50">
      <div className="container mx-auto">
        <nav className="flex justify-around items-center h-16">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-1/4 py-1 transition-all duration-300',
                isActive(item.path) 
                  ? 'text-nutritrack-green' 
                  : 'text-gray-400 hover:text-white'
              )}
            >
              <div 
                className={cn(
                  "p-1.5 rounded-full transition-all duration-300",
                  isActive(item.path) && "bg-nutritrack-green/20 shadow-glow-green animate-pulse-glow"
                )}
              >
                <item.icon size={20} />
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
