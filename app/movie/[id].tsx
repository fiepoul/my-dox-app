// app/(tabs)/movie/[id].tsx

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
        const found = data.find(f => f.id.toString() === id);
        setMovie(found ?? null);
      })
      .catch(err => console.error('Fetch error:', err))
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
          <Text style={styles.notFound}>Film not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const infoParts: string[] = [];
  if (movie.director) infoParts.push(movie.director);
  if (movie.year != null) infoParts.push(movie.year.toString());
  if (movie.country) infoParts.push(movie.country);
  if (movie.category) infoParts.push(movie.category);

  return (
    <SafeAreaView style={styles.container}>
      {/* Surreal abstract shape */}
      <View style={styles.surrealShape} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButtonContainer}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{movie.title}</Text>
        </View>

        {/* Poster Placeholder with “cutout” */}
        <View style={styles.posterPlaceholder}>
          <View style={styles.posterCutout} />
          <Text style={styles.posterText}>Poster</Text>
        </View>

        {/* Info Row */}
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
          {movie.description || 'No description available'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#fff'
  },
  scrollContent: {
    paddingVertical: 24, paddingHorizontal: 16
  },
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center'
  },
  notFound: {
    fontSize: 18, fontStyle: 'italic', color: '#888'
  },
  surrealShape: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0,68,255,0.06)',
    top: 150,
    right: -60,
    transform: [{ scaleX: 1.3 }, { scaleY: 0.8 }]
  },
  headerWrapper: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 8,
    paddingBottom: 4,
    position: 'relative',
  },
  backButtonContainer: {
    position: 'absolute', left: 0, top: 8
  },
  backButton: {
    fontSize: 16, color: '#555', fontStyle: 'italic'
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    color: '#000',
    transform: [{ rotate: '-3deg' }],
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    paddingHorizontal: 32,
    lineHeight: 36,
  },
  posterPlaceholder: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden'
  },
  posterCutout: {
    position: 'absolute',
    top: '30%',
    left: '25%',
    width: '60%',
    height: '50%',
    backgroundColor: '#fff',
    opacity: 0.7,
    transform: [{ rotate: '15deg' }],
  },
  posterText: {
    color: '#aaa',
    fontSize: 16,
    fontStyle: 'italic'
  },
  infoRow: {
    textAlign: 'center',
    fontSize: 14,
    color: '#444',
    fontStyle: 'italic',
    fontWeight: '300',
    marginBottom: 16,
  },
  tagline: {
    fontStyle: 'italic',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: '700',
    lineHeight: 26,
    color: '#333',
    textAlign: 'justify',
  }
});
