import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Box, ThemeProvider } from "@mui/material";
import { DarkTheme, LightTheme } from "./../themes";
import Cookies from 'js-cookie';

// Definindo a estrutura dos dados do contexto
interface IThemeContextData {
  themeName: 'light' | 'dark'; // Nome do tema ('light' ou 'dark')
  toggleTheme: () => void; // Função para alternar o tema
}

// Criando o contexto do tema
const ThemeContext = createContext({} as IThemeContextData);

// Hook para acessar o contexto do tema
export const useAppThemeContext = () => {
  return useContext(ThemeContext);
}

// Props do componente AppThemeProvider
interface IAppThemeProvider {
  children: React.ReactNode; // Conteúdo renderizado dentro do componente
}

// Componente AppThemeProvider
export const AppThemeProvider: React.FC<IAppThemeProvider> = ({ children }) => {
  const [themeName, setThemeName] = useState<'light' | 'dark'>('light'); // Estado do nome do tema ('light' por padrão)

  // Função para alternar o tema
  const toggleTheme = useCallback(() => {
    setThemeName(oldThemeName => {
      const newThemeName = oldThemeName === 'light' ? 'dark' : 'light'; // Alternando entre 'light' e 'dark'
      Cookies.set('themeName', newThemeName, { expires: 365 }); // Salvando o nome do tema nos cookies
      return newThemeName;
    });
  }, []);

  // Verificando o tema salvo nos cookies ao carregar a página
  useEffect(() => {
    const savedThemeName = Cookies.get('themeName');
    if (savedThemeName && (savedThemeName === 'light' || savedThemeName === 'dark')) {
      setThemeName(savedThemeName);
    }
  }, []);

  // Definindo o tema com base no nome do tema
  const theme = useMemo(() => {
    if (themeName === 'light') return LightTheme; // Tema claro
    return DarkTheme; // Tema escuro
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <Box width="100vw" height="100vh" bgcolor={theme.palette.background.default}>
          {children} {/* Renderizando os componentes filhos */}
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
