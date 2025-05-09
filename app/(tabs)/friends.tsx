// app/(tabs)/friends.tsx

import React, { useEffect, useState, useCallback } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
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

  // Load films + friends' favorites once
  useEffect(() => {
    let alive = true
    ;(async () => {
      const films = await fetchDoxFilms()
      const favs = await fetchFriendsFavorites()
      if (!alive) return
      setAllFilms(films)
      setFriendFavs(favs)
    })()
    return () => {
      alive = false
    }
  }, [])

  // Remove a friend (mutual)
  const handleRemove = useCallback(
    async (uid: string) => {
      await removeFriend(uid)
      const favs = await fetchFriendsFavorites()
      setFriendFavs(favs)
    },
    []
  )

  // Helper: find a film title by its ID
  const findFilmTitle = (id: number) => {
    const m = allFilms.find(f => f.id === id)
    return m?.title || `Film ID ${id}`
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={friendFavs}
        keyExtractor={(item, idx) => item.uid + idx}
        contentContainerStyle={[
          styles.list,
          { paddingTop: HEADER_OFFSET + 24 }, // lift up slightly more
        ]}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.orangeShape} />
            <View style={styles.accentStripe} />
            <Text style={styles.headerMain}>MY FRIENDS</Text>
            <Text style={styles.headerFun}>
              WHY WATCH ALONE WHEN YOU CAN AUDITION A FRIEND?
            </Text>
            <AddFriend promptText="tired of your friends' film taste?" />
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            YOU HAVEN’T ADDED ANY FRIENDS YET
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.block}>
            <View style={styles.headerRow}>
              <Text style={styles.userName}>
                {item.fullName.toUpperCase()}
              </Text>
              <Pressable onPress={() => handleRemove(item.uid)} hitSlop={12}>
                <Ionicons name="trash-outline" size={20} color="#000" />
              </Pressable>
            </View>
            {item.favorites.length === 0 ? (
              <Text style={styles.emptyText}>NO LIKED FILMS YET</Text>
            ) : (
              <View style={styles.filmGrid}>
                {item.favorites.map((fid: number) => (
                  <Pressable
                    key={fid}
                    style={styles.filmCard}
                    onPress={() =>
                      router.push({
                        pathname: '/movie/[id]',
                        params: { id: fid.toString() },
                      })
                    }
                  >
                    <Text style={styles.filmTitle} numberOfLines={3}>
                      {findFilmTitle(fid).toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  headerBlock: {
    marginBottom: 12,
    alignItems: 'center',
  },
  orangeShape: {
    width: 80,
    height: 6,
    backgroundColor: '#FF8C00',
    marginBottom: 6,
    transform: [{ rotate: '12deg' }],
  },
  accentStripe: {
    width: 100,
    height: 4,
    backgroundColor: '#0047ff',
    marginBottom: 8,
    transform: [{ rotate: '-6deg' }],
  },
  headerMain: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#000',
    transform: [{ skewX: '-2deg' }],
    marginBottom: 6,
  },
  headerFun: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 12,
    paddingHorizontal: 20,
    letterSpacing: 1,
  },

  block: {
    marginBottom: 12,        // tighter spacing
    padding: 12,             // keep content padding
    // border removed
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 1,
  },

  filmGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  filmCard: {
    width: '44%',
    aspectRatio: 3 / 4,
    backgroundColor: '#0047ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderRadius: 4,
    padding: 6,
  },
  filmTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  emptyListText: {
    marginTop: 80,
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    fontStyle: 'italic',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textTransform: 'uppercase',
    fontSize: 13,
  },
})
