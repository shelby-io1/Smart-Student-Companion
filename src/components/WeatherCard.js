import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../utils/ThemeContext';

const WeatherCard = ({ weather }) => {
  const { theme } = useTheme();
  const s = makeStyles(theme);

  if (!weather) return null;

  return (
    <View style={s.container}>
      <View style={s.row}>
        <Image source={{ uri: weather.icon }} style={s.icon} />
        <View style={s.tempContainer}>
          <Text style={s.temperature}>{weather.temperature}°C</Text>
          <Text style={s.condition}>{weather.condition}</Text>
        </View>
      </View>
      <Text style={s.description}>{weather.description}</Text>
      <View style={s.details}>
        <View style={s.detailItem}>
          <Text style={s.detailLabel}>Humidity</Text>
          <Text style={s.detailValue}>{weather.humidity}%</Text>
        </View>
        <View style={s.detailItem}>
          <Text style={s.detailLabel}>Wind</Text>
          <Text style={s.detailValue}>{weather.windSpeed} m/s</Text>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (theme) => StyleSheet.create({
  container: {
    backgroundColor: theme.accent,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    elevation: 4,
    shadowColor: theme.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 80, height: 80 },
  tempContainer: { marginLeft: 10 },
  temperature: { fontSize: 42, fontWeight: '800', color: theme.headerText },
  condition: { fontSize: 18, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  description: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textTransform: 'capitalize', marginTop: 4 },
  details: {
    flexDirection: 'row', marginTop: 12, paddingTop: 12,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)',
  },
  detailItem: { flex: 1, alignItems: 'center' },
  detailLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  detailValue: { fontSize: 16, color: theme.headerText, fontWeight: '700', marginTop: 2 },
});

export default WeatherCard;
