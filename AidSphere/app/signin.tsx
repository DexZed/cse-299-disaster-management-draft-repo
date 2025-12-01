
import React, { useState, useLayoutEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { apiFetch } from '../constants/backend';
import {
  setEmail,
  setPassword,
  setRole,
  setRememberMe,
  setUser,
} from '../store/slices/authSlice';
import {
  setLoading,
  setError,
  togglePasswordVisibility,
  clearMessages,
} from '../store/slices/uiSlice';

export default function SignInScreen() {
  /**
   * SignInScreen
   * ----------------
   * Handles user sign-in and role selection. This screen uses Redux
   * `auth` state and dispatches `setUser` / `setRole` when demo users are
   * selected. When integrating with a backend, the `handleSignIn` method
   * calls `/api/auth/signin` — update that endpoint and add auth token
   * handling here when your API requires it.
   */
  const router = useRouter();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Redux state
  const { email, password, role, rememberMe } = useAppSelector((state) => state.auth);
  const { isLoading, error, showPassword } = useAppSelector((state) => state.ui);

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [showPwInfo, setShowPwInfo] = useState(false);

  // Validation function
  const validateForm = (): boolean => {
    // For testing: allow empty fields, just require role selection
    if (!role) {
      dispatch(setError('Please select a role'));
      return false;
    }
    return true;
  };

  // Handle sign in
  const handleSignIn = async () => {
    dispatch(clearMessages());

    if (!validateForm()) {
      return;
    }

    dispatch(setLoading(true));

    try {
      // Real API call using apiFetch helper.
      // This will use the configured BACKEND_URL from app.json
      const resp = await apiFetch('/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          role,
        }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        // backend may send { message } or { error }
        const msg = data?.message || data?.error || 'Sign in failed';
        dispatch(setError(String(msg)));
        dispatch(setLoading(false));
        return;
      }

      // Expecting server to return user object in data.user (or data)
      const userData = data.user || data;
      if (!userData) {
        dispatch(setError('Invalid server response'));
        dispatch(setLoading(false));
        return;
      }

      dispatch(setUser(userData));
      dispatch(setLoading(false));

      // Route based on user role
      if (userData.role === 'victim') {
        // Victims go to emergency report page
        router.push('/emergency-report');
      } else {
        // Volunteers go to dashboard
        router.push('/(tabs)');
      }
    } catch (err) {
      dispatch(setError('Sign in failed. Please check your connection and try again.'));
      dispatch(setLoading(false));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      edges={["top", "bottom"]}>
      <View style={[styles.inner, { paddingTop: 16 /* keep original spacing */ }] }>
        <Image source={require('../assets/images/app-logo-1.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>Sign in</Text>
        <Text style={styles.subtitle}>Please select your role</Text>

        {/* Error Message */}
        {error && (
          <View style={styles.errorBox}>
            <MaterialCommunityIcons name="alert-circle" size={16} color="#ff3b30" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Role Selection (dropdown) */}
        <View style={{ alignSelf: 'flex-start', width: 230, marginBottom: 16 }}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setRoleMenuOpen((s) => !s)}
            disabled={isLoading}
          >
            <Text style={[styles.dropdownButtonText, !role && styles.placeholderText]}>{role ? role.toUpperCase() : 'Select role'}</Text>
            <MaterialCommunityIcons name={roleMenuOpen ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
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

        <Text style={styles.signinLabel}>Sign in to your account via email</Text>

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
              // hide the info box when user updates password to valid length
              if (value && value.length >= 8) setShowPwInfo(false);
            }}
            secureTextEntry={!showPassword}
            editable={!isLoading}
          />
          <TouchableOpacity onPress={() => dispatch(togglePasswordVisibility())} style={{ marginLeft: 6, marginRight: 6 }}>
            <MaterialCommunityIcons
              name={showPassword ? 'eye' : 'eye-off'}
              size={18}
              color="#bdbdbd"
            />
          </TouchableOpacity>

          {/* Info icon - shows message when password is too short */}
          {/** Determine if password is present and too short **/}
          {
            (() => {
              const pwTooShort = !!password && password.length < 8;
              return (
                <TouchableOpacity
                  onPress={() => pwTooShort && setShowPwInfo((s) => !s)}
                  accessibilityLabel="Password information"
                  accessibilityHint={pwTooShort ? 'Shows password length requirements' : 'Password requirements met'}
                >
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={18}
                    color={pwTooShort ? '#ff3b30' : '#bdbdbd'}
                  />
                </TouchableOpacity>
              );
            })()
          }
        </View>

        {/* Password info message shown when icon is tapped and password is too short */}
        {password && password.length < 8 && showPwInfo && (
          <View style={styles.passwordInfoBox}>
            <Text style={styles.passwordInfoText}>Your password is too small. It must be 8 characters long or more.</Text>
          </View>
        )}

        {/* Remember me / Forgot password removed per request */}

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

        {/* Demo quick sign-ins for local testing (no backend) */}
        <View style={{ marginTop: 12, alignItems: 'center' }}>
          <TouchableOpacity
            style={[styles.signinButton, { backgroundColor: '#d84c3d', width: 260 }]}
            onPress={() => {
              // Demo victim user
              const demoUser = { id: 'demo-victim', email: 'victim@demo.local', role: 'victim' } as any;
              dispatch(setUser(demoUser));
              dispatch(setRole('victim'));
              router.push('/emergency-report');
            }}
            disabled={isLoading}
          >
            <Text style={styles.signinButtonText}>Continue as Demo Victim</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.signinButton, { backgroundColor: '#2e7d32', width: 260, marginTop: 8 }]}
            onPress={() => {
              // Demo volunteer user
              const demoUser = { id: 'demo-vol', email: 'volunteer@demo.local', role: 'volunteer' } as any;
              dispatch(setUser(demoUser));
              dispatch(setRole('volunteer'));
              // Navigate directly to the standalone volunteer dashboard page
              router.push('/volunteer-dashboard');
            }}
            disabled={isLoading}
          >
            <Text style={styles.signinButtonText}>Continue as Demo Volunteer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    marginBottom: 10,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
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
    alignSelf: 'flex-start',
  },
  errorText: {
    fontSize: 13,
    color: '#ff3b30',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginBottom: 16,
    gap: 12,
    width: 230,
  },
  roleBox: {
    width: 110,
    height: 80,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 2,
  },
  roleBoxSelected: {
    borderColor: '#0099ff',
    backgroundColor: '#e6f4fe',
  },
  roleIcon: {
    width: 32,
    height: 32,
    marginBottom: 4,
    tintColor: '#bdbdbd',
  },
  roleText: {
    fontSize: 13,
    color: '#bdbdbd',
    fontWeight: '600',
  },
  roleTextSelected: {
    color: '#0099ff',
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
    width: '100%',
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
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
  },
  signinLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
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
    alignSelf: 'flex-start',
  },
  inputIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: '#bdbdbd',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#222',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberMe: {
    fontSize: 13,
    color: '#222',
    fontWeight: '700',
  },
  forgot: {
    fontSize: 13,
    color: '#222',
    fontWeight: '700',
  },
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
  signinButtonDisabled: {
    backgroundColor: '#99d9ff',
    opacity: 0.7,
  },
  signinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  signupText: {
    fontSize: 13,
    color: '#222',
  },
  signupLink: {
    fontSize: 13,
    color: '#0099ff',
    fontWeight: '700',
  },
  checkbox: {
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordInfoBox: {
    alignSelf: 'flex-start',
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fff7f7',
    borderWidth: 1,
    borderColor: '#ff3b30',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  passwordInfoText: {
    color: '#ff3b30',
    fontSize: 13,
    fontWeight: '600',
  },
});
