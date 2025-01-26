import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const ProgressMeter = ({ value, maxValue, unit, color = '#4CAF50' }) => {
  const percentage = Math.min((value / maxValue) * 100, 100); // Clamp between 0-100

  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.valueText}>
        {value.toFixed(2)} {unit}
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      {/* Percentage */}
      <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  progressBar: {
    width: '80%',
    height: 20,
    backgroundColor: '#EEE',
    borderRadius: 10,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 10,
  },
  percentageText: {
    marginTop: 5,
    fontSize: 16,
    color: '#333',
  },
});

export default ProgressMeter;
