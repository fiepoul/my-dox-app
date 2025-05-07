// app/(tabs)/schedule.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { format } from "date-fns";

import type { ScheduleBlock } from "../types/filmTypes";
import { fetchSchedule } from "../api/doxFilmApi";

const FESTIVAL_ISO_DATES = ["2025-05-05", "2025-05-06", "2025-05-07"];

export default function ScheduleScreen() {
  const router = useRouter();
  // 1) Byg en liste af Date-objekter, og find startdato
  const festivalDates = FESTIVAL_ISO_DATES.map(d => new Date(d));
  const todayISO = format(new Date(), "yyyy-MM-dd");
  const initialDate =
    festivalDates.find(d => format(d, "yyyy-MM-dd") === todayISO) ??
    festivalDates[0];

  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [blocks, setBlocks] = useState<ScheduleBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isToday = format(currentDate, "yyyy-MM-dd") === todayISO;

  const isoDate = format(currentDate, "yyyy-MM-dd");
  const currentIndex = festivalDates.findIndex(
    d => format(d, "yyyy-MM-dd") === isoDate
  );
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < festivalDates.length - 1;

  // 2) Hent dine blocks for den valgte dato
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);

    fetchSchedule(isoDate)
      .then(fetched => {
        if (!alive) return;
        setBlocks(fetched);
      })
      .catch(e => {
        console.error("Schedule fetch error:", e);
        if (alive) setError("Kunne ikke hente programmet");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [isoDate]);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0f0f0f", "#1a1a1a"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header med pil, dato og pil */}
      <View style={styles.header}>
        <Pressable
          onPress={() => canPrev && setCurrentDate(festivalDates[currentIndex - 1])}
          disabled={!canPrev}
        >
          <Text style={[styles.arrow, !canPrev && styles.arrowDisabled]}>
            ‹
          </Text>
        </Pressable>

        <Text style={styles.title}>
    {isToday ? "Today's Screenings" : format(currentDate, "dd MMM yyyy")}
  </Text>

        <Pressable
          onPress={() => canNext && setCurrentDate(festivalDates[currentIndex + 1])}
          disabled={!canNext}
        >
          <Text style={[styles.arrow, !canNext && styles.arrowDisabled]}>
            ›
          </Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#ff5f6d"
          style={styles.loader}
        />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollArea}
          showsVerticalScrollIndicator={false}
        >
          {blocks.map((block, i) => (
            <View key={i} style={styles.timeBlock}>
              <Text style={styles.time}>{block.time}</Text>
              {block.events.map((ev, j) => (
          <Pressable
                     key={j}
                     onPress={() => router.push({ pathname: "/movie/[id]", params: { id: ev.id.toString() } })}
                  >
                <BlurView
                  key={j}
                  intensity={50}
                  tint="dark"
                  style={styles.cardWrapper}
                >
                  <LinearGradient
                    colors={["rgba(28,28,28,0.8)", "rgba(0,0,0,0.6)"]}
                    style={styles.card}
                  >
                    <Text style={styles.eventTitle}>{ev.title}</Text>
                    <Text style={styles.location}>{ev.cinema}</Text>
                  </LinearGradient>
                </BlurView>
                </Pressable>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 10,
    height: 170,
  },
  arrow: { fontSize: 28, color: "#fff", paddingHorizontal: 10 },
  arrowDisabled: { color: "#333" },
  title: { fontSize: 22, color: "#fff", fontWeight: "600" },
  loader: { marginTop: 50 },
  errorText: {
    color: "#ff4444",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  scrollArea: { paddingHorizontal: 20, paddingBottom: 30 },
  timeBlock: { marginBottom: 30 },
  time: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  cardWrapper: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
  },
  card: { padding: 16, borderRadius: 16 },
  eventTitle: { fontSize: 18, fontWeight: "600", color: "#fff" },
  location: { fontSize: 14, color: "#ccc", marginTop: 4 },
});
