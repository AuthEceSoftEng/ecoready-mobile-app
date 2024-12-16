import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const getColorByValue = (value, maxValue) => {
  const percentage = value / maxValue;
  if (percentage < 0.4) return '#F44336'; // Red
  if (percentage < 0.7) return '#FFEB3B'; // Yellow
  return '#4CAF50'; // Green
};

const BatteryChargeMeter = ({ value, maxValue, unit }) => {
  const chargeWidth = Math.min((value / maxValue) * 100, 100);
  const chargeColor = getColorByValue(value, maxValue);

  return (
    <View style={styles.container}>
      <View style={styles.battery}>
        <View
          style={[styles.charge, { width: `${chargeWidth}%`, backgroundColor: chargeColor }]}
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
  battery: {
    width: 200,
    height: 50,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#FFF',
  },
  charge: {
    height: '100%',
  },
  valueText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default BatteryChargeMeter;
