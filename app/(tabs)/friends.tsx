import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Pressable,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { fetchFriendsFavorites } from '../api/friendsApi'
import { fetchDoxFilms } from '../api/doxFilmApi'
import { removeFriend } from '../api/userApi'
import AddFriend from '@/components/addFriends'

const HEADER_OFFSET =
  Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 60 : 60

export default function FriendsTab() {
  const router = useRouter()
  const [friendFavs, setFriendFavs] = useState<any[]>([])
  const [allFilms, setAllFilms] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      const films = await fetchDoxFilms()
      setAllFilms(films)
      const favs = await fetchFriendsFavorites()
      setFriendFavs(favs)
    }
    load()
  }, [])

  const refreshList = async () => {
    const favs = await fetchFriendsFavorites()
    setFriendFavs(favs)
  }

  const handleRemove = async (uid: string) => {
    await removeFriend(uid)
    refreshList()
  }

  const findFilmTitle = (id: number) => {
    const match = allFilms.find(f => f.id === id)
    return match?.title || `Film ID ${id}`
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={styles.list}
        ListHeaderComponent={<AddFriend />}
        data={friendFavs}
        keyExtractor={(item, idx) => item.uid + idx}
        renderItem={({ item }) => (
          <View style={styles.block}>
            <View style={styles.headerRow}>
              <Text style={styles.user}>
                {item.fullName.toUpperCase()}{' '}
                <Text style={styles.sub}>FAVORITES</Text>
              </Text>
              <Pressable onPress={() => handleRemove(item.uid)} hitSlop={12}>
                <Ionicons name="trash-outline" size={20} color="#000" />
              </Pressable>
            </View>

            {item.favorites.length === 0 ? (
              <Text style={styles.empty}>NO LIKED FILMS YET</Text>
            ) : (
              <View style={styles.filmGrid}>
                {item.favorites.map((filmId: number) => {
                  const title = findFilmTitle(filmId).toUpperCase()
                  return (
                    <Pressable
                      key={filmId}
                      onPress={() =>
                        router.push({
                          pathname: '/movie/[id]',
                          params: { id: filmId.toString() },
                        })
                      }
                      style={styles.filmCard}
                    >
                      <Text style={styles.filmTitle} numberOfLines={3}>
                        {title}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            YOU HAVEN’T ADDED ANY FRIENDS YET
          </Text>
        }
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    paddingTop: HEADER_OFFSET + 8,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  block: {
    marginBottom: 36,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  user: {
    color: '#000',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  sub: {
    fontWeight: '700',
    color: '#000',
  },
  filmGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  filmCard: {
    width: '48%',
    aspectRatio: 3 / 4,
    backgroundColor: '#0047FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 4,
  },
  filmTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  empty: {
    color: '#888',
    fontStyle: 'italic',
    paddingTop: 4,
    fontSize: 13,
    textTransform: 'uppercase',
  },
  emptyListText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 60,
    fontWeight: '600',
    letterSpacing: 1,
  },
})
