import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InputSummary = ({ selectedCalculator, inputs }) => {
  if (!selectedCalculator) return null;

  const summaries = {
    '1': [
      { label: '🚗 Transport Distance', value: inputs.transportDistance ? `${inputs.transportDistance} km` : "0 km" },
      { label: '🚘 Vehicle Type', value: inputs.vehicleType ? inputs.vehicleType.charAt(0).toUpperCase() + inputs.vehicleType.slice(1) : "Not selected" }
    ],
    '2': [
      { label: '🚿 Weekly Showers', value: inputs.weeklyShowers ? `${inputs.weeklyShowers} times` : "0 times" },
      { label: '🍳 Weekly Cooking', value: inputs.dailyCooking ? `${inputs.dailyCooking * 7} sessions` : "0 sessions" },
      { label: '🧺 Weekly Laundry', value: inputs.weeklyLaundry ? `${inputs.weeklyLaundry} loads` : "0 loads" }
    ],
    '3': [
      { label: '🥩 Meat Portions', value: inputs.meat ? `${inputs.meat} portions` : "0 portions" },
      { label: '🥦 Vegetable Portions', value: inputs.vegetables ? `${inputs.vegetables} portions` : "0 portions" },
      { label: '🌾 Grain Portions', value: inputs.grains ? `${inputs.grains} portions` : "0 portions" }
    ],
    '4': [
      { label: '⚡ Monthly Energy Usage', value: inputs.energyUsage ? `${inputs.energyUsage} kWh` : "0 kWh" },
      { label: '💰 kWh Price', value: inputs.kwhPrice ? `$${inputs.kwhPrice}/kWh` : "Not provided" },
      { label: '🔆 Solar Panel Investment', value: inputs.solarPanelCost ? `$${inputs.solarPanelCost}` : "Not provided" }
    ],
    '5': [
            { label: '💪 Protein Intake', value: inputs.proteinIntake ? `${inputs.proteinIntake}g` : "0g" },
            { label: '🍽 Protein Source', value: inputs.proteinSource ? inputs.proteinSource.charAt(0).toUpperCase() + inputs.proteinSource.slice(1) : "Not selected" }
        ],
    '6': [
      { label: '♻️ Small Bags', value: inputs.smallBags ? `${inputs.smallBags} bags` : "0 bags" },
      { label: '🗑️ Medium Bags', value: inputs.mediumBags ? `${inputs.mediumBags} bags` : "0 bags" },
      { label: '🛢️ Large Bins', value: inputs.largeBins ? `${inputs.largeBags} bins` : "0 bins" }
    ],
  };

  return (
    <View style={styles.summaryContainer}>
      {summaries[selectedCalculator.id]?.map((item, index) => (
        <View key={index} style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{item.label}</Text>
          <Text style={styles.summaryValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 15,
    width: '90%',
    alignSelf: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  summaryLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E4E75',
  },
});

export default InputSummary;
