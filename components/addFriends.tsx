import React, { useState } from 'react'
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Keyboard,
} from 'react-native'
import { addFriendByUsername } from '@/app/api/userApi'

export default function AddFriend() {
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')

  const handleAdd = async () => {
    Keyboard.dismiss()
    try {
      await addFriendByUsername(username.trim())
      setMessage('✔ FRIEND ADDED')
      setUsername('')
    } catch (e: any) {
      setMessage(e.message?.toUpperCase() || 'SOMETHING WENT WRONG')
    }
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>ADD FRIEND</Text>

      <TextInput
        placeholder="USERNAME"
        placeholderTextColor="#999"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <Pressable
        onPress={handleAdd}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>ADD</Text>
      </Pressable>

      {!!message && <Text style={styles.message}>{message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 32,
  },
  heading: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#000',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f4f4f4',
    color: '#000',
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '600',
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 16,
    borderRadius: 4, // Kun let afrundet
    letterSpacing: 1,
  },
  button: {
    backgroundColor: '#0047FF',
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#000',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  message: {
    marginTop: 16,
    color: '#000',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
})
