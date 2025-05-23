
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

type ThemeType = 'light' | 'dark' | 'vibrant';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>('dark');
  const { toast } = useToast();

  // Carrega o tema do localStorage quando o componente é montado
  useEffect(() => {
    const storedTheme = localStorage.getItem('nutritrack_theme') as ThemeType | null;
    if (storedTheme) {
      setThemeState(storedTheme);
      document.documentElement.className = storedTheme;
    }
  }, []);

  // Salva o tema no localStorage e aplica a classe na raiz do documento
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('nutritrack_theme', newTheme);
    document.documentElement.className = newTheme;
    
    toast({
      title: "Tema alterado",
      description: `O tema foi alterado para ${
        newTheme === 'light' ? 'Claro' : 
        newTheme === 'dark' ? 'Escuro' : 
        'Vibrante'
      }.`,
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
