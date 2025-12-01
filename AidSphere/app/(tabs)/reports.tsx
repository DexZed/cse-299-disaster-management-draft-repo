import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function ReportsScreen() {
  const reports = [
    {
      id: 'DR-1004',
      need: 'Medical Assistance',
      status: 'Assigned',
      date: '2024-11-19',
      volunteer: 'Volunteer X',
    },
    {
      id: 'DR-1003',
      need: 'Food & Shelter',
      status: 'Completed',
      date: '2024-11-18',
      volunteer: 'Volunteer Y',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Reports</Text>
        </View>

        {/* Reports List */}
        <View style={styles.section}>
          {reports.map((report) => (
            <TouchableOpacity key={report.id} style={styles.reportCard}>
              <View style={styles.reportTop}>
                <Text style={styles.reportId}>{report.id}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    report.status === 'Completed'
                      ? styles.statusCompleted
                      : styles.statusAssigned,
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      report.status === 'Completed'
                        ? styles.statusTextCompleted
                        : styles.statusTextAssigned,
                    ]}>
                    {report.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.reportNeed}>{report.need}</Text>
              <Text style={styles.reportDate}>{report.date}</Text>
              <Text style={styles.reportVolunteer}>Assigned to: {report.volunteer}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  section: {
    marginBottom: 24,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  reportTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusAssigned: {
    backgroundColor: '#e3f2fd',
  },
  statusCompleted: {
    backgroundColor: '#e8f5e9',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextAssigned: {
    color: '#1976d2',
  },
  statusTextCompleted: {
    color: '#388e3c',
  },
  reportNeed: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  reportVolunteer: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});
