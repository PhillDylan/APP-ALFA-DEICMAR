import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Box, ThemeProvider } from "@mui/material";
import { DarkTheme, LightTheme } from "./../themes";
import Cookies from 'js-cookie';

interface IThemeContextData {
  themeName: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext({} as IThemeContextData);

export const useAppThemeContext = () => {
  return useContext(ThemeContext);
}

interface IAppThemeProvider {
  children: React.ReactNode;
}

export const AppThemeProvider: React.FC<IAppThemeProvider> = ({ children }) => {
  const [themeName, setThemeName] = useState<'light' | 'dark'>('light');

  const toggleTheme = useCallback(() => {
    setThemeName(oldThemeName => {
      const newThemeName = oldThemeName === 'light' ? 'dark' : 'light';
      Cookies.set('themeName', newThemeName, { expires: 365 });
      return newThemeName;
    });
  }, []);

  useEffect(() => {
    const savedThemeName = Cookies.get('themeName');
    if (savedThemeName && (savedThemeName === 'light' || savedThemeName === 'dark')) {
      setThemeName(savedThemeName);
    }
  }, []);

  const theme = useMemo(() => {
    if (themeName === 'light') return LightTheme;
    return DarkTheme;
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <Box width="100vw" height="100vh" bgcolor={theme.palette.background.default}>
          {children}
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
