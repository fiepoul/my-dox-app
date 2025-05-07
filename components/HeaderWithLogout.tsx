// components/HeaderWithLogout.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../app/_config/firebaseconfig';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function HeaderWithLogout() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <Animated.View style={[styles.wrapper, { opacity: fadeAnim, paddingTop: insets.top }]}>       
      <View style={styles.container}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>CPH:DOX</Text>
        </View>
        <Pressable
          onPress={handleLogout}
          style={styles.logoutButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="log-out-outline" size={24} color="#ff5f6d" />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: '#000',
    zIndex: 999,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  logoutButton: {
    padding: 6,
  },
});
