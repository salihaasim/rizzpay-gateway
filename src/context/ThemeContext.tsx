
import React, { createContext, useContext, ReactNode } from 'react';

interface ThemeContextType {
  theme: 'light';
  setTheme: (theme: 'light') => void;
}

const ThemeContext = createContext<ThemeContextType>({ 
  theme: 'light',
  setTheme: () => {} 
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Only light theme is supported now
  const theme = 'light';
  const setTheme = () => {
    // No-op function since we only support light theme
  };
  
  // Apply theme to document
  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
