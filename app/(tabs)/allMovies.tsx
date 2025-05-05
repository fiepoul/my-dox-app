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
import type { Film } from '../types/filmTypes';

export default function AllFilmsScreen() {
  const router = useRouter();
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoxFilms()
      .then((data: Film[]) => setFilms(data))
      .catch((err) => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  }, []);

  const handlePress = (id: number) => {
    router.push({ pathname: '/movie', params: { id: id.toString() } });
  };

  const renderFilm = ({ item }: { item: Film }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.id)}>
      <View style={styles.posterPlaceholder}>
        <Text style={styles.posterText}>Plakat</Text>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

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
      {/* DOX Style Overskrift */}
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
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android shadow
    elevation: 3,
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
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});