// app/_layout.tsx
import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './_config/firebaseconfig';   // juster efter din struktur
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User|null>(null);

  // 1) Lyt på Firebase Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      console.log('🛡️ onAuthStateChanged → user is:', u);
      setUser(u);
      if (initializing) setInitializing(false);
    });
    return unsub;
  }, []);

  // 2) Når init er færdig, gem Splash
  useEffect(() => {
    if (!initializing) {
      SplashScreen.hideAsync();
    }
  }, [initializing]);

  // 3) Indtil init er færdig, vis ingenting
  if (initializing) {
    return null;
  }

  // 4) Herefter returnerer vi ALTID en <Stack> navigator
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="login" options={{ headerShown: false }} />
  <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
</Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
