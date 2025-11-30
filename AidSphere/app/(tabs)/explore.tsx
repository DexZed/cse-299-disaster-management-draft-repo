import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

// try to require react-native-maps dynamically
let MapView: any = null;
let Marker: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  MapView = require('react-native-maps').default;
  Marker = require('react-native-maps').Marker;
} catch (err) {
  // no-op; we'll show a fallback
}

const incidents = [
  { id: '1', lat: 23.811, lon: 90.412, priority: 'critical' },
  { id: '2', lat: 23.82, lon: 90.405, priority: 'high' },
  { id: '3', lat: 23.804, lon: 90.42, priority: 'medium' },
  { id: '4', lat: 23.815, lon: 90.428, priority: 'supply' },
];

export default function VolunteerDashboard() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#fff', dark: '#111' }}
      headerImage={<IconSymbol size={140} color="#2d2d2d" name="map" style={styles.headerImage} />}
    >
      <ThemedView style={styles.container}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Volunteer Dashboard</Text>
            <Text style={styles.subtitle}>Manage relief operations and respond to requests</Text>
          </View>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Available</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Pending Requests</Text>
            <Text style={styles.statHint}>Awaiting response</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Active Assignments</Text>
            <Text style={styles.statHint}>In progress</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Completed Today</Text>
            <Text style={styles.statHint}>Successfully delivered</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Total Incidents</Text>
            <Text style={styles.statHint}>On map</Text>
          </View>
        </ScrollView>

        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>Incident Map</Text>
          <Text style={styles.sectionSubtitle}>Real-time view of reported incidents in your area</Text>
          <View style={styles.mapCard}>
            {MapView ? (
              <MapView
                style={styles.map}
                initialRegion={{ latitude: 23.8103, longitude: 90.4125, latitudeDelta: 0.06, longitudeDelta: 0.06 }}
              >
                {incidents.map((it) => (
                  Marker && (
                    <Marker
                      key={it.id}
                      coordinate={{ latitude: it.lat, longitude: it.lon }}
                      pinColor={it.priority === 'critical' ? '#e53935' : it.priority === 'high' ? '#fb8c00' : it.priority === 'medium' ? '#ffd54f' : '#66bb6a'}
                    />
                  )
                ))}
              </MapView>
            ) : (
              <View style={styles.mapFallback}>
                <Text style={{ color: '#666' }}>Map preview unavailable (install react-native-maps)</Text>
              </View>
            )}

            <View style={styles.legend}>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#e53935' }]} /><Text style={styles.legendText}>Critical</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#fb8c00' }]} /><Text style={styles.legendText}>High</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#ffd54f' }]} /><Text style={styles.legendText}>Medium</Text></View>
              <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: '#66bb6a' }]} /><Text style={styles.legendText}>Supply Camp</Text></View>
            </View>
          </View>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  headerImage: { position: 'absolute', right: -40, top: -20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700' },
  subtitle: { color: '#666', marginTop: 4 },
  statusPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e8f5e9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2e7d32', marginRight: 8 },
  statusText: { color: '#2e7d32', fontWeight: '600' },
  cardsRow: { marginVertical: 12 },
  statCard: { width: 180, backgroundColor: '#fff', padding: 14, borderRadius: 10, marginRight: 12, shadowColor: '#000', shadowOpacity: 0.05, elevation: 1 },
  statNumber: { fontSize: 20, fontWeight: '700' },
  statLabel: { color: '#666', marginTop: 6 },
  statHint: { color: '#ff9800', marginTop: 8 },
  mapSection: { marginTop: 8 },
  sectionTitle: { fontWeight: '700', marginBottom: 4 },
  sectionSubtitle: { color: '#666', marginBottom: 8 },
  mapCard: { backgroundColor: '#fff', height: 320, borderRadius: 12, overflow: 'hidden', padding: 12 },
  map: { flex: 1 },
  mapFallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  legend: { position: 'absolute', left: 12, top: 12, backgroundColor: '#fff', padding: 8, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.06, elevation: 2 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  legendText: { fontSize: 12, color: '#333' },
});
