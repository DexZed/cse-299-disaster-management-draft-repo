import React, { useState } from 'react';
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
import { selectAllRequests, fetchRequests } from '../store/slices/requestsSlice';

interface CompletedTask {
  id: string;
  type: string;
  location: string;
  priority: string;
  description?: string;
  affectedPeople?: number;
  completedTime?: string;
  completedDate?: string;
}

export default function CompletedTasksPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const requests = useAppSelector(selectAllRequests);

  // Refresh requests when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchRequests());
    }, [dispatch])
  );

  // Filter completed requests
  const completedTasks = (requests || []).filter((r: any) => r.status === 'completed');

  // Get task details based on type
  const getTaskDetails = (request: any): CompletedTask => {
    const baseTask: CompletedTask = {
      id: request.id,
      type: request.type,
      location: request.location,
      priority: request.priority || 'medium',
      completedTime: '33m ago',
      completedDate: '12/6/2025',
    };

    if (request.type === 'Food Request') {
      return {
        ...baseTask,
        description: 'Family of 6 stranded without food for 2 days',
        affectedPeople: 6,
      };
    } else if (request.type === 'Medical Request') {
      return {
        ...baseTask,
        description: 'Family with injured child needs medical supplies',
        affectedPeople: 3,
      };
    } else if (request.type === 'Shelter Request') {
      return {
        ...baseTask,
        description: 'Family displaced by disaster needs shelter materials',
        affectedPeople: 8,
      };
    }

    return baseTask;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Completed Tasks</Text>
          <Text style={styles.headerSubtitle}>Your relief work history</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {completedTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="check-circle-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No completed tasks yet</Text>
            <Text style={styles.emptySubtitle}>Your completed relief work will appear here</Text>
          </View>
        ) : (
          completedTasks.map((request: any) => {
            const task = getTaskDetails(request);
            const priorityColor =
              task.priority === 'critical'
                ? '#e53935'
                : task.priority === 'high'
                ? '#fb8c00'
                : task.priority === 'medium'
                ? '#ffd54f'
                : '#66bb6a';

            const iconName =
              task.type === 'Food Request'
                ? 'food-apple'
                : task.type === 'Medical Request'
                ? 'hospital-box'
                : 'home';

            return (
              <View key={task.id} style={styles.taskCard}>
                {/* Header with icon, type, and status */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleRow}>
                    <View style={styles.iconBox}>
                      <MaterialCommunityIcons
                        name={iconName}
                        size={24}
                        color="#2e7d32"
                      />
                    </View>
                    <View style={styles.titleGroup}>
                      <Text style={styles.taskType}>{task.type}</Text>
                      <Text style={styles.timestamp}>Completed {task.completedTime}</Text>
                    </View>
                  </View>
                  <View style={styles.statusBadge}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={20}
                      color="#2e7d32"
                    />
                    <Text style={styles.statusText}>Done</Text>
                  </View>
                </View>

                {/* Location and Details */}
                <View style={styles.detailsSection}>
                  <View style={styles.locationRow}>
                    <MaterialCommunityIcons
                      name="map-marker"
                      size={18}
                      color="#666"
                    />
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationText}>{task.location}</Text>
                      <Text style={styles.description}>{task.description}</Text>
                    </View>
                  </View>

                  {/* Meta information */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <MaterialCommunityIcons
                        name="account-multiple"
                        size={14}
                        color="#666"
                      />
                      <Text style={styles.metaText}>{task.affectedPeople} people helped</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialCommunityIcons
                        name="calendar"
                        size={14}
                        color="#666"
                      />
                      <Text style={styles.metaText}>{task.completedDate}</Text>
                    </View>
                  </View>
                </View>

                {/* Success Status */}
                <View style={styles.successBox}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={18}
                    color="#2e7d32"
                  />
                  <Text style={styles.successText}>Successfully delivered relief</Text>
                </View>
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
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#2e7d32',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  titleGroup: {
    flex: 1,
  },
  taskType: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e7d32',
  },
  detailsSection: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  locationInfo: {
    marginLeft: 8,
    flex: 1,
  },
  locationText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 8,
  },
  successText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e7d32',
  },
});
