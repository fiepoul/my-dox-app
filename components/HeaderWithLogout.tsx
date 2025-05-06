// components/HeaderWithLogout.tsx
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../app/_config/firebaseconfig';

export default function HeaderWithLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    console.log('🔴 handleLogout triggered');
    try {
      await signOut(auth);
      console.log('✅ signOut succeeded, navigating to login');
      router.replace('/login');
    } catch (e) {
      console.error('❌ signOut failed', e);
      // Du kan evt. vise en fejl-alert her
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CPH DOX App</Text>
      <Pressable
        onPress={handleLogout}
        style={styles.logoutButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.logout}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logout: {
    color: '#ff5f6d',
    fontWeight: '500',
  },
  logoutButton: {
    padding: 8,
  },
});
