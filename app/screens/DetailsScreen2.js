import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  BackHandler,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ThermometerMeter from '../components/ThermometerMeter';
import WaveMeter from '../components/WaveMeter';
import BarGraph from '../components/BarGraph';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import CircularGauge from '../components/CircularGauge';
import NutritionCard from '../components/NutritionCard';
import foodDatabase from '../data/foodNutritionDB.json';
import { generateAlert, getSuggestions } from '../utils/nutritionAlerts';

const calculators = [
  { id: '1', name: 'Carbon Footprint', unit: 'kg CO₂/day', meter: 'Thermometer Gauge' },
  { id: '2', name: 'Water Usage', unit: 'Liters/day', meter: 'Wave Meter' },
  { id: '3', name: 'Calorie & Nutrition Impact', unit: 'Calories', meter: 'Battery Charge Meter & Bar Graph' },
  { id: '4', name: 'Energy Efficiency', unit: 'kWh/day', meter: 'Circular Gauge' },
  { id: '5', name: 'Transportation Footprint', unit: 'kg CO₂/day', meter: 'Bar Graph Comparison' },
];

const SectionDetails = ({ route }) => {
  const [selectedCalculator, setSelectedCalculator] = useState(null);
  const [inputs, setInputs] = useState({});
  const [resultValue, setResultValue] = useState(0);

  // Reset state when "reset" param is true
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.reset) {
        setSelectedCalculator(null);
        setInputs({});
        setResultValue(0);
      }
    }, [route.params])
  );

  useEffect(() => {
    const handleBackPress = () => {
      if (selectedCalculator) {
        setSelectedCalculator(null);
        setInputs({});
        setResultValue(0);
        return true; // Prevent default back behavior
      }
      return false; // Allow default back behavior if no calculator is selected
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove();
  }, [selectedCalculator]);

  const handleCalculate = () => {
    let result = 0;
    switch (selectedCalculator.id) {
      case '1': {
        const { transportDistance, vehicleType } = inputs;
        const vehicleEmissions = { car: 0.25, bike: 0.05, bus: 0.1 };
        result = parseFloat(transportDistance || 0) * (vehicleEmissions[vehicleType] || 0);
        break;
      }
      case '2': {
        const { dailyShowers, dailyCooking, weeklyLaundry } = inputs;
        result = parseFloat(dailyShowers || 0) * 50 +
          parseFloat(dailyCooking || 0) * 15 +
          (parseFloat(weeklyLaundry || 0) * 80) / 7;
        break;
      }
      case '3': { // Calorie & Nutrition Impact
        // New food database logic
        const { selectedFood, servingSize } = inputs;
        
        if (!selectedFood || !servingSize) {
          setResultValue(0);
          break;
        }
        
        const food = foodDatabase.foods.find(f => f.id === selectedFood);
        if (food) {
          const servingKg = parseFloat(servingSize) / 1000;
          result = food.carbonPerKg * servingKg;
        }
        break;
      }
      case '4': {
        const { washingMachine, dishwasher, heatingType, heatingUsage } = inputs;
        const heatingEmission = { electric: 0.5, gas: 1.2 };
        result = parseFloat(washingMachine || 0) * 2 +
          parseFloat(dishwasher || 0) * 1.5 +
          parseFloat(heatingUsage || 0) * (heatingEmission[heatingType] || 0);
        break;
      }
      case '5': { // Transportation Footprint
        const { carDistance, busDistance, bikeDistance } = inputs;

        const transportEmissions = { car: 0.3, bus: 0.1, bike: 0.02 };

        const carEmissions = parseFloat(carDistance || 0) * transportEmissions.car;
        const busEmissions = parseFloat(busDistance || 0) * transportEmissions.bus;
        const bikeEmissions = parseFloat(bikeDistance || 0) * transportEmissions.bike;

        result = carEmissions + busEmissions + bikeEmissions; // Total emissions
        break;
      }
      default:
        break;
    }
    setResultValue(parseFloat(result.toFixed(2)));
  };

  const renderMeter = () => {
    const getColor = (value, maxValue) => {
      const ratio = value / maxValue;
      if (ratio <= 0.4) return '#4CAF50';
      if (ratio <= 0.7) return '#FFC107';
      return '#F44336';
    };

    const color = getColor(resultValue, 100);

    switch (selectedCalculator?.id) {
      case '1':
        return <ThermometerMeter value={resultValue} maxValue={100} unit="kg CO₂" color={color} />;
      case '2':
        return <WaveMeter value={resultValue} maxValue={500} unit="Liters/day" color={color} />;
        case '3': {
          if (!inputs.selectedFood || !inputs.servingSize) {
            return <Text style={styles.noMeterText}>Please select a food and enter serving size</Text>;
          }

          const selectedFood = foodDatabase.foods.find(f => f.id === inputs.selectedFood);
          if (!selectedFood) {
            return <Text style={styles.noMeterText}>Food not found</Text>;
          }

          const servingKg = parseFloat(inputs.servingSize) / 1000; // Convert grams to kg
          const carbonEmissions = (selectedFood.carbonPerKg * servingKg).toFixed(2);

          // Generate alert and suggestions
          const alert = generateAlert(selectedFood, servingKg);
          const suggestions = getSuggestions(selectedFood);

          return (
            <>
              <Text style={styles.totalText}>
                CO₂ Emissions: {carbonEmissions} kg for {inputs.servingSize}g
              </Text>
              
              {/* Nutrition Card */}
              <NutritionCard food={selectedFood} servingSize={parseFloat(inputs.servingSize)} />
              
              {/* Alert Section */}
              <View style={[styles.alertBox, { 
                backgroundColor: alert.alertType === 'red' ? '#ffebee' : alert.alertType === 'yellow' ? '#fff3e0' : '#e8f5e9',
                borderColor: alert.alertType === 'red' ? '#f44336' : alert.alertType === 'yellow' ? '#ff9800' : '#4caf50'
              }]}>
                <Text style={styles.alertIcon}>{alert.icon}</Text>
                <Text style={[styles.alertTitle, { color: alert.alertType === 'red' ? '#c62828' : alert.alertType === 'yellow' ? '#e65100' : '#2e7d32' }]}>{alert.title}</Text>
                <Text style={styles.alertMessage}>{alert.message}</Text>
              </View>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <View style={styles.suggestionsBox}>
                  <Text style={styles.suggestionsTitle}>💡 Better Alternatives:</Text>
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <View key={index} style={styles.suggestionItem}>
                      <Text style={styles.suggestionName}>{suggestion.name}</Text>
                      <Text style={styles.suggestionDetails}>
                        {suggestion.carbonPerKg.toFixed(1)} kg CO₂/kg • Sustainability: {suggestion.sustainabilityScore}/10
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          );
        }
        
      case '4':
        return <CircularGauge percentage={(resultValue / 100) * 100} label="Energy Efficiency" color={color} />;
      case '5': { // Transportation Footprint
        const emissionsData = [
          { mode: 'Car', emissions: parseFloat(inputs.carDistance || 0) * 0.3 },
          { mode: 'Bus', emissions: parseFloat(inputs.busDistance || 0) * 0.1 },
          { mode: 'Bike', emissions: parseFloat(inputs.bikeDistance || 0) * 0.02 },
        ];

        const totalEmissions = emissionsData.reduce((sum, entry) => sum + entry.emissions, 0);
        
        return (
          <>
            <Text style={styles.totalText}>Total CO₂ Emissions: {totalEmissions.toFixed(2)} kg/day</Text>
            <BarGraph
              values={emissionsData.map((entry) => entry.emissions/totalEmissions*100)}
              labels={emissionsData.map((entry) => entry.mode)}
            />
          </>
        );
      }
      default:
        return <Text style={styles.noMeterText}>Select a calculator</Text>;
    }
  };

  const renderInputFields = () => (
    <View style={styles.form}>
      {inputFields[selectedCalculator.id].map((field) => {
        // Filter foods by category for food selection dropdown
        let foodOptions = field.options;
        let foodLabels = field.optionLabels;
        
        if (field.filterByCategory && inputs.selectedCategory) {
          const filteredFoods = foodDatabase.foods.filter(f => f.category === inputs.selectedCategory);
          foodOptions = filteredFoods.map(f => f.id);
          foodLabels = filteredFoods.map(f => f.name);
        }

        return (
          <View key={field.key} style={styles.inputContainer}>
            <Text style={styles.label}>{field.label}:</Text>
            {field.type === 'number' ? (
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter value"
                value={inputs[field.key]?.toString() || ''}
                onChangeText={(value) =>
                  setInputs((prev) => ({ ...prev, [field.key]: parseFloat(value) || 0 }))
                }
              />
            ) : (
              <Picker
                selectedValue={inputs[field.key]}
                style={styles.picker}
                onValueChange={(value) => {
                  setInputs((prev) => ({ ...prev, [field.key]: value }));
                  // Reset food selection when category changes
                  if (field.key === 'selectedCategory') {
                    setInputs((prev) => ({ ...prev, selectedFood: '' }));
                  }
                }}
              >
                <Picker.Item label={field.defaultOption} value="" />
                {field.optionLabels ? (
                  foodOptions.map((option, index) => (
                    <Picker.Item key={option} label={foodLabels[index]} value={option} />
                  ))
                ) : (
                  field.options.map((option) => (
                    <Picker.Item key={option} label={option} value={option} />
                  ))
                )}
              </Picker>
            )}
          </View>
        );
      })}
      <TouchableOpacity onPress={handleCalculate} style={styles.calculateButton}>
        <Text style={styles.calculateButtonText}>Calculate</Text>
      </TouchableOpacity>
    </View>
  );

  const inputFields = {
    '1': [
      { label: 'Transport Distance (km/day)', key: 'transportDistance', type: 'number' },
      {
        label: 'Vehicle Type',
        key: 'vehicleType',
        type: 'dropdown',
        options: ['car', 'bike', 'bus'],
        defaultOption: 'Select Vehicle Type',
      },
    ],
    '2': [
      { label: 'Daily Showers', key: 'dailyShowers', type: 'number' },
      { label: 'Daily Cooking Sessions', key: 'dailyCooking', type: 'number' },
      { label: 'Weekly Laundry Loads', key: 'weeklyLaundry', type: 'number' },
    ],
    '3': [
      {
        label: 'Select Food Category',
        key: 'selectedCategory',
        type: 'dropdown',
        options: ['Proteins', 'Dairy', 'Grains', 'Vegetables', 'Fruits', 'Oils'],
        defaultOption: 'Choose a category',
      },
      {
        label: 'Select Food',
        key: 'selectedFood',
        type: 'dropdown',
        options: foodDatabase.foods.map(f => f.id),
        optionLabels: foodDatabase.foods.map(f => f.name),
        defaultOption: 'Choose a food',
        filterByCategory: true,
      },
      { label: 'Serving Size (grams)', key: 'servingSize', type: 'number' },
    ],
    '4': [
      { label: 'Washing Machine Loads', key: 'washingMachine', type: 'number' },
      { label: 'Dishwasher Loads', key: 'dishwasher', type: 'number' },
      {
        label: 'Heating Type',
        key: 'heatingType',
        type: 'dropdown',
        options: ['electric', 'gas'],
        defaultOption: 'Select Heating Type',
      },
      { label: 'Heating Usage (hours/day)', key: 'heatingUsage', type: 'number' },
    ],
    '5': [
      { label: 'Daily Car Distance (km)', key: 'carDistance', type: 'number' },
      { label: 'Daily Bus Distance (km)', key: 'busDistance', type: 'number' },
      { label: 'Daily Bike Distance (km)', key: 'bikeDistance', type: 'number' },
    ],
  };

  return (
    <View style={styles.container}>
      {selectedCalculator ? (
        <ScrollView contentContainerStyle={styles.detailsContainer}>
          <Text style={styles.selectedHeader}>{selectedCalculator.name}</Text>
          {renderInputFields()}
          <View style={styles.meterContainer}>{renderMeter()}</View>
        </ScrollView>
      ) : (
        <FlatList
          data={calculators}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                setSelectedCalculator(item);
                setInputs({});
                setResultValue(0);
              }}
            >
              <Text style={styles.title}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    width: '95%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  selectedHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  meterContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  form: {
    flexGrow: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#555',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#ffffff',
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    padding: 5,
  },
  calculateButton: {
    backgroundColor: '#0288d1',
    padding: 15,
    borderRadius: 8,
  },
  calculateButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  alertBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
  },
  alertIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  alertMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
  suggestionsBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#add8e6',
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  suggestionItem: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#4caf50',
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  suggestionDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  noMeterText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SectionDetails;
