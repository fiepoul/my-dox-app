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

interface AddFriendProps {
  /** Optional prompt shown above input */
  promptText?: string
}

export default function AddFriend({ promptText }: AddFriendProps) {
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
      {/* Show custom prompt or default heading */}
      {promptText ? (
        <Text style={styles.prompt}>{promptText.toUpperCase()}</Text>
      ) : (
        <Text style={styles.heading}>ADD FRIEND</Text>
      )}

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
        <Text style={styles.buttonText}>ADD NEW FRIEND</Text>
      </Pressable>

      {!!message && <Text style={styles.message}>{message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '90%',            // make it slightly wider
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 32,
  },
  prompt: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#FF8C00',
    marginBottom: 12,
    textAlign: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
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
    borderRadius: 4,
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
