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
  const [errors, setErrors] = useState({});
  const [showResult, setShowResult] = useState(false);

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
        if (!validateInputs()) return; // Add this line
        const { transportDistance, vehicleType } = inputs;
        const vehicleEmissions = { car: 0.25, bike: 0.05, bus: 0.1 };
        result = parseFloat(transportDistance || 0) * (vehicleEmissions[vehicleType] || 0);
        setShowResult(true);
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
  const validateInputs = () => {
    let newErrors = {};
    let isValid = true;
  
    if (selectedCalculator?.id === '1') {
      // Validate transport distance
      if (!inputs.transportDistance) {
        newErrors.transportDistance = 'Distance is required';
        isValid = false;
      } else if (isNaN(inputs.transportDistance) || inputs.transportDistance < 0) {
        newErrors.transportDistance = 'Please enter a valid positive number';
        isValid = false;
      }
  
      // Validate vehicle type
      if (!inputs.vehicleType) {
        newErrors.vehicleType = 'Please select a vehicle type';
        isValid = false;
      }
    }
  
    setErrors(newErrors);
    return isValid;
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
            return (
              <View style={styles.meterContentContainer}>
                <Text style={styles.resultLabel}>Your Carbon Footprint:</Text>
                <ThermometerMeter 
                  value={resultValue} 
                  maxValue={100} 
                  unit="kg CO₂" 
                  color={color} 
                  style={styles.thermometerSize}  // Add this line
                />
                {resultValue > 0 && (
                  <Text style={styles.resultNote}>
                    {resultValue <= 2 
                      ? '✨ Great! Your carbon footprint is low.'
                      : resultValue <= 5
                      ? '⚠️ Moderate impact. Consider eco-friendly alternatives.'
                      : '⚠️ High impact. Try reducing car usage when possible.'}
                  </Text>
                )}
              </View>
            );
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
        { 
            label: 'Daily Transport Distance (km)', 
            key: 'transportDistance', 
            type: 'number',
            placeholder: 'Enter distance'
        },
        {
            label: 'Vehicle Type',
            key: 'vehicleType',
            type: 'dropdown',
            options: [
            { label: 'Car', value: 'car' },
            { label: 'Bus', value: 'bus' },
            { label: 'Bike', value: 'bike' },
            { label: 'Train', value: 'train' },
            { label: 'Motorcycle', value: 'motorcycle' }
            ],
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
    <View style={styles.inputsContainer}>
      {inputFields[selectedCalculator.id].map((field) => (
        <View key={field.key} style={styles.inputContainer}>
          <Text style={styles.label}>{field.label}:</Text>
          {field.type === 'number' ? (
            <>
              <TextInput
                style={[
                  styles.input,
                  errors[field.key] && styles.inputError
                ]}
                keyboardType="numeric"
                placeholder={field.placeholder || "Enter value"}
                value={inputs[field.key]?.toString()}
                onChangeText={(value) => {
                  setInputs((prev) => ({ ...prev, [field.key]: value }));
                  setErrors((prev) => ({ ...prev, [field.key]: null }));
                }}
              />
              {errors[field.key] && (
                <Text style={styles.errorText}>{errors[field.key]}</Text>
              )}
            </>
          ) : (
            <>
              <View style={[
                styles.pickerContainer,
                errors[field.key] && styles.inputError
              ]}>
                <Picker
                  selectedValue={inputs[field.key]}
                  style={styles.picker}
                  onValueChange={(value) => {
                    setInputs((prev) => ({ ...prev, [field.key]: value }));
                    setErrors((prev) => ({ ...prev, [field.key]: null }));
                  }}
                >
                  <Picker.Item label={field.defaultOption} value="" />
                  {field.options.map((option) => (
                    <Picker.Item 
                      key={option.value} 
                      label={option.label} 
                      value={option.value} 
                    />
                  ))}
                </Picker>
              </View>
              {errors[field.key] && (
                <Text style={styles.errorText}>{errors[field.key]}</Text>
              )}
            </>
          )}
        </View>
      ))}
      <TouchableOpacity 
        onPress={handleCalculate} 
        style={styles.calculateButton}
      >
        <Text style={styles.calculateButtonText}>Calculate Emissions</Text>
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
        <View style={styles.fixedContainer}>
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
    fixedContainer: {
        height: windowHeight * 0.75,
    },
    headerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      backgroundColor: '#f5f5f5',
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
        padding: 10,
        alignItems: 'center',
      },
      selectedHeader: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8F5E9',
        borderRadius: 12,
        width: '100%',
      },
      selectedHeaderIcon: {
        fontSize: Math.min(windowWidth * 0.08, 32),
        marginLeft: '5%',
      },
      selectedHeaderText: {
        fontSize: Math.min(windowWidth * 0.06, 24),
        fontWeight: 'bold',
        marginLeft: '2%',
      },
      inputsContainer: {
        flex: 3, // Takes 4 parts out of 9 total (roughly 40%)
        marginVertical: 10,
      },
      inputContainer: {
        flex: 1,
        marginVertical: 5,
        maxHeight: 90,
      },
      label: {
        fontSize: Math.min(windowWidth * 0.04, 16),
        color: '#333',
        marginBottom: 5,
      },
      input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
      },
      pickerContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#ffffff',
        overflow: 'hidden',
      },
      picker: {
        flex: 1,
      },
      calculateButton: {
        backgroundColor: '#1E4E75',
        borderRadius: 8,
        alignItems: 'center',
      },
      calculateButtonText: {
        color: '#ffffff',
        fontSize: Math.min(windowWidth * 0.045, 18),
        fontWeight: 'bold',
      },
      meterContainer: {
        flex: 4, // Takes 4 parts out of 9 total (roughly 40%)
        backgroundColor: '#ffffff',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      meterContentContainer: {
        flex: 1,
        width: '50%',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      thermometerSize: {
        flex: 1,
        width: '90%',
      },
      resultLabel: {
        fontSize: Math.min(windowWidth * 0.04, 16),
        textAlign: 'center',
      },
      resultNote: {
        fontSize: Math.min(windowWidth * 0.035, 14),
        textAlign: 'center',
        color: '#667',
      }
    });

export default SectionDetails;