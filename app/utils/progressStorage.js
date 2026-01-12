import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendAchievementNotification } from './notificationService';
import { formatDateDMY } from './dateFormatter';

const QUIZ_HISTORY_KEY = 'quiz_history';
const ACHIEVEMENTS_KEY = 'achievements';

// Achievement definitions
const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'first_quiz',
    name: 'First Steps',
    description: 'Complete your first quiz',
    icon: 'eco',
    requirement: (stats) => stats.totalQuizzes >= 1,
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Score 10/10 on a quiz',
    icon: 'emoji-events',
    requirement: (stats) => stats.bestScore === 10,
  },
  {
    id: 'consistent_learner',
    name: 'Consistent Learner',
    description: 'Complete 5 quizzes',
    icon: 'school',
    requirement: (stats) => stats.totalQuizzes >= 5,
  },
  {
    id: 'dedicated_student',
    name: 'Dedicated Student',
    description: 'Complete 10 quizzes',
    icon: 'menu-book',
    requirement: (stats) => stats.totalQuizzes >= 10,
  },
  {
    id: 'eco_expert',
    name: 'Eco Expert',
    description: 'Maintain an average score above 80%',
    icon: 'star',
    requirement: (stats) => stats.averageScore >= 8,
  },
  {
    id: 'streak_3',
    name: '3-Day Streak',
    description: 'Take quizzes on 3 consecutive days',
    icon: 'local-fire-department',
    requirement: (stats) => stats.currentStreak >= 3,
  },
  {
    id: 'streak_7',
    name: '7-Day Streak',
    description: 'Take quizzes on 7 consecutive days',
    icon: 'whatshot',
    requirement: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'high_achiever',
    name: 'High Achiever',
    description: 'Score 9 or 10 on five different quizzes',
    icon: 'workspace-premium',
    requirement: (stats) => {
      if (!stats.quizHistory) return false;
      const highScores = stats.quizHistory.filter(quiz => quiz.score >= 9);
      return highScores.length >= 5;
    },
  },
];

/**
 * Save a quiz result
 */
export const saveQuizResult = async (quizData) => {
  try {
    const { score, totalQuestions, answers, date } = quizData;
    
    const quizResult = {
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      answers: answers || [],
      date: date || formatDateDMY(new Date()),
      timestamp: Date.now(),
    };

    // Get existing history
    const historyJson = await AsyncStorage.getItem(QUIZ_HISTORY_KEY);
    const history = historyJson ? JSON.parse(historyJson) : [];

    // Add new result
    history.push(quizResult);

    // Save updated history
    await AsyncStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(history));

    // Check for new achievements
    await checkAndUnlockAchievements();

    return true;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return false;
  }
};

/**
 * Get quiz history
 */
export const getQuizHistory = async () => {
  try {
    const historyJson = await AsyncStorage.getItem(QUIZ_HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error('Error getting quiz history:', error);
    return [];
  }
};

/**
 * Calculate statistics from quiz history
 */
export const calculateStats = async () => {
  try {
    const history = await getQuizHistory();

    if (history.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        currentStreak: 0,
        longestStreak: 0,
        quizHistory: [],
      };
    }

    // Calculate total and average
    const totalQuizzes = history.length;
    const totalScore = history.reduce((sum, quiz) => sum + quiz.score, 0);
    const averageScore = totalScore / totalQuizzes;
    const bestScore = Math.max(...history.map(quiz => quiz.score));

    // Calculate streaks
    const { currentStreak, longestStreak } = calculateStreaks(history);

    return {
      totalQuizzes,
      averageScore: parseFloat(averageScore.toFixed(1)),
      bestScore,
      currentStreak,
      longestStreak,
      quizHistory: history,
    };
  } catch (error) {
    console.error('Error calculating stats:', error);
    return {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      currentStreak: 0,
      longestStreak: 0,
      quizHistory: [],
    };
  }
};

/**
 * Calculate quiz streaks
 */
const calculateStreaks = (history) => {
  if (history.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort by date
  const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));

  let currentStreak = 1;
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i - 1].date);
    const currDate = new Date(sorted[i].date);

    // Remove time component
    prevDate.setHours(0, 0, 0, 0);
    currDate.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (daysDiff === 1) {
      // Consecutive day
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else if (daysDiff === 0) {
      // Same day - don't break streak
      continue;
    } else {
      // Streak broken
      tempStreak = 1;
    }
  }

  // Check if current streak is still active (last quiz was today or yesterday)
  const lastQuizDate = new Date(sorted[sorted.length - 1].date);
  const today = new Date();
  lastQuizDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const daysSinceLastQuiz = Math.floor((today - lastQuizDate) / (1000 * 60 * 60 * 24));

  if (daysSinceLastQuiz <= 1) {
    currentStreak = tempStreak;
  } else {
    currentStreak = 0;
  }

  return { currentStreak, longestStreak };
};

