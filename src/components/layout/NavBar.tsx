
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
      "fixed bottom-0 left-0 right-0 border-t z-50 backdrop-blur-xl",
      theme === 'light' 
        ? "bg-white/90 border-gray-200" 
        : "bg-card/90 border-border"
    )}>
      <div className="container mx-auto">
        <nav className="flex justify-around items-center h-16">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center w-1/4 py-1 transition-all duration-300 group',
                isActive(item.path) 
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div 
                className={cn(
                  "p-2 rounded-xl transition-all duration-300 relative overflow-hidden",
                  isActive(item.path) && (
                    theme === 'light'
                      ? "bg-primary/10 shadow-sm"
                      : theme === 'vibrant'
                        ? "bg-primary/20 shadow-glow-green/50" 
                        : "bg-primary/20 shadow-md"
                  ),
                  !isActive(item.path) && "group-hover:bg-secondary/50"
                )}
              >
                {isActive(item.path) && theme === 'vibrant' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 animate-shimmer" />
                )}
                <item.icon size={18} className="relative z-10" />
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
