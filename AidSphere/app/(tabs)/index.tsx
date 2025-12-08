import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // If the signed-in user is a volunteer (including demo), skip this Home Dashboard
    // and go directly to the volunteer dashboard (explore tab).
    if (role === 'volunteer') {
      router.replace('/(tabs)/explore');
    }
  }, [role]);

  // Sample active reports data
  const activeReports = [
    {
      id: 'DR-1004',
      need: 'Medical Assistance',
      status: 'Assigned',
      assignee: 'Volunteer X',
      eta: '30 min',
      location: { lat: 40.7128, lng: -74.006 },
    },
  ];

  // While we're redirecting volunteers, show a simple loader to avoid flicker.
  if (role === 'volunteer') {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0099ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home Dashboard</Text>
          <TouchableOpacity style={styles.notificationIcon}>
            <MaterialCommunityIcons name="bell" size={24} color="#ff6b6b" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>1</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Report Emergency Button */}
        <TouchableOpacity
          style={styles.emergencyButton}
          onPress={() => router.push('/emergency-report')}
        >
          <MaterialCommunityIcons name="hand-back-right" size={40} color="#fff" />
          <Text style={styles.emergencyText}>REPORT{'\n'}EMERGENCY{'\n'}NEED</Text>
        </TouchableOpacity>

        {/* My Active Reports Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Active Reports</Text>

          {activeReports.map((report) => (
            <TouchableOpacity key={report.id} style={styles.reportCard}>
              {/* Report Details */}
              <View style={styles.reportHeader}>
                <Text style={styles.reportId}>Report ID: {report.id}</Text>
              </View>

              <View style={styles.reportDetailsRow}>
                <Text style={styles.reportLabel}>Need: </Text>
                <Text style={styles.reportValue}>{report.need}</Text>
              </View>

              <View style={styles.reportDetailsRow}>
                <Text style={styles.reportLabel}>Status: </Text>
                <Text style={styles.reportValue}>{report.status}</Text>
              </View>

              <View style={styles.reportDetailsRow}>
                <Text style={styles.reportLabel}>Status: </Text>
                <Text style={styles.assigneeValue}>{report.assignee}</Text>
              </View>

              <View style={styles.reportDetailsRow}>
                <Text style={styles.volunteerText}>
                  {report.assignee} - ETA {report.eta}.
                </Text>
              </View>

              {/* Map Preview */}
              <View style={styles.mapContainer}>
                <MaterialCommunityIcons name="map" size={200} color="#e0e0e0" />
                <View style={styles.mapMarkerStart}>
                  <MaterialCommunityIcons name="map-marker" size={20} color="#4a90e2" />
                </View>
                <View style={styles.mapMarkerEnd}>
                  <MaterialCommunityIcons name="map-marker" size={20} color="#50e3c2" />
                </View>
                <View style={styles.mapLine} />
              </View>
            </TouchableOpacity>
          ))}

          {activeReports.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No active reports</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    paddingTop: 12,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
  },
  notificationIcon: {
    position: 'absolute',
    right: 0,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff6b6b',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  emergencyButton: {
    backgroundColor: '#d84c3d',
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  emergencyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 26,
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 14,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#4caf50',
    padding: 16,
    marginBottom: 16,
  },
  reportHeader: {
    marginBottom: 10,
  },
  reportId: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  reportDetailsRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  reportLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  reportValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  assigneeValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4caf50',
  },
  volunteerText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#999',
    marginTop: 6,
    lineHeight: 16,
  },
  mapContainer: {
    marginTop: 14,
    position: 'relative',
    height: 120,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapMarkerStart: {
    position: 'absolute',
    left: '18%',
    top: '45%',
  },
  mapMarkerEnd: {
    position: 'absolute',
    right: '12%',
    top: '38%',
  },
  mapLine: {
    position: 'absolute',
    left: '20%',
    right: '14%',
    height: 2,
    backgroundColor: '#4a90e2',
    transform: [{ rotate: '-8deg' }],
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
