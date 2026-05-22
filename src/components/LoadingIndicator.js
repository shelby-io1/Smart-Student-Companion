import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

const LoadingIndicator = ({ message = 'Loading...', size = 'large', color }) => {
  const { theme } = useTheme();
  const s = makeStyles(theme);
  const spinnerColor = color || theme.accent;

  return (
    <View style={s.container}>
      <ActivityIndicator size={size} color={spinnerColor} />
      <Text style={s.text}>{message}</Text>
    </View>
  );
};

const makeStyles = (theme) => StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { marginTop: 12, fontSize: 14, color: theme.textSecondary, fontWeight: '500' },
});

export default LoadingIndicator;
