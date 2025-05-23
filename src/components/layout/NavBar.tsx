
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Apple, PieChart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

export const NavBar: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();
  
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
    <div className={cn(
      "fixed bottom-0 left-0 right-0 border-t z-50",
      theme === 'light' 
        ? "bg-white border-gray-200" 
        : theme === 'vibrant'
          ? "bg-nutritrack-vibrant-card bg-opacity-90 backdrop-blur-lg border-nutritrack-vibrant-green/20" 
          : "bg-nutritrack-card bg-opacity-90 backdrop-blur-lg border-white/10"
    )}>
      <div className="container mx-auto">
        <nav className="flex justify-around items-center h-16">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-1/4 py-1 transition-all duration-300',
                isActive(item.path) 
                  ? theme === 'light'
                    ? 'text-primary'
                    : theme === 'vibrant'
                      ? 'text-nutritrack-vibrant-green'
                      : 'text-nutritrack-green'
                  : theme === 'light'
                    ? 'text-gray-500 hover:text-gray-800'
                    : 'text-gray-400 hover:text-white'
              )}
            >
              <div 
                className={cn(
                  "p-1.5 rounded-full transition-all duration-300",
                  isActive(item.path) && (
                    theme === 'light'
                      ? "bg-primary/10 shadow-md"
                      : theme === 'vibrant'
                        ? "bg-nutritrack-vibrant-green/20 shadow-glow-vibrant animate-pulse-glow" 
                        : "bg-nutritrack-green/20 shadow-glow-green animate-pulse-glow"
                  )
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
