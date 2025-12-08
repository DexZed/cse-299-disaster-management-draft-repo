import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchIncidents, selectAllIncidents } from '../store/slices/incidentsSlice';

interface Incident {
  id: string;
  type: string;
  location: string;
  priority: string;
  description?: string;
  affectedPeople?: number;
  timestamp?: string;
  time?: string;
}

export default function TotalIncidentsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const incidents = useAppSelector(selectAllIncidents);

  // Mock incidents data matching the screenshot
  const mockIncidents = [
    {
      id: '1',
      type: 'Food Need',
      location: 'Mirpur-10, Dhaka',
      priority: 'high',
      description: 'Family of 6 stranded without food for 2 days',
      affectedPeople: 6,
      timestamp: '15h ago',
      time: '10:30 AM',
    },
    {
      id: '2',
      type: 'Medical Need',
      location: 'Dhanmondi, Dhaka',
      priority: 'critical',
      description: 'Pregnant woman needs urgent medical attention',
      affectedPeople: 1,
      timestamp: '17h ago',
      time: '08:15 AM',
    },
    {
      id: '3',
      type: 'Shelter Need',
      location: 'Mohammadpur, Dhaka',
      priority: 'medium',
      description: 'House damaged, family needs temporary shelter',
      affectedPeople: 4,
      timestamp: '18h ago',
      time: '08:45 AM',
    },
    {
      id: '4',
      type: 'Food Need',
      location: 'Uttara, Dhaka',
      priority: 'medium',
      description: 'Community center needs food supplies for 20 people',
      affectedPeople: 20,
      timestamp: '16h ago',
      time: '11:00 AM',
    },
  ];

  // Refresh incidents when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchIncidents());
    }, [dispatch])
  );

  // Get incident details based on type
  const getIncidentDetails = (incident: any): Incident => {
    const baseIncident: Incident = {
      id: incident.id || '1',
      type: incident.type || 'Food Need',
      location: incident.location || 'Mirpur-10, Dhaka',
      priority: incident.priority || 'medium',
      timestamp: incident.timestamp || '15h ago',
      time: incident.time || '10:30 AM',
    };

    if (incident.type === 'Food Need' || incident.type?.includes('Food')) {
      return {
        ...baseIncident,
        type: 'Food Need',
        description: 'Family of 6 stranded without food for 2 days',
        affectedPeople: 6,
      };
    } else if (incident.type === 'Medical Need' || incident.type?.includes('Medical')) {
      return {
        ...baseIncident,
        type: 'Medical Need',
        description: 'Family with injured child needs medical supplies',
        affectedPeople: 1,
      };
    } else if (incident.type === 'Shelter Need' || incident.type?.includes('Shelter')) {
      return {
        ...baseIncident,
        type: 'Shelter Need',
        description: 'House damaged, family needs temporary shelter',
        affectedPeople: 4,
      };
    }

    return baseIncident;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical':
        return '#e53935';
      case 'high':
        return '#fb8c00';
      case 'medium':
        return '#ffd54f';
      default:
        return '#66bb6a';
    }
  };

  const getPriorityLabel = (priority: string) => {
    return priority?.charAt(0).toUpperCase() + priority?.slice(1).toLowerCase();
  };

  const getIncidentIcon = (type: string) => {
    if (type?.includes('Food')) return 'food-apple';
    if (type?.includes('Medical')) return 'hospital-box';
    if (type?.includes('Shelter')) return 'home';
    return 'alert-circle-outline';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Total Incidents</Text>
          <Text style={styles.headerSubtitle}>All reported incidents in your area</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {mockIncidents && mockIncidents.length > 0 ? (
          mockIncidents.map((incident: any, index: number) => {
            const details = getIncidentDetails(incident);
            const priorityColor = getPriorityColor(details.priority);
            const iconName = getIncidentIcon(details.type);

            return (
              <View key={`${details.id}-${index}`} style={styles.incidentCard}>
                {/* Header with icon and type */}
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons
                      name={iconName}
                      size={20}
                      color="#fff"
                    />
                  </View>
                  <View style={styles.cardTitleRow}>
                    <View style={styles.titleGroup}>
                      <Text style={styles.incidentType}>{details.type}</Text>
                      <Text style={styles.timestamp}>{details.timestamp}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: priorityColor },
                    ]}
                  >
                    <Text style={styles.priorityText}>
                      {getPriorityLabel(details.priority)}
                    </Text>
                  </View>
                </View>

                {/* Location and Affected Area */}
                <View style={styles.locationSection}>
                  <View style={styles.locationRow}>
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={16}
                      color="#666"
                    />
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationTitle}>{details.location}</Text>
                      <Text style={styles.locationDescription}>
                        {details.description}
                      </Text>
                    </View>
                  </View>

                  {/* Meta Information */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <MaterialCommunityIcons
                        name="account-multiple"
                        size={14}
                        color="#666"
                      />
                      <Text style={styles.metaText}>
                        {details.affectedPeople} people affected
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={14}
                        color="#666"
                      />
                      <Text style={styles.metaText}>{details.time}</Text>
                    </View>
                  </View>
                </View>

                {/* Location tag at bottom */}
                <View style={styles.locationTag}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={16}
                    color="#0099ff"
                  />
                  <Text style={styles.locationTagText}>
                    Location: {details.location}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="alert-circle-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No incidents reported</Text>
            <Text style={styles.emptySubtitle}>
              New incident reports will appear here
            </Text>
          </View>
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
  incidentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8f1f8',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#ffd54f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cardTitleRow: {
    flex: 1,
  },
  titleGroup: {
    flex: 1,
  },
  incidentType: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  locationSection: {
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  locationInfo: {
    marginLeft: 8,
    flex: 1,
  },
  locationTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  locationDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    marginLeft: 24,
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#666',
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  locationTagText: {
    fontSize: 12,
    color: '#0099ff',
    fontWeight: '500',
  },
});
