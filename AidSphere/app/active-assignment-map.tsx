import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { useAppSelector } from '../store/hooks';
import { selectAllRequests } from '../store/slices/requestsSlice';

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

export default function ActiveAssignmentMapPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const safeTop = -32;
  const safeBottom = insets && typeof insets.bottom === 'number' ? insets.bottom : 0;
  const { assignmentId } = useLocalSearchParams();
  const requests = useAppSelector(selectAllRequests);
  
  const [volunteerLat, setVolunteerLat] = useState<number | null>(null);
  const [volunteerLon, setVolunteerLon] = useState<number | null>(null);

  // Find the assignment
  const assignment = (requests || [])
    .filter((r: any) => r.status === 'accepted')
    .find((r: any) => r.id === assignmentId);

  // Get assignment coordinates based on type
  const getAssignmentCoordinates = () => {
    if (!assignment) return null;

    if (assignment.type === 'Food Request') {
      return {
        affectedLat: 23.811,
        affectedLon: 90.412,
        collectionLat: 23.805,
        collectionLon: 90.400,
      };
    } else if (assignment.type === 'Medical Request') {
      return {
        affectedLat: 23.82,
        affectedLon: 90.405,
        collectionLat: 23.815,
        collectionLon: 90.395,
      };
    } else if (assignment.type === 'Shelter Request') {
      return {
        affectedLat: 23.804,
        affectedLon: 90.42,
        collectionLat: 23.825,
        collectionLon: 90.428,
      };
    }
    return null;
  };

  const coordinates = getAssignmentCoordinates();

  useEffect(() => {
    fetchVolunteerLocation();
  }, []);

  const fetchVolunteerLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setVolunteerLat(location.coords.latitude);
      setVolunteerLon(location.coords.longitude);
    } catch (err) {
      console.error('Failed to fetch volunteer location:', err);
    }
  };

  if (!assignment || !coordinates) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: safeTop, paddingBottom: safeBottom }]} edges={["top","bottom"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#111" />
          </TouchableOpacity>
          <Text style={styles.title}>Assignment Map</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Assignment not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { paddingTop: safeTop, paddingBottom: safeBottom }]} edges={["top","bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.title}>{assignment.type}</Text>
      </View>

      <View style={styles.mapWrapper}>
        {MapView ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: coordinates.collectionLat,
              longitude: coordinates.collectionLon,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
          >
            {/* Volunteer's own location marker (blue) */}
            {volunteerLat && volunteerLon && Marker && (
              <Marker
                coordinate={{ latitude: volunteerLat, longitude: volunteerLon }}
                pinColor="#0099ff"
                title="Your Location"
              />
            )}
            {/* Supply Camp marker (green) */}
            {Marker && (
              <Marker
                coordinate={{ latitude: coordinates.collectionLat, longitude: coordinates.collectionLon }}
                pinColor="#2e7d32"
                title="Supply Camp"
              />
            )}
            {/* Affected Area marker (red) */}
            {Marker && (
              <Marker
                coordinate={{ latitude: coordinates.affectedLat, longitude: coordinates.affectedLon }}
                pinColor="#e53935"
                title="Assigned Affected Area"
              />
            )}
          </MapView>
        ) : (
          <View style={styles.fallback}>
            <Text style={{ color: '#666' }}>Map preview unavailable</Text>
          </View>
        )}
        {/* Legend overlay - Top Left */}
        <View style={styles.legendBox} pointerEvents="none">
          <Text style={styles.legendTitle}>Map Legend</Text>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#0099ff' }]} />
            <Text style={styles.legendLabel}>Your Location</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#2e7d32' }]} />
            <Text style={styles.legendLabel}>Supply Camp</Text>
          </View>
          <View style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: '#e53935' }]} />
            <Text style={styles.legendLabel}>Assigned Affected Area</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f4f6',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  mapWrapper: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  fallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  legendBox: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    maxWidth: 140,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 11,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
});
