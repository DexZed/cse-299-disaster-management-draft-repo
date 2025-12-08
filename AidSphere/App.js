import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Platform } from 'react-native';
import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('react-native-app'),
});

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Welcome to the Expo app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})