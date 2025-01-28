import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CarbonFootprintCalculator from './CarbonFootprintCalculator';


const CalculatorDetailsScreen = ({ route }) => {
  const { calculator } = route.params;

  // Dynamically load the correct calculator
  const renderCalculator = () => {
    console.log(calculator.id);
    switch (calculator.id) {
      case '1':
        return <CarbonFootprintCalculator />;
      case '2':
        return <WaterUsageCalculator />;
      case '3':
        return <NutritionImpactCalculator />;
      case '4':
        return <EnergyEfficiencyCalculator />;
      case '5':
        return <TransportationFootprintCalculator />;
      default:
        return (
          <Text style={styles.errorText}>Calculator not implemented yet!</Text>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{calculator.name}</Text>
      {renderCalculator()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default CalculatorDetailsScreen;
