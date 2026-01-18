import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './app/navigations/AppNavigator';
import Header from './app/components/Header';
import { initializeNotifications } from './app/utils/notificationService';
import { formatDateTimeDM } from './app/utils/dateFormatter';

// Configure how notifications are displayed
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const App = () => {
  useEffect(() => {
    // Initialize notification system on app startup
    initializeNotifications();
    
    // Add listener for when notifications are received
    const notificationListener = Notifications.addNotificationReceivedListener(async (notification) => {
      // Log to history
      try {
        const historyJson = await AsyncStorage.getItem('notification_history');
        const history = historyJson ? JSON.parse(historyJson) : [];
        
        history.unshift({
          type: notification.request.content.data?.type || 'unknown',
          title: notification.request.content.title,
          body: notification.request.content.body,
          timestamp: formatDateTimeDM(new Date()),
        });
        
        const trimmedHistory = history.slice(0, 50);
        await AsyncStorage.setItem('notification_history', JSON.stringify(trimmedHistory));
      } catch (error) {
        console.error('Error logging notification:', error);
      }
    });
    
    return () => {
      notificationListener.remove();
    };
  }, []);

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