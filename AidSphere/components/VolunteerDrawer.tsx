import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppSelector } from '../store/hooks';

interface VolunteerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VolunteerDrawer({ isOpen, onClose }: VolunteerDrawerProps) {
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
          {/* Profile */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation('/volunteer-profile')}
          >
            <MaterialCommunityIcons name="account-circle" size={22} color="#333" />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons name="logout" size={22} color="#333" />
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
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8e8e8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  userEmail: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginVertical: 4,
    borderRadius: 8,
  },
  menuText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 8,
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  logoutText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    fontWeight: '500',
  },
});
