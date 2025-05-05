// app/index.tsx
import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Animated, 
  FlatList,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Dummy data til dine favoritfilm
  const movies = [
    { id: '1', title: 'Film A' },
    { id: '2', title: 'Film B' },
    { id: '3', title: 'Film C' },
    { id: '4', title: 'Film D' },
    { id: '5', title: 'Film E' },
    { id: '6', title: 'Film F' },
  ];

  // Udregn kortets bredde for et grid med 2 kolonner (med lidt margin til padding)
  const cardWidth = (Dimensions.get('window').width - 48) / 2;

  // Renderer hvert filmkort som en touchable komponent
  const renderItem = ({ item }: { item: { id: string; title: string } }) => (
    <TouchableOpacity 
      style={[styles.card, { width: cardWidth, height: cardWidth + 40 }]}
      onPress={() => {
        // Eventuelt: Naviger til detaljesiden for filmen
        router.push(`./movie/${item.id}`);
      }}
    >
      {/* Pladsholder for filmplakaten */}
      <View style={styles.imagePlaceholder} />
      <Text style={styles.movieTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Baggrundsgradient som sætter stemningen */}
      <LinearGradient colors={['#000', '#333']} style={StyleSheet.absoluteFill} />

      {/* Header med logo */}
      <View style={styles.header}>
        <Text style={styles.logo}>CPH:DOX</Text>
      </View>

      {/* Animated content med et grid af favoritfilm */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <FlatList 
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  header: { 
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingTop: 10,
    zIndex: 1, // Sikrer at headeren vises over baggrunden
  },
  logo: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  content: { 
    flex: 1, 
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    // Simpel skygge for at give indtryk af dybde
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1, // Gør billedområdet firkantet
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginBottom: 8,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
});

