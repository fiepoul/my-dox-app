import React, { useState, useEffect, useRef } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Animated,
  ScrollView,
  ActivityIndicator,
  Pressable,
  StatusBar,
  Platform
} from 'react-native'
import { useRouter } from 'expo-router'
import { format } from 'date-fns'
import type { ScheduleBlock } from '../types/filmTypes'
import { fetchSchedule } from '../api/doxFilmApi'

const FESTIVAL_DATES = ['2025-05-05', '2025-05-06', '2025-05-07']

export default function ScheduleScreen() {
  const router = useRouter()
  const dates = FESTIVAL_DATES.map(d => new Date(d))
  const todayISO = format(new Date(), 'yyyy-MM-dd')
  const initial = dates.find(d => format(d, 'yyyy-MM-dd') === todayISO) ?? dates[0]

  const [current, setCurrent] = useState<Date>(initial)
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fade = useRef(new Animated.Value(0)).current

  const iso = format(current, 'yyyy-MM-dd')
  const idx = dates.findIndex(d => format(d, 'yyyy-MM-dd') === iso)
  const prev = idx > 0
  const next = idx < dates.length - 1

  // fade on date change
  useEffect(() => {
    fade.setValue(0)
    Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }).start()
  }, [iso])

  // fetch schedule
  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)
    fetchSchedule(iso)
      .then(data => alive && setBlocks(data))
      .catch(() => alive && setError('Could not load schedule'))
      .finally(() => alive && setLoading(false))
    return () => { alive = false }
  }, [iso])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable disabled={!prev} onPress={() => prev && setCurrent(dates[idx - 1])}>
          <Text style={[styles.arrow, !prev && styles.disabled]}>‹</Text>
        </Pressable>
        <View style={styles.dateWrap}>
          <Text style={styles.weekday}>{format(current, 'EEEE').toUpperCase()}</Text>
          <Text style={styles.date}>{format(current, 'dd MMM yyyy')}</Text>
        </View>
        <Pressable disabled={!next} onPress={() => next && setCurrent(dates[idx + 1])}>
          <Text style={[styles.arrow, !next && styles.disabled]}>›</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#0047ff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <Animated.ScrollView
          style={{ opacity: fade }}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {blocks.map((blk, i) => (
            <View key={i} style={styles.block}>
              <Text style={styles.time}>{blk.time}</Text>
              {blk.events.map((ev, j) => (
                <Pressable
                  key={j}
                  style={styles.cardWrapper}
                  onPress={() => router.push(`/movie/${ev.id}`)}
                >
                  <View style={styles.card}>
                    <View style={styles.bar} />
                    <View style={styles.content}>
                      <Text style={styles.title}>{ev.title.toUpperCase()}</Text>
                      <Text style={styles.loc}>{ev.cinema.toUpperCase()}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </Animated.ScrollView>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'android'
      ? (StatusBar.currentHeight ?? 0) + 48
      : 60,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#0047ff'
  },
  arrow: { fontSize: 32, color: '#0047ff' },
  disabled: { color: '#ccc' },
  dateWrap: { alignItems: 'center' },
  weekday: { fontSize: 12, fontWeight: '700' },
  date: { fontSize: 20, fontWeight: '900', color: '#0047ff', marginTop: 4 },
  loader: { marginTop: 40 },
  error: { marginTop: 20, textAlign: 'center', color: '#e63946' },
  scroll: { padding: 20, paddingBottom: 32 },
  block: { marginBottom: 32 },
  time: { color: '#0047ff', fontWeight: '700', marginBottom: 12 },
  cardWrapper: { marginBottom: 16 },
  card: {
    flexDirection: 'row',
    borderLeftWidth: 6,
    borderLeftColor: '#0047ff',
    overflow: 'hidden'
  },
  bar: { width: 6, backgroundColor: '#0047ff' },
  content: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '900' },
  loc: { fontSize: 14, color: '#555', marginTop: 4 }
})
