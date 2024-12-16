import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import AppNavigator from './app/navigations/AppNavigator';
import Header from './app/components/Header';
import { SafeAreaProvider } from 'react-native-safe-area-context';
const App = () => {
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.safeArea}>
      {/* Fixed Header */}
      <Header />

      {/* Screen Content */}
      <View style={styles.content}>
        <AppNavigator />
      </View>
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E4E75', // Matches the header background
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5', // Main screen background
  },
});

export default App;