import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAppSelector } from '../store/hooks';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

// Backend URL
const API_URL = "https://cse-299-disaster-management-draft-repo.onrender.com/api/v1/users";

export default function VictimProfilePage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const insets = useSafeAreaInsets();

  const [editingField, setEditingField] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  

  const [editValues, setEditValues] = useState({
    email: "",
    phone: "",
    address: "",
  });

  const userName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.email || "Unknown User";

  // FETCH USER DATA FROM BACKEND
  const fetchUser = async () => {
    try {
      const userId = user?.id;
      if (!userId) {
        Alert.alert("Error", "User ID not found");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();

      if (response.ok) {
        setEditValues({
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } else {
        Alert.alert("Error", data.message || "Failed to load profile.");
      }
    } catch (error) {
      console.log("Fetch error:", error);
      Alert.alert("Error", "Unable to fetch user profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchUser();
  }, [user]);

  // 📸 PICK PROFILE IMAGE (UI ONLY)
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        Alert.alert("Success", "Profile picture updated ✔");
      }
    } catch (error) {
      Alert.alert("Error", "Image selection failed");
    }
  };

  // 🟩 2. UPDATE FIELD TO BACKEND
  const handleEditSave = async () => {
    try {
      const userId = user?.id;
      if (!userId) {
        Alert.alert("Error", "User ID not found");
        return;
      }

      const field = editingField as keyof typeof editValues;

      const response = await fetch(`${API_URL}/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [field]: editValues[field],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Profile updated successfully!");
        setEditingField(null);
      } else {
        Alert.alert("Error", data.message || "Update failed.");
      }
    } catch (error) {
      console.log("Update error:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#000" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              {profileImage ? (
                <Text style={styles.avatarImage}>📷</Text>
              ) : (
                <MaterialCommunityIcons name="account" size={64} color="#999" />
              )}
            </View>

            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={handlePickImage}
            >
              <MaterialCommunityIcons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{userName}</Text>
        </View>

        {/* Personal Info */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {/* Email */}
          <InfoItem
            label="Email"
            value={editValues.email}
            icon="email"
            onEdit={() => setEditingField("email")}
          />

          {/* Phone */}
          <InfoItem
            label="Phone"
            value={editValues.phone}
            icon="phone"
            onEdit={() => setEditingField("phone")}
          />

          {/* Address */}
          <InfoItem
            label="Address"
            value={editValues.address}
            icon="map-marker"
            onEdit={() => setEditingField("address")}
          />
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={!!editingField}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingField(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Edit {editingField}
            </Text>

            <TextInput
              style={styles.modalInput}
              value={editValues[editingField as keyof typeof editValues]}
              onChangeText={(text) => {
                setEditValues({
                  ...editValues,
                  [editingField as keyof typeof editValues]: text,
                });
              }}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditingField(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleEditSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// COMPONENT: For cleaner code
function InfoItem({ label, value, icon, onEdit }: any) {
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoLeft}>
        <MaterialCommunityIcons name={icon} size={24} color="#666" />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoLabel}>{label}</Text>
          <Text style={styles.infoValue}>{value}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <MaterialCommunityIcons name="pencil" size={22} color="#666" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: { flex: 1, backgroundColor: "#f5f5f5" },

  header: {
    backgroundColor: "#d22424",
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    height: 110,
  },

  backButton: {
    position: "absolute",
    left: 16,
    top: 47,
    padding: 5,
    zIndex: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },

  scrollContent: { paddingBottom: 20 },

  profileSection: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
    marginBottom: 12,
  },

  avatarContainer: { position: "relative", marginBottom: 16 },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarImage: { fontSize: 60 },

  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: "#d32f2f",
    justifyContent: "center",
    alignItems: "center",
  },

  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
  },

  infoSection: { backgroundColor: "#fff", padding: 16 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
  },

  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  infoLeft: { flexDirection: "row", alignItems: "center" },

  infoTextContainer: { marginLeft: 12 },

  infoLabel: { fontSize: 12, color: "#777" },

  infoValue: { fontSize: 14, fontWeight: "600" },

  editButton: { padding: 8 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },

  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 14 },

  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  modalButtons: { flexDirection: "row", gap: 10 },

  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  cancelButtonText: { color: "#555" },

  saveButton: {
    flex: 1,
    backgroundColor: "#d32f2f",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  saveButtonText: { color: "#fff", fontWeight: "700" },
});
