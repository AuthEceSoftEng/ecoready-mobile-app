import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  BackHandler,
  LayoutAnimation,
  StyleSheet,
  ScrollView
} from 'react-native';
import InputFields from '../components/calculator/InputFields';
import InputSummary from '../components/calculator/InputSummary';
import ResultMeter from '../components/calculator/ResultMeter';
import { calculateResults } from '../utils/calculateResults';
import foodDatabase from '../data/foodNutritionDB.json';

const calculators = [
    { 
      id: '1', 
      name: 'Transport Impact', 
      unit: 'kg CO₂', 
      icon: '🚗', 
      color: '#4CAF50', 
      bgColor: '#E8F5E9' 
    },
    { 
      id: '2', 
      name: 'Weekly Water Usage', 
      unit: 'Liters/week', 
      icon: '💧', 
      color: '#2196F3', 
      bgColor: '#E3F2FD' 
    },
    { 
      id: '3', 
      name: 'Calorie & Nutrition', 
      unit: 'Calories/day', 
      icon: '🍎', 
      color: '#FF9800', 
      bgColor: '#FFF3E0' 
    },
    { 
      id: '4', 
      name: 'Renewable Energy Savings', 
      unit: 'kWh/month', 
      icon: '⚡', 
      color: '#FFC107', 
      bgColor: '#FFF8E1' 
    },
    { 
      id: '5', 
      name: 'Protein Impact', 
      unit: 'kg CO₂/week', 
      icon: '🥩🌿', 
      color: '#9C27B0', 
      bgColor: '#F3E5F5' 
    },
    { 
      id: '6', 
      name: 'Recycling Impact', 
      unit: 'kg CO₂/week', 
      icon: '♻️', 
      color: '#00ACC1', 
      bgColor: '#E0F7FA' 
    }
  ];
  const inputFields = {
    '1': [
      { label: '🌍 Transport Distance (km)', key: 'transportDistance', type: 'number', placeholder: 'Enter distance' },
      { 
        label: '🚗 Vehicle Type', key: 'vehicleType', type: 'dropdown',
        options: [{ label: 'Car', value: 'car' }, { label: 'Bus', value: 'bus' }, { label: 'Bike', value: 'bike' }],
        defaultOption: 'Select Vehicle Type',
      },
    ],
    '2': [ 
      { label: '🚿 Weekly Showers', key: 'weeklyShowers', type: 'slider', min: 0, max: 30, step: 1 },
      { label: '🍳 Daily Cooking Sessions', key: 'dailyCooking', type: 'slider', min: 0, max: 10, step: 1 },
      { label: '👕 Weekly Laundry Loads', key: 'weeklyLaundry', type: 'slider', min: 0, max: 20, step: 1 },
    ],
    '3': [
      { 
        label: '📦 Food Category', key: 'foodCategory', type: 'dropdown',
        options: [
          { label: 'Proteins', value: 'Proteins' },
          { label: 'Dairy', value: 'Dairy' },
          { label: 'Grains', value: 'Grains' },
          { label: 'Vegetables', value: 'Vegetables' },
          { label: 'Fruits', value: 'Fruits' },
          { label: 'Oils', value: 'Oils' }
        ],
        defaultOption: 'Select Category',
      },
      { 
        label: '🍽 Food Item', key: 'foodItem', type: 'dropdown',
        options: foodDatabase.foods.map(f => ({ label: f.name, value: f.id })),
        defaultOption: 'Select Food',
        filterByCategory: true,
      },
      { label: '⚖️ Serving Size (grams)', key: 'servingSize', type: 'number', placeholder: 'Enter grams (e.g., 100)' },
    ],
    '4': [
      { label: '⚡ Monthly Energy Usage (kWh)', key: 'energyUsage', type: 'number', placeholder: 'Enter kWh' },
      { label: '💰 kWh Price (€)', key: 'kwhPrice', type: 'number', placeholder: 'Enter price per kWh' },
      { label: '☀️ Solar Panel Cost (€)', key: 'solarPanelCost', type: 'number', placeholder: 'Enter system cost' },
    ],
    '5': [
      { label: '💪 Daily Protein Intake (grams)', key: 'proteinIntake', type: 'slider', min: 0, max: 2000, step: 10 },
      { 
        label: '🍽 Protein Source', key: 'proteinSource', type: 'dropdown',
        options: [
          { label: 'Beef', value: 'beef' }, 
          { label: 'Chicken', value: 'chicken' }, 
          { label: 'Fish', value: 'fish' },
          { label: 'Eggs', value: 'eggs' },
          { label: 'Dairy', value: 'dairy' },
          { label: 'Plant-based', value: 'plant' }
        ],
        defaultOption: 'Select Protein Source',
      },
    ],
    '6': [
      { label: '🛍️ Small Bags (Grocery bag, ~0.5 kg)', key: 'smallBags', type: 'slider', min: 0, max: 20, step: 1 },
      { label: '🗑️ Medium Bags (Kitchen bag, ~2 kg)', key: 'mediumBags', type: 'slider', min: 0, max: 10, step: 1 },
      { label: '🛢️ Large Bags (Bin collection, ~5 kg)', key: 'largeBags', type: 'slider', min: 0, max: 5, step: 1 },
    ],
};  

