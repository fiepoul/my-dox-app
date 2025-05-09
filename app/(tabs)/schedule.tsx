// app/(tabs)/schedule.tsx

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "expo-router";
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
  Platform,
} from "react-native";
import { format } from "date-fns";

import type { ScheduleBlock } from "../types/filmTypes";
import { fetchSchedule } from "../api/doxFilmApi";

const FESTIVAL_ISO_DATES = ["2025-05-05", "2025-05-06", "2025-05-07"];

export default function ScheduleScreen() {
  const router = useRouter();
  const festivalDates = FESTIVAL_ISO_DATES.map(d => new Date(d));
  const todayISO = format(new Date(), "yyyy-MM-dd");
  const initialDate =
    festivalDates.find(d => format(d, "yyyy-MM-dd") === todayISO) ??
    festivalDates[0];

  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isoDate = format(currentDate, "yyyy-MM-dd");
  const currentIndex = festivalDates.findIndex(
    d => format(d, "yyyy-MM-dd") === isoDate
  );
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < festivalDates.length - 1;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [isoDate]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchSchedule(isoDate)
      .then(fetched => {
        if (alive) setBlocks(fetched);
      })
      .catch(e => {
        console.error("Schedule fetch error:", e);
        if (alive) setError("Could not load schedule");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => { alive = false };
  }, [isoDate]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => canPrev && setCurrentDate(festivalDates[currentIndex - 1])}
          disabled={!canPrev}
        >
          <Text style={[styles.arrow, !canPrev && styles.arrowDisabled]}>‹</Text>
        </Pressable>

        <View style={styles.dateContainer}>
          <Text style={styles.weekday}>
            {format(currentDate, "EEEE").toUpperCase()}
          </Text>
          <Text style={styles.dateText}>
            {format(currentDate, "dd MMM yyyy")}
          </Text>
        </View>

        <Pressable
          onPress={() => canNext && setCurrentDate(festivalDates[currentIndex + 1])}
          disabled={!canNext}
        >
          <Text style={[styles.arrow, !canNext && styles.arrowDisabled]}>›</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0047ff" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <Animated.ScrollView
          style={{ opacity: fadeAnim }}
          contentContainerStyle={styles.scrollArea}
          showsVerticalScrollIndicator={false}
        >
          {blocks.map((block, i) => (
            <View key={i} style={styles.timeBlock}>
              <Text style={styles.time}>{block.time}</Text>
              {block.events.map((ev, j) => (
                <Pressable
                  key={j}
                  onPress={() =>
                    router.push({ pathname: "/movie/[id]", params: { id: ev.id.toString() } })
                  }
                  style={styles.cardWrapper}
                >
                  <View style={styles.card}>
                    <View style={styles.accentBar} />
                    <View style={styles.cardContent}>
                      <Text style={styles.eventTitle}>{ev.title.toUpperCase()}</Text>
                      <Text style={styles.location}>{ev.cinema.toUpperCase()}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ))}
        </Animated.ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight! + 48 : 60,
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#0047ff",
  },
  arrow: {
    fontSize: 32,
    color: "#0047ff",
  },
  arrowDisabled: {
    color: "#ccc",
  },
  dateContainer: {
    alignItems: "center",
  },
  weekday: {
    fontSize: 12,
    fontWeight: "700",
    color: "#000",
    letterSpacing: 1,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0047ff",
    letterSpacing: 2,
    marginTop: 2,
  },
  loader: {
    marginTop: 40,
  },
  errorText: {
    color: "#e63946",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "600",
  },
  scrollArea: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  timeBlock: {
    marginBottom: 32,
  },
  time: {
    color: "#0047ff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  cardWrapper: {
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 0,
    borderLeftWidth: 6,
    borderLeftColor: "#0047ff",
    overflow: "hidden",
    // **Reduced shadow for a flatter Bauhaus feel**
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  accentBar: {
    width: 6,
    backgroundColor: "#0047ff",
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#000",
    marginBottom: 4,
    lineHeight: 22,
  },
  location: {
    fontSize: 14,
    color: "#555",
    opacity: 0.8,
  },
});
