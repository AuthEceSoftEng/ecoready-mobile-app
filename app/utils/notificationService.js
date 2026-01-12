import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { formatDateTimeDM } from './dateFormatter';

// Configure how notifications are displayed
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NOTIFICATION_SETTINGS_KEY = 'user_notification_settings';
const NOTIFICATION_HISTORY_KEY = 'notification_history';

// Eco tips for daily notifications
const ECO_TIPS = [
  "🌱 Use reusable bags when shopping to reduce plastic waste!",
  "💧 Turn off the tap while brushing your teeth to save water.",
  "🚴 Try biking or walking for short trips instead of driving.",
  "♻️ Recycle paper, plastic, and glass to reduce landfill waste.",
  "🌿 Plant native species in your garden to support local wildlife.",
  "💡 Switch to LED bulbs - they use 75% less energy!",
  "🥗 Try Meatless Mondays to reduce your carbon footprint.",
  "🚿 Take shorter showers to conserve water and energy.",
  "📦 Buy products with minimal packaging when possible.",
  "🌳 Support local farmers markets for fresher, lower-carbon food.",
];

/**
 * Request notification permissions from the user
 */
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permissions denied');
      return false;
    }

    // For Android, create notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'EcoReady Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#94C83D',
      });
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

/**
 * Get user notification settings from AsyncStorage
 */
export const getNotificationSettings = async () => {
  try {
    const settings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (settings) {
      return JSON.parse(settings);
    }
    
    // Default settings
    return {
      enabled: true,
      dailyTips: true,
      quizReminders: true,
      achievements: true,
      preferredTime: '09:00', // Default to 9 AM
    };
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return null;
  }
};

/**
 * Save user notification settings to AsyncStorage
 */
export const saveNotificationSettings = async (settings) => {
  try {
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
    
    // Reschedule notifications based on new settings
    await scheduleAllNotifications();
    
    return true;
  } catch (error) {
    console.error('Error saving notification settings:', error);
    return false;
  }
};

/**
 * Schedule a daily eco-tip notification
 */
export const scheduleDailyTipNotification = async () => {
  try {
    const settings = await getNotificationSettings();
    
    if (!settings.enabled || !settings.dailyTips) {
      return;
    }

    // Cancel existing daily tip notifications
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.data?.type === 'daily-tip') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }

    // Parse preferred time (format: "HH:MM")
    const [hour, minute] = settings.preferredTime.split(':').map(Number);

    // Get current timezone offset
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() / 60; // Convert minutes to hours
    console.log(`Timezone offset: ${tzOffset} hours, Current time: ${now.toLocaleString()}`);

    // Get a random tip
    const randomTip = ECO_TIPS[Math.floor(Math.random() * ECO_TIPS.length)];

    // Schedule notification with correct trigger format
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌍 Daily Eco-Tip',
        body: randomTip,
        data: { type: 'daily-tip' },
        sound: true,
        badge: 1,
      },
      trigger: {
        type: 'daily',
        hour: hour,
        minute: minute,
      },
    });

    console.log(`✅ Daily tip notification scheduled for ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} (Timezone: UTC${tzOffset > 0 ? '+' : ''}${tzOffset})`);
  } catch (error) {
    console.error('Error scheduling daily tip:', error);
  }
};

/**
 * Schedule quiz reminder notification
 */
export const scheduleQuizReminder = async () => {
  try {
    const settings = await getNotificationSettings();
    
    if (!settings.enabled || !settings.quizReminders) {
      return;
    }

    // Cancel existing quiz reminders
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduled) {
      if (notification.content.data?.type === 'quiz-reminder') {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }

    // Check when user last took a quiz
    const quizHistory = await AsyncStorage.getItem('quiz_history');
    if (quizHistory) {
      const history = JSON.parse(quizHistory);
      const lastQuizDate = new Date(history[history.length - 1]?.date);
      const daysSinceLastQuiz = Math.floor((Date.now() - lastQuizDate.getTime()) / (1000 * 60 * 60 * 24));

      // Only schedule reminder if it's been 3+ days
      if (daysSinceLastQuiz >= 3) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: '🧠 Time for a Quiz!',
            body: "It's been a while - test your eco-knowledge and learn something new!",
            data: { type: 'quiz-reminder' },
            sound: true,
            badge: 1,
          },
          trigger: {
            type: 'time-interval',
            seconds: 60 * 60 * 24, // 24 hours from now
          },
        });
      }
    }
  } catch (error) {
    console.error('Error scheduling quiz reminder:', error);
  }
};

