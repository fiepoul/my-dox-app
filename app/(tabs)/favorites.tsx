// app/favorites.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

export default function FavoritesScreen() {
  // Dummy-data for brugerens egne favoritter
  const [myFavorites] = useState([
    { id: '1', title: 'Dokumentar 1' },
    { id: '2', title: 'Film 2' },
    { id: '3', title: 'Dokumentar 3' },
  ]);

  // Dummy-data for venners favoritter
  const [friendsFavorites] = useState([
    { id: '4', title: 'Venners Dokumentar 1', friendName: 'Maja' },
    { id: '5', title: 'Venners Film 2', friendName: 'Lars' },
  ]);

  const renderMyFavoriteItem = ({ item }: { item: { id: string; title: string } }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
    </View>
  );

  const renderFriendFavoriteItem = ({ item }: { item: { id: string; title: string; friendName: string } }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.friendName}>– {item.friendName}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Topbar med logo og profilknap */}
      <View style={styles.topBar}>
        <Text style={styles.logo}>CPH:DOX</Text>
        <TouchableOpacity style={styles.profileButton} onPress={() => { /* Naviger til profil om nødvendigt */ }}>
          <Text style={styles.profileText}>Profil</Text>
        </TouchableOpacity>
      </View>
      {/* Sektion: My Favorites */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>My Favorites</Text>
        <FlatList
          data={myFavorites}
          keyExtractor={(item) => item.id}
          renderItem={renderMyFavoriteItem}
        />
      </View>
      {/* Sektion: Friends' Favorites */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Friends' Favorites</Text>
        <FlatList
          data={friendsFavorites}
          keyExtractor={(item) => item.id}
          renderItem={renderFriendFavoriteItem}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  logo: { fontSize: 22, color: '#fff', fontWeight: 'bold' },
  profileButton: { padding: 8, backgroundColor: '#444', borderRadius: 8 },
  profileText: { color: '#fff' },
  section: { marginVertical: 12 },
  sectionHeader: { fontSize: 20, color: '#fff', marginBottom: 8 },
  itemContainer: { padding: 12, backgroundColor: '#222', borderRadius: 8, marginBottom: 8 },
  itemTitle: { fontSize: 16, color: '#fff' },
  friendName: { fontSize: 14, color: '#ccc', marginTop: 4 },
});
