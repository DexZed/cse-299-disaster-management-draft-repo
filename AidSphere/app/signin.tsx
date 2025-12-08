
import React, { useState, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setEmail,
  setPassword,
  setFirstName,
  setLastName,
  setRole,
  setUser,
} from '../store/slices/authSlice';
import {
  setLoading,
  setError,
  togglePasswordVisibility,
  clearMessages,
} from '../store/slices/uiSlice';

// BACKEND URL
const API_BASE_URL = "https://cse-299-disaster-management-draft-r.vercel.app/api/v1"; 

export default function SignInScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const selector = useAppSelector((state) => state);
  // Redux state
  const { email, password, firstName, lastName, role, rememberMe } =
    useAppSelector((state) => state.auth);
  const { isLoading, error, showPassword } = useAppSelector((state) => state.ui);

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [showPwInfo, setShowPwInfo] = useState(false);

  // Validation
  const validateForm = (): boolean => {
    if (!role) {
      dispatch(setError('Please select a role'));
      return false;
    }
    if (!email.trim()) {
      dispatch(setError('Email is required'));
      return false;
    }
    if (!password.trim()) {
      dispatch(setError('Password is required'));
      return false;
    }
    return true;
  };

  // BACKEND CONNECTED SIGN-IN FUNCTIOn
   const handleSignIn = async () => {
    dispatch(clearMessages());

    if (!validateForm()) return;

    dispatch(setLoading(true));

    try {
      const payload = {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email.trim(),
        password: password.trim(),
        role: role,

      };
        console.log("Sign-in payload:", payload); // Debugging log
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();
      console.log("Sign-in response:", json); // Debugging log
      if (!response.ok) {
        dispatch(setError(json.message || "Invalid credentials"));
        dispatch(setLoading(false));
        return;
      }

      // SUCCESS → Save user
      dispatch(setUser(json.user));
      dispatch(setRole(json.user.role));
      dispatch(setLoading(false));
     
console.log(selector);      
      if (json.user.role === "victim") {
        router.push("emergency-report" as any);
      } else {
        router.push("(tabs)" as any);
      }

    } catch (error) {
      console.error("Sign-in error:", error);
      dispatch(setError("Network error. Please try again."));
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollContainer}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      >
        <View
          style={[
            styles.inner,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom },
          ]}
        >
          <Image
            source={require('../assets/images/app-logo-1.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Sign in</Text>
          <Text style={styles.subtitle}>Please select your role</Text>

          {/* Error */}
          {error && (
            <View style={styles.errorBox}>
              <MaterialCommunityIcons name="alert-circle" size={16} color="#ff3b30" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Role dropdown */}
          <View style={{ alignSelf: 'flex-start', width: 230, marginBottom: 16 }}>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setRoleMenuOpen((s) => !s)}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.dropdownButtonText,
                  !role && styles.placeholderText,
                ]}
              >
                {role ? role.toUpperCase() : 'Select role'}
              </Text>
              <MaterialCommunityIcons
                name={roleMenuOpen ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>

            {roleMenuOpen && (
              <View style={styles.dropdownMenu}>
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    dispatch(setRole('victim'));
                    dispatch(clearMessages());
                    setRoleMenuOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>Victim</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    dispatch(setRole('volunteer'));
                    dispatch(clearMessages());
                    setRoleMenuOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>Volunteer</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Username label */}
          <Text style={styles.signinLabel}>Username</Text>

          {/* First + Last Name */}
          <View style={styles.nameRow}>
            <View style={[styles.inputBox, { flex: 1, marginRight: 6 }]}>
              <MaterialCommunityIcons name="account-outline" size={18} color="#bdbdbd" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="First name"
                placeholderTextColor="#bdbdbd"
                value={firstName}
                onChangeText={(value) => dispatch(setFirstName(value))}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
            <View style={[styles.inputBox, { flex: 1, marginLeft: 6 }]}>
              <MaterialCommunityIcons name="account-outline" size={18} color="#bdbdbd" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Last name"
                placeholderTextColor="#bdbdbd"
                value={lastName}
                onChangeText={(value) => dispatch(setLastName(value))}
                autoCapitalize="words"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Email Label */}
          <Text style={styles.signinLabel}>Sign in to your account</Text>

          {/* Email Input */}
          <View style={styles.inputBox}>
            <MaterialCommunityIcons name="email-outline" size={18} color="#bdbdbd" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#bdbdbd"
              value={email}
              onChangeText={(value) => dispatch(setEmail(value))}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputBox}>
            <MaterialCommunityIcons name="lock-outline" size={18} color="#bdbdbd" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#bdbdbd"
              value={password}
              onChangeText={(value) => {
                dispatch(setPassword(value));
                if (value && value.length >= 8) setShowPwInfo(false);
              }}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={() => dispatch(togglePasswordVisibility())}
              style={{ marginLeft: 6, marginRight: 6 }}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye' : 'eye-off'}
                size={18}
                color="#bdbdbd"
              />
            </TouchableOpacity>

            {/* Info icon */}
            {(() => {
              const pwTooShort = !!password && password.length < 8;
              return (
                <TouchableOpacity
                  onPress={() => pwTooShort && setShowPwInfo((s) => !s)}
                  accessibilityLabel="Password information"
                >
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={18}
                    color={pwTooShort ? '#ff3b30' : '#bdbdbd'}
                  />
                </TouchableOpacity>
              );
            })()}
          </View>

          {/* Password Info */}
          {password && password.length < 8 && showPwInfo && (
            <View style={styles.passwordInfoBox}>
              <Text style={styles.passwordInfoText}>
                Your password is too small. It must be 8 characters long or more.
              </Text>
            </View>
          )}

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signinButton, isLoading && styles.signinButtonDisabled]}
            onPress={handleSignIn}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.signinButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Demo buttons */}
          <View style={{ marginTop: 12, alignItems: 'center' }}>
            <TouchableOpacity
              style={[styles.signinButton, { backgroundColor: '#d84c3d', width: 260 }]}
              onPress={() => {
                const demoUser = { id: 'demo-victim', email: 'victim@demo.local', role: 'victim' as const };
                dispatch(setUser(demoUser));
                dispatch(setRole('victim'));
                router.push('emergency-report' as any);
              }}
              disabled={isLoading}
            >
              <Text style={styles.signinButtonText}>Continue as Demo Victim</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.signinButton, { backgroundColor: '#2e7d32', width: 260, marginTop: 8 }]}
              onPress={() => {
                const demoUser = { id: 'demo-vol', email: 'volunteer@demo.local', role: 'volunteer' as const };
                dispatch(setUser(demoUser));
                dispatch(setRole('volunteer'));
                router.push('volunteer-dashboard' as any);
              }}
              disabled={isLoading}
            >
              <Text style={styles.signinButtonText}>Continue as Demo Volunteer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { flex: 1, width: '100%' },
  scrollContent: { flexGrow: 1, width: '100%', paddingBottom: 40 },
  inner: { alignItems: 'center', paddingHorizontal: 24, width: '100%' },
  logo: { width: 80, height: 80, marginBottom: 10, marginTop: 70 },
  title: { fontSize: 26, fontWeight: '700', color: '#222', marginBottom: 10 },
  subtitle: { fontSize: 15, color: '#888', marginBottom: 10, alignSelf: 'flex-start' },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    width: '100%',
    maxWidth: 360,
  },
  errorText: {
    fontSize: 13,
    color: '#ff3b30',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
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
  dropdownButtonText: { fontSize: 14, color: '#333', fontWeight: '500' },
  placeholderText: { color: '#999' },
  dropdownMenu: { borderWidth: 1, borderColor: '#ddd', borderTopWidth: 0 },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dropdownItemText: { fontSize: 14, color: '#333' },

  signinLabel: { fontSize: 14, color: '#888', marginBottom: 8, alignSelf: 'flex-start' },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginBottom: 10,
    width: '100%',
    maxWidth: 360,
    height: 40,
    paddingHorizontal: 10,
  },
  input: { flex: 1, fontSize: 14, color: '#222' },

  nameRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', maxWidth: 360 },

  inputIcon: { width: 18, height: 18, marginRight: 8 },

  signinButton: {
    width: 220,
    height: 44,
    backgroundColor: '#28a8ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  signinButtonDisabled: { backgroundColor: '#99d9ff', opacity: 0.7 },
  signinButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  passwordInfoBox: {
    backgroundColor: '#fff7f7',
    borderWidth: 1,
    borderColor: '#ff3b30',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  passwordInfoText: { color: '#ff3b30', fontSize: 13, fontWeight: '600' },
});
