import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { formatDateTimeDM } from '../utils/dateFormatter';
import {
  getNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermissions,
  getNotificationHistory,
  clearNotificationHistory,
} from '../utils/notificationService';

const SettingsScreen = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadSettings();
    loadNotificationHistory();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    const userSettings = await getNotificationSettings();
    setSettings(userSettings);
    setLoading(false);
  };

  const loadNotificationHistory = async () => {
    const history = await getNotificationHistory();
    setNotificationHistory(history);
  };

  const handleSettingChange = async (key, value) => {
    // If enabling notifications, request permissions first
    if (key === 'enabled' && value === true) {
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        Alert.alert(
          'Permission Required',
          'Please enable notifications in your device settings to receive EcoReady reminders.',
          [{ text: 'OK' }]
        );
        return;
      }
    }

    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    setSaving(true);
    await saveNotificationSettings(newSettings);
    setSaving(false);
  };

  const handleTimeChange = (time) => {
    handleSettingChange('preferredTime', time);
  };

  const handleClearHistory = async () => {
    Alert.alert(
      'Clear Notification History',
      'Are you sure you want to clear all notification history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearNotificationHistory();
            setNotificationHistory([]);
            Alert.alert('Success', 'Notification history cleared');
          },
        },
      ]
    );
  };

  const formatTimestamp = (timestamp) => {
    return formatDateTimeDM(timestamp);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#94C83D" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialIcons name="settings" size={32} color="#1E4E75" />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Notification Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        {/* Master Toggle */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Enable Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive reminders and updates
            </Text>
          </View>
          <Switch
            value={settings.enabled}
            onValueChange={(value) => handleSettingChange('enabled', value)}
            trackColor={{ false: '#ccc', true: '#94C83D' }}
            thumbColor="#fff"
          />
        </View>

        {settings.enabled && (
          <>
            {/* Daily Tips */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Daily Eco-Tips</Text>
                <Text style={styles.settingDescription}>
                  Get a sustainable living tip every day
                </Text>
              </View>
              <Switch
                value={settings.dailyTips}
                onValueChange={(value) => handleSettingChange('dailyTips', value)}
                trackColor={{ false: '#ccc', true: '#94C83D' }}
                thumbColor="#fff"
              />
            </View>

            {/* Quiz Reminders */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Quiz Reminders</Text>
                <Text style={styles.settingDescription}>
                  Reminder to take a quiz if inactive for 3 days
                </Text>
              </View>
              <Switch
                value={settings.quizReminders}
                onValueChange={(value) => handleSettingChange('quizReminders', value)}
                trackColor={{ false: '#ccc', true: '#94C83D' }}
                thumbColor="#fff"
              />
            </View>

            {/* Achievements */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Achievement Alerts</Text>
                <Text style={styles.settingDescription}>
                  Get notified when you unlock achievements
                </Text>
              </View>
              <Switch
                value={settings.achievements}
                onValueChange={(value) => handleSettingChange('achievements', value)}
                trackColor={{ false: '#ccc', true: '#94C83D' }}
                thumbColor="#fff"
              />
            </View>

            {/* Preferred Time */}
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Preferred Time</Text>
                <Text style={styles.settingDescription}>
                  When to receive daily notifications
                </Text>
              </View>
            </View>

            <View style={styles.timeButtons}>
              <TouchableOpacity
                style={[
                  styles.timeButton,
                  settings.preferredTime === '08:00' && styles.timeButtonActive,
                ]}
                onPress={() => handleTimeChange('08:00')}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    settings.preferredTime === '08:00' && styles.timeButtonTextActive,
                  ]}
                >
                  Morning
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.timeButton,
                  settings.preferredTime === '14:00' && styles.timeButtonActive,
                ]}
                onPress={() => handleTimeChange('14:00')}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    settings.preferredTime === '14:00' && styles.timeButtonTextActive,
                  ]}
                >
                  Afternoon
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.timeButton,
                  settings.preferredTime === '19:00' && styles.timeButtonActive,
                ]}
                onPress={() => handleTimeChange('19:00')}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    settings.preferredTime === '19:00' && styles.timeButtonTextActive,
                  ]}
                >
                  Evening
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Notification History Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Notification History</Text>
          <TouchableOpacity
            style={styles.showHistoryButton}
            onPress={() => setShowHistory(!showHistory)}
          >
            <Text style={styles.showHistoryText}>
              {showHistory ? 'Hide' : 'Show'} ({notificationHistory.length})
            </Text>
            <MaterialIcons
              name={showHistory ? 'expand-less' : 'expand-more'}
              size={20}
              color="#1E4E75"
            />
          </TouchableOpacity>
        </View>

        {showHistory && (
          <>
            {notificationHistory.length === 0 ? (
              <View style={styles.emptyHistory}>
                <MaterialIcons name="notifications-off" size={48} color="#ccc" />
                <Text style={styles.emptyHistoryText}>No notifications yet</Text>
              </View>
            ) : (
              <>
                {notificationHistory.slice(0, 10).map((notification, index) => (
                  <View key={index} style={styles.historyItem}>
                    <View style={styles.historyIcon}>
                      <MaterialIcons
                        name={
                          notification.type === 'achievement'
                            ? 'emoji-events'
                            : notification.type === 'quiz-reminder'
                            ? 'quiz'
                            : 'eco'
                        }
                        size={24}
                        color="#94C83D"
                      />
                    </View>
                    <View style={styles.historyContent}>
                      <Text style={styles.historyTitle}>{notification.title}</Text>
                      <Text style={styles.historyMessage}>{notification.message}</Text>
                      <Text style={styles.historyTime}>
                        {formatTimestamp(notification.timestamp)}
                      </Text>
                    </View>
                  </View>
                ))}

                <TouchableOpacity
                  style={styles.clearHistoryButton}
                  onPress={handleClearHistory}
                >
                  <MaterialIcons name="delete-outline" size={20} color="#d32f2f" />
                  <Text style={styles.clearHistoryText}>Clear History</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </View>

      {/* Saving Indicator */}
      {saving && (
        <View style={styles.savingIndicator}>
          <ActivityIndicator size="small" color="#94C83D" />
          <Text style={styles.savingText}>Saving...</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E4E75',
    marginLeft: 10,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E4E75',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
  },
  timeButtons: {
    marginTop: 10,
  },
  timeButton: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 10,
    alignItems: 'center',
  },
  timeButtonActive: {
    borderColor: '#94C83D',
    backgroundColor: '#f0f8e8',
  },
  timeButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  timeButtonTextActive: {
    color: '#1E4E75',
    fontWeight: 'bold',
  },
  showHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showHistoryText: {
    fontSize: 14,
    color: '#1E4E75',
    marginRight: 5,
  },
  emptyHistory: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyHistoryText: {
    marginTop: 10,
    fontSize: 14,
    color: '#999',
  },
  historyItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  historyIcon: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 2,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  historyMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 12,
    color: '#999',
  },
  clearHistoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ffebee',
  },
  clearHistoryText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#d32f2f',
    fontWeight: '600',
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  savingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#94C83D',
  },
});

export default SettingsScreen;
