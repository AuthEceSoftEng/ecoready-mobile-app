import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const getColorByValue = (percentage) => {
  if (percentage < 50) return '#4CAF50'; // Green
  if (percentage < 80) return '#FFEB3B'; // Yellow
  return '#F44336'; // Red
};

const ThermometerMeter = ({ value, maxValue, unit }) => {
  const heightPercentage = Math.min((value / maxValue) * 100, 100);
  const color = getColorByValue(heightPercentage);

  return (
    <View style={styles.container}>
      <Text style={styles.valueText}>
        {value.toFixed(2)} {unit}
      </Text>
      <View style={styles.thermometer}>
        <View
          style={[styles.fill, { height: `${heightPercentage}%`, backgroundColor: color }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  thermometer: {
    height: "60%",
    aspectRatio: 0.3,
    borderRadius: 25,
    backgroundColor: '#EEE',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#AAA',
    maxWidth: 80,
  },
  fill: {
    width: '100%',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

export default ThermometerMeter;
