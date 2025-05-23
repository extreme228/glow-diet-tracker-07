
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const AboutSection = () => {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-3">
      <p className="text-muted-foreground text-sm">
        <span className="font-medium text-card-foreground">Versão 1.0.0</span>
      </p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Aplicativo de controle de alimentação e acompanhamento nutricional.
        Todos os dados são armazenados localmente no seu dispositivo para total privacidade.
      </p>
    </div>
  );
};

export default AboutSection;
