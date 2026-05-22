import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@smart_student_theme';
const ThemeContext = createContext();

export const lightTheme = {
  backgroundColor: '#F5F7FA',
  cardBackground: '#FFF',
  textPrimary: '#2D3436',
  textSecondary: '#636E72',
  textMuted: '#B2BEC3',
  border: '#DFE6E9',
  borderLight: '#F0F0F0',
  accent: '#4A90D9',
  headerBg: '#4A90D9',
  headerText: '#FFF',
  tabBarBg: '#FFF',
  statusBar: 'dark',
};

export const darkTheme = {
  backgroundColor: '#1A1A2E',
  cardBackground: '#16213E',
  textPrimary: '#EEE',
  textSecondary: '#A0A0B0',
  textMuted: '#6C6C80',
  border: '#2A2A4A',
  borderLight: '#222244',
  accent: '#5B8DEF',
  headerBg: '#0F3460',
  headerText: '#FFF',
  tabBarBg: '#16213E',
  statusBar: 'light',
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved) setIsDarkMode(saved === 'dark');
      } catch (_) {}
    })();
  }, []);

  const toggleTheme = useCallback(async () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light').catch(() => {});
      return next;
    });
  }, []);

  const setTheme = useCallback(async (dark) => {
    setIsDarkMode(dark);
    await AsyncStorage.setItem(THEME_KEY, dark ? 'dark' : 'light').catch(() => {});
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
