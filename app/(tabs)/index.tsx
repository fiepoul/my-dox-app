import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Animated, 
  TouchableOpacity, 
  ScrollView, 
  FlatList 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

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

  const goToFavorite = () => {
    router.push('/favorites');
  };

  const goToFriends = () => {
    router.push('/friends');
  };

  const Poster = ({ title }: { title: string }) => (
    <View style={styles.poster}>
      <Text style={styles.posterText}>{title}</Text>
    </View>
  );

  const renderPosterRow = (data: string[]) => (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `${item}-${index}`}
      renderItem={({ item }) => <Poster title={item} />}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 12 }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0f0f0f', '#1a1a1a']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Text style={styles.logo}>CPH:DOX</Text>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Welcome to the DOX Festival App</Text>
          <Text style={styles.subtitle}>
            Explore your favorite films and discover what your friends are watching.
          </Text>

          {/* My Favorites Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={goToFavorite}>
              <Text style={styles.sectionTitle}>My Favorites</Text>
              <AntDesign name="right" size={16} color="#fff" />
            </TouchableOpacity>
            {renderPosterRow(['The Silent Forest', 'Dystopia Dreams', 'Echoes of Nature', 'Reflections'])}
          </View>

          {/* Friends' Favorites Section */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.sectionHeader} onPress={goToFriends}>
              <Text style={styles.sectionTitle}>Friends' Favorites</Text>
              <AntDesign name="right" size={16} color="#fff" />
            </TouchableOpacity>
            {renderPosterRow(['Ghosts of CPH', 'Beyond the Frame', 'Parallel Voices', 'Lost in Light'])}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#000',
  },
  header: { 
    height: 60, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingTop: 10,
  },
  logo: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#fff', 
    letterSpacing: 1.5,
  },
  content: { 
    flex: 1, 
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: { 
    fontSize: 24, 
    color: '#fff', 
    fontWeight: '600', 
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: { 
    fontSize: 16, 
    color: '#aaa', 
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  poster: {
    width: 110,
    height: 165,
    backgroundColor: '#333',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  posterText: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 6,
  }
});