/**
 * Get earned achievements
 */
export const getEarnedAchievements = async () => {
  try {
    const achievementsJson = await AsyncStorage.getItem(ACHIEVEMENTS_KEY);
    return achievementsJson ? JSON.parse(achievementsJson) : [];
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
};

/**
 * Get all achievements with unlock status
 */
export const getAllAchievements = async () => {
  try {
    const earned = await getEarnedAchievements();
    const earnedIds = earned.map(a => a.id);

    return ACHIEVEMENT_DEFINITIONS.map(achievement => ({
      ...achievement,
      unlocked: earnedIds.includes(achievement.id),
      unlockedDate: earned.find(a => a.id === achievement.id)?.date || null,
    }));
  } catch (error) {
    console.error('Error getting all achievements:', error);
    return ACHIEVEMENT_DEFINITIONS.map(a => ({ ...a, unlocked: false, unlockedDate: null }));
  }
};

/**
 * Check and unlock new achievements
 */
export const checkAndUnlockAchievements = async () => {
  try {
    const stats = await calculateStats();
    const earned = await getEarnedAchievements();
    const earnedIds = earned.map(a => a.id);

    const newlyUnlocked = [];

    for (const achievement of ACHIEVEMENT_DEFINITIONS) {
      // Skip if already unlocked
      if (earnedIds.includes(achievement.id)) {
        continue;
      }

      // Check if requirement is met
      if (achievement.requirement(stats)) {
        const unlockedAchievement = {
          id: achievement.id,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          date: new Date().toISOString(),
        };

        earned.push(unlockedAchievement);
        newlyUnlocked.push(unlockedAchievement);

        // Send notification
        await sendAchievementNotification(achievement.name, achievement.description);
      }
    }

    // Save updated achievements
    if (newlyUnlocked.length > 0) {
      await AsyncStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(earned));
    }

    return newlyUnlocked;
  } catch (error) {
    console.error('Error checking achievements:', error);
    return [];
  }
};

/**
 * Get progress towards next achievement
 */
export const getAchievementProgress = async () => {
  try {
    const stats = await calculateStats();
    const allAchievements = await getAllAchievements();
    const locked = allAchievements.filter(a => !a.unlocked);

    const progress = [];

    for (const achievement of locked) {
      let progressValue = 0;
      let progressMax = 1;
      let progressText = '';

      switch (achievement.id) {
        case 'first_quiz':
          progressValue = stats.totalQuizzes;
          progressMax = 1;
          progressText = `${progressValue}/${progressMax} quiz`;
          break;
        case 'consistent_learner':
          progressValue = stats.totalQuizzes;
          progressMax = 5;
          progressText = `${progressValue}/${progressMax} quizzes`;
          break;
        case 'dedicated_student':
          progressValue = stats.totalQuizzes;
          progressMax = 10;
          progressText = `${progressValue}/${progressMax} quizzes`;
          break;
        case 'perfect_score':
          progressValue = stats.bestScore;
          progressMax = 10;
          progressText = `Best: ${progressValue}/${progressMax}`;
          break;
        case 'eco_expert':
          progressValue = stats.averageScore;
          progressMax = 8;
          progressText = `Avg: ${progressValue.toFixed(1)}/8.0`;
          break;
        case 'streak_3':
          progressValue = stats.currentStreak;
          progressMax = 3;
          progressText = `${progressValue}/${progressMax} days`;
          break;
        case 'streak_7':
          progressValue = stats.currentStreak;
          progressMax = 7;
          progressText = `${progressValue}/${progressMax} days`;
          break;
        case 'high_achiever':
          const highScores = stats.quizHistory.filter(q => q.score >= 9).length;
          progressValue = highScores;
          progressMax = 5;
          progressText = `${progressValue}/${progressMax} high scores`;
          break;
      }

      progress.push({
        ...achievement,
        progressValue,
        progressMax,
        progressText,
        progressPercentage: Math.min((progressValue / progressMax) * 100, 100),
      });
    }

    // Sort by progress percentage (closest to completion first)
    return progress.sort((a, b) => b.progressPercentage - a.progressPercentage);
  } catch (error) {
    console.error('Error getting achievement progress:', error);
    return [];
  }
};

/**
 * Clear all progress data (for testing/reset)
 */
export const clearAllProgress = async () => {
  try {
    await AsyncStorage.removeItem(QUIZ_HISTORY_KEY);
    await AsyncStorage.removeItem(ACHIEVEMENTS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing progress:', error);
    return false;
  }
};
