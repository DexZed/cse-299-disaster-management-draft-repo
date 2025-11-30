import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { signOut } from '@/store/slices/authSlice';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(signOut());
    router.push('/welcome');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Info Section */}
        <View style={styles.section}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="account-circle" size={80} color="#0099ff" />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.email || 'User'}</Text>
              <Text style={styles.userRole}>{user?.role === 'victim' ? 'Victim' : 'Volunteer'}</Text>
            </View>
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <View style={styles.settingItem}>
            <MaterialCommunityIcons name="email" size={20} color="#0099ff" />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Email</Text>
              <Text style={styles.settingValue}>{user?.email || 'Not provided'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <MaterialCommunityIcons name="shield-account" size={20} color="#0099ff" />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Role</Text>
              <Text style={styles.settingValue}>{user?.role === 'victim' ? 'Disaster Victim' : 'Volunteer'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons name="lock-reset" size={20} color="#0099ff" />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Change Password</Text>
              <Text style={styles.settingValue}>Update your password</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#bdbdbd" />
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons name="bell" size={20} color="#0099ff" />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Notifications</Text>
              <Text style={styles.settingValue}>Manage notification settings</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#bdbdbd" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingItem}>
            <MaterialCommunityIcons name="map" size={20} color="#0099ff" />
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>Location</Text>
              <Text style={styles.settingValue}>Privacy & location settings</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#bdbdbd" />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={20} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
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
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#0099ff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    marginTop: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  settingValue: {
    fontSize: 12,
    color: '#888',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#e84c3d',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
});
