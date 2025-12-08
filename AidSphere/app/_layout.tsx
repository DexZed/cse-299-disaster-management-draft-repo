import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { store } from '@/store/store';

export const unstable_settings = {
  initialRouteName: 'welcome',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="signin" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="emergency-report" options={{ headerShown: false }} />
          <Stack.Screen name="report-tracking" options={{ headerShown: false }} />
          <Stack.Screen name="chatbot" options={{ headerShown: false }} />
          <Stack.Screen name="volunteer-dashboard" options={{ headerShown: false }} />
          <Stack.Screen name="victim-profile" options={{ headerShown: false }} />
          <Stack.Screen name="active-assignments" options={{ headerShown: false }} />
          <Stack.Screen name="active-assignment-map" options={{ headerShown: false }} />
          <Stack.Screen name="completed-tasks" options={{ headerShown: false }} />
          <Stack.Screen name="total-incidents" options={{ headerShown: false }} />
          <Stack.Screen name="victim-reports" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
