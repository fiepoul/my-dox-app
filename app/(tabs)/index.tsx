import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { fetchFavorites } from '../api/favoritesApi';
import { fetchFriendsFavorites } from '../api/friendsApi';
import { fetchDoxFilms } from '../api/doxFilmApi';
import { fetchCurrentUserData } from '../api/userApi';
import type { Film } from '../types/filmTypes';

const SCREEN_WIDTH = Dimensions.get('window').width;

type FriendFavorite = {
  uid: string;
  fullName: string;
  username: string;
  favorites: number[];
};

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  const [fullName, setFullName] = useState('Guest');
  const [myFavorites, setMyFavorites] = useState<number[]>([]);
  const [friendsFavorites, setFriendsFavorites] = useState<FriendFavorite[]>([]);
  const [allFilms, setAllFilms] = useState<Film[]>([]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    const loadData = async () => {
      try {
        const user = await fetchCurrentUserData();
        setFullName(user.fullName || 'Guest');

        const [films, favs, friendsFavs] = await Promise.all([
          fetchDoxFilms(),
          fetchFavorites(),
          fetchFriendsFavorites(),
        ]);

        setAllFilms(films);
        setMyFavorites(favs.map(f => Number(f.id)).filter(id => !isNaN(id)));
        setFriendsFavorites(friendsFavs);
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    };

    loadData();
  }, []);

  const goToFavorite = () => router.push('/favorites');
  const goToFriends = () => router.push('/friends');

  const Poster = ({ title, id }: { title: string; id: number }) => (
    <TouchableOpacity onPress={() => router.push(`/movie/${id}`)} style={styles.posterWrap}>
      <Animated.View style={[styles.poster, { transform: [{ scale: fadeAnim }] }]}>
        <Text style={styles.posterText}>{title}</Text>
      </Animated.View>
    </TouchableOpacity>
  );

  const renderPosterRow = (filmIds: number[]) => {
    const posters = filmIds
      .map(id => allFilms.find(f => f.id === id))
      .filter((f): f is Film => Boolean(f))
      .slice(0, 10);

    return (
      <FlatList
        data={posters}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Poster title={item.title} id={item.id} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <Text style={styles.logo}>DOX</Text>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              hi, <Text style={styles.name}>{fullName.toUpperCase()}</Text>
            </Text>
            <View style={styles.separator} />
            <Text style={styles.tagline}>
              Radical visions. Human stories. Curated cinema from CPH:DOX and beyond.
            </Text>
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={goToFavorite}>
              <Text style={styles.sectionTitle}>My Favorites</Text>
              <AntDesign name="right" size={18} color="#0047ff" />
            </TouchableOpacity>
            {myFavorites.length > 0
              ? renderPosterRow(myFavorites)
              : <Text style={styles.emptyText}>You haven’t liked any films yet.</Text>}
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={goToFriends}>
              <Text style={styles.sectionTitle}>Friends’ Favorites</Text>
              <AntDesign name="right" size={18} color="#0047ff" />
            </TouchableOpacity>
            {friendsFavorites.length > 0 ? (
              renderPosterRow(
                friendsFavorites
                  .flatMap(friend => friend.favorites)
                  .filter((id, index, arr) => arr.indexOf(id) === index)
                  .slice(0, 10)
              )
            ) : (
              <Text style={styles.emptyText}>Your friends haven’t liked any films yet.</Text>
            )}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0047ff',
    letterSpacing: 10,
    fontFamily: 'sans-serif-condensed',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  welcomeContainer: {
    marginTop: 12,
    marginBottom: 32,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  name: {
    color: '#0047ff',
  },
  separator: {
    width: 60,
    height: 2,
    backgroundColor: '#000',
    marginTop: 8,
    marginBottom: 14,
  },
  tagline: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 6,
    lineHeight: 22,
  },
  section: {
    marginBottom: 44,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  posterWrap: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  poster: {
    width: 130,
    height: 190,
    backgroundColor: '#0047ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    shadowColor: '#222',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  posterText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyText: {
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic',
    paddingLeft: 4,
  },
});
