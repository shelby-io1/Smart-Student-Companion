import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TextInput, TouchableOpacity, RefreshControl, Alert,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fetchWeather, fetchPopularMovies, searchMovies } from '../services/api';
import WeatherCard from '../components/WeatherCard';
import CustomCard from '../components/CustomCard';
import LoadingIndicator from '../components/LoadingIndicator';
import { useTheme } from '../utils/ThemeContext';

const ExploreScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const s = makeStyles(theme);
  const [weather, setWeather] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = useCallback(async () => {
    setWeatherLoading(true);
    setLoading(true);
    setError(null);

    const [weatherData, moviesData] = await Promise.all([
      fetchWeather('London').catch(() => null),
      fetchPopularMovies().catch(() => []),
    ]);

    if (weatherData) setWeather(weatherData);
    if (moviesData.length > 0) setMovies(moviesData);

    if (!weatherData && moviesData.length === 0) {
      setError('Failed to load data. Check your API keys.');
    }

    setWeatherLoading(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await searchMovies(searchQuery.trim());
      setMovies(results);
    } catch (err) {
      Alert.alert('Error', 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity
      style={s.movieCard}
      onPress={() => navigation.navigate('Detail', { item })}
      activeOpacity={0.8}
    >
      <View style={s.movieImageContainer}>
        {item.image ? (
          <ImageBackground source={{ uri: item.image }} style={s.movieImage} imageStyle={{ borderRadius: 10 }} />
        ) : (
          <View style={s.moviePlaceholder}>
            <Ionicons name="film-outline" size={32} color={theme.textMuted} />
          </View>
        )}
      </View>
      <View style={s.movieInfo}>
        <Text style={s.movieTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={s.movieDesc} numberOfLines={2}>{item.description || 'No description available'}</Text>
        <View style={s.movieMeta}>
          <View style={s.ratingBadge}>
            <Ionicons name="star" size={12} color="#FFD700" />
            <Text style={s.ratingText}>{item.rating?.toFixed(1)}</Text>
          </View>
          <Text style={s.movieDate}>{item.releaseDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading && movies.length === 0) {
    return <LoadingIndicator message="Loading explore data..." />;
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Explore</Text>
        <Text style={s.headerSubtitle}>Discover weather & movies</Text>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {error && (
              <View style={s.errorBanner}>
                <Ionicons name="alert-circle" size={18} color="#E17055" />
                <Text style={s.errorText}>{error}</Text>
              </View>
            )}

            <View style={s.weatherSection}>
              <Text style={s.sectionTitle}>
                <Ionicons name="partly-sunny" size={18} color={theme.accent} /> Weather
              </Text>
              {weatherLoading ? (
                <LoadingIndicator message="Fetching weather..." size="small" />
              ) : weather ? (
                <WeatherCard weather={weather} />
              ) : null}
            </View>

            <View style={s.searchSection}>
              <Text style={s.sectionTitle}>
                <Ionicons name="film" size={18} color={theme.accent} /> Movies
              </Text>
              <View style={s.searchBar}>
                <Ionicons name="search" size={20} color={theme.textMuted} />
                <TextInput
                  style={s.searchInput}
                  placeholder="Search movies..."
                  placeholderTextColor={theme.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                  returnKeyType="search"
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => { setSearchQuery(''); loadData(); }}>
                    <Ionicons name="close-circle" size={20} color={theme.textMuted} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          !loading && (
            <View style={s.emptyState}>
              <Ionicons name="film-outline" size={50} color={theme.textMuted} />
              <Text style={s.emptyText}>No movies found</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

const makeStyles = (theme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.backgroundColor },
  header: {
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16,
    backgroundColor: theme.cardBackground, borderBottomWidth: 1, borderBottomColor: theme.borderLight,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: theme.textPrimary },
  headerSubtitle: { fontSize: 14, color: theme.textSecondary, marginTop: 4 },
  list: { padding: 16, paddingBottom: 24 },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FEE8E6', padding: 12, borderRadius: 12, marginBottom: 16,
  },
  errorText: { color: '#E17055', fontSize: 13, flex: 1 },
  weatherSection: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 18, fontWeight: '700', color: theme.textPrimary, marginBottom: 10,
  },
  searchSection: { marginBottom: 16 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.cardBackground, borderRadius: 12, paddingHorizontal: 14, height: 46,
    borderWidth: 1, borderColor: theme.borderLight, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: theme.textPrimary },
  movieCard: {
    flexDirection: 'row', backgroundColor: theme.cardBackground, borderRadius: 14, padding: 12,
    marginBottom: 10, elevation: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 6,
  },
  movieImageContainer: { width: 80, height: 120, borderRadius: 10, overflow: 'hidden' },
  movieImage: { width: '100%', height: '100%' },
  moviePlaceholder: {
    width: '100%', height: '100%', backgroundColor: '#F0F3F5',
    justifyContent: 'center', alignItems: 'center',
  },
  movieInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  movieTitle: { fontSize: 15, fontWeight: '700', color: theme.textPrimary },
  movieDesc: { fontSize: 13, color: theme.textSecondary, marginTop: 4, lineHeight: 18 },
  movieMeta: {
    flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12,
  },
  ratingBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#FFF8E1', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 8,
  },
  ratingText: { fontSize: 12, fontWeight: '700', color: '#F57F17' },
  movieDate: { fontSize: 12, color: theme.textMuted },
  emptyState: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 14, color: theme.textMuted, marginTop: 8 },
});

export default ExploreScreen;
