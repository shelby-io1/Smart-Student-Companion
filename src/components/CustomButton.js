import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

const CustomButton = ({ title, onPress, loading, disabled, variant = 'primary', icon }) => {
  const { theme } = useTheme();
  const s = makeStyles(theme);

  return (
    <TouchableOpacity
      style={[
        s.button, variant === 'outline' && s.outline,
        variant === 'danger' && s.danger, variant === 'ghost' && s.ghost,
        disabled && s.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.accent : theme.headerText} />
      ) : (
        <>
          {icon}
          <Text style={[
            s.text, variant === 'outline' && s.outlineText,
            variant === 'danger' && s.dangerText, variant === 'ghost' && s.ghostText,
          ]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const makeStyles = (theme) => StyleSheet.create({
  button: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: theme.accent, paddingVertical: 14, paddingHorizontal: 24,
    borderRadius: 12, gap: 8, elevation: 2,
    shadowColor: theme.accent, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 6,
  },
  outline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: theme.accent, elevation: 0, shadowOpacity: 0 },
  danger: { backgroundColor: '#E17055', shadowColor: '#E17055' },
  ghost: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0, paddingVertical: 8, paddingHorizontal: 12 },
  disabled: { opacity: 0.6 },
  text: { color: theme.headerText, fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  outlineText: { color: theme.accent },
  dangerText: { color: theme.headerText },
  ghostText: { color: theme.accent, fontSize: 14, fontWeight: '600' },
});

export default CustomButton;
