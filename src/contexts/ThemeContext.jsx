import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Busca o tema salvo no navegador ou define o 'dark' como padrão
  const [theme, setTheme] = useState(localStorage.getItem('autohub-theme') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    // Remove os dois para evitar conflito
    root.classList.remove('light', 'dark');
    // Adiciona o tema atual
    root.classList.add(theme);
    // Salva no navegador
    localStorage.setItem('autohub-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);