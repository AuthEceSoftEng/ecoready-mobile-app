import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResultMeter = ({ selectedCalculator, resultValue }) => {
  if (!selectedCalculator) return null;

  const formatValue = (id, value) => {
    switch (id) {
      case '1': return `${value.toFixed(2)} kg CO₂`; // Transport Impact
      case '2': return `${value.toFixed(2)} Liters/week`; // Water Usage
      case '3': return `${value.toFixed(2)} kg CO₂ from Food`; // Food Impact
      case '4': return `💰 Savings: €${resultValue.monthlyCost.toFixed(2)}\n🌱 CO₂ Saved: ${resultValue.co2Saved.toFixed(2)} kg/month\n⌛ Payback: ~${Math.round(resultValue.paybackPeriod)} months`; // Energy Savings
      case '5': return `${value.toFixed(2)} kg CO₂ from Protein`; // Protein CO₂ Impact
      case '6': return `${value.toFixed(2)} kg Recycled`; // Recycling Efficiency
      default: return `${value.toFixed(2)}`;
    }
  };

  const getFeedbackMessage = (id, value) => {
    switch (id) {
      case '1': 
        return value < 5 ? "🌱 Great! Your transport footprint is low!" 
          : value < 15 ? "⚠️ Moderate impact. Consider alternatives!" 
          : "🚨 High footprint! Try public transport!";
      case '2': 
        return value < 500 ? "💧 Efficient water use!" 
          : value < 1000 ? "⚠️ Consider reducing your usage." 
          : "🚨 High water consumption!";
      case '3': 
        return value < 500 ? "🥦 Low CO₂ food choice!" 
          : value < 1500 ? "⚠️ Balanced diet, moderate impact!" 
          : "🚨 High impact! Consider reducing meat intake.";
      case '4': 
        return resultValue.paybackPeriod > 0 
          ? "⚡ Smart energy choices help the planet!"
          : "⚡ No savings calculated.";
      case '5': 
        return value < 10 ? "🌱 Low CO₂ protein choice!" 
          : value < 20 ? "⚠️ Moderate impact - Balance is key!" 
          : "🚨 High impact! Try more plant-based options.";
      case '6': 
        return value > 10 ? "♻️ Great recycling habits!" 
          : "⚠️ Consider recycling more waste.";
      default:
        return "";
    }
  };

  const formattedValue = formatValue(selectedCalculator.id, resultValue);
  const feedbackMessage = getFeedbackMessage(selectedCalculator.id, resultValue);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Impact</Text>

      {/* Result Value Display */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultValue}>{formattedValue}</Text>
      </View>

      {/* Feedback Message */}
      <Text style={styles.feedback}>{feedbackMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E4E75',
    marginBottom: 10,
  },
  resultContainer: {
    backgroundColor: '#E3F2FD', // Light blue background
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E4E75',
    textAlign: 'center',
  },
  feedback: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
    paddingHorizontal: 20,
  },
});

export default ResultMeter;
