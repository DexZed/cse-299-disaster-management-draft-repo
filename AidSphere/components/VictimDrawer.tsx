import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../store/hooks';

interface VictimDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VictimDrawer({ isOpen, onClose }: VictimDrawerProps) {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  if (!isOpen) return null;

  const handleNavigation = (route: string) => {
    onClose();
    router.push(route as any);
  };

  const handleLogout = () => {
    onClose();
    router.push('/welcome' as any);
  };

  return (
    <>
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />
      
      {/* Drawer */}
      <SafeAreaView style={styles.drawer} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Disaster Relief</Text>
          <Text style={styles.headerSubtitle}>Help is here</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.userAvatar}>
            <MaterialCommunityIcons name="account" size={32} color="#999" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@email.com'}</Text>
          </View>
        </View>

        {/* Menu Items */}
        <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
          {/* Track Volunteer */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('/report-tracking')}
          >
            <MaterialCommunityIcons name="map-marker" size={22} color="#333" />
            <Text style={styles.menuText}>Track Volunteer</Text>
          </TouchableOpacity>

          {/* My Reports */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('/victim-reports')}
          >
            <MaterialCommunityIcons name="clipboard-text" size={22} color="#333" />
            <Text style={styles.menuText}>My Reports</Text>
          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('/victim-profile')}
          >
            <MaterialCommunityIcons name="account-circle" size={22} color="#333" />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Logout */}
        <View style={styles.footerSpacer} />
        <TouchableOpacity
          style={styles.logoutItem}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={22} color="#666" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 99,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '80%',
    maxWidth: 300,
    backgroundColor: '#fff',
    zIndex: 100,
    flexDirection: 'column',
  },
  header: {
    backgroundColor: '#d32f2f',
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingTop: 32,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 12,
    padding: 8,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  menuContainer: {
    flex: 1,
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  menuText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 16,
    fontWeight: '500',
  },
  footerSpacer: {
    flex: 1,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logoutText: {
    fontSize: 15,
    color: '#666',
    marginLeft: 16,
    fontWeight: '500',
  },
});
