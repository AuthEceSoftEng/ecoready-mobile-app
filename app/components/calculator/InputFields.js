import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Correct Picker import
import Slider from '@react-native-community/slider';
import foodDatabase from '../../data/foodNutritionDB.json';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const InputFields = ({ selectedCalculator, inputs, setInputs, handleCalculate }) => {
    const [sliderTempValues, setSliderTempValues] = useState({});
    
    // Get foods filtered by category - memoize based on category
    const getFoodsForCategory = (category) => {
      if (!category) return foodDatabase.foods;
      return foodDatabase.foods.filter(f => f.category === category);
    };
    
    // Get current food options based on selected category
    const currentFoodOptions = React.useMemo(() => {
      return getFoodsForCategory(inputs.foodCategory).map(f => ({ label: f.name, value: f.id }));
    }, [inputs.foodCategory]);
    
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
            options: currentFoodOptions,
            defaultOption: 'Select Food',
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



  return (
    <View style={styles.container}>
      {inputFields[selectedCalculator.id]?.map((field) => (
        <View key={field.key} style={styles.inputContainer}>
          <Text style={styles.label}>{field.label}:</Text>
          {field.type === 'number' ? (
            <TextInput
                style={[styles.input, inputs[field.key] === '' ? styles.inputError : null]} 
                keyboardType="numeric"
                placeholder={field.placeholder || "Enter value"}
                value={inputs[field.key] ?? ''} // Ensures empty state is handled
                onChangeText={(value) => {
                setInputs((prev) => ({ ...prev, [field.key]: value }));
                }}
                onBlur={() => {
                if (inputs[field.key] === '') {
                    setInputs((prev) => ({ ...prev, [field.key]: '' })); // Keep it empty instead of setting a default
                }
                }}
            />          
          ) : field.type === 'slider' ? (
            <View style={styles.sliderWrapper}>
              <Text style={styles.sliderValue}>
                {sliderTempValues[field.key] ?? inputs[field.key] ?? 0}
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={field.min}
                maximumValue={field.max}
                step={field.step}
                value={inputs[field.key] ?? 0}
                onValueChange={(value) => {
                  setSliderTempValues((prev) => ({ ...prev, [field.key]: value }));
                }}
                onSlidingComplete={(value) => {
                  setInputs((prev) => ({ ...prev, [field.key]: value }));
                  setSliderTempValues((prev) => ({ ...prev, [field.key]: null }));
                }}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#ddd"
                thumbTintColor="#FF9800"
                thumbStyle={styles.thumbStyle}
                trackStyle={styles.trackStyle}
              />
            </View>
          ) : (
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={inputs[field.key] || ""}
                    onValueChange={(value) => {
                        if (value === "") return; // Ignore selecting the placeholder
                        
                        // Reset food item when category changes
                        if (field.key === 'foodCategory') {
                          setInputs((prev) => ({
                            ...prev,
                            [field.key]: value,
                            foodItem: '', // Reset food selection when category changes
                          }));
                        } else {
                          setInputs((prev) => ({
                            ...prev,
                            [field.key]: value,
                          }));
                        }
                    }}
                    style={styles.picker}
                >
                    <Picker.Item label={field.defaultOption} value="" color="#999" />
                    {field.options.map((option) => (
                        <Picker.Item key={option.value} label={option.label} value={option.value} />
                    ))}
                </Picker>
            </View>
          )}
        </View>
      ))}

      <TouchableOpacity onPress={handleCalculate} style={styles.calculateButton}>
        <Text style={styles.calculateButtonText}>Calculate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: '5%',
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      textAlign: 'center',
      letterSpacing: 1.2,
      color: '#1E4E75',
      marginBottom: 15,
    },
    inputContainer: {
      width: '100%',
      marginBottom: 15,
      alignItems: 'center',
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
      marginBottom: 5,
      textAlign: 'center',
    },
    input: {
      width: '100%',
      padding: 12,
      borderWidth: 2,
      borderColor: '#B0C4DE',
      borderRadius: 12,
      backgroundColor: '#F8FAFC',
      fontSize: 16,
      textAlign: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    sliderWrapper: {
      width: '100%',
      paddingVertical: 10,
      backgroundColor: '#E3F2FD', // Light blue background for better contrast
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 4,
    },
    slider: {
      width: '90%',
      height: 45,
    },
    trackStyle: {
      height: 14, // Thicker track for better visibility
      borderRadius: 7,
      backgroundColor: '#4A90E2', // Modern blue track
    },
    thumbStyle: {
      width: 32,
      height: 32,
      backgroundColor: '#1E4E75', // Darker blue thumb
      borderRadius: 50,
      borderColor: '#fff',
      borderWidth: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 4,
    },
    inputError: {
        borderColor: 'red', 
        borderWidth: 2, 
        backgroundColor: '#FFE5E5', // Light red to highlight missing input
      },
    sliderValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#1E4E75', // Matches thumb color for consistency
      marginBottom: 5,
    },
    calculateButton: {
      width: '90%',
      backgroundColor: '#1E4E75',
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    calculateButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    pickerContainer: {
      width: '100%',
      borderWidth: 2,
      borderColor: '#1E4E75',
      borderRadius: 12,
      backgroundColor: '#fff',
      overflow: 'hidden',
      marginBottom: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    picker: {
      width: '100%',
      height: 55,
      backgroundColor: '#fff',
      color: '#1E4E75',
    },
  });
    

export default InputFields;