import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const CircularGauge = ({ percentage = 0, label = '', color = '#4CAF50' }) => {
  const validPercentage = Math.min(Math.max(parseFloat(percentage) || 0, 0), 100); // Clamp value between 0 and 100
  const size = 150;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <Svg height={size} width={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          <Circle
            stroke="#eee"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke={color}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </G>
      </Svg>
      <Text style={styles.percentageText}>{validPercentage.toFixed(2)}%</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
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

export default CircularGauge;
