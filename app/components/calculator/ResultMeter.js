import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ResultMeter = ({ selectedCalculator, resultValue }) => {
  if (!selectedCalculator) return null;

  // Special handling for calculator #3 (Nutrition)
  if (selectedCalculator.id === '3' && resultValue && resultValue.food) {
    const { food, servingSize, carbonEmission, alert, suggestions } = resultValue;
    
    // Calculate nutrition values for serving size
    const multiplier = servingSize / 100;
    const calories = Math.round(food.calories * multiplier);
    const protein = Math.round(food.protein * multiplier);
    const fiber = Math.round(food.fiber * multiplier);
    
    const getSustainabilityColor = (score) => {
      if (score >= 8) return '#4CAF50';
      if (score >= 5) return '#FF9800';
      return '#f44336';
    };
    
    const getNutritionColor = (score) => {
      if (score >= 8) return '#4CAF50';
      if (score >= 5) return '#FF9800';
      return '#f44336';
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Your Nutrition Impact</Text>

        {/* Food Name & Category */}
        <View style={styles.foodHeader}>
          <Text style={styles.foodName}>{food.name}</Text>
          <Text style={styles.foodCategory}>{food.category}</Text>
        </View>

        {/* CO2 Emission */}
        <View style={styles.resultContainer}>
          <Text style={styles.resultValue}>{carbonEmission} kg CO₂</Text>
          <Text style={styles.servingText}>for {servingSize}g serving</Text>
        </View>

        {/* Scores Row */}
        <View style={styles.scoresRow}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Sustainability</Text>
            <Text style={[styles.scoreValue, { color: getSustainabilityColor(food.sustainabilityScore) }]}>
              🌱 {food.sustainabilityScore}/10
            </Text>
          </View>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreLabel}>Nutrition</Text>
            <Text style={[styles.scoreValue, { color: getNutritionColor(food.nutritionScore) }]}>
              ⭐ {food.nutritionScore}/10
            </Text>
          </View>
        </View>

        {/* Nutrition Facts */}
        <View style={styles.nutritionBox}>
          <Text style={styles.nutritionTitle}>Nutrition Facts (per {servingSize}g)</Text>
          <View style={styles.nutritionRow}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionIcon}>🔥</Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
              <Text style={styles.nutritionValue}>{calories}</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionIcon}>💪</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>{protein}g</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionIcon}>🌿</Text>
              <Text style={styles.nutritionLabel}>Fiber</Text>
              <Text style={styles.nutritionValue}>{fiber}g</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionIcon}>💧</Text>
              <Text style={styles.nutritionLabel}>Water</Text>
              <Text style={styles.nutritionValue}>{food.water}%</Text>
            </View>
          </View>
          {food.vitamins && food.vitamins.length > 0 && (
            <View style={styles.vitaminsContainer}>
              <Text style={styles.vitaminsLabel}>Key Nutrients:</Text>
              <View style={styles.vitaminsList}>
                {food.vitamins.map((vitamin, index) => (
                  <View key={index} style={styles.vitaminBadge}>
                    <Text style={styles.vitaminText}>{vitamin}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Alert Section */}
        {alert && (
          <View style={[styles.alertBox, { 
            backgroundColor: alert.alertType === 'red' ? '#ffebee' : alert.alertType === 'yellow' ? '#fff3e0' : '#e8f5e9',
            borderColor: alert.alertType === 'red' ? '#f44336' : alert.alertType === 'yellow' ? '#ff9800' : '#4caf50'
          }]}>
            <Text style={styles.alertIcon}>{alert.icon}</Text>
            <Text style={[styles.alertTitle, { 
              color: alert.alertType === 'red' ? '#c62828' : alert.alertType === 'yellow' ? '#e65100' : '#2e7d32' 
            }]}>{alert.title}</Text>
            <Text style={styles.alertMessage}>{alert.message}</Text>
          </View>
        )}

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsBox}>
            <Text style={styles.suggestionsTitle}>💡 Better Alternatives:</Text>
            {suggestions.map((suggestion, index) => (
              <View key={index} style={styles.suggestionItem}>
                <Text style={styles.suggestionName}>{suggestion.name}</Text>
                <Text style={styles.suggestionDetails}>
                  {suggestion.carbonPerKg.toFixed(1)} kg CO₂/kg • Sustainability: {suggestion.sustainabilityScore}/10
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  }

  // Default rendering for other calculators

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
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E4E75',
    marginBottom: 10,
  },
  foodHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  foodName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E4E75',
  },
  foodCategory: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  resultContainer: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  resultValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E4E75',
    textAlign: 'center',
  },
  servingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 15,
  },
  scoreCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    width: '45%',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  nutritionBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  nutritionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E4E75',
    marginBottom: 12,
    textAlign: 'center',
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  nutritionItem: {
    alignItems: 'center',
    width: '25%',
    marginBottom: 10,
  },
  nutritionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#666',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  vitaminsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  vitaminsLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  vitaminsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vitaminBadge: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    margin: 3,
  },
  vitaminText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
  },
  alertBox: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    marginVertical: 10,
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  alertMessage: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
  suggestionsBox: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#add8e6',
    marginTop: 10,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  suggestionItem: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#4caf50',
  },
  suggestionName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  suggestionDetails: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
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
