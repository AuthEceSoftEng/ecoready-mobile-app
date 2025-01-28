import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import ThermometerMeter from '../components/ThermometerMeter';

const CarbonFootprintCalculator = () => {
  const [transportDistance, setTransportDistance] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [result, setResult] = useState(0);

  const calculateCarbonFootprint = () => {
    const vehicleEmissions = { car: 0.25, bike: 0.05, bus: 0.1 };
    const distance = parseFloat(transportDistance) || 0;
    const emissionFactor = vehicleEmissions[vehicleType] || 0;
    const carbonFootprint = distance * emissionFactor;

    setResult(carbonFootprint.toFixed(2)); // Keep two decimal places
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Transport Distance (km/day):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Enter distance in km"
        value={transportDistance}
        onChangeText={setTransportDistance}
      />

      <Text style={styles.label}>Vehicle Type:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter car, bike, or bus"
        value={vehicleType}
        onChangeText={setVehicleType}
      />

      <TouchableOpacity
        style={styles.calculateButton}
        onPress={calculateCarbonFootprint}
      >
        <Text style={styles.buttonText}>Calculate</Text>
      </TouchableOpacity>

      {result > 0 && (
        <>
          <Text style={styles.resultText}>
            Your Carbon Footprint: {result} kg CO₂/day
          </Text>
          <ThermometerMeter value={parseFloat(result)} maxValue={100} unit="kg CO₂/day" />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  calculateButton: {
    backgroundColor: '#0288d1',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default CarbonFootprintCalculator;
