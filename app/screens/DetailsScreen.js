import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

// Data for the calculators
const calculators = [
  { id: '1', name: 'Carbon Footprint', icon: '🌍' },
  { id: '2', name: 'Water Usage', icon: '🚿' },
  { id: '3', name: 'Calorie & Nutrition Impact', icon: '🍽️' },
  { id: '4', name: 'Energy Efficiency', icon: '⚡' },
  { id: '5', name: 'Transportation Footprint', icon: '🚗' },
  { id: '6', name: 'Sustainable Diet', icon: '🌱' },
  { id: '7', name: 'Solar Energy Potential', icon: '🌞' },
  { id: '8', name: 'Waste Reduction', icon: '♻️' },
];

const CalculatorsScreen = ({ navigation }) => {
  const handleCalculatorPress = (calculator) => {
    // Navigate to the specific calculator page with its ID
    navigation.navigate('CalculatorDetails', { calculator });
  };

  const renderCalculatorCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleCalculatorPress(item)}
    >
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.cardTitle}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Eco-Friendly Calculators</Text>

      {/* Calculator List */}
      <FlatList
        data={calculators}
        keyExtractor={(item) => item.id}
        renderItem={renderCalculatorCard}
        contentContainerStyle={styles.listContainer}
        numColumns={2} // Two cards per row
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Use the full available height
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E4E75',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    margin: 10,
    width: '42%', // Width of each card (two cards per row with space between)
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: {
    fontSize: 32,
    marginBottom: 10,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});

export default CalculatorsScreen;
