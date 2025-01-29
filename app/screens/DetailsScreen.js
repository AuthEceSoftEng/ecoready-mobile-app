import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Dimensions,
  Platform,
  LayoutAnimation,
  UIManager,
  BackHandler,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ThermometerMeter from '../components/ThermometerMeter';
import WaveMeter from '../components/WaveMeter';
import BarGraph from '../components/BarGraph';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import CircularGauge from '../components/CircularGauge';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Calculator data with enhanced colors
const calculators = [
  { 
    id: '1', 
    name: 'Carbon Footprint', 
    unit: 'kg CO₂/day', 
    meter: 'Thermometer Gauge',
    icon: '🌍',
    color: '#4CAF50',
    bgColor: '#E8F5E9'
  },
  { 
    id: '2', 
    name: 'Water Usage', 
    unit: 'Liters/day', 
    meter: 'Wave Meter',
    icon: '💧',
    color: '#2196F3',
    bgColor: '#E3F2FD'
  },
  { 
    id: '3', 
    name: 'Calorie & Nutrition', 
    unit: 'Calories', 
    meter: 'Bar Graph',
    icon: '🍎',
    color: '#FF9800',
    bgColor: '#FFF3E0'
  },
  { 
    id: '4', 
    name: 'Energy Efficiency', 
    unit: 'kWh/day', 
    meter: 'Circular Gauge',
    icon: '⚡',
    color: '#FFC107',
    bgColor: '#FFF8E1'
  },
  { 
    id: '5', 
    name: 'Transport Impact', 
    unit: 'kg CO₂/day', 
    meter: 'Bar Graph',
    icon: '🚗',
    color: '#9C27B0',
    bgColor: '#F3E5F5'
  },
  { 
    id: '6', 
    name: 'Transport Impact', 
    unit: 'kg CO₂/day', 
    meter: 'Bar Graph',
    icon: '🚗',
    color: '#9C27B0',
    bgColor: '#F3E5F5'
  },
];

// Dynamic window dimensions
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


const SectionDetails = ({ route, navigation }) => {
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
        return true;
      }
      return false;
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
      case '3': {
        const { meat = 0, vegetables = 0, grains = 0 } = inputs;
        const calorieCO2Impact = { meat: 27, vegetables: 3, grains: 5 };
        const totalEmissions = 
          (parseFloat(meat) || 0) * calorieCO2Impact.meat +
          (parseFloat(vegetables) || 0) * calorieCO2Impact.vegetables +
          (parseFloat(grains) || 0) * calorieCO2Impact.grains;
        result = totalEmissions;
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
      case '5': {
        const { carDistance, busDistance, bikeDistance } = inputs;
        const transportEmissions = { car: 0.3, bus: 0.1, bike: 0.02 };
        result = 
          parseFloat(carDistance || 0) * transportEmissions.car +
          parseFloat(busDistance || 0) * transportEmissions.bus +
          parseFloat(bikeDistance || 0) * transportEmissions.bike;
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
        const calorieCO2Impact = { meat: 27, vegetables: 3, grains: 5 };
        const meatEmissions = (parseFloat(meat) || 0) * calorieCO2Impact.meat;
        const vegetableEmissions = (parseFloat(vegetables) || 0) * calorieCO2Impact.vegetables;
        const grainEmissions = (parseFloat(grains) || 0) * calorieCO2Impact.grains;
        const totalEmissions = meatEmissions + vegetableEmissions + grainEmissions;
        
        return (
          <>
            <Text style={styles.totalText}>Total CO₂ Emissions: {totalEmissions.toFixed(2)} kg/day</Text>
            <BarGraph
              values={[
                meatEmissions * 100/totalEmissions, 
                vegetableEmissions * 100/totalEmissions, 
                grainEmissions * 100/totalEmissions
              ]}
              labels={['Meat', 'Vegetables', 'Grains']}
            />
          </>
        );
      }
      case '4':
        return <CircularGauge percentage={(resultValue / 100) * 100} label="Energy Efficiency" color={color} />;
      case '5': {
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
        return null;
    }
  };

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

  const renderCalculatorCard = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { 
          backgroundColor: item.bgColor,
          borderColor: item.color,
        }
      ]}
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

  const renderContent = () => {
    if (selectedCalculator) {
      return (
        <View style={styles.detailsContainer}>
          <View style={[styles.selectedHeader, { backgroundColor: selectedCalculator.bgColor }]}>
            <Text style={styles.selectedHeaderIcon}>{selectedCalculator.icon}</Text>
            <Text style={[styles.selectedHeaderText, { color: selectedCalculator.color }]}>
              {selectedCalculator.name}
            </Text>
          </View>
          <View style={styles.inputsContainer}>
            {renderInputFields()}
          </View>
          <View style={styles.meterContainer}>
            {renderMeter()}
          </View>
        </View>
      );
    }

    return (
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
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
    padding: 10, // Add some padding
    backgroundColor: '#f5f5f5', // Optional background color
  },
  headerTitle: {
    fontSize: Math.min(windowWidth * 0.07, 28),
    fontWeight: 'bold',
    color: '#1E4E75',
    textAlign: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: Math.min(windowWidth * 0.04, 16),
    color: '#667',
    textAlign: 'center',
    marginTop: windowHeight * 0.001,
  },
  listContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  row: {
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: windowHeight * 0.01,
    flexGrow: 1,
    height: '30%',
  },
  card: {
    flexGrow: 0.2,
    borderRadius: 15,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    width: '45%',
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { 
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: Math.min(windowWidth * 0.08, 32),
    marginBottom: windowHeight * 0.01,
  },
  cardTitle: {
    fontSize: Math.min(windowWidth * 0.04, 16),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: windowHeight * 0.01,
  },
  unit: {
    fontSize: Math.min(windowWidth * 0.03, 12),
    textAlign: 'center',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  selectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: windowHeight * 0.02,
  },
  selectedHeaderIcon: {
    fontSize: Math.min(windowWidth * 0.08, 32),
    marginRight: 10,
  },
  selectedHeaderText: {
    fontSize: Math.min(windowWidth * 0.06, 24),
    fontWeight: 'bold',
  },
  inputsContainer: {
    flex: 1,
    paddingVertical: windowHeight * 0.02,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: windowHeight * 0.015,
    backgroundColor: '#ffffff',
    fontSize: Math.min(windowWidth * 0.04, 16),
  },
  calculateButton: {
    backgroundColor: '#1E4E75',
    padding: windowHeight * 0.02,
    borderRadius: 8,
    marginVertical: windowHeight * 0.02,
  },
  calculateButtonText: {
    color: '#ffffff',
    fontSize: Math.min(windowWidth * 0.045, 18),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  meterContainer: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: windowHeight * 0.02,
    borderRadius: 12,
    marginTop: 'auto',
  }
});

export default SectionDetails;