// app/signup.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './_config/firebaseconfig';
import { setDoc, doc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHAPE_SIZE = 200;

export default function SignupScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState<string|null>(null);
  const [loading, setLoading]   = useState(false);

  // Animations
  const circAnim = useRef(new Animated.Value(0)).current;
  const rectAnim = useRef(new Animated.Value(0)).current;
  const meltAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // loop circle
    Animated.loop(
      Animated.sequence([
        Animated.timing(circAnim, { toValue:1, duration:8000, easing:Easing.linear, useNativeDriver:true }),
        Animated.timing(circAnim, { toValue:0, duration:8000, easing:Easing.linear, useNativeDriver:true }),
      ])
    ).start();
    // loop rect
    Animated.loop(
      Animated.sequence([
        Animated.timing(rectAnim, { toValue:1, duration:10000, easing:Easing.inOut(Easing.ease), useNativeDriver:true }),
        Animated.timing(rectAnim, { toValue:0, duration:10000, easing:Easing.inOut(Easing.ease), useNativeDriver:true }),
      ])
    ).start();
    // melt heading
    Animated.loop(
      Animated.sequence([
        Animated.timing(meltAnim, { toValue:1, duration:2500, easing:Easing.inOut(Easing.quad), useNativeDriver:true }),
        Animated.timing(meltAnim, { toValue:0, duration:2500, easing:Easing.inOut(Easing.quad), useNativeDriver:true }),
      ])
    ).start();
  }, []);

  const handleSignup = async () => {
    setError(null);
    setLoading(true);
    Keyboard.dismiss();
    try {
      if (!fullName.trim() || !username.trim()) {
        throw new Error('Please fill in name & username');
      }
      // check username uniqueness
      const q = query(collection(db, 'users'), where('username','==',username.trim()));
      const snap = await getDocs(q);
      if (!snap.empty) throw new Error('Username taken');

      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const uid = cred.user.uid;
      await setDoc(doc(db,'users',uid),{
        fullName: fullName.trim(),
        username: username.trim(),
        createdAt: serverTimestamp(),
        friends: [],
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/');
    } catch(e: any) {
      setError(e.message || 'Could not create account');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS==='ios'?'padding':undefined}
      style={styles.container}
    >
      {/* Surreal shapes */}
      <Animated.View style={[
        styles.circle,
        {
          transform: [{
            translateX: circAnim.interpolate({ inputRange:[0,1], outputRange:[-SHAPE_SIZE, SCREEN_WIDTH*0.7] })
          },{
            translateY: circAnim.interpolate({ inputRange:[0,1], outputRange:[-SHAPE_SIZE*0.6, SCREEN_HEIGHT*0.3] })
          }]
        }
      ]}/>
      <Animated.View style={[
        styles.rect,
        {
          transform: [{
            rotate: rectAnim.interpolate({ inputRange:[0,1], outputRange:['0deg','360deg'] })
          }]
        }
      ]}/>

      <SafeAreaView style={styles.inner}>
        {/* Melted heading */}
        <Animated.Text style={[
          styles.heading,
          {
            transform: [
              { skewX: meltAnim.interpolate({inputRange:[0,1],outputRange:['0deg','12deg']}) },
              { translateY: meltAnim.interpolate({inputRange:[0,1],outputRange:[0,8]}) }
            ],
            opacity: meltAnim.interpolate({inputRange:[0,1],outputRange:[1,0.8]})
          }
        ]}>
          SIGN UP
        </Animated.Text>

        {/* Brief description */}
        <Text style={styles.brief}>
          Become part of the DOX universe.
        </Text>

        <View style={styles.frame}>
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#555"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            placeholder="Username"
            placeholderTextColor="#555"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#555"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#555"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable onPress={handleSignup} style={styles.signupBtn}>
            {loading
              ? <ActivityIndicator color="#fff"/>
              : <Text style={styles.signupText}>CREATE</Text>
            }
          </Pressable>

          <Pressable onPress={()=>router.back()} style={styles.loginLink}>
            <Text style={styles.loginText}>Already have an account? LOGIN →</Text>
          </Pressable>
        </View>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff' },
  inner: { flex:1, alignItems:'center', justifyContent:'center', padding:24 },
  circle: {
    position:'absolute',
    width:SHAPE_SIZE,
    height:SHAPE_SIZE,
    borderRadius:SHAPE_SIZE/2,
    backgroundColor:'rgba(0,68,255,0.1)'
  },
  rect: {
    position:'absolute',
    width:SHAPE_SIZE*1.3,
    height:SHAPE_SIZE*0.4,
    backgroundColor:'rgba(255,64,129,0.1)'
  },
  heading: {
    fontSize:32,
    fontWeight:'900',
    letterSpacing:4,
    color:'#000',
    marginBottom:8
  },
  brief: {
    fontSize:14,
    color:'#555',
    fontStyle:'italic',
    marginBottom:24,
    textAlign:'center'
  },
  frame: {
    borderWidth:2,
    borderColor:'#000',
    padding:20,
    width:'90%',
    maxWidth:320
  },
  input: {
    borderBottomWidth:1,
    borderColor:'#ccc',
    paddingVertical:12,
    marginBottom:20,
    fontSize:16
  },
  signupBtn: {
    backgroundColor:'#0047ff',
    paddingVertical:14,
    alignItems:'center',
    marginBottom:16
  },
  signupText: {
    color:'#fff',
    fontWeight:'900',
    fontSize:16,
    letterSpacing:2
  },
  loginLink: {
    alignItems:'center',
    paddingVertical:8
  },
  loginText: {
    color:'#0047ff',
    fontWeight:'700',
    fontSize:14,
    letterSpacing:1
  },
  errorBox: {
    marginTop:16,
    backgroundColor:'rgba(255,68,68,0.1)',
    padding:12,
    borderLeftWidth:4,
    borderLeftColor:'#ff5f6d'
  },
  errorText: {
    color:'#990000'
  }
});
