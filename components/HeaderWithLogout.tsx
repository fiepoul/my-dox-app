// components/HeaderWithLogout.tsx

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../app/_config/firebaseconfig';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function HeaderWithLogout() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { paddingTop: insets.top, opacity: fade },
      ]}
    >
      <View style={styles.container}>
        <View style={styles.logoWrapper}>
          {/* Surrealist square behind */}
          <View style={styles.squareBehind} />
          {/* Bauhaus circle accent */}
          <View style={styles.circleAccent} />
          <Text style={styles.logoText}>
            CPH:
            <Text style={styles.logoHighlight}>DOX</Text>
          </Text>
        </View>

        <Pressable
          onPress={handleLogout}
          style={styles.logoutButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="log-out-outline" size={24} color="#000" />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 999,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },

  logoWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // give room for our shapes
    height: 48,
  },
  squareBehind: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#0047FF',
    top: -6,
    left: -24,
    transform: [{ rotate: '45deg' }],
    opacity: 0.15,
  },
  circleAccent: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FF8C00',
    top: -4,
    right: -20,
    opacity: 0.2,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: '#000',
    fontFamily: Platform.select({
      ios: 'HelveticaNeue-CondensedBlack',
      android: 'sans-serif-condensed',
    }),
    transform: [{ skewX: '-5deg' }],
  },
  logoHighlight: {
    color: '#0047FF',
    transform: [{ skewX: '5deg' }],
  },

  logoutButton: {
    padding: 6,
  },
});
