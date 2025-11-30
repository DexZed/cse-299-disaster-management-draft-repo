import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { acceptRequest, declineRequest, fetchRequests, selectAllRequests } from '../store/slices/requestsSlice';

export default function IncomingRequest() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params?.id || '1';
  /**
   * IncomingRequest
   * ---------------
   * Detail view for a single incoming request. Uses `requestsSlice`
   * thunks `acceptRequest` / `declineRequest` to update server-side
   * request status and refreshes the list with `fetchRequests()`.
   */
  const dispatch = useAppDispatch();
  const requests = useAppSelector(selectAllRequests);
  const [processing, setProcessing] = useState(false);

  const handleAccept = async () => {
    try {
      setProcessing(true);
      await dispatch(acceptRequest(id));
      // refresh list
      dispatch(fetchRequests());
      Alert.alert('Accepted', `You accepted request ${id}`);
      router.push('/volunteer-dashboard');
    } catch (err) {
      Alert.alert('Error', 'Failed to accept request');
    } finally {
      setProcessing(false);
    }
  };

  const handleDecline = async () => {
    try {
      setProcessing(true);
      await dispatch(declineRequest(id));
      dispatch(fetchRequests());
      Alert.alert('Declined', `You declined request ${id}`);
      router.back();
    } catch (err) {
      Alert.alert('Error', 'Failed to decline request');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.header}>Incoming Requests</Text>
        <Text style={styles.subheader}>New assignments from admin</Text>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconBox}><MaterialCommunityIcons name="food-apple" size={22} color="#2d6cdf" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Food Request</Text>
              <Text style={styles.cardTime}>207h ago</Text>
            </View>
            <View style={styles.priorityPill}><Text style={styles.priorityText}>High</Text></View>
          </View>

          <View style={styles.locationBox}>
            <View style={styles.locationRow}><MaterialCommunityIcons name="map-marker" size={14} color="#6b7280" /><Text style={styles.locationText}> Mirpur-10, Dhaka</Text></View>
            <Text style={styles.locationNote}>Family of 6 stranded without food for 2 days</Text>
            <View style={styles.metaRow}><Text style={styles.metaText}>6 people</Text><Text style={styles.metaText}>  •  Est. 45 mins</Text></View>
          </View>

          <View style={styles.collectionBox}>
            <Text style={styles.collectionTitle}>Collection Point</Text>
            <Text style={styles.collectionName}>Central Relief Camp</Text>
            <Text style={styles.collectionLocation}>Mirpur-2, Dhaka</Text>
            <Text style={styles.collectionDistance}>📍 1.2 km from your location</Text>
          </View>

          <View style={styles.instructionsBox}>
            <Text style={styles.instructionsLabel}>Instructions:</Text>
            <Text style={styles.instruction}>1. Go to Central Relief Camp to collect supplies</Text>
            <Text style={styles.instruction}>2. Collect food packets for 6 people</Text>
            <Text style={styles.instruction}>3. Deliver to Mirpur-10, Dhaka</Text>
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept} activeOpacity={0.9} disabled={processing}>
              {processing ? <ActivityIndicator color="#fff" /> : <Text style={styles.acceptText}>Accept Request</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineButton} onPress={handleDecline} activeOpacity={0.9} disabled={processing}>
              {processing ? <ActivityIndicator color="#374151" /> : <Text style={styles.declineText}>Decline</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fb' },
  content: { padding: 18, paddingBottom: 40 },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 2 },
  subheader: { color: '#6b7280', marginBottom: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, borderLeftWidth: 4, borderLeftColor: '#2d6cdf', shadowColor: '#000', shadowOpacity: 0.03, elevation: 1 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#eef5ff', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardTime: { color: '#9aa0a6', fontSize: 12 },
  priorityPill: { backgroundColor: '#fff4f0', borderColor: '#ffccba', borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  priorityText: { color: '#ff6b4d', fontWeight: '700' },

  locationBox: { backgroundColor: '#fafbfc', borderRadius: 8, padding: 10, marginBottom: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  locationText: { color: '#374151' },
  locationNote: { color: '#6b7280', marginBottom: 8 },
  metaRow: { flexDirection: 'row' },
  metaText: { color: '#6b7280', fontSize: 12, marginRight: 8 },

  collectionBox: { backgroundColor: '#ecfdf5', borderRadius: 8, padding: 12, marginBottom: 12, borderColor: '#d1fae5', borderWidth: 1 },
  collectionTitle: { color: '#047857', fontWeight: '700', marginBottom: 6 },
  collectionName: { color: '#065f46', fontWeight: '600' },
  collectionLocation: { color: '#065f46', marginBottom: 6 },
  collectionDistance: { color: '#065f46' },

  instructionsBox: { marginBottom: 12 },
  instructionsLabel: { fontWeight: '700', marginBottom: 6 },
  instruction: { color: '#374151', marginBottom: 6 },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  acceptButton: { backgroundColor: '#1e66ff', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, flex: 1, marginRight: 8, alignItems: 'center' },
  acceptText: { color: '#fff', fontWeight: '700' },
  declineButton: { borderWidth: 1, borderColor: '#e5e7eb', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, flex: 1, marginLeft: 8, alignItems: 'center', backgroundColor: '#fff' },
  declineText: { color: '#374151', fontWeight: '700' },
});
