import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const DonutChart = ({ percentage = 0, label = '', color = '#4CAF50' }) => {
  const size = 150; // Diameter of the circle
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2; // Radius
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      {/* SVG Donut */}
      <Svg height={size} width={size}>
        <Circle
          stroke="#EEE" // Background circle color
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={color} // Progress circle color
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>

      {/* Percentage Label */}
      <Text style={styles.percentageText}>{percentage.toFixed(0)}%</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  percentageText: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default DonutChart;
