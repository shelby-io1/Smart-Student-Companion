import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

const CustomCard = ({ title, subtitle, children, onPress, variant = 'default', icon }) => {
  const { theme } = useTheme();
  const s = makeStyles(theme);
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container style={[s.card, variant === 'compact' && s.compact]} onPress={onPress} activeOpacity={0.8}>
      {title && (
        <View style={s.header}>
          {icon && <View style={s.iconWrapper}>{icon}</View>}
          <View style={s.headerText}>
            <Text style={s.title}>{title}</Text>
            {subtitle && <Text style={s.subtitle}>{subtitle}</Text>}
          </View>
        </View>
      )}
      {children && <View style={s.content}>{children}</View>}
    </Container>
  );
};

const makeStyles = (theme) => StyleSheet.create({
  card: {
    backgroundColor: theme.cardBackground, borderRadius: 16, padding: 16,
    marginVertical: 6, marginHorizontal: 2, elevation: 3,
    shadowColor: theme.textPrimary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, borderWidth: 1, borderColor: theme.borderLight,
  },
  compact: { padding: 12, marginVertical: 4 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconWrapper: { marginRight: 10 },
  headerText: { flex: 1 },
  title: { fontSize: 17, fontWeight: '700', color: theme.textPrimary },
  subtitle: { fontSize: 13, color: theme.textSecondary, marginTop: 2 },
  content: { marginTop: 4 },
});

export default CustomCard;
