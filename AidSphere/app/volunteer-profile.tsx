import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export default function VolunteerProfilePage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleCameraPress = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
      }
    } else {
      Alert.alert('Permission needed', 'Gallery permission is required to select photos');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <MaterialCommunityIcons name="account" size={80} color="#999" />
          )}
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={handleCameraPress}
          >
            <MaterialCommunityIcons name="camera" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.profileName}>Niloy Mahmud</Text>
      </View>
      {/* Personal Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Personal Information</Text>
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="email" size={22} color="#888" />
          <View style={styles.infoTextBox}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>niloy.mahmud@email.com</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <MaterialCommunityIcons name="pencil" size={18} color="#888" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="phone" size={22} color="#888" />
          <View style={styles.infoTextBox}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>+880 1234-567890</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <MaterialCommunityIcons name="pencil" size={18} color="#888" />
          </TouchableOpacity>
        </View>
        <View style={styles.infoCard}>
          <MaterialCommunityIcons name="map-marker" size={22} color="#888" />
          <View style={styles.infoTextBox}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>Dhaka, Bangladesh</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <MaterialCommunityIcons name="pencil" size={18} color="#888" />
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
  },
  scrollView: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#d32f2f',
    borderRadius: 20,
    padding: 6,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
    marginTop: 0,
  },
  profileMemberSince: {
    fontSize: 15,
    color: '#888',
    marginTop: 4,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: 90,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardBlue: {
    backgroundColor: '#e3f0ff',
  },
  statCardGreen: {
    backgroundColor: '#e8f5e9',
  },
  statCardYellow: {
    backgroundColor: '#fff8e1',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  infoSection: {
    paddingHorizontal: 18,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
  },
  infoTextBox: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  editButton: {
    padding: 6,
  },
});
