import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchIncidents, selectAllIncidents } from '../store/slices/incidentsSlice';
import { fetchRequests, selectAllRequests } from '../store/slices/requestsSlice';

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
  }, [dispatch]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f9fb' }}>
      <ScrollView contentContainerStyle={styles.pageContainer}>
        <View style={styles.headerRowTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Volunteer Dashboard</Text>
            <Text style={styles.subtitle}>Manage relief operations and respond to requests</Text>
          </View>
          <View style={styles.availablePill}>
            <View style={styles.availableDot} />
            <Text style={styles.availableText}>Available</Text>
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

          <View style={styles.statCardLarge}>
            <Text style={styles.cardLabel}>Active Assignments</Text>
            <Text style={styles.cardNumber}>{requests ? requests.filter((r: any) => r.status === 'accepted').length : 0}</Text>
            <View style={styles.cardHintRow}><MaterialCommunityIcons name="send" size={16} color="#2196f3" /><Text style={styles.cardHint}>  In progress</Text></View>
          </View>

          <View style={styles.statCardLarge}>
            <Text style={styles.cardLabel}>Completed Today</Text>
            <Text style={styles.cardNumber}>0</Text>
            <View style={styles.cardHintRow}><MaterialCommunityIcons name="check-circle-outline" size={16} color="#2e7d32" /><Text style={styles.cardHint}>  Successfully delivered</Text></View>
          </View>

          <View style={styles.statCardLarge}>
            <Text style={styles.cardLabel}>Total Incidents</Text>
            <Text style={styles.cardNumber}>{incidents ? incidents.length : 0}</Text>
            <View style={styles.cardHintRow}><MaterialCommunityIcons name="map-marker-outline" size={16} color="#666" /><Text style={styles.cardHint}>  On map</Text></View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pageContainer: { padding: 20, paddingBottom: 40 },
  headerRowTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: '#111', marginBottom: 6 },
  subtitle: { color: '#6b7280', fontSize: 15 },
  availablePill: { backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#e6eef3', flexDirection: 'row', alignItems: 'center' },
  availableDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2e7d32', marginRight: 8 },
  availableText: { color: '#111', fontWeight: '600' },

  cardContainer: { marginTop: 10 },
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
