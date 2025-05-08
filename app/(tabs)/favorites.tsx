// app/(tabs)/favorites.tsx
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import { fetchDoxFilms } from '../api/doxFilmApi'
import {
  fetchFavorites,
  removeFavorite,
} from '../api/favoritesApi'
import type { Film } from '../types/filmTypes'

export default function FavoritesScreen() {
  const [allFilms, setAllFilms] = useState<Film[]>([])
  const [favIds, setFavIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true

    Promise.all([
      fetchDoxFilms(),    // your films API
      fetchFavorites(),   // returns Promise<{ id: string; title: string; posterUrl?: string }[]>
    ])
      .then(([films, favArray]) => {
        if (!alive) return
        setAllFilms(films)

        // build a Set<string> of just the IDs:
        const idSet = new Set<string>(favArray.map((f) => f.id))
        setFavIds(idSet)
      })
      .catch(console.error)
      .finally(() => setLoading(false))

    return () => {
      alive = false
    }
  }, [])

  const handleRemove = async (filmId: number) => {
    try {
      await removeFavorite(filmId)
      // remove from local Set
      const clone = new Set(favIds)
      clone.delete(filmId.toString())
      setFavIds(clone)
    } catch (e) {
      console.error('Could not remove favorite', e)
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const favFilms = allFilms.filter((f) => favIds.has(f.id.toString()))

  if (favFilms.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Ingen favoritter endnu</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={favFilms}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Pressable
            onPress={() => handleRemove(item.id)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Fjern</Text>
          </Pressable>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 16, marginBottom: 8 },
  button: {
    alignSelf: 'flex-end',
    padding: 6,
    backgroundColor: '#ff5f6d',
    borderRadius: 4,
  },
  buttonText: { color: '#fff' },
})
