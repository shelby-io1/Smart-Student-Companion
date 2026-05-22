import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  ImageBackground, TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';

const { width } = Dimensions.get('window');

const DetailScreen = ({ route, navigation }) => {
  const { theme } = useTheme();
  const s = makeStyles(theme);
  const { item } = route.params;

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.imageContainer}>
          {item.image ? (
            <ImageBackground source={{ uri: item.image }} style={s.image}>
              <View style={s.imageOverlay}>
                <TouchableOpacity style={s.backButton} onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={24} color={theme.headerText} />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          ) : (
            <View style={s.imagePlaceholder}>
              <TouchableOpacity style={s.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={theme.headerText} />
              </TouchableOpacity>
              <Ionicons name="film-outline" size={60} color={theme.textMuted} />
            </View>
          )}
        </View>

        <View style={s.content}>
          <Text style={s.title}>{item.title}</Text>

          <View style={s.metaRow}>
            {item.rating && (
              <View style={s.metaItem}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={s.metaText}>{item.rating?.toFixed(1)} / 10</Text>
              </View>
            )}
            {item.releaseDate && (
              <View style={s.metaItem}>
                <Ionicons name="calendar-outline" size={16} color={theme.textSecondary} />
                <Text style={s.metaText}>{item.releaseDate}</Text>
              </View>
            )}
            {item.runtime && (
              <View style={s.metaItem}>
                <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
                <Text style={s.metaText}>{item.runtime} min</Text>
              </View>
            )}
          </View>

          {item.genres && item.genres.length > 0 && (
            <View style={s.genreRow}>
              {item.genres.map((genre, index) => (
                <View key={index} style={s.genreBadge}>
                  <Text style={s.genreText}>{genre}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={s.section}>
            <Text style={s.sectionTitle}>Overview</Text>
            <Text style={s.overview}>
              {item.description || 'No description available.'}
            </Text>
          </View>

          {item.voteCount && (
            <View style={s.statsRow}>
              <View style={s.statItem}>
                <Text style={s.statValue}>{item.voteCount}</Text>
                <Text style={s.statLabel}>Votes</Text>
              </View>
              <View style={s.statItem}>
                <Text style={s.statValue}>{item.rating?.toFixed(1)}</Text>
                <Text style={s.statLabel}>Rating</Text>
              </View>
              <View style={s.statItem}>
                <Text style={s.statValue}>{item.releaseDate?.split('-')[0]}</Text>
                <Text style={s.statLabel}>Year</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const makeStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.backgroundColor },
  imageContainer: { width, height: width * 0.6 },
  image: { width: '100%', height: '100%' },
  imageOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.2)',
    paddingTop: 16, paddingLeft: 16,
  },
  imagePlaceholder: {
    width: '100%', height: '100%',
    backgroundColor: theme.headerBg,
    justifyContent: 'center', alignItems: 'center',
    paddingTop: 16, paddingLeft: 16,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center', alignItems: 'center',
    alignSelf: 'flex-start',
  },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', color: theme.textPrimary },
  metaRow: { flexDirection: 'row', gap: 16, marginTop: 12, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 13, color: theme.textSecondary },
  genreRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  genreBadge: {
    backgroundColor: theme.cardBackground, paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20,
  },
  genreText: { fontSize: 12, color: theme.accent, fontWeight: '600' },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: theme.textPrimary, marginBottom: 8 },
  overview: { fontSize: 14, color: theme.textSecondary, lineHeight: 22 },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    backgroundColor: theme.cardBackground, borderRadius: 14, padding: 16, marginTop: 20,
    elevation: 2, shadowColor: theme.border,
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 6,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: theme.accent },
  statLabel: { fontSize: 12, color: theme.textSecondary, marginTop: 2 },
});

export default DetailScreen;
