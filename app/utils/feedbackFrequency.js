import AsyncStorage from '@react-native-async-storage/async-storage';

const FEEDBACK_FREQUENCY_KEY = 'feedback_frequency';
const LAST_FEEDBACK_DATE_KEY = 'last_feedback_date';
const SESSIONS_SINCE_FEEDBACK_KEY = 'sessions_since_feedback';

// Configuration
const MIN_SESSIONS_BETWEEN_FEEDBACK = 20; // Show feedback every 20 games/quizzes
const MIN_DAYS_BETWEEN_FEEDBACK = 3; // Or every 3 days, whichever comes first

/**
 * Check if we should show the feedback modal
 * Only shows feedback every 5 sessions OR every 3 days
 */
export const shouldShowFeedback = async () => {
  try {
    const lastFeedbackDate = await AsyncStorage.getItem(LAST_FEEDBACK_DATE_KEY);
    const sessionsSinceStr = await AsyncStorage.getItem(SESSIONS_SINCE_FEEDBACK_KEY);
    const sessionsSince = sessionsSinceStr ? parseInt(sessionsSinceStr) : 0;

    // If never shown feedback, show it after 2 sessions
    if (!lastFeedbackDate) {
      return sessionsSince >= 2;
    }

    const lastDate = new Date(lastFeedbackDate);
    const now = new Date();
    const daysDiff = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));

    // Show if it's been more than MIN_DAYS_BETWEEN_FEEDBACK days
    if (daysDiff >= MIN_DAYS_BETWEEN_FEEDBACK) {
      return true;
    }

    // Or show if more than MIN_SESSIONS_BETWEEN_FEEDBACK sessions
    if (sessionsSince >= MIN_SESSIONS_BETWEEN_FEEDBACK) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking feedback frequency:', error);
    return false;
  }
};

/**
 * Increment the session counter
 * Call this each time a quiz/game is completed
 */
export const incrementSessionCounter = async () => {
  try {
    const sessionsSinceStr = await AsyncStorage.getItem(SESSIONS_SINCE_FEEDBACK_KEY);
    const sessionsSince = sessionsSinceStr ? parseInt(sessionsSinceStr) : 0;
    await AsyncStorage.setItem(SESSIONS_SINCE_FEEDBACK_KEY, (sessionsSince + 1).toString());
  } catch (error) {
    console.error('Error incrementing session counter:', error);
  }
};

/**
 * Reset counters after feedback is submitted or dismissed
 */
export const resetFeedbackCounters = async () => {
  try {
    await AsyncStorage.setItem(LAST_FEEDBACK_DATE_KEY, new Date().toISOString());
    await AsyncStorage.setItem(SESSIONS_SINCE_FEEDBACK_KEY, '0');
  } catch (error) {
    console.error('Error resetting feedback counters:', error);
  }
};

/**
 * Get feedback statistics for debugging
 */
export const getFeedbackStats = async () => {
  try {
    const lastFeedbackDate = await AsyncStorage.getItem(LAST_FEEDBACK_DATE_KEY);
    const sessionsSinceStr = await AsyncStorage.getItem(SESSIONS_SINCE_FEEDBACK_KEY);
    
    return {
      lastFeedbackDate: lastFeedbackDate ? new Date(lastFeedbackDate) : null,
      sessionsSinceFeedback: sessionsSinceStr ? parseInt(sessionsSinceStr) : 0,
    };
  } catch (error) {
    console.error('Error getting feedback stats:', error);
    return null;
  }
};
