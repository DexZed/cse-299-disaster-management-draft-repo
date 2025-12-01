import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ImageBackground,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRouter } from 'expo-router';
import { apiFetch } from '../constants/backend';

import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmergencyReportScreen() {
  const insets = useSafeAreaInsets();
  const safeTop = 0;
  const safeBottom = (insets && insets.bottom) ? insets.bottom : 0;
  /**
   * EmergencyReportScreen
   * ----------------------
   * Collects a disaster report from the user and submits it to the
   * backend. Currently the form uses `fetch('/api/reports/create')` to
   * submit multipart form data. To connect your backend, change the
   * URL and add authentication headers as needed.
   *
   * Note: A `reportSlice` exists which provides a `submitReport` thunk
   * you can use instead of calling `fetch` directly here for consistent
   * Redux-driven flow and centralized error/loading state.
   */
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  // Form state
  const [location, setLocation] = useState<{ latitude: number; longitude: number; address: string } | null>(null);
  const [description, setDescription] = useState('');
  const [helpType, setHelpType] = useState('');
  const [priority, setPriority] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [helpTypeMenuOpen, setHelpTypeMenuOpen] = useState(false);
  const [priorityMenuOpen, setPriorityMenuOpen] = useState(false);

  const helpTypeOptions = [
    { label: 'Select help type', value: '' },
    { label: 'Food', value: 'Food' },
    { label: 'Shelter', value: 'Shelter' },
    { label: 'Medical Kit', value: 'Medical Kit' },
  ];

  const priorityOptions = [
    { label: 'Critical', value: 'critical' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
  ];
  
  // UI state
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  // Map modal & picker state
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [markerPos, setMarkerPos] = useState<{ latitude: number; longitude: number } | null>(null);

  // Try to load a local image for the map view background.
  // The image filename used in the project should be `Map_view_victim.png|jpg|jpeg`.
  let MapBg: any = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    MapBg = require('../assets/images/Map_view_victim.png');
  } catch (e) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      MapBg = require('../assets/images/Map_view_victim.jpg');
    } catch (e2) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        MapBg = require('../assets/images/Map_view_victim.jpeg');
      } catch (e3) {
        MapBg = null;
      }
    }
  }

  // Fetch current location on mount
  useEffect(() => {
    fetchCurrentLocation();
  }, []);

  const fetchCurrentLocation = async () => {
    setLoadingLocation(true);
    setError('');
    try {
      const { status } = await (Location.requestForegroundPermissionsAsync as any)();
      if (status !== 'granted') {
        setError('Location permission denied');
        setLoadingLocation(false);
        return;
      }

      const currentLocation = await (Location.getCurrentPositionAsync as any)({
        accuracy: (Location.Accuracy as any).Balanced,
      });

      const { latitude, longitude } = currentLocation.coords;

      setLocation({
        latitude,
        longitude,
        address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
      });
      return { latitude, longitude };
    } catch (err) {
      setError('Failed to fetch location. Please enable location services.');
      console.error(err);
      return null;
    } finally {
      setLoadingLocation(false);
    }
  };

  const pickMedia = async () => {
    try {
      const result = await (ImagePicker.launchImageLibraryAsync as any)({
        mediaTypes: (ImagePicker.MediaTypeOptions as any).All,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setMedia([...media, result.assets[0].uri]);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick media');
      console.error(err);
    }
  };

  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!location) {
      setError('Location is required. Please enable location services.');
      return false;
    }
    if (!description.trim()) {
      setError('Please describe the situation');
      return false;
    }
    if (!helpType) {
      setError('Please select a type of help needed');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setError('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Append form data
      const formData = new FormData();
      formData.append('userId', user?.id || '');
      formData.append('latitude', String(location?.latitude || 0));
      formData.append('longitude', String(location?.longitude || 0));
      formData.append('address', location?.address || '');
      formData.append('description', description);
      formData.append('helpType', helpType);
      formData.append('priority', priority);

      // Append media files
      media.forEach((uri, index) => {
        const filename = uri.split('/').pop() || `media-${index}`;
        const extension = filename.split('.').pop() || 'jpg';
        const mimeType = extension === 'jpg' || extension === 'jpeg' ? 'image/jpeg' : `image/${extension}`;

        formData.append('media', {
          uri,
          name: filename,
          type: mimeType,
        } as any);
      });

      // Send to backend using centralized helper
      const response = await apiFetch('/reports/create', {
        method: 'POST',
        // NOTE: Do not set Content-Type for multipart/form-data here —
        // letting fetch set the correct boundary is more reliable.
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg = data?.message || data?.error || 'Failed to submit report';
        setError(String(msg));
        setSubmitting(false);
        return;
      }

      // Success
      Alert.alert('Success', 'Report submitted successfully! Help is on the way.', [
        {
          text: 'View Reports',
          onPress: () => router.push('/(tabs)/reports'),
        },
        {
          text: 'OK',
          onPress: () => router.push('/(tabs)'),
        },
      ]);

      setSubmitting(false);
    } catch (err) {
      setError('Failed to submit report. Please check your connection and try again.');
      setSubmitting(false);
      console.error(err);
    }
  };

  // Draggable chatbot position setup
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // capture current offset so movement is relative
        // accessing internal _value is acceptable here for a simple UX
        pan.setOffset({ x: (pan as any).x._value || 0, y: (pan as any).y._value || 0 });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        // When dragging ends, clamp position within visible bounds and animate into place
        pan.flattenOffset();
        const { width, height } = Dimensions.get('window');
        const BUTTON_SIZE = 56;
        const MARGIN = 12;
        // reasonable gutters to avoid header/footer overlap
        const TOP_GUTTER = 90;
        const BOTTOM_GUTTER = 90;

        const x = (pan as any).x._value || 0;
        const y = (pan as any).y._value || 0;

        const maxX = Math.max(MARGIN, width - BUTTON_SIZE - MARGIN);
        const maxY = Math.max(MARGIN, height - BUTTON_SIZE - MARGIN);

        const clampedX = Math.max(MARGIN, Math.min(x, maxX));
        const clampedY = Math.max(TOP_GUTTER, Math.min(y, maxY - BOTTOM_GUTTER));

        Animated.spring(pan, {
          toValue: { x: clampedX, y: clampedY },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: safeTop, paddingBottom: safeBottom }]} edges={["top","bottom"]}>
      <StatusBar style="light" backgroundColor="#000000" />
            {/* Floating Chatbot Button (draggable) */}
            <Animated.View
              style={[styles.floatingChatbotButton, { transform: pan.getTranslateTransform() }]}
              {...panResponder.panHandlers}
            >
              <TouchableOpacity onPress={() => router.push('/chatbot')} activeOpacity={0.8}>
                <MaterialCommunityIcons name="chat-outline" size={28} color="#fff" />
              </TouchableOpacity>
            </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Submit Disaster Report</Text>
          <Text style={styles.headerSubtitle}>Help is on the way</Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorBox}>
            <MaterialCommunityIcons name="alert-circle" size={16} color="#d32f2f" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Location Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#2e7d32" />
            <Text style={styles.sectionTitle}>Your Location</Text>
          </View>

          {/* Map Placeholder (opens map modal) */}
          <TouchableOpacity
            onPress={() => {
              // open modal and set initial marker to current location if available
              if (location) setMarkerPos({ latitude: location.latitude, longitude: location.longitude });
              setMapModalVisible(true);
            }}
            activeOpacity={0.9}
          >
            {MapBg ? (
              <ImageBackground source={MapBg} style={styles.mapContainer} imageStyle={{ borderRadius: 8 }}>
                <View style={styles.mapOverlay}>
                          <MaterialCommunityIcons name="map-marker" size={60} color="#2e7d32" />
                          <Text style={[styles.mapTitle, { color: '#000' }]}>Map View</Text>
                          <Text style={[styles.mapSubtitle, { color: '#000' }]}>
                            {loadingLocation ? 'Fetching location...' : 'Tap to select location'}
                          </Text>
                </View>
              </ImageBackground>
            ) : (
              <View style={styles.mapContainer}>
                <MaterialCommunityIcons name="map-marker" size={60} color="#0099ff" />
                <Text style={styles.mapTitle}>Map View</Text>
                <Text style={styles.mapSubtitle}>
                  {loadingLocation ? 'Fetching location...' : 'Tap to select location'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Map Picker Modal */}
          <Modal visible={mapModalVisible} animationType="slide">
            <View style={styles.modalContainer}>
              {/* Try to use react-native-maps if installed */}
              {(() => {
                try {
                  // dynamic require so app won't crash if lib not installed
                  // eslint-disable-next-line @typescript-eslint/no-var-requires
                  const MapView = require('react-native-maps').default;
                  const Marker = require('react-native-maps').Marker;
                  const initialRegion = {
                    latitude: markerPos?.latitude || location?.latitude || 0,
                    longitude: markerPos?.longitude || location?.longitude || 0,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  };

                  return (
                    <>
                      <MapView
                        style={styles.mapStyle}
                        initialRegion={initialRegion}
                        onPress={(e: any) => {
                          const coord = e.nativeEvent.coordinate;
                          setMarkerPos({ latitude: coord.latitude, longitude: coord.longitude });
                        }}
                        onMapReady={() => {
                          // if markerPos isn't set, try to center on current location
                          if (!markerPos && location) {
                            setMarkerPos({ latitude: location.latitude, longitude: location.longitude });
                          }
                        }}
                      >
                        {markerPos && (
                          // @ts-ignore - Marker type may differ
                          <Marker coordinate={{ latitude: markerPos.latitude, longitude: markerPos.longitude }} />
                        )}
                      </MapView>
                    </>
                  );
                } catch (err) {
                  // Fallback UI when maps library not available
                  return (
                    <View style={styles.mapFallback}>
                      <Text style={{ marginBottom: 12 }}>Map library not installed.</Text>
                      <Text style={{ marginBottom: 8 }}>Use detected coordinates or enter them manually.</Text>
                      <Text style={{ fontWeight: '700' }}>{location ? location.address : 'No coordinates'}</Text>
                    </View>
                  );
                }
              })()}

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[styles.submitButton, { flex: 1, marginRight: 8 }]}
                  onPress={() => {
                    // Confirm selection
                    if (markerPos) {
                      setLocation({ latitude: markerPos.latitude, longitude: markerPos.longitude, address: `${markerPos.latitude.toFixed(4)}, ${markerPos.longitude.toFixed(4)}` });
                    } else if (location) {
                      // keep existing
                    } else {
                      Alert.alert('No location selected', 'Please tap on the map to select your location or enable location services.');
                      return;
                    }
                    setMapModalVisible(false);
                  }}
                >
                  <Text style={styles.submitButtonText}>Confirm Location</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.trackingButton, { flex: 1, marginLeft: 8 }]}
                  onPress={() => setMapModalVisible(false)}
                >
                  <Text style={styles.trackingButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Location Display */}
          <View style={styles.locationDisplay}>
            <View style={styles.locationRow}>
              <MaterialCommunityIcons name="map-marker-outline" size={18} color="#2e7d32" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.locationText, { color: '#000' }]}>
                  {loadingLocation ? 'Fetching location...' : location?.address || 'No location'}
                </Text>
                {location && (
                  <Text style={styles.coordText}>Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}</Text>
                )}
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={fetchCurrentLocation} disabled={loadingLocation} style={styles.iconBtn}>
                <MaterialCommunityIcons name="refresh" size={18} color="#2e7d32" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setError('');
                  const coords = await fetchCurrentLocation();
                  if (coords) {
                    // set marker preview so user can confirm in map
                    setMarkerPos({ latitude: coords.latitude, longitude: coords.longitude });
                  }
                }}
                disabled={loadingLocation}
                style={styles.iconBtn}
              >
                <MaterialCommunityIcons name="crosshairs-gps" size={18} color="#2e7d32" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Describe the Situation</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Please describe the disaster situation and what type of help you need..."
            placeholderTextColor="#aaa"
            multiline
            numberOfLines={5}
            value={description}
            onChangeText={setDescription}
            editable={!submitting}
          />
        </View>

        {/* Help Type Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Type of Help Needed</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setHelpTypeMenuOpen(!helpTypeMenuOpen)}
            disabled={submitting}
          >
            <Text style={[styles.dropdownButtonText, !helpType && styles.placeholderText]}>
              {helpType || 'Select help type'}
            </Text>
            <MaterialCommunityIcons 
              name={helpTypeMenuOpen ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>

          {helpTypeMenuOpen && (
            <View style={styles.dropdownMenu}>
              {helpTypeOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    helpType === option.value && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setHelpType(option.value);
                    setHelpTypeMenuOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      helpType === option.value && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Priority Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority Level</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setPriorityMenuOpen(!priorityMenuOpen)}
            disabled={submitting}
          >
            <Text style={[styles.dropdownButtonText, !priority && styles.placeholderText]}>
              {priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Select priority'}
            </Text>
            <MaterialCommunityIcons 
              name={priorityMenuOpen ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>

          {priorityMenuOpen && (
            <View style={styles.dropdownMenu}>
              {priorityOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    priority === option.value && styles.dropdownItemSelected,
                  ]}
                  onPress={() => {
                    setPriority(option.value);
                    setPriorityMenuOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownItemText,
                      priority === option.value && styles.dropdownItemTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Media Upload Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Photos/Videos</Text>
          <TouchableOpacity
            style={styles.uploadBox}
            onPress={pickMedia}
            disabled={submitting}
          >
            <MaterialCommunityIcons name="cloud-upload-outline" size={32} color="#999" />
            <Text style={styles.uploadText}>Tap to upload images or videos</Text>
          </TouchableOpacity>

          {/* Media Preview */}
          {media.length > 0 && (
            <View style={styles.mediaPreview}>
              {media.map((uri, index) => (
                <View key={index} style={styles.mediaItem}>
                  <Image source={{ uri }} style={styles.mediaImage} />
                  <TouchableOpacity
                    style={styles.removeMediaBtn}
                    onPress={() => removeMedia(index)}
                  >
                    <MaterialCommunityIcons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Submit report to request help</Text>
          <Text style={styles.infoSubtitle}>You'll be able to track volunteer status after submission</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <MaterialCommunityIcons name="send" size={18} color="#fff" />
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </>
          )}
        </TouchableOpacity>

        {/* View Reports Button */}
        <TouchableOpacity
          style={styles.trackingButton}
          onPress={() => {
            if (!location) {
              setError('Please enable location or pick a location before previewing tracking.');
              return;
            }
            // pass current report coords to tracking page
            const lat = String(location.latitude);
            const lon = String(location.longitude);
            router.push(`/report-tracking?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}`);
          }}
          disabled={submitting}
        >
          <Text style={styles.trackingButtonText}>Preview Tracking Page</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 12,
  },
  header: {
    backgroundColor: '#0099ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: '#0099ff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 4,
  },
  errorText: {
    fontSize: 13,
    color: '#0066cc',
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginLeft: 8,
  },
  mapContainer: {
    height: 200,
    backgroundColor: '#b3e5fc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 8,
    width: '100%',
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0277bd',
    marginTop: 8,
  },
  mapSubtitle: {
    fontSize: 12,
    color: '#01579b',
    marginTop: 4,
  },
  locationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  uploadText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    fontWeight: '500',
  },
  mediaPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  mediaItem: {
    position: 'relative',
    width: '30%',
    aspectRatio: 1,
    borderRadius: 6,
    overflow: 'hidden',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  removeMediaBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#0099ff',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: '#fffde7',
    borderLeftWidth: 4,
    borderLeftColor: '#f57f17',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f57f17',
  },
  infoSubtitle: {
    fontSize: 12,
    color: '#f57f17',
    marginTop: 4,
    opacity: 0.8,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#0099ff',
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#66b3ff',
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  trackingButton: {
    backgroundColor: '#424242',
    marginHorizontal: 16,
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  placeholderText: {
    color: '#999',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    backgroundColor: '#fff',
    marginTop: -1,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemSelected: {
    backgroundColor: '#e3f2fd',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownItemTextSelected: {
    color: '#0099ff',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapStyle: {
    flex: 1,
  },
  mapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  coordText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  iconBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginLeft: 8,
  },
  floatingChatbotButton: {
    position: 'absolute' as any,
    bottom: 24,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0099ff',
    justifyContent: 'center' as any,
    alignItems: 'center' as any,
    zIndex: 100,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});