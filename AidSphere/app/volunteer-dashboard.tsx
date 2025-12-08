import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchIncidents, selectAllIncidents } from '../store/slices/incidentsSlice';
import { fetchRequests, selectAllRequests } from '../store/slices/requestsSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import VolunteerDrawer from '../components/VolunteerDrawer';

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

// incidents will come from Redux; selectors provide fallback when empty

export default function VolunteerDashboardPage() {
  const router = useRouter();
  const [volunteerLocation, setVolunteerLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  /**
   * VolunteerDashboardPage
   * ----------------------
   * Shows volunteer-facing stats and an incident map. This screen
   * dispatches `fetchIncidents()` and `fetchRequests()` to load server
   * data; the lists are read via selectors from the Redux store. To
   * connect your backend, ensure `incidentsSlice` and `requestsSlice`
   * endpoints are configured accordingly.
   */
  const dispatch = useAppDispatch();
  const incidents = useAppSelector(selectAllIncidents);
  const requests = useAppSelector(selectAllRequests);

  useEffect(() => {
    dispatch(fetchIncidents());
    dispatch(fetchRequests());
    fetchVolunteerLocation();
  }, [dispatch]);

  const fetchVolunteerLocation = async () => {
    try {
      const { status } = await (Location.requestForegroundPermissionsAsync as any)();
      if (status !== 'granted') {
        console.warn('Location permission denied');
        return;
      }
      const location = await (Location.getCurrentPositionAsync as any)({
        accuracy: (Location.Accuracy as any).Balanced,
      });
      setVolunteerLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (err) {
      console.error('Failed to fetch volunteer location:', err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f9fb' }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setIsDrawerOpen(true)}
        >
          <MaterialCommunityIcons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTextSection}>
          <Text style={styles.headerTitle}>Volunteer Dashboard</Text>
          <Text style={styles.headerSubtitle}>Manage relief operations and respond to requests</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.pageContainer}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusCardLeft}>
            <View style={styles.statusDot} />
            <View>
              <Text style={styles.statusLabel}>Status: Available</Text>
              <Text style={styles.statusDescription}>Ready to accept new assignments</Text>
            </View>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>Active</Text>
          </View>
        </View>

        <View style={styles.cardContainer}>
          <View style={styles.mapSectionCard}>
            <Text style={styles.mapSectionTitle}>Incident Map</Text>
            <Text style={styles.mapSectionSubtitle}>Real-time view of reported incidents in your area</Text>

            <View style={styles.mapCardInner}>
              {MapView ? (
                <>
                  <MapView
                    style={styles.mapFull}
                    initialRegion={{ latitude: 23.8103, longitude: 90.4125, latitudeDelta: 0.06, longitudeDelta: 0.06 }}
                  >
                    {/* Volunteer's own location marker (blue) */}
                    {volunteerLocation && Marker && (
                      <Marker
                        coordinate={{ latitude: volunteerLocation.latitude, longitude: volunteerLocation.longitude }}
                        pinColor="#2196f3"
                        title="Your Location"
                      />
                    )}
                    {incidents && incidents.map((it: any) => (
                      Marker && (
                        <Marker
                          key={it.id}
                          coordinate={{ latitude: it.lat, longitude: it.lon }}
                          pinColor={it.priority === 'critical' ? '#e53935' : it.priority === 'high' ? '#fb8c00' : it.priority === 'medium' ? '#ffd54f' : '#66bb6a'}
                        />
                      )
                    ))}
                  </MapView>

                  {/* expand button in top-right */}
                  <TouchableOpacity style={styles.expandButton} onPress={() => router.push('/full-map')} activeOpacity={0.8}>
                    <MaterialCommunityIcons name="fullscreen" size={20} color="#fff" />
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.mapFallbackCentered}><Text style={{ color: '#666' }}>Map preview unavailable</Text></View>
              )}
              {/* Map legend overlay */}
              <View style={styles.legendBox} pointerEvents="none">
                <Text style={styles.legendTitle}>Map Legend</Text>
                <View style={styles.legendRow}><View style={[styles.legendDot, { backgroundColor: '#2196f3' }]} /><Text style={styles.legendLabel}>Your Location</Text></View>
                <View style={styles.legendRow}><View style={[styles.legendDot, { backgroundColor: '#e53935' }]} /><Text style={styles.legendLabel}>Critical</Text></View>
                <View style={styles.legendRow}><View style={[styles.legendDot, { backgroundColor: '#fb8c00' }]} /><Text style={styles.legendLabel}>High</Text></View>
                <View style={styles.legendRow}><View style={[styles.legendDot, { backgroundColor: '#ffd54f' }]} /><Text style={styles.legendLabel}>Medium</Text></View>
                <View style={styles.legendRow}><View style={[styles.legendDot, { backgroundColor: '#66bb6a' }]} /><Text style={styles.legendLabel}>Supply Camp</Text></View>
              </View>
            </View>
          </View>

          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/incoming-request?id=1')}>
            <View style={styles.statCardLarge}>
              <Text style={styles.cardLabel}>Pending Requests</Text>
              <Text style={styles.cardNumber}>{requests ? requests.filter((r: any) => r.status === 'pending').length : 0}</Text>
              <View style={styles.cardHintRow}><MaterialCommunityIcons name="clock-outline" size={16} color="#2196f3" /><Text style={styles.cardHint}>  Awaiting response</Text></View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('active-assignments' as any)}>
            <View style={styles.statCardLarge}>
              <Text style={styles.cardLabel}>Active Assignments</Text>
              <Text style={styles.cardNumber}>{requests ? requests.filter((r: any) => r.status === 'accepted').length : 0}</Text>
              <View style={styles.cardHintRow}><MaterialCommunityIcons name="send" size={16} color="#2196f3" /><Text style={styles.cardHint}>  In progress</Text></View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('completed-tasks' as any)}>
            <View style={styles.statCardLarge}>
              <Text style={styles.cardLabel}>Completed Today</Text>
              <Text style={styles.cardNumber}>{requests ? requests.filter((r: any) => r.status === 'completed').length : 0}</Text>
              <View style={styles.cardHintRow}><MaterialCommunityIcons name="check-circle-outline" size={16} color="#2e7d32" /><Text style={styles.cardHint}>  Successfully delivered</Text></View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('total-incidents' as any)}>
            <View style={styles.statCardLarge}>
              <Text style={styles.cardLabel}>Total Incidents</Text>
              <Text style={styles.cardNumber}>{incidents ? incidents.length : 0}</Text>
              <View style={styles.cardHintRow}><MaterialCommunityIcons name="map-marker-outline" size={16} color="#666" /><Text style={styles.cardHint}>  On map</Text></View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <VolunteerDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#1e88e5',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTextSection: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
  },
  statusPillSection: {
    backgroundColor: '#1e88e5',
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingLeft: 60,
    paddingTop: 0,
  },
  pageContainer: { padding: 20, paddingBottom: 40 },
  statusCard: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  statusCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2e7d32',
  },
  statusLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1b5e20',
    marginBottom: 4,
  },
  statusDescription: {
    fontSize: 13,
    color: '#558b2f',
  },
  statusBadge: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  availablePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  availableDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2e7d32',
    marginRight: 8,
  },
  availableText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  cardContainer: { marginTop: 0, paddingHorizontal: 0 },
  statCardLarge: { backgroundColor: '#fff', borderRadius: 12, padding: 18, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.03, elevation: 1 },
  cardLabel: { color: '#9aa0a6', fontSize: 14, marginBottom: 8 },
  cardNumber: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 8 },
  cardHintRow: { flexDirection: 'row', alignItems: 'center' },
  cardHint: { color: '#6b7280', marginLeft: 6 },

  mapSectionCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 8, overflow: 'hidden' },
  mapSectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  mapSectionSubtitle: { color: '#6b7280', marginBottom: 10 },
  mapCardInner: { height: 220, borderRadius: 10, overflow: 'hidden', backgroundColor: '#f3f6f9' },
  mapFull: { flex: 1 },
  mapFallbackCentered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  expandButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0, 0, 0, 0.4)', width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },

  // legend (kept in case needed)
  legend: { position: 'absolute', left: 12, top: 12, backgroundColor: '#fff', padding: 8, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.06, elevation: 2 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  legendText: { fontSize: 12, color: '#333' },
  legendBox: { position: 'absolute', left: 12, top: 12, backgroundColor: '#fff', padding: 8, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.06, elevation: 3 },
  legendTitle: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  legendLabel: { fontSize: 12, color: '#444' },
});
