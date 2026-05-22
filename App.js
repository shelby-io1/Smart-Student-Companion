import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/utils/ThemeContext';

const AppContent = () => {
  const { theme } = useTheme();
  return (
    <NavigationContainer>
      <StatusBar style={theme.statusBar} />
      <AppNavigator />
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
