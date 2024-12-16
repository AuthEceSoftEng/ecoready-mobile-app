import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const getColorByValue = (value) => {
  if (value < 40) return '#4CAF50'; // Green
  if (value < 70) return '#FFEB3B'; // Yellow
  return '#F44336'; // Red
};

const BarGraph = ({ values, labels }) => (
  <View style={styles.container}>
    {values.map((value, index) => (
      <View key={index} style={styles.barContainer}>
        <Text style={styles.label}>{labels[index]}</Text>
        <View style={styles.bar}>
          <View
            style={[
              styles.fill,
              {
                height: `${value}%`,
                backgroundColor: getColorByValue(value),
              },
            ]}
          />
        </View>
        <Text style={styles.value}>{value.toFixed(2)}%</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  bar: {
    width: 30,
    height: 150,
    backgroundColor: '#DDD',
    borderRadius: 10,
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  value: {
    fontSize: 14,
    marginTop: 5,
    color: '#333',
  },
});

export default BarGraph;
