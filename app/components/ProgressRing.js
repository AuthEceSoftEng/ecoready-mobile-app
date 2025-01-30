import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const ProgressRing = ({ value = 0, maxValue = 100, unit = '' }) => {
  const size = 150; // Diameter of the progress ring
  const strokeWidth = 12; // Thickness of the ring
  const radius = (size - strokeWidth) / 2; // Adjust radius based on stroke width
  const circumference = 2 * Math.PI * radius; // Full circumference
  const progress = Math.min(value / maxValue, 1); // Ensure the progress is between 0-1
  const strokeDashoffset = circumference * (1 - progress); // Calculate offset for progress
  const ringColor = value < maxValue * 0.4 ? '#4CAF50' : value < maxValue * 0.7 ? '#FFC107' : '#F44336'; // Color based on value

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E0E0E0" // Light grey background
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor} // Dynamic color based on value
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>
      {/* Centered Text */}
      <View style={styles.textContainer}>
        <Text style={styles.valueText}>{value.toFixed(1)}</Text>
        <Text style={styles.unitText}>{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E4E75',
  },
  unitText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777',
  },
});

export default ProgressRing;
