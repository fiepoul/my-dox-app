import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { fetchDoxFilms } from '../api/doxFilmApi';
import type { Film } from '../types/filmTypes';

export default function MovieScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [movie, setMovie] = useState<Film | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoxFilms()
      .then((data: Film[]) => {
        const found = data.find((f) => f.id.toString() === id);
        setMovie(found ?? null);
      })
      .catch((err) => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  if (!movie) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Film ikke fundet</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Build info parts without labels
  const infoParts = [];
  if (movie.director) infoParts.push(movie.director);
  if (movie.year != null) infoParts.push(movie.year.toString());
  if (movie.country) infoParts.push(movie.country);
  if (movie.category) infoParts.push(movie.category);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>← Tilbage</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{movie.title}</Text>
        </View>

        {/* Poster Placeholder (reduced size) */}
        <View style={styles.posterPlaceholder}>
          <Text style={styles.posterText}>Plakat</Text>
        </View>

        {/* Info Row: director / year / country / category */}
        {infoParts.length > 0 && (
          <Text style={styles.infoRow}>{infoParts.join(' / ')}</Text>
        )}

        {/* Tagline */}
        {movie.tagline ? (
          <Text style={styles.tagline} numberOfLines={3}>
            {movie.tagline}
          </Text>
        ) : null}

        {/* Description */}
        <Text style={styles.description}>
          {movie.description || 'Ingen beskrivelse tilgængelig'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  scrollContent: {
    paddingVertical: 16
    // no horizontal padding to allow full-width poster
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16
  },
  backButton: {
    fontSize: 18,
    marginRight: 12,
    color: '#000',
    paddingHorizontal: 16
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginRight: 24
  },
  posterPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    // remove border radius for flush appearance
    marginBottom: 16
  },
  posterText: {
    color: '#666',
    fontSize: 16
  },
  infoRow: {
    textAlign: 'center',
    fontSize: 14,
    color: '#444',
    marginBottom: 12,
    paddingHorizontal: 16
  },
  tagline: {
    fontStyle: 'italic',
    fontSize: 16,
    marginBottom: 12,
    color: '#555',
    paddingHorizontal: 16
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    paddingHorizontal: 16
  }
});
