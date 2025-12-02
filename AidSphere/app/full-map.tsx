import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// dynamic require for react-native-maps
let MapView: any = null;
let Marker: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  MapView = require('react-native-maps').default;
  Marker = require('react-native-maps').Marker;
} catch (err) {
  // no-op
}

const incidents = [
  { id: '1', lat: 23.811, lon: 90.412, priority: 'critical' },
  { id: '2', lat: 23.82, lon: 90.405, priority: 'high' },
  { id: '3', lat: 23.804, lon: 90.42, priority: 'medium' },
  { id: '4', lat: 23.815, lon: 90.428, priority: 'supply' },
];

export default function FullMapPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const safeTop = -32;
  const safeBottom = insets && typeof insets.bottom === 'number' ? insets.bottom : 0;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: safeTop, paddingBottom: safeBottom }]} edges={["top","bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Incident Map</Text>
      </View>

      <View style={styles.mapWrapper}>
        {MapView ? (
          <MapView
            style={styles.map}
            initialRegion={{ latitude: 23.8103, longitude: 90.4125, latitudeDelta: 0.12, longitudeDelta: 0.12 }}
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
          <View style={styles.fallback}><Text style={{ color: '#666' }}>Map preview unavailable</Text></View>
        )}
        {/* Legend overlay on full map */}
        <View style={styles.legendBox} pointerEvents="none">
          <Text style={styles.legendTitle}>Map Legend</Text>
          <View style={styles.legendRow}><View style={[styles.legendDot, { backgroundColor: '#e53935' }]} /><Text style={styles.legendLabel}>Critical</Text></View>
          <View style={styles.legendRow}><View style={[styles.legendDot, { backgroundColor: '#fb8c00' }]} /><Text style={styles.legendLabel}>High</Text></View>
          <View style={styles.legendRow}><View style={[styles.legendDot, { backgroundColor: '#ffd54f' }]} /><Text style={styles.legendLabel}>Medium</Text></View>
          <View style={styles.legendRow}><View style={[styles.legendDot, { backgroundColor: '#66bb6a' }]} /><Text style={styles.legendLabel}>Supply Camp</Text></View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 0, borderBottomWidth: 1, borderBottomColor: '#f2f4f6' },
  backButton: { padding: 8, marginRight: 6 },
  title: { fontSize: 18, fontWeight: '700' },
  mapWrapper: { flex: 1 },
  map: { flex: 1 },
  fallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  legendBox: { position: 'absolute', left: 12, top: 12, backgroundColor: '#fff', padding: 8, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.06, elevation: 3 },
  legendTitle: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  legendLabel: { fontSize: 12, color: '#444' },
});