/**
 * Send achievement notification immediately
 */
export const sendAchievementNotification = async (achievementName, description) => {
  try {
    const settings = await getNotificationSettings();
    
    if (!settings.enabled || !settings.achievements) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🏆 Achievement Unlocked!',
        body: `${achievementName}: ${description}`,
        data: { type: 'achievement' },
        sound: true,
        badge: 1,
      },
      trigger: {
        type: 'time-interval',
        seconds: 2, // Show immediately
      },
    });

    // Log to history
    await logNotification({
      type: 'achievement',
      title: '🏆 Achievement Unlocked!',
      body: `${achievementName}: ${description}`,
    });
  } catch (error) {
    console.error('Error sending achievement notification:', error);
  }
};

/**
 * Add notification to history
 */
const logNotification = async (notification) => {
  try {
    const historyJson = await AsyncStorage.getItem(NOTIFICATION_HISTORY_KEY);
    const history = historyJson ? JSON.parse(historyJson) : [];
    
    // Add new notification to the beginning
    history.unshift({
      ...notification,
      timestamp: formatDateTimeDM(new Date()),
    });
    
    // Keep only last 50 notifications
    const trimmedHistory = history.slice(0, 50);
    
    await AsyncStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error logging notification:', error);
  }
};

/**
 * Add notification to history
 */
const addToNotificationHistory = async (notification) => {
  try {
    const historyJson = await AsyncStorage.getItem(NOTIFICATION_HISTORY_KEY);
    const history = historyJson ? JSON.parse(historyJson) : [];
    
    // Add new notification to the beginning
    history.unshift(notification);
    
    // Keep only last 50 notifications
    const trimmedHistory = history.slice(0, 50);
    
    await AsyncStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error adding to notification history:', error);
  }
};

/**
 * Get notification history
 */
export const getNotificationHistory = async () => {
  try {
    const historyJson = await AsyncStorage.getItem(NOTIFICATION_HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error getting notification history:', error);
    return [];
  }
};

/**
 * Clear notification history
 */
export const clearNotificationHistory = async () => {
  try {
    await AsyncStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify([]));
    return true;
  } catch (error) {
    console.error('Error clearing notification history:', error);
    return false;
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

/**
 * Schedule all notifications based on user settings
 */
export const scheduleAllNotifications = async () => {
  try {
    // Cancel all existing notifications first
    await cancelAllNotifications();

    const settings = await getNotificationSettings();
    
    if (!settings.enabled) {
      return;
    }

    // Schedule enabled notifications
    if (settings.dailyTips) {
      await scheduleDailyTipNotification();
    }
    
    if (settings.quizReminders) {
      await scheduleQuizReminder();
    }

    console.log('All notifications scheduled successfully');
  } catch (error) {
    console.error('Error scheduling all notifications:', error);
  }
};

/**
 * Get all scheduled notifications for debugging
 */
export const getScheduledNotifications = async () => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    console.log('📋 All Scheduled Notifications:');
    scheduled.forEach((notif, index) => {
      console.log(`  ${index + 1}. Type: ${notif.content.data?.type || 'unknown'}`);
      console.log(`     Trigger: ${JSON.stringify(notif.trigger)}`);
      console.log(`     Title: ${notif.content.title}`);
    });
    return scheduled;
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

/**
 * Initialize notification service (call on app startup)
 */
export const initializeNotifications = async () => {
  try {
    // Request permissions
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      console.log('Notifications not initialized - no permission');
      return;
    }

    // Schedule all notifications based on settings
    await scheduleAllNotifications();

    // Listen for received notifications to add to history
    Notifications.addNotificationReceivedListener((notification) => {
      const { title, body, data } = notification.request.content;
      addToNotificationHistory({
        type: data?.type || 'general',
        title: title || 'EcoReady',
        message: body || '',
        timestamp: formatDateTimeDM(new Date()),
      });
    });
  } catch (error) {
    console.error('Error initializing notifications:', error);
  }
};
