// app/signup.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './_config/firebaseconfig';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError(null);
    setLoading(true);
    try {
      // 1) Opret bruger i Firebase Auth
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const uid = cred.user.uid;

      // 2) Opret Firestore-document for brugeren
      await setDoc(doc(db, 'users', uid), {
        createdAt: serverTimestamp()
      });

      // 3) Haptisk feedback på native platforme
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
      }

      // 4) Naviger ind i app’en
      router.replace('/');
    } catch (e: any) {
      setError(e.message || 'Kunne ikke oprette bruger');
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Error
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <LinearGradient
        colors={['#0a0a0a', '#1c1c1c']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.inner}>
        <Text style={styles.title}>Opret Konto</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <BlurView intensity={80} tint="dark" style={styles.card}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#ccc"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            onPress={handleSignup}
            style={styles.button}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <LinearGradient
              colors={['#ff5f6d', '#ffc371']}
              style={styles.buttonBackground}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Opret Konto</Text>
              )}
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => router.back()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.switchText}>
              Har allerede en konto? Log ind →
            </Text>
          </Pressable>
        </BlurView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 24
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden'
  },
  buttonBackground: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 12
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18
  },
  errorBox: {
    backgroundColor: 'rgba(255,68,68,0.8)',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14
  },
  switchText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 12,
    textDecorationLine: 'underline'
  }
});
