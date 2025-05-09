// app/(tabs)/favorites.tsx

import React, { useEffect, useState, useRef } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { fetchDoxFilms } from '../api/doxFilmApi'
import { fetchFavorites, removeFavorite } from '../api/favoritesApi'
import type { Film } from '../types/filmTypes'

const HEADER_OFFSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 60 : 60

export default function FavoritesScreen() {
  const router = useRouter()
  const [allFilms, setAllFilms] = useState<Film[]>([])
  const [favIds, setFavIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start()

    let alive = true
    Promise.all([fetchDoxFilms(), fetchFavorites()])
      .then(([films, favArray]) => {
        if (!alive) return
        setAllFilms(films)
        // her er ID’erne strings, så vi bruger Set<string>
        setFavIds(new Set(favArray.map((f) => f.id.toString())))
      })
      .catch(console.error)
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const handleRemove = async (id: number) => {
    await removeFavorite(id)
    const next = new Set(favIds)
    next.delete(id.toString())
    setFavIds(next)
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  // filtrér filmene mod dine favoritter
  const favFilms = allFilms.filter((f) => favIds.has(f.id.toString()))

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favFilms}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <Text style={styles.headerMain}>MY FAVORITES</Text>
            <Text style={styles.headerSub}>
              Here are the films you’ve saved. Tap a title to view details.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.block}>
            <View style={styles.headerRow}>
              <Text style={styles.user}>{item.title.toUpperCase()}</Text>
              <Pressable onPress={() => handleRemove(item.id)} hitSlop={12}>
                <Ionicons name="trash-outline" size={20} color="#000" />
              </Pressable>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/movie/[id]',
                  params: { id: item.id.toString() },
                })
              }
              style={styles.filmCard}
            >
              <Animated.View style={[styles.posterMock, { opacity: fadeAnim }]} />
              <Text style={styles.filmTitle} numberOfLines={3}>
                {item.title.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            YOU HAVEN’T SAVED ANY FILMS YET
          </Text>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  list: {
    paddingTop: HEADER_OFFSET + 8,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerBlock: { marginBottom: 24, alignItems: 'center' },
  headerMain: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#000',
  },
  headerSub: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  block: {
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#000',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  user: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1,
    flex: 1,
    marginRight: 8,
  },

  filmCard: {
    marginTop: 12,
    width: '100%',
    aspectRatio: 2 / 3,
    backgroundColor: '#0047FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  posterMock: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0047FF',
  },
  filmTitle: {
    marginTop: 8,
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    paddingHorizontal: 6,
    textTransform: 'uppercase',
  },

  emptyListText: {
    marginTop: 60,
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 1,
  },
})
