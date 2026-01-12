import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AchievementBadge = ({ achievement, size = 'normal' }) => {
  const { name, description, icon, unlocked, unlockedDate, progressPercentage } = achievement;

  const isSmall = size === 'small';
  const iconSize = isSmall ? 32 : 48;
  const badgeSize = isSmall ? 70 : 90;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`;
  };

  return (
    <View style={[styles.container, isSmall && styles.containerSmall]}>
      <View style={[
        styles.badge,
        { width: badgeSize, height: badgeSize },
        unlocked ? styles.badgeUnlocked : styles.badgeLocked
      ]}>
        <MaterialIcons 
          name={icon || 'emoji-events'} 
          size={iconSize} 
          color={unlocked ? '#FFC107' : '#999'} 
        />
        {!unlocked && progressPercentage !== undefined && (
          <View style={styles.progressOverlay}>
            <View 
              style={[
                styles.progressFill, 
                { height: `${progressPercentage}%` }
              ]} 
            />
          </View>
        )}
      </View>
      <Text style={[styles.name, isSmall && styles.nameSmall]} numberOfLines={1}>
        {name}
      </Text>
      {!isSmall && (
        <>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
          {unlocked && unlockedDate && (
            <Text style={styles.date}>
              Earned: {formatDate(unlockedDate)}
            </Text>
          )}
          {!unlocked && achievement.progressText && (
            <Text style={styles.progressText}>
              {achievement.progressText}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 8,
    width: 120,
  },
  containerSmall: {
    width: 80,
    margin: 5,
  },
  badge: {
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  badgeUnlocked: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#FFC107',
  },
  badgeLocked: {
    backgroundColor: '#f5f5f5',
    borderWidth: 3,
    borderColor: '#e0e0e0',
  },
  progressOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'transparent',
  },
  progressFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  name: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  nameSmall: {
    fontSize: 11,
  },
  description: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  date: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
    textAlign: 'center',
  },
  progressText: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default AchievementBadge;
