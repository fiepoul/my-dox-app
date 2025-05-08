// app/(tabs)/allMovies.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { fetchDoxFilms } from '../api/doxFilmApi';
import {
  addFavorite,
  removeFavorite,
  fetchFavorites
} from '../api/favoritesApi';
import type { Film } from '../types/filmTypes';

export default function AllFilmsScreen() {
  const router = useRouter();
  const [films, setFilms] = useState<Film[]>([]);
  const [favIds, setFavIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    Promise.all([fetchDoxFilms(), fetchFavorites()])
      .then(([filmsData, favArray]) => {
        if (!alive) return;
        setFilms(filmsData);
        // make a Set<string> of fav IDs
        const favSet = new Set(favArray.map(f => f.id));
        setFavIds(favSet);
      })
      .catch(err => console.error('Fetch error:', err))
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  const handlePress = (id: number) => {
    router.push({
      pathname: '/movie/[id]',
      params: { id: id.toString() },
    });
  };

  // now takes the whole Film object so we can pass id:number → removeFavorite
  // and the full {id,title,posterUrl?} → addFavorite
  const toggleFavorite = async (film: Film) => {
    const idStr = film.id.toString();
    const newSet = new Set(favIds);

    if (newSet.has(idStr)) {
      await removeFavorite(film.id);
      newSet.delete(idStr);
    } else {
      await addFavorite({
        id: film.id,
        title: film.title,
        posterUrl: film.posterUrl ?? undefined,
      });
      newSet.add(idStr);
    }

    setFavIds(newSet);
  };

  const renderFilm = ({ item }: { item: Film }) => {
    const idStr = item.id.toString();
    const isFav = favIds.has(idStr);

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.posterPlaceholder}
          onPress={() => handlePress(item.id)}
        >
          <Text style={styles.posterText}>Plakat</Text>
        </TouchableOpacity>

        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <TouchableOpacity
          onPress={() => toggleFavorite(item)}
          style={styles.favoriteButton}
        >
          <Text style={[styles.heart, isFav && styles.heartFav]}>
            {isFav ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      </SafeAreaView>
    );
  }

  if (films.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Ingen film tilgængelige</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>DOX:FILMS</Text>
      </View>
      <FlatList
        data={films}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFilm}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    paddingVertical: 16,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  card: {
    flex: 1,
    marginVertical: 8,
    marginHorizontal: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingBottom: 8,
  },
  posterPlaceholder: {
    width: '100%',
    aspectRatio: 2 / 3,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  posterText: {
    color: '#888',
    fontSize: 14,
  },
  cardTitle: {
    marginTop: 8,
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  heart: {
    fontSize: 20,
    color: '#888',
  },
  heartFav: {
    color: '#ff5f6d',
  },
});
