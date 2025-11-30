import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Linking } from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchVolunteer, selectVolunteer } from '../store/slices/volunteerSlice';

// We'll try to dynamically require react-native-maps to avoid crashing if not installed
let MapView: any = null;
let Marker: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  MapView = require('react-native-maps').default;
  Marker = require('react-native-maps').Marker;
} catch (err) {
  // If maps isn't installed, we'll show a fallback view
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

export default function ReportTrackingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  /**
   * ReportTrackingScreen
   * ---------------------
   * Displays a live tracking view for a submitted report. The screen
   * previously simulated volunteer movement locally; it is now wired to
   * read volunteer location from `volunteerSlice` (dispatch `fetchVolunteer`
   * on mount). For real-time location updates, replace the simulator
   * with a WebSocket or push mechanism that updates `volunteerSlice`.
   */
  const dispatch = useAppDispatch();
  const volunteerData = useAppSelector(selectVolunteer);

  // Read victim coords from query params when provided, fallback to Dhaka
  const victimLat = parseFloat((params.latitude as string) || '23.8103');
  const victimLon = parseFloat((params.longitude as string) || '90.4125');

  // Use Redux volunteer location with fallback to default
  const [volunteerPos, setVolunteerPos] = useState({
    latitude: volunteerData?.latitude || 23.826,
    longitude: volunteerData?.longitude || 90.422,
  });
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<any>(null);

  // VolunteerSocket: a small WebSocket-like simulator that emits location updates
  class VolunteerSocket {
    onmessage: ((data: any) => void) | null = null;
    onopen: (() => void) | null = null;
    onclose: (() => void) | null = null;
    private _timer: any = null;
    private _pos: { latitude: number; longitude: number };
    private _victim: { latitude: number; longitude: number };

    constructor(startPos: any, victimPos: any, tick = 5000) {
      this._pos = { ...startPos };
      this._victim = { ...victimPos };
      // simulate open
      setTimeout(() => this.onopen && this.onopen(), 200);
      // start ticking
      this._timer = setInterval(() => {
        // move 10% of remaining distance each tick
        const latDiff = this._victim.latitude - this._pos.latitude;
        const lonDiff = this._victim.longitude - this._pos.longitude;
        this._pos.latitude += latDiff * 0.1;
        this._pos.longitude += lonDiff * 0.1;
        if (this.onmessage) {
          this.onmessage({ latitude: this._pos.latitude, longitude: this._pos.longitude });
        }
      }, tick);
    }

    close() {
      if (this._timer) clearInterval(this._timer);
      this.onclose && this.onclose();
    }
  }

  useEffect(() => {
    // Dispatch fetch to get real volunteer data from backend
    dispatch(fetchVolunteer('demo-vol'));
    computeDistanceAndEta();
    // create and connect fake socket
    const sock = new VolunteerSocket(volunteerPos, { latitude: victimLat, longitude: victimLon }, 4000);
    sock.onopen = () => {
      // console.log('Volunteer socket open');
    };
    sock.onmessage = (data: any) => {
      setVolunteerPos({ latitude: data.latitude, longitude: data.longitude });
    };
    socketRef.current = sock;

    return () => {
      socketRef.current?.close?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    computeDistanceAndEta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [volunteerPos]);

  const computeDistanceAndEta = () => {
    const d = haversineDistance(victimLat, victimLon, volunteerPos.latitude, volunteerPos.longitude);
    setDistanceKm(d);
    // assume average volunteer travel speed (km/h). use 30 km/h as example (urban)
    const speedKmh = 30;
    const eta = (d / speedKmh) * 60; // minutes
    setEtaMinutes(eta);
  };

  const onCallPress = () => {
    const phone = '+8801122334455';
    const url = `tel:${phone}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Call Feature', `Calling ${phone}\n\nPhone calls are not available in the simulator. On a physical device, this would dial the volunteer.`);
        } else {
          return Linking.openURL(url).catch(() => {
            Alert.alert('Call Feature', `Calling ${phone}\n\nThis feature is not available in your current environment, but on a physical device it would dial the volunteer.`);
          });
        }
      })
      .catch((err) => {
        Alert.alert('Call Feature', `Calling ${phone}\n\nPhone calls require a physical device with calling capabilities.`);
      });
  };

  const onMessagePress = () => {
    const phone = '+8801122334455';
    const url = `sms:${phone}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert('Message Feature', `Messaging ${phone}\n\nMessaging is not available in the simulator. On a physical device, this would open SMS.`);
        } else {
          return Linking.openURL(url).catch(() => {
            Alert.alert('Message Feature', `Messaging ${phone}\n\nThis feature is not available in your current environment, but on a physical device it would open SMS.`);
          });
        }
      })
      .catch((err) => {
        Alert.alert('Message Feature', `Messaging ${phone}\n\nMessaging requires a physical device with SMS capabilities.`);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Volunteer Status</Text>
          <Text style={styles.headerSub}>Report #DR-2024-1234</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.mainScroll} contentContainerStyle={styles.mainScrollContent}>
        <View style={styles.topSection}>
          <View style={styles.statusBox}>
            <Text style={styles.statusTitle}>Volunteer Assigned!</Text>
            <Text style={styles.statusSub}>Help is on the way to your location</Text>
          </View>

          <View style={styles.detailsCard}>
            <Text style={styles.cardTitle}>Your Report Details</Text>
            <View style={styles.row}>
              <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
              <Text style={styles.cardText}>Dhaka, Bangladesh</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons name="map-marker-outline" size={14} color="#999" />
              <Text style={styles.smallText}>Lat: {victimLat.toFixed(4)}, Long: {victimLon.toFixed(4)}</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons name="food" size={14} color="#027723" />
              <Text style={styles.smallText}>Help Type: Food</Text>
            </View>
            <View style={styles.row}>
              <MaterialCommunityIcons name="clock-outline" size={14} color="#999" />
              <Text style={styles.smallText}>Submitted: 10:30 AM, Nov 24, 2024</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Live Location</Text>

          <View style={styles.mapContainer}>
            {MapView ? (
              <>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: victimLat,
                    longitude: victimLon,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                >
                  {/* Victim marker */}
                  {Marker && (
                    <Marker
                      coordinate={{ latitude: victimLat, longitude: victimLon }}
                      title="Your Location"
                      pinColor="red"
                    />
                  )}

                  {/* Volunteer marker */}
                  {Marker && (
                    <Marker
                      coordinate={{ latitude: volunteerPos.latitude, longitude: volunteerPos.longitude }}
                      title="Volunteer"
                      pinColor="green"
                    />
                  )}
                </MapView>

                {/* expand button in top-right */}
                <TouchableOpacity style={styles.expandMapButton} onPress={() => router.push(`/volunteer-tracking-map?victimLat=${victimLat}&victimLon=${victimLon}`)} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="fullscreen" size={20} color="#fff" />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.mapFallback}>
                <Text>Map not available (react-native-maps is not installed).</Text>
                <Text style={{ marginTop: 8 }}>Victim: {victimLat.toFixed(4)}, {victimLon.toFixed(4)}</Text>
                <Text style={{ marginTop: 4 }}>Volunteer: {volunteerPos.latitude.toFixed(4)}, {volunteerPos.longitude.toFixed(4)}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.volunteerCard}>
          <View style={styles.volunteerHeader}>
            <View style={styles.avatarPlaceholder}>
              <MaterialCommunityIcons name="account" size={28} color="#fff" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.volName}>Mr. X</Text>
              <Text style={styles.volLabel}>Assigned Volunteer</Text>
            </View>
          </View>

          <View style={styles.volMetricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricTitle}>Estimated Time</Text>
              <Text style={styles.metricValue}>{etaMinutes !== null ? `${Math.max(1, Math.round(etaMinutes))} minutes` : '--'}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricTitle}>Distance</Text>
              <Text style={styles.metricValue}>{distanceKm !== null ? `${distanceKm.toFixed(1)} km away` : '--'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker-radius" size={16} color="#666" />
            <Text style={styles.infoText}>Current Location: Gulshan Avenue, Dhaka</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.callButton} onPress={onCallPress}>
              <MaterialCommunityIcons name="phone" size={18} color="#fff" />
              <Text style={styles.callText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton} onPress={onMessagePress}>
              <MaterialCommunityIcons name="message" size={18} color="#fff" />
              <Text style={styles.callText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoPanel}>
          <Text style={styles.infoPanelTitle}>Important Information</Text>
          <View style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.infoPanelText}> Stay in a safe location</Text></View>
          <View style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.infoPanelText}> Keep your phone charged and accessible</Text></View>
          <View style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.infoPanelText}> The volunteer will contact you upon arrival</Text></View>
          <View style={styles.bulletRow}><Text style={styles.bullet}>•</Text><Text style={styles.infoPanelText}> Emergency helpline: 999</Text></View>
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0099ff" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb' },
  header: { backgroundColor: '#d32f2f', padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { alignItems: 'center' },
  headerText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  headerSub: { color: '#fff', fontSize: 12, marginTop: 4 },
  topSection: { paddingHorizontal: 16, paddingVertical: 12 },
  scrollableContent: { flex: 1 },
  scrollableContentContainer: { paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 16 },
  statusBox: { backgroundColor: '#e3f2fd', borderLeftWidth: 4, borderLeftColor: '#0099ff', padding: 12, borderRadius: 8, marginBottom: 12 },
  statusTitle: { color: '#0099ff', fontWeight: '700', fontSize: 16 },
  statusSub: { color: '#0099ff', marginTop: 4 },
  detailsCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 12, marginBottom: 12 },
  cardTitle: { fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  cardText: { marginLeft: 8 },
  smallText: { marginLeft: 8, color: '#666', fontSize: 13 },
  sectionTitle: { marginTop: 6, marginBottom: 8, fontWeight: '700' },
  mapContainer: { height: 220, borderRadius: 8, overflow: 'hidden', marginBottom: 12, position: 'relative' },
  map: { flex: 1 },
  mapFallback: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 12 },
  expandMapButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0, 0, 0, 0.4)', width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  mainScroll: { flex: 1 },
  mainScrollContent: { paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 16 },
  volunteerCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 },
  volunteerHeader: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#1b5e20', justifyContent: 'center', alignItems: 'center' },
  volName: { fontWeight: '700', color: '#fff', backgroundColor: '#1b5e20', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  volLabel: { color: '#666', marginTop: 4 },
  volMetricsRow: { flexDirection: 'row', marginTop: 12 },
  metricBox: { flex: 1, backgroundColor: '#f5fbf7', padding: 10, borderRadius: 8, marginRight: 8 },
  metricTitle: { color: '#666', fontSize: 12 },
  metricValue: { color: '#2e7d32', fontWeight: '700', marginTop: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  infoText: { marginLeft: 8, color: '#666' },
  actionsRow: { flexDirection: 'row', marginTop: 12 },
  callButton: { flex: 1, backgroundColor: '#2e7d32', padding: 12, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  messageButton: { flex: 1, backgroundColor: '#1976d2', padding: 12, borderRadius: 8, marginLeft: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  callText: { color: '#fff', marginLeft: 8 },
  infoPanel: { backgroundColor: '#e8f0fb', padding: 12, borderRadius: 8, marginTop: 8 },
  infoPanelTitle: { fontWeight: '700', marginBottom: 8 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  bullet: { color: '#1976d2', marginRight: 8 },
  infoPanelText: { color: '#333' },
  loadingOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.6)' },
});
