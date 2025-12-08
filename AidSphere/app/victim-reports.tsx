import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Report {
  id: string;
  reportId: string;
  date: string;
  location: string;
  helpType: string;
  volunteerName: string;
  rating: number;
  status: 'Completed' | 'In Progress' | 'Pending';
}

export default function VictimReportsPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const safeTop = 16;
  const safeBottom = insets && typeof insets.bottom === 'number' ? insets.bottom : 0;

  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      reportId: '#DR-2024-1234',
      date: 'Nov 24, 2024 - 10:30 AM',
      location: 'Dhaka, Bangladesh',
      helpType: 'Food',
      volunteerName: 'Kamal Mahmud',
      rating: 5,
      status: 'Completed',
    },
    {
      id: '2',
      reportId: '#DR-2024-1233',
      date: 'Nov 23, 2024 - 3:15 PM',
      location: 'Chittagong, Bangladesh',
      helpType: 'Medical Kit',
      volunteerName: 'Fahad Hossain',
      rating: 4,
      status: 'Completed',
    },
    {
      id: '3',
      reportId: '#DR-2024-1232',
      date: 'Nov 22, 2024 - 8:45 AM',
      location: 'Sylhet, Bangladesh',
      helpType: 'Shelter',
      volunteerName: 'Niloy Sarkar',
      rating: 0,
      status: 'In Progress',
    },
  ]);

  const [ratingModal, setRatingModal] = useState<{ visible: boolean; reportId: string | null }>({
    visible: false,
    reportId: null,
  });
  const [tempRating, setTempRating] = useState<number>(0);

  const totalReports = reports.length;
  const completedReports = reports.filter((r) => r.status === 'Completed').length;
  const activeReports = reports.filter((r) => r.status === 'In Progress').length;
  const pendingReports = reports.filter((r) => r.status === 'Pending').length;

  const getHelpTypeColor = (helpType: string) => {
    switch (helpType) {
      case 'Food':
        return '#d32f2f';
      case 'Medical Kit':
        return '#d32f2f';
      case 'Shelter':
        return '#d32f2f';
      default:
        return '#666';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return '#4caf50';
      case 'In Progress':
        return '#2196f3';
      case 'Pending':
        return '#ff9800';
      default:
        return '#666';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialCommunityIcons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={18}
          color={i <= rating ? '#ffc107' : '#ddd'}
        />
      );
    }
    return stars;
  };

  const openRatingModal = (reportId: string, currentRating: number) => {
    setRatingModal({ visible: true, reportId });
    setTempRating(currentRating);
  };

  const closeRatingModal = () => {
    setRatingModal({ visible: false, reportId: null });
    setTempRating(0);
  };

  const submitRating = () => {
    if (ratingModal.reportId) {
      setReports(
        reports.map((r) =>
          r.id === ratingModal.reportId ? { ...r, rating: tempRating } : r
        )
      );
      closeRatingModal();
      Alert.alert('Success', 'Rating submitted successfully!');
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { paddingTop: safeTop, paddingBottom: safeBottom }]}
    >
      <StatusBar style="light" backgroundColor="#000000" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Reports</Text>
          <Text style={styles.headerSubtitle}>History of your requests</Text>
        </View>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={[styles.statCard, styles.statCard1]}>
            <Text style={styles.statNumber}>{totalReports}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statCard, styles.statCard2]}>
            <Text style={styles.statNumber}>{completedReports}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
          <View style={[styles.statCard, styles.statCard3]}>
            <Text style={styles.statNumber}>{activeReports}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={[styles.statCard, styles.statCard4]}>
            <Text style={styles.statNumber}>{pendingReports}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Reports List */}
        <View style={styles.reportsContainer}>
          {reports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              {/* Report Header with ID and Status */}
              <View style={styles.reportHeader}>
                <Text style={styles.reportId}>{report.reportId}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { borderColor: getStatusColor(report.status) },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      report.status === 'Completed'
                        ? 'check-circle'
                        : report.status === 'In Progress'
                        ? 'information'
                        : 'clock-outline'
                    }
                    size={16}
                    color={getStatusColor(report.status)}
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                    {report.status}
                  </Text>
                </View>
              </View>

              {/* Date */}
              <View style={styles.reportItem}>
                <MaterialCommunityIcons name="clock-outline" size={18} color="#666" />
                <Text style={styles.reportItemText}>{report.date}</Text>
              </View>

              {/* Location */}
              <View style={styles.reportItem}>
                <MaterialCommunityIcons name="map-marker" size={18} color="#666" />
                <Text style={styles.reportItemText}>{report.location}</Text>
              </View>

              {/* Help Type */}
              <View style={styles.reportItem}>
                <MaterialCommunityIcons name="package-variant" size={18} color={getHelpTypeColor(report.helpType)} />
                <Text style={[styles.reportItemText, { color: getHelpTypeColor(report.helpType) }]}>
                  Help Type: <Text style={styles.helpTypeValue}>{report.helpType}</Text>
                </Text>
              </View>

              {/* Volunteer Name */}
              <View style={styles.reportItem}>
                <MaterialCommunityIcons name="account" size={18} color="#666" />
                <Text style={styles.reportItemText}>{report.volunteerName}</Text>
              </View>

              {/* Rating */}
              {report.status === 'Completed' && (
                <View style={styles.ratingSection}>
                  <View style={styles.ratingHeader}>
                    <Text style={styles.ratingLabel}>Your Rating:</Text>
                    <TouchableOpacity
                      onPress={() => openRatingModal(report.id, report.rating)}
                      style={styles.editRatingButton}
                    >
                      <MaterialCommunityIcons name="pencil" size={14} color="#0099ff" />
                      <Text style={styles.editRatingText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.starsContainer}>
                    {renderStars(report.rating)}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Rating Modal */}
      <Modal
        visible={ratingModal.visible}
        transparent
        animationType="fade"
        onRequestClose={closeRatingModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ratingModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rate Volunteer</Text>
              <TouchableOpacity
                onPress={closeRatingModal}
                style={styles.modalCloseButton}
              >
                <MaterialCommunityIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.ratingPrompt}>How satisfied are you with the service?</Text>

            <View style={styles.ratingStarsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setTempRating(star)}
                  style={styles.ratingStarButton}
                >
                  <MaterialCommunityIcons
                    name={star <= tempRating ? 'star' : 'star-outline'}
                    size={40}
                    color={star <= tempRating ? '#ffc107' : '#ddd'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.ratingValue}>
              {tempRating > 0 ? `${tempRating} star${tempRating !== 1 ? 's' : ''}` : 'Select a rating'}
            </Text>

            <View style={styles.modalButtonGroup}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeRatingModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitButton, { opacity: tempRating > 0 ? 1 : 0.5 }]}
                onPress={submitRating}
                disabled={tempRating === 0}
              >
                <Text style={styles.submitButtonText}>Submit Rating</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 8,
    top: 32,
    padding: 8,
    width: 40,
  },
  headerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#fff',
    opacity: 0.9,
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCard1: {
    backgroundColor: '#f5f5f5',
  },
  statCard2: {
    backgroundColor: '#e8f5e9',
  },
  statCard3: {
    backgroundColor: '#e3f2fd',
  },
  statCard4: {
    backgroundColor: '#fff8e1',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    color: '#333',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  reportsContainer: {
    paddingHorizontal: 12,
    gap: 12,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  reportId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0099ff',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  reportItemText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  helpTypeValue: {
    color: '#d32f2f',
  },
  ratingSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 13,
    color: '#666',
  },
  editRatingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },
  editRatingText: {
    fontSize: 12,
    color: '#0099ff',
    fontWeight: '600',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  ratingModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  modalCloseButton: {
    padding: 8,
  },
  ratingPrompt: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  ratingStarsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  ratingStarButton: {
    padding: 8,
  },
  ratingValue: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  modalButtonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#d32f2f',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
