import React from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '@/store/hooks';
import { signOut } from '@/store/slices/authSlice';

export default function CustomDrawerContent(props: any) {
  const navigation = props.navigation;
  const router = useRouter();
  const dispatch = useAppDispatch();
  // Dummy user data for sidebar
  const user = {
    name: 'John Doe',
    email: 'john.doe@email.com',
  };
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1, paddingTop: 0}}>
      <View style={styles.header}>
        <Text style={styles.title}>Disaster Relief</Text>
        <Text style={styles.subtitle}>Help is here</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.closeDrawer()}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={36} color="#888" />
        </View>
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>
      <View style={styles.menuSection}>
        <DrawerItem
          label="Track Volunteer"
          labelStyle={styles.menuItemActiveLabel}
          style={styles.menuItemActive}
          icon={({color, size}) => (
            <MaterialIcons name="my-location" size={22} color="#e53935" />
          )}
          onPress={() => {
            navigation.closeDrawer();
            router.push('/(tabs)');
          }}
        />
        <DrawerItem
          label="My Reports"
          labelStyle={styles.menuItemLabel}
          icon={({color, size}) => (
            <MaterialIcons name="description" size={22} color="#444" />
          )}
          onPress={() => {
            navigation.closeDrawer();
            router.push('/(tabs)/reports');
          }}
        />
        <DrawerItem
          label="Profile"
          labelStyle={styles.menuItemLabel}
          icon={({color, size}) => (
            <Ionicons name="person-outline" size={22} color="#444" />
          )}
          onPress={() => {
            navigation.closeDrawer();
            router.push('/(tabs)/profile');
          }}
        />
      </View>
      <View style={styles.logoutSection}>
        <DrawerItem
          label="Logout"
          labelStyle={styles.logoutLabel}
          icon={({color, size}) => (
            <MaterialIcons name="logout" size={22} color="#444" />
          )}
          onPress={() => {
            navigation.closeDrawer();
            dispatch(signOut());
            router.push('/welcome');
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#e53935',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    position: 'relative',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 40,
    padding: 4,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  profileEmail: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  menuSection: {
    marginTop: 16,
    flex: 1,
  },
  menuItemActive: {
    backgroundColor: '#fff5f5',
    borderRadius: 14,
    marginHorizontal: 12,
    marginBottom: 2,
  },
  menuItemActiveLabel: {
    color: '#e53935',
    fontWeight: 'bold',
    fontSize: 16,
  },
  menuItemLabel: {
    color: '#222',
    fontSize: 16,
  },
  logoutSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  logoutLabel: {
    color: '#222',
    fontSize: 16,
  },
});
