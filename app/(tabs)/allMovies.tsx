// app/(tabs)/allMovies.tsx

import React, { useEffect, useState, useCallback } from 'react'
import {
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native'
import { useRouter } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { fetchDoxFilms } from '../api/doxFilmApi'
import { addFavorite, removeFavorite, fetchFavorites } from '../api/favoritesApi'
import type { Film } from '../types/filmTypes'
import FilmCard from '@/components/filmCard'

const HEADER_HEIGHT = 80

export default function AllFilmsScreen() {
  const router = useRouter()
  const [films, setFilms] = useState<Film[]>([])
  const [favIds, setFavIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    try {
      const [filmsData, favArray] = await Promise.all([
        fetchDoxFilms(),
        fetchFavorites(),
      ])
      setFilms(filmsData)
      setFavIds(new Set(favArray.map(f => f.id.toString())))
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handlePress = useCallback(
    (id: number) => {
      router.push({ pathname: '/movie/[id]', params: { id: id.toString() } })
    },
    [router]
  )

  const toggleFavorite = useCallback(
    async (film: Film) => {
      const idStr = film.id.toString()
      const next = new Set(favIds)
      if (next.has(idStr)) {
        await removeFavorite(film.id)
        next.delete(idStr)
      } else {
        await addFavorite({
          id: film.id,
          title: film.title,
          posterUrl: film.posterUrl ?? undefined,
        })
        next.add(idStr)
        if (Platform.OS !== 'web') Haptics.selectionAsync()
      }
      setFavIds(next)
    },
    [favIds]
  )

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={films}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FilmCard
            film={item}
            isFavorite={favIds.has(item.id.toString())}
            onPress={handlePress}
            onToggleFavorite={toggleFavorite}
          />
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:
      Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  list: {
    paddingTop: HEADER_HEIGHT,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
