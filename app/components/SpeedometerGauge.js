import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const getColorByValue = (value, maxValue) => {
  const percentage = value / maxValue;
  if (percentage < 0.4) return '#4CAF50'; // Green
  if (percentage < 0.7) return '#FFEB3B'; // Yellow
  return '#F44336'; // Red
};

const SpeedometerGauge = ({ value, maxValue, unit }) => {
  const angle = Math.min((value / maxValue) * 180, 180); // Cap at 180 degrees
  const rotation = `rotate(${angle - 90}deg)`; // Adjust rotation to start from left
  const needleColor = getColorByValue(value, maxValue);

  return (
    <View style={styles.container}>
      <View style={styles.speedometer}>
        <View
          style={[styles.needle, { transform: [{ rotate: rotation }], backgroundColor: needleColor }]}
        />
      </View>
      <Text style={styles.valueText}>
        {value.toFixed(2)} {unit}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  speedometer: {
    width: 200,
    height: 100,
    borderRadius: 100,
    backgroundColor: '#EEE',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#AAA',
  },
  needle: {
    position: 'absolute',
    width: 3,
    height: '50%',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
  },
  valueText: {
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
});

export default SpeedometerGauge;