const SectionDetails = () => {
  const [selectedCalculator, setSelectedCalculator] = useState(null);
  const [inputs, setInputs] = useState({});
  const [resultValue, setResultValue] = useState(0);
  const [calculationCompleted, setCalculationCompleted] = useState(false);

  useEffect(() => {
    const handleBackPress = () => {
      if (calculationCompleted) {
        setCalculationCompleted(false);  // Back to inputs screen
        return true;
      }
      if (selectedCalculator) {
        setSelectedCalculator(null);  // Back to calculator selection
        setInputs({});
        setResultValue(0);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [calculationCompleted, selectedCalculator]);

  const handleCalculate = () => {
    console.log('Inputs...', inputs)
    let missingFields = [];
    inputFields[selectedCalculator.id]?.forEach((field) => {
        console.log('Field...', field);
        
        if (field.type === 'number') { // Only validate numeric inputs
            const value = inputs[field.key];
            if (value === '' || value === null || value === undefined) {
                missingFields.push(field.label);
            }
        } 
        else if (field.type === 'dropdown') { // Validate dropdown selection
            const value = inputs[field.key];
            if (!value) {
                missingFields.push(field.label);
            }
        }
    });

    // If missing numeric fields exist, show warning and prevent calculation
    if (missingFields.length > 0) {
        alert(`⚠️ Please fill in all required fields:\n${missingFields.join(", ")}`);
        return;
    }
    const result = calculateResults(selectedCalculator, inputs);
    setResultValue(result);
    setCalculationCompleted(true);
  };

  const renderCalculatorCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: item.bgColor, borderColor: item.color }]}
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setSelectedCalculator(item);
        setInputs({});
        setResultValue(0);
      }}
    >
      <View style={styles.cardContent}>
        <Text style={styles.icon}>{item.icon}</Text>
        <Text style={[styles.cardTitle, { color: item.color }]}>{item.name}</Text>
        <Text style={[styles.unit, { color: item.color }]}>{item.unit}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
    {selectedCalculator && (
      <View style={[styles.titleContainer, { backgroundColor: selectedCalculator.bgColor }]}>
        <Text style={[styles.title, { color: selectedCalculator.color }]}>
          {selectedCalculator.icon} {selectedCalculator.name}
        </Text>
      </View>
    )}
      {selectedCalculator ? (
        calculationCompleted ? (
          <ScrollView 
            style={styles.detailsScrollView} 
            contentContainerStyle={styles.detailsContent}
            showsVerticalScrollIndicator={true}
          >
            <InputSummary selectedCalculator={selectedCalculator} inputs={inputs} />
            <ResultMeter selectedCalculator={selectedCalculator} resultValue={resultValue} />
            <TouchableOpacity onPress={() => setCalculationCompleted(false)} style={styles.modifyButton}>
              <Text style={styles.modifyButtonText}>Modify Inputs</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          <InputFields 
            selectedCalculator={selectedCalculator} 
            inputs={inputs} 
            setInputs={setInputs} 
            handleCalculate={handleCalculate} 
          />
        )
      ) : (
        <>
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Eco-Calculators</Text>
            <Text style={styles.subtitle}>Track your environmental impact</Text>
          </View>
          <FlatList
            data={calculators}
            keyExtractor={(item) => item.id}
            renderItem={renderCalculatorCard}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  headerContainer: { justifyContent: 'center', alignItems: 'center', padding: 10 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E4E75', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#667', textAlign: 'center', marginTop: 5 },
  listContainer: { flexGrow: 1, justifyContent: 'center' },
  row: { justifyContent: 'space-around', alignItems: 'center', margin: 10, flexGrow: 1, height: '30%' },
  card: { flexGrow: 0.2, borderRadius: 15, borderWidth: 2, shadowOpacity: 0.1, width: '45%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  cardContent: { justifyContent: 'center', alignItems: 'center' },
  icon: { fontSize: 32, marginBottom: 10 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  unit: { fontSize: 12, textAlign: 'center' },
  detailsScrollView: { flex: 1, width: '100%' },
  detailsContent: { padding: 10, alignItems: 'center', paddingBottom: 40 },
  modifyButton: { backgroundColor: '#1E4E75', borderRadius: 8, alignItems: 'center', padding: 12, marginTop: 20, width: '80%' },
  modifyButtonText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold' },
  titleContainer: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  inputError: {
    borderColor: 'red', 
    borderWidth: 2, 
    backgroundColor: '#FFE5E5', // Light red to highlight missing input
  },  
});

export default SectionDetails;
