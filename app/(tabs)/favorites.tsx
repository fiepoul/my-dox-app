// app/(tabs)/favorites.tsx

import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
  Animated,
} from 'react-native'
import { useRouter } from 'expo-router'
import { fetchDoxFilms } from '../api/doxFilmApi'
import { fetchFavorites, removeFavorite } from '../api/favoritesApi'
import type { Film } from '../types/filmTypes'
import FilmCard from '@/components/filmCard'

const HEADER_OFFSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 60 : 60

export default function FavoritesScreen() {
  const router = useRouter()
  const [films, setFilms] = useState<Film[]>([])
  const [favIds, setFavIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Load data + fade-in
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start()

    let alive = true
    ;(async () => {
      try {
        const [all, favArray] = await Promise.all([fetchDoxFilms(), fetchFavorites()])
        if (!alive) return
        setFilms(all)
        setFavIds(new Set(favArray.map((f) => f.id.toString())))
      } catch (e) {
        console.error('Failed to load', e)
      } finally {
        alive && setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [])

  // Remove a favorite
  const handleRemove = useCallback(async (id: number) => {
    await removeFavorite(id)
    setFavIds((prev) => {
      const next = new Set(prev)
      next.delete(id.toString())
      return next
    })
  }, [])

  // Only the films you’ve favorited
  const favoriteFilms = useMemo(
    () => films.filter((f) => favIds.has(f.id.toString())),
    [films, favIds]
  )

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favoriteFilms}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.list,
          { paddingTop: HEADER_OFFSET + 24 }, // rykkes længere ned
        ]}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.accentStripe} />
            <Text style={styles.headerMain}>MY FAVORITES</Text>
            <Text style={styles.headerSub}>
              Here are the films you’ve saved. Tap a poster to dive deeper.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            YOU HAVEN’T SAVED ANY FILMS YET
          </Text>
        }
        renderItem={({ item }) => (
          <FilmCard
            film={item}
            isFavorite={true}
            onPress={(id) =>
              router.push({ pathname: '/movie/[id]', params: { id: id.toString() } })
            }
            onToggleFavorite={({ id }) => handleRemove(id)}
          />
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  headerBlock: {
    marginBottom: 24,
    alignItems: 'center',
    zIndex: 1,
  },
  accentStripe: {
    width: 80,
    height: 4,
    backgroundColor: '#0047ff',
    marginBottom: 8,
    transform: [{ rotate: '-8deg' }], // lille surreal vinkel
  },
  headerMain: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#000',
    transform: [{ skewX: '-3deg' }], // Bauhaus/surreal hint
    marginBottom: 6,
  },
  headerSub: {
    maxWidth: 280,
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 1,
  },

  emptyText: {
    marginTop: 60,
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    fontStyle: 'italic',
  },
})
