import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScheduleScreen() {
  const schedule = [
    {
      time: '10:00 - 11:30',
      events: [
        { title: 'Voices of the North', location: 'Empire Bio' },
        { title: 'Fragments of Silence', location: 'Grand Teatret' },
      ],
    },
    {
      time: '12:00 - 13:45',
      events: [
        { title: 'City in Motion', location: 'Cinemateket' },
        { title: 'Dreaming in Neon', location: 'Palads' },
      ],
    },
    {
      time: '14:00 - 15:30',
      events: [
        { title: 'Refuge', location: 'Empire Bio' },
        { title: 'Eyes on Tomorrow', location: 'Vester Vov Vov' },
      ],
    },
    {
      time: '16:00 - 17:30',
      events: [
        { title: 'Lost Signals', location: 'Grand Teatret' },
        { title: 'Soundscape', location: 'DR Koncerthuset' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#0f0f0f', '#1a1a1a']} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <Text style={styles.title}>Festival Schedule</Text>
        <Text style={styles.subtitle}>Check out today's screenings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {schedule.map((block, index) => (
          <View key={index} style={styles.timeBlock}>
            <Text style={styles.time}>{block.time}</Text>
            {block.events.map((event, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.location}>{event.location}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 4,
  },
  scrollArea: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  timeBlock: {
    marginBottom: 30,
  },
  time: {
    color: '#888',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  location: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 4,
  },
});
