
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const AboutSection = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        <span className="font-medium text-yellow-500">Versão Definitiva</span>
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        O melhor App de Dieta que tem no mundo
      </p>
    </div>
  );
};

export default AboutSection;
