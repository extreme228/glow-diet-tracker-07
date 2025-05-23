
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
    } else {
      // Define tema padrão como dark se não houver tema salvo
      setThemeState('dark');
      document.documentElement.className = 'dark';
    }
  }, []);

  // Salva o tema no localStorage e aplica a classe na raiz do documento
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('nutritrack_theme', newTheme);
    document.documentElement.className = newTheme;
    
    // Remove classes de outros temas para evitar conflitos
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark', 'vibrant');
    } else if (newTheme === 'dark') {
      document.documentElement.classList.remove('light', 'vibrant');
    } else if (newTheme === 'vibrant') {
      document.documentElement.classList.remove('light', 'dark');
    }
    
    toast({
      title: "Tema alterado",
      description: `O tema foi alterado para ${
        newTheme === 'light' ? 'Claro' : 
        newTheme === 'dark' ? 'Escuro' : 
        'Vibrante'
      }.`,
      className: newTheme === 'light' ? 'bg-white text-black' : 
                newTheme === 'dark' ? 'bg-nutritrack-card text-white' : 
                'bg-nutritrack-vibrant-card text-white',
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
