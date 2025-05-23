
import React, { ReactNode } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface SettingsCardProps {
  children: ReactNode;
  icon: LucideIcon;
  title: string;
  iconColor?: string;
  iconBgClass?: string;
}

const SettingsCard = ({ 
  children, 
  icon: Icon, 
  title, 
  iconColor = "text-primary",
  iconBgClass
}: SettingsCardProps) => {
  const { theme } = useTheme();
  
  return (
    <div className={cn(
      "glow-card p-6 transition-all duration-300 hover:scale-[1.01]",
      theme === 'vibrant' && "hover:shadow-glow-vibrant/20"
    )}>
      <div className="flex items-center gap-3 mb-6">
        <div className={cn(
          "p-2 rounded-lg",
          iconBgClass || (theme === 'light' ? "bg-gray-100" : "bg-secondary")
        )}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        <h2 className="text-lg font-semibold text-card-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default SettingsCard;
