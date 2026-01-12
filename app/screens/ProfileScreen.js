import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { calculateStats, getAllAchievements, getAchievementProgress } from '../utils/progressStorage';
import ProgressChart from '../components/ProgressChart';
import AchievementBadge from '../components/AchievementBadge';
import FeedbackModal from '../components/FeedbackModal';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [achievementProgress, setAchievementProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [userStats, allAchievements, progress] = await Promise.all([
        calculateStats(),
        getAllAchievements(),
        getAchievementProgress(),
      ]);
      
      setStats(userStats);
      setAchievements(allAchievements);
      setAchievementProgress(progress);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#94C83D" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  const displayedLockedAchievements = showAllAchievements 
    ? lockedAchievements 
    : achievementProgress.slice(0, 3);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#94C83D']} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialIcons name="account-circle" size={60} color="#1E4E75" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>My Learning Journey</Text>
            <Text style={styles.headerSubtitle}>Track your eco-knowledge progress</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <MaterialIcons name="settings" size={28} color="#1E4E75" />
        </TouchableOpacity>
      </View>

      {stats && stats.totalQuizzes === 0 ? (
        /* No data yet - Welcome message */
        <View style={styles.emptyState}>
          <MaterialIcons name="school" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>Start Your Journey!</Text>
          <Text style={styles.emptyText}>
            Take your first quiz to begin tracking your learning progress and unlock achievements!
          </Text>
          <TouchableOpacity style={styles.emptyButton}>
            <Text style={styles.emptyButtonText}>Take a Quiz</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <MaterialIcons name="quiz" size={32} color="#2196F3" />
              <Text style={styles.statNumber}>{stats.totalQuizzes}</Text>
              <Text style={styles.statLabel}>Quizzes Taken</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialIcons name="star" size={32} color="#FFC107" />
              <Text style={styles.statNumber}>{stats.averageScore.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialIcons name="emoji-events" size={32} color="#4CAF50" />
              <Text style={styles.statNumber}>{stats.bestScore}/10</Text>
              <Text style={styles.statLabel}>Best Score</Text>
            </View>

            <View style={styles.statCard}>
              <MaterialIcons name="local-fire-department" size={32} color="#FF5722" />
              <Text style={styles.statNumber}>{stats.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>

          {/* Progress Chart */}
          {stats.quizHistory && stats.quizHistory.length > 0 && (
            <View style={styles.section}>
              <ProgressChart quizHistory={stats.quizHistory} />
            </View>
          )}

          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="emoji-events" size={24} color="#FFC107" />
                <Text style={styles.sectionTitle}>
                  Achievements ({unlockedAchievements.length}/{achievements.length})
                </Text>
              </View>
              <View style={styles.achievementsGrid}>
                {unlockedAchievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </View>
            </View>
          )}

          {/* In Progress / Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="lock" size={24} color="#999" />
                <Text style={styles.sectionTitle}>
                  Next Goals ({lockedAchievements.length} remaining)
                </Text>
              </View>
              <View style={styles.achievementsGrid}>
                {displayedLockedAchievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </View>
              {!showAllAchievements && lockedAchievements.length > 3 && (
                <TouchableOpacity 
                  style={styles.showMoreButton}
                  onPress={() => setShowAllAchievements(true)}
                >
                  <Text style={styles.showMoreText}>
                    Show All ({lockedAchievements.length - 3} more)
                  </Text>
                  <MaterialIcons name="expand-more" size={20} color="#1E4E75" />
                </TouchableOpacity>
              )}
              {showAllAchievements && (
                <TouchableOpacity 
                  style={styles.showMoreButton}
                  onPress={() => setShowAllAchievements(false)}
                >
                  <Text style={styles.showMoreText}>Show Less</Text>
                  <MaterialIcons name="expand-less" size={20} color="#1E4E75" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Personal Insights */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="insights" size={24} color="#9C27B0" />
              <Text style={styles.sectionTitle}>Your Insights</Text>
            </View>
            <View style={styles.insightsContainer}>
              {stats.averageScore >= 8 ? (
                <View style={styles.insightCard}>
                  <Text style={styles.insightEmoji}>🌟</Text>
                  <Text style={styles.insightText}>
                    Excellent performance! You're averaging {stats.averageScore.toFixed(1)}/10
                  </Text>
                </View>
              ) : stats.averageScore >= 6 ? (
                <View style={styles.insightCard}>
                  <Text style={styles.insightEmoji}>👍</Text>
                  <Text style={styles.insightText}>
                    Good progress! Your average is {stats.averageScore.toFixed(1)}/10. Keep improving!
                  </Text>
                </View>
              ) : (
                <View style={styles.insightCard}>
                  <Text style={styles.insightEmoji}>💪</Text>
                  <Text style={styles.insightText}>
                    Keep learning! Review quiz explanations to improve your score.
                  </Text>
                </View>
              )}
              {stats.currentStreak >= 3 && (
                <View style={styles.insightCard}>
                  <Text style={styles.insightEmoji}>🔥</Text>
                  <Text style={styles.insightText}>
                    Amazing {stats.currentStreak}-day streak! Keep it up!
                  </Text>
                </View>
              )}
              {stats.totalQuizzes >= 10 && (
                <View style={styles.insightCard}>
                  <Text style={styles.insightEmoji}>📚</Text>
                  <Text style={styles.insightText}>
                    Dedicated learner with {stats.totalQuizzes} quizzes completed!
                  </Text>
                </View>
              )}
              {stats.bestScore === 10 && (
                <View style={styles.insightCard}>
                  <Text style={styles.insightEmoji}>🏆</Text>
                  <Text style={styles.insightText}>
                    Perfect score achieved! You're an eco-expert!
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Contact Development Team */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="feedback" size={24} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Share Your Thoughts</Text>
            </View>
            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackDescription}>
                Help us improve EcoReady! Share your ideas, report issues, or just say hi to our development team.
              </Text>
              <TouchableOpacity 
                style={styles.feedbackButton}
                onPress={() => setShowFeedbackModal(true)}
              >
                <MaterialIcons name="mail-outline" size={20} color="#fff" />
                <Text style={styles.feedbackButtonText}>Send Feedback</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        visible={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        context="general"
        contextId="profile-feedback"
      />
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
    backgroundColor: '#fff',
    padding: 15,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E4E75',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  settingsButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  emptyButton: {
    backgroundColor: '#94C83D',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  statCard: {
    alignItems: 'center',
    width: '45%',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E4E75',
    marginLeft: 8,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  showMoreText: {
    fontSize: 14,
    color: '#1E4E75',
    fontWeight: '600',
    marginRight: 5,
  },
  insightsContainer: {
    gap: 10,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  insightEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  feedbackCard: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0f2f1',
  },
  feedbackDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
    lineHeight: 20,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
