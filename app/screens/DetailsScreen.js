import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
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
        const { meat = 0, vegetables = 0, grains = 0 } = inputs;
      
        // Ensure all inputs are numbers and default to 0 if not set
        const meatValue = parseFloat(meat) || 0;
        const vegetableValue = parseFloat(vegetables) || 0;
        const grainValue = parseFloat(grains) || 0;
      
        // CO₂ impact factors (kg CO₂ per kg of food)
        const calorieCO2Impact = { meat: 27, vegetables: 3, grains: 5 };
      
        // Calculate emissions for each category
        const meatEmissions = meatValue * calorieCO2Impact.meat;
        const vegetableEmissions = vegetableValue * calorieCO2Impact.vegetables;
        const grainEmissions = grainValue * calorieCO2Impact.grains;
      
        // Calculate total emissions
        const totalEmissions = meatEmissions + vegetableEmissions + grainEmissions;
      
        // Store result
        setResultValue(parseFloat(totalEmissions.toFixed(2))); // Keep two decimal places
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
          const { meat = 0, vegetables = 0, grains = 0 } = inputs;
        
          // CO₂ impact factors
          const calorieCO2Impact = { meat: 27, vegetables: 3, grains: 5 };
        
          // Calculate emissions
          const meatEmissions = (parseFloat(meat) || 0) * calorieCO2Impact.meat;
          const vegetableEmissions = (parseFloat(vegetables) || 0) * calorieCO2Impact.vegetables;
          const grainEmissions = (parseFloat(grains) || 0) * calorieCO2Impact.grains;
          const totalEmissions = meatEmissions + vegetableEmissions + grainEmissions;
        
          // Render results and bar graph
          return (
            <>
              <Text style={styles.totalText}>Total CO₂ Emissions: {totalEmissions.toFixed(2)} kg/day</Text>
              <BarGraph
                values={[meatEmissions * 100/totalEmissions, vegetableEmissions * 100/totalEmissions, grainEmissions * 100/totalEmissions]}
                labels={['Meat', 'Vegetables', 'Grains']}
              />
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
      {inputFields[selectedCalculator.id].map((field) => (
        <View key={field.key} style={styles.inputContainer}>
          <Text style={styles.label}>{field.label}:</Text>
          {field.type === 'number' ? (
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter value"
              onChangeText={(value) =>
                setInputs((prev) => ({ ...prev, [field.key]: parseFloat(value) || 0 }))
              }
            />
          ) : (
            <Picker
              selectedValue={inputs[field.key]}
              style={styles.picker}
              onValueChange={(value) =>
                setInputs((prev) => ({ ...prev, [field.key]: value }))
              }
            >
              <Picker.Item label={field.defaultOption} value="" />
              {field.options.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          )}
        </View>
      ))}
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
      { label: 'Meat (kg/day)', key: 'meat', type: 'number' },
      { label: 'Vegetables (kg/day)', key: 'vegetables', type: 'number' },
      { label: 'Grains (kg/day)', key: 'grains', type: 'number' },
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
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
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
});

export default SectionDetails;
