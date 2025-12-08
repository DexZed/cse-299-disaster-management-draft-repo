import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectAllRequests, fetchRequests, completeRequest } from '../store/slices/requestsSlice';
import * as Linking from 'expo-linking';

// Try to require react-native-maps dynamically
let MapView: any = null;
let Marker: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  MapView = require('react-native-maps').default;
  Marker = require('react-native-maps').Marker;
} catch (err) {
  // no-op; we'll show a fallback
}

interface Assignment {
  id: string;
  type: string;
  location: string;
  priority: string;
  affectedPeople?: number;
  estimatedTime?: string;
  description?: string;
  collectionPoint?: string;
  collectionPointAddress?: string;
  distance?: string;
  instructions?: string[];
  victimPhone?: string;
  victimName?: string;
  affectedLat?: number;
  affectedLon?: number;
  collectionLat?: number;
  collectionLon?: number;
}

export default function ActiveAssignmentsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const requests = useAppSelector(selectAllRequests);
  const [completedCount, setCompletedCount] = useState(0);
  const [collectionDoneAssignmentId, setCollectionDoneAssignmentId] = useState<string | null>(null);
  const [volunteerLat, setVolunteerLat] = useState<number | null>(null);
  const [volunteerLon, setVolunteerLon] = useState<number | null>(null);

  // Fetch volunteer location
  useEffect(() => {
    const getVolunteerLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          setVolunteerLat(location.coords.latitude);
          setVolunteerLon(location.coords.longitude);
        }
      } catch (err) {
        console.log('Location error:', err);
      }
    };
    getVolunteerLocation();
  }, []);

  // Refresh requests when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchRequests());
    }, [dispatch])
  );

  // Filter accepted requests
  const activeAssignments = (requests || []).filter((r: any) => r.status === 'accepted');

  // Mock assignment details based on request
  const getAssignmentDetails = (request: any): Assignment => {
    const baseAssignment: Assignment = {
      id: request.id,
      type: request.type,
      location: request.location,
      priority: request.priority || 'medium',
    };

    if (request.type === 'Food Request') {
      return {
        ...baseAssignment,
        affectedPeople: 6,
        estimatedTime: '45 mins',
        description: 'Family of 6 stranded without food for 2 days',
        collectionPoint: 'Central Relief Camp',
        collectionPointAddress: 'Mirpur-2, Dhaka',
        distance: '1.2 km from your location',
        victimName: 'Fatima Rahman',
        victimPhone: '+8801234567890',
        affectedLat: 23.811,
        affectedLon: 90.412,
        collectionLat: 23.805,
        collectionLon: 90.400,
        instructions: [
          'Go to Central Relief Camp to collect supplies',
          'Collect food packets for 6 people',
          'Deliver to Mirpur-10, Dhaka',
        ],
      };
    } else if (request.type === 'Medical Request') {
      return {
        ...baseAssignment,
        affectedPeople: 3,
        estimatedTime: '30 mins',
        description: 'Family with injured child needs medical supplies',
        victimName: 'Ahmed Hassan',
        victimPhone: '+8801987654321',
        affectedLat: 23.82,
        affectedLon: 90.405,
        collectionLat: 23.815,
        collectionLon: 90.395,
        collectionPoint: 'Medical Relief Hub',
        collectionPointAddress: 'Dhanmondi, Dhaka',
        distance: '2.5 km from your location',
        instructions: [
          'Go to Medical Relief Hub to collect medical supplies',
          'Get first aid kit and medicines for child injuries',
          'Deliver to Dhanmondi, Dhaka',
        ],
      };
    } else if (request.type === 'Shelter Request') {
      return {
        ...baseAssignment,
        affectedPeople: 8,
        estimatedTime: '60 mins',
        description: 'Family displaced by disaster needs shelter materials',
        affectedLat: 23.804,
        affectedLon: 90.42,
        collectionLat: 23.825,
        collectionLon: 90.428,
        collectionPoint: 'Shelter Supply Center',
        collectionPointAddress: 'Gulshan, Dhaka',
        distance: '3.0 km from your location',
        victimName: 'Karim Sheikh',
        victimPhone: '+8801555666777',
        instructions: [
          'Go to Shelter Supply Center to collect shelter materials',
          'Collect tent and bedding for 8 people',
          'Deliver to pickup location',
        ],
      };
    }

    return baseAssignment;
  };

  const handleResourceCollectionDone = (assignmentId: string) => {
    // Show the "Mark as Done" button
    setCollectionDoneAssignmentId(assignmentId);
  };

  const handleMarkAsDone = (assignmentId: string) => {
    Alert.alert(
      'Task Completed?',
      'This will mark the task as completed and update your statistics.',
      [
        { text: 'Cancel', onPress: () => setCollectionDoneAssignmentId(null), style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              // Dispatch action to mark request as completed in Redux
              await dispatch(completeRequest(assignmentId));
              // Refresh requests to update the list
              dispatch(fetchRequests());
              setCollectionDoneAssignmentId(null);
              Alert.alert('Success', 'Task marked as completed!', [
                {
                  text: 'OK',
                  onPress: () => {
                    // Navigate back to dashboard
                    router.back();
                  },
                },
              ]);
            } catch (err) {
              Alert.alert('Error', 'Failed to complete task');
            }
          },
        },
      ]
    );
  };

  const handleCallVictim = (phoneNumber: string | undefined, victimName: string) => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Phone number not available');
      return;
    }
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleMessageVictim = (phoneNumber: string | undefined, victimName: string) => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Phone number not available');
      return;
    }
    Linking.openURL(`sms:${phoneNumber}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Active Assignments</Text>
          <Text style={styles.headerSubtitle}>Your ongoing relief operations</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeAssignments.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="check-circle-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No active assignments</Text>
            <Text style={styles.emptySubtitle}>Accepted requests will appear here</Text>
          </View>
        ) : (
          activeAssignments.map((request: any) => {
            const assignment = getAssignmentDetails(request);
            const priorityColor =
              assignment.priority === 'critical'
                ? '#e53935'
                : assignment.priority === 'high'
                ? '#fb8c00'
                : assignment.priority === 'medium'
                ? '#ffd54f'
                : '#66bb6a';

            return (
              <View key={assignment.id} style={styles.assignmentCard}>
                {/* Header with type and priority */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleRow}>
                    <MaterialCommunityIcons
                      name="package-variant"
                      size={24}
                      color="#0099ff"
                    />
                    <View style={styles.titleGroup}>
                      <Text style={styles.assignmentType}>{assignment.type}</Text>
                      <Text style={styles.timestamp}>15h ago</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: priorityColor },
                    ]}
                  >
                    <Text style={styles.priorityText}>
                      {assignment.priority.charAt(0).toUpperCase() +
                        assignment.priority.slice(1)}
                    </Text>
                  </View>
                </View>

                {/* Status */}
                <View style={styles.statusRow}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={16}
                    color="#0099ff"
                  />
                  <Text style={styles.statusText}>Status: Accepted</Text>
                </View>

                {/* Location Section */}
                <View style={styles.infoSection}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={20}
                    color="#2e7d32"
                  />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>Delivery Location</Text>
                    <Text style={styles.infoText}>{assignment.location}</Text>
                    <Text style={styles.description}>
                      {assignment.description}
                    </Text>
                    <View style={styles.metaRow}>
                      <View style={styles.metaItem}>
                        <MaterialCommunityIcons
                          name="account-multiple"
                          size={14}
                          color="#666"
                        />
                        <Text style={styles.metaText}>
                          {assignment.affectedPeople} people
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <MaterialCommunityIcons
                          name="clock-outline"
                          size={14}
                          color="#666"
                        />
                        <Text style={styles.metaText}>
                          Est. {assignment.estimatedTime}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Collection Point Section */}
                <View style={styles.collectionBox}>
                  <View style={styles.collectionHeader}>
                    <MaterialCommunityIcons
                      name="store"
                      size={20}
                      color="#2e7d32"
                    />
                    <Text style={styles.collectionTitle}>Collection Point</Text>
                  </View>
                  <Text style={styles.collectionName}>
                    {assignment.collectionPoint}
                  </Text>
                  <Text style={styles.collectionAddress}>
                    {assignment.collectionPointAddress}
                  </Text>
                  <View style={styles.distanceRow}>
                    <MaterialCommunityIcons
                      name="heart"
                      size={16}
                      color="#e53935"
                    />
                    <Text style={styles.distanceText}>{assignment.distance}</Text>
                  </View>
                </View>

                {/* Map Section - Shows locations: volunteer, supply camp & affected area */}
                <View style={styles.mapSection}>
                  <View style={styles.mapHeader}>
                    <MaterialCommunityIcons name="map" size={18} color="#0099ff" />
                    <Text style={styles.mapTitle}>Location of the Supply Camp and Assigned Affected Area</Text>
                  </View>
                  <View style={styles.mapContainer}>
                    {MapView ? (
                      <MapView
                        style={styles.map}
                        initialRegion={{
                          latitude: assignment.collectionLat,
                          longitude: assignment.collectionLon,
                          latitudeDelta: 0.02,
                          longitudeDelta: 0.02,
                        }}
                      >
                        {/* Volunteer's own location (blue) */}
                        {volunteerLat && volunteerLon && Marker && (
                          <Marker
                            coordinate={{
                              latitude: volunteerLat,
                              longitude: volunteerLon,
                            }}
                            pinColor="#0099ff"
                            title="Your Location"
                          />
                        )}
                        {/* Supply camp location (green) */}
                        {Marker && (
                          <Marker
                            coordinate={{
                              latitude: assignment.collectionLat,
                              longitude: assignment.collectionLon,
                            }}
                            pinColor="#2e7d32"
                            title="Supply Camp"
                          />
                        )}
                        {/* Affected area location (red) */}
                        {Marker && (
                          <Marker
                            coordinate={{
                              latitude: assignment.affectedLat,
                              longitude: assignment.affectedLon,
                            }}
                            pinColor="#e53935"
                            title="Assigned Affected Area"
                          />
                        )}
                      </MapView>
                    ) : (
                      <View style={styles.mapFallback}>
                        <Text>Map unavailable</Text>
                      </View>
                    )}
                    {/* Expand button positioned on top-right of map */}
                    <TouchableOpacity
                      onPress={() => router.push(`/active-assignment-map?assignmentId=${assignment.id}`)}
                      style={styles.mapExpandButton}
                    >
                      <MaterialCommunityIcons name="fullscreen" size={18} color="#0099ff" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.mapLegend}>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#0099ff' }]} />
                      <Text style={styles.legendText}>Your Location</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#2e7d32' }]} />
                      <Text style={styles.legendText}>Supply Camp</Text>
                    </View>
                    <View style={styles.legendItem}>
                      <View style={[styles.legendDot, { backgroundColor: '#e53935' }]} />
                      <Text style={styles.legendText}>Assigned Affected Area</Text>
                    </View>
                  </View>
                </View>

                {/* Communication Section */}
                <View style={styles.communicationBox}>
                  <View style={styles.communicationHeader}>
                    <MaterialCommunityIcons
                      name="phone"
                      size={20}
                      color="#0099ff"
                    />
                    <View style={styles.communicationInfo}>
                      <Text style={styles.communicationTitle}>Contact Victim</Text>
                      <Text style={styles.victimName}>{assignment.victimName}</Text>
                    </View>
                  </View>
                  <View style={styles.communicationButtons}>
                    <TouchableOpacity
                      style={styles.callButton}
                      onPress={() => handleCallVictim(assignment.victimPhone, assignment.victimName || 'Victim')}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons
                        name="phone-outline"
                        size={18}
                        color="#fff"
                      />
                      <Text style={styles.buttonText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.messageButton}
                      onPress={() => handleMessageVictim(assignment.victimPhone, assignment.victimName || 'Victim')}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons
                        name="message-text-outline"
                        size={18}
                        color="#fff"
                      />
                      <Text style={styles.buttonText}>Message</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Instructions */}
                <View style={styles.instructionsSection}>
                  <Text style={styles.instructionsTitle}>Instructions:</Text>
                  {assignment.instructions?.map((instruction, idx) => (
                    <View key={idx} style={styles.instructionItem}>
                      <Text style={styles.instructionNumber}>{idx + 1}</Text>
                      <Text style={styles.instructionText}>{instruction}</Text>
                    </View>
                  ))}
                </View>

                {/* Conditional Button: Resource Collection Done or Task Completed */}
                {collectionDoneAssignmentId === assignment.id ? (
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => handleMarkAsDone(assignment.id)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={18}
                      color="#fff"
                    />
                    <Text style={styles.doneButtonText}>Task Completed</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => handleResourceCollectionDone(assignment.id)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={18}
                      color="#fff"
                    />
                    <Text style={styles.doneButtonText}>
                      Resource Collection Done
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
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
    marginRight: 8,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 4,
  },
  assignmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#0099ff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleGroup: {
    marginLeft: 12,
    flex: 1,
  },
  assignmentType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: '500',
    marginLeft: 8,
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  collectionBox: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  collectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  collectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2e7d32',
    marginLeft: 6,
  },
  collectionName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1b5e20',
    marginBottom: 2,
  },
  collectionAddress: {
    fontSize: 12,
    color: '#2e7d32',
    marginBottom: 6,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceText: {
    fontSize: 12,
    color: '#e53935',
    fontWeight: '600',
    marginLeft: 4,
  },
  communicationBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  communicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  communicationInfo: {
    marginLeft: 10,
    flex: 1,
  },
  communicationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0099ff',
  },
  victimName: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '600',
    marginTop: 2,
  },
  communicationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  callButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0099ff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#2e7d32',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  instructionsSection: {
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  instructionNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
    minWidth: 20,
  },
  instructionText: {
    fontSize: 13,
    color: '#555',
    flex: 1,
    lineHeight: 18,
  },
  doneButton: {
    flexDirection: 'row',
    backgroundColor: '#2e7d32',
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  mapSection: {
    marginBottom: 12,
  },
  mapHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mapTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0099ff',
    marginLeft: 6,
    flex: 1,
  },
  mapContainer: {
    height: 220,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    marginBottom: 8,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapExpandButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  mapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLegend: {
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 6,
    gap: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    color: '#666',
  },
});
