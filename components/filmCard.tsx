// components/FilmCard.tsx

import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native'
import * as Haptics from 'expo-haptics'
import type { Film } from '@/app/types/filmTypes'

interface FilmCardProps {
  film: Film
  isFavorite: boolean
  onPress: (id: number) => void
  onToggleFavorite: (film: Film) => void
}

export default function FilmCard({
  film,
  isFavorite,
  onPress,
  onToggleFavorite,
}: FilmCardProps) {
  const infoParts = [
    film.director,
    film.year != null ? film.year.toString() : null,
    film.country,
    film.category,
  ]
    .filter(Boolean)
    .join(' / ')

  return (
    <View style={styles.card}>
      {/* Poster */}
      <TouchableOpacity
        style={styles.poster}
        onPress={() => {
          onPress(film.id)
          if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.posterText}>DOX</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>
          {film.title.toUpperCase()}
        </Text>

        {/* Tagline (show full) */}
        {film.tagline ? (
          <Text style={styles.tagline}>
            {film.tagline}
          </Text>
        ) : null}

        {/* Info line */}
        <Text style={styles.infoRow}>{infoParts}</Text>
      </View>

      {/* Favorite icon */}
      <TouchableOpacity
        onPress={() => onToggleFavorite(film)}
        style={styles.heartContainer}
        hitSlop={8}
      >
        <Text style={[styles.heart, isFavorite && styles.heartActive]}>
          {isFavorite ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    width: '49%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 16,
    position: 'relative',
  },
  poster: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#0047FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
  },
  content: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '900',
    color: '#000',
    marginBottom: 4,
    lineHeight: 18,
    letterSpacing: 1,
  },
  tagline: {
    fontStyle: 'italic',
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
    lineHeight: 16,
  },
  infoRow: {
    fontSize: 10,
    color: '#777',
    textAlign: 'center',
    marginBottom: 4,
  },
  heartContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  heart: {
    fontSize: 18,
    color: '#ccc',
  },
  heartActive: {
    color: '#ff5f6d',
  },
})
