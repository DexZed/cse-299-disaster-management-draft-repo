import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchVolunteer, selectVolunteer } from '../store/slices/volunteerSlice';

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

// Haversine distance (km)
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // Earth radius km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function VolunteerTrackingMapPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  /**
   * VolunteerTrackingMapPage
   * ------------------------
   * Full-screen map showing volunteer and victim markers. This page
   * reads the volunteer's latest location from `volunteerSlice` and
   * dispatches `fetchVolunteer` on mount. Replace the simulated updates
   * with a real-time source (WebSocket or server push) when available.
   */
  const dispatch = useAppDispatch();
  const volunteerData = useAppSelector(selectVolunteer);
  const insets = useSafeAreaInsets();
  // Use a minimal top safe area to keep the title close to the
  // status bar. Set to 0 to minimize the gap; adjust if overlapping
  // occurs on devices with large notches.
  const safeTop = -35;
  const safeBottom = insets && typeof insets.bottom === 'number' ? insets.bottom : 0;

  const victimLat = parseFloat((params.victimLat as string) || '23.8103');
  const victimLon = parseFloat((params.victimLon as string) || '90.4125');

  // Use Redux volunteer location with fallback
  const [volunteerPos, setVolunteerPos] = useState({
    latitude: volunteerData?.latitude || 23.826,
    longitude: volunteerData?.longitude || 90.422,
  });
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchVolunteer('demo-vol'));
    // Simulate volunteer movement toward victim
    const interval = setInterval(() => {
      setVolunteerPos((prev) => {
        const moveDistance = 0.0005;
        const dx = victimLat - prev.latitude;
        const dy = victimLon - prev.longitude;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < moveDistance) {
          return { latitude: victimLat, longitude: victimLon };
        }

        const nx = prev.latitude + (dx / dist) * moveDistance;
        const ny = prev.longitude + (dy / dist) * moveDistance;
        return { latitude: nx, longitude: ny };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [victimLat, victimLon]);

  useEffect(() => {
    const d = haversineDistance(victimLat, victimLon, volunteerPos.latitude, volunteerPos.longitude);
    setDistanceKm(d);
    const speedKmh = 30;
    const eta = (d / speedKmh) * 60;
    setEtaMinutes(eta);
  }, [volunteerPos, victimLat, victimLon]);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: safeTop, paddingBottom: safeBottom }]} edges={["top","bottom"]}>
      <StatusBar style="light" backgroundColor="#000" />
      <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>Volunteer Location</Text>
      </View>

      <View style={styles.mapWrapper}>
        {MapView ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: victimLat,
              longitude: victimLon,
              latitudeDelta: 0.08,
              longitudeDelta: 0.08,
            }}
          >
            {Marker && (
              <>
                <Marker
                  coordinate={{ latitude: victimLat, longitude: victimLon }}
                  title="Your Location"
                  pinColor="red"
                />
                <Marker
                  coordinate={{ latitude: volunteerPos.latitude, longitude: volunteerPos.longitude }}
                  title="Volunteer"
                  pinColor="green"
                />
              </>
            )}
          </MapView>
        ) : (
          <View style={styles.fallback}>
            <Text style={{ color: '#666' }}>Map preview unavailable</Text>
          </View>
        )}

        {/* Info overlay in top-left */}
        <View style={styles.infoOverlay} pointerEvents="none">
          <View style={styles.infoBox}>
            <Text style={styles.distanceLabel}>Distance</Text>
            <Text style={styles.distanceValue}>{distanceKm !== null ? `${distanceKm.toFixed(1)} km` : '--'}</Text>
            <Text style={styles.etaLabel}>ETA</Text>
            <Text style={styles.etaValue}>{etaMinutes !== null ? `${Math.max(1, Math.round(etaMinutes))} min` : '--'}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f2f4f6' },
  backButton: { padding: 8, marginRight: 6 },
  title: { fontSize: 18, fontWeight: '700' },
  mapWrapper: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  fallback: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  infoOverlay: { position: 'absolute', left: 12, top: 12 },
  infoBox: { backgroundColor: '#fff', padding: 10, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.08, elevation: 3 },
  distanceLabel: { fontSize: 11, color: '#9aa0a6' },
  distanceValue: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 8 },
  etaLabel: { fontSize: 11, color: '#9aa0a6' },
  etaValue: { fontSize: 14, fontWeight: '700', color: '#0099ff' },
});
