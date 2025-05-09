import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { fetchDoxFilms } from '../api/doxFilmApi'
import {
  addFavorite,
  removeFavorite,
  fetchFavorites,
} from '../api/favoritesApi'
import type { Film } from '../types/filmTypes'

const HEADER_HEIGHT = 80 // adjust based on HeaderWithLogout height

export default function AllFilmsScreen() {
  const router = useRouter()
  const [films, setFilms] = useState<Film[]>([])
  const [favIds, setFavIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    Promise.all([fetchDoxFilms(), fetchFavorites()])
      .then(([filmsData, favArray]) => {
        if (!alive) return
        setFilms(filmsData)
        const favSet = new Set(favArray.map((f) => f.id))
        setFavIds(favSet)
      })
      .catch((err) => console.error('Fetch error:', err))
      .finally(() => alive && setLoading(false))

    return () => {
      alive = false
    }
  }, [])

  const handlePress = (id: number) => {
    router.push({
      pathname: '/movie/[id]',
      params: { id: id.toString() },
    })
  }

  const toggleFavorite = async (film: Film) => {
    const idStr = film.id.toString()
    const newSet = new Set(favIds)

    if (newSet.has(idStr)) {
      await removeFavorite(film.id)
      newSet.delete(idStr)
    } else {
      await addFavorite({
        id: film.id,
        title: film.title,
        posterUrl: film.posterUrl ?? undefined,
      })
      newSet.add(idStr)

      if (Platform.OS !== 'web') {
        Haptics.selectionAsync()
      }
    }

    setFavIds(newSet)
  }

  const renderFilm = ({ item }: { item: Film }) => {
    const idStr = item.id.toString()
    const isFav = favIds.has(idStr)

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePress(item.id)}
        activeOpacity={0.85}
      >
        <View style={styles.poster}>
          <Text style={styles.posterText}>DOX</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title.toUpperCase()}
          </Text>
          <TouchableOpacity
            onPress={() => toggleFavorite(item)}
            hitSlop={10}
            style={styles.heartContainer}
          >
            <Text style={[styles.heart, isFav && styles.heartActive]}>
              {isFav ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={films}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFilm}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT,
          paddingBottom: 32,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: '48%',
    borderWidth: 2,
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  poster: {
    backgroundColor: '#0047FF',
    aspectRatio: 2 / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 4,
  },
  footer: {
    padding: 12,
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heartContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 6,
  },
  heart: {
    fontSize: 18,
    color: '#ccc',
  },
  heartActive: {
    color: '#ff5f6d',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
