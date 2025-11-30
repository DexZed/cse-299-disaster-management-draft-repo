import React, { useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

// Signup removed — redirecting to signin
export default function SignUpScreen() {
  const router = useRouter();
  useEffect(() => {
    // send users back to signin
    router.replace('/signin');
  }, [router]);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View>
        <Text>Sign up has been disabled. Redirecting to Sign in...</Text>
      </View>
    </SafeAreaView>
  );
}