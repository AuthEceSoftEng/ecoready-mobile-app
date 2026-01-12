import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getNutritionBadge, getSustainabilityBadge } from '../utils/nutritionAlerts';

const NutritionCard = ({ food, servingSize = 100 }) => {
  if (!food) return null;

  const nutritionBadge = getNutritionBadge(food.nutritionScore);
  const sustainabilityBadge = getSustainabilityBadge(food.sustainabilityScore);

  // Calculate values for serving size
  const multiplier = servingSize / 100;
  const calories = Math.round(food.calories * multiplier);
  const protein = Math.round(food.protein * multiplier);
  const fiber = Math.round(food.fiber * multiplier);
  const carbonImpact = ((food.carbonPerKg * servingSize) / 1000).toFixed(2);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{food.name}</Text>
        <Text style={styles.category}>{food.category}</Text>
      </View>

      {/* Scores */}
      <View style={styles.scoresContainer}>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Sustainability</Text>
          <View style={styles.scoreValue}>
            <Text style={styles.scoreEmoji}>{sustainabilityBadge.emoji}</Text>
            <Text style={[styles.scoreBadge, { color: sustainabilityBadge.color }]}>
              {sustainabilityBadge.label}
            </Text>
          </View>
          <Text style={styles.scoreDetail}>{food.carbonPerKg} kg CO₂/kg</Text>
        </View>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Nutrition</Text>
          <View style={styles.scoreValue}>
            <Text style={styles.scoreEmoji}>{nutritionBadge.emoji}</Text>
            <Text style={[styles.scoreBadge, { color: nutritionBadge.color }]}>
              {nutritionBadge.label}
            </Text>
          </View>
          <Text style={styles.scoreDetail}>{food.nutritionScore}/10</Text>
        </View>
      </View>

      {/* Nutrition Facts */}
      <View style={styles.factsContainer}>
        <Text style={styles.factsTitle}>Nutrition Facts (per {servingSize}g)</Text>
        
        <View style={styles.factRow}>
          <View style={styles.factItem}>
            <MaterialIcons name="local-fire-department" size={20} color="#FF5722" />
            <Text style={styles.factLabel}>Calories</Text>
            <Text style={styles.factValue}>{calories}</Text>
          </View>
          
          <View style={styles.factItem}>
            <MaterialIcons name="fitness-center" size={20} color="#2196F3" />
            <Text style={styles.factLabel}>Protein</Text>
            <Text style={styles.factValue}>{protein}g</Text>
          </View>
        </View>

        <View style={styles.factRow}>
          <View style={styles.factItem}>
            <MaterialIcons name="eco" size={20} color="#4CAF50" />
            <Text style={styles.factLabel}>Fiber</Text>
            <Text style={styles.factValue}>{fiber}g</Text>
          </View>
          
          <View style={styles.factItem}>
            <MaterialIcons name="opacity" size={20} color="#03A9F4" />
            <Text style={styles.factLabel}>Water</Text>
            <Text style={styles.factValue}>{food.water}%</Text>
          </View>
        </View>

        {/* Carbon Impact */}
        <View style={styles.carbonContainer}>
          <MaterialIcons name="cloud" size={20} color="#666" />
          <Text style={styles.carbonLabel}>Carbon Impact:</Text>
          <Text style={styles.carbonValue}>{carbonImpact} kg CO₂</Text>
        </View>
      </View>

      {/* Vitamins & Nutrients */}
      {food.vitamins && food.vitamins.length > 0 && (
        <View style={styles.vitaminsContainer}>
          <Text style={styles.vitaminsTitle}>Key Nutrients</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E4E75',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  scoreValue: {
    alignItems: 'center',
    marginBottom: 4,
  },
  scoreEmoji: {
    fontSize: 18,
    marginBottom: 4,
  },
  scoreBadge: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  scoreDetail: {
    fontSize: 11,
    color: '#999',
  },
  factsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  factsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  factRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  factItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
  },
  factLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  factValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  carbonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  carbonLabel: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
  },
  carbonValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 6,
  },
  vitaminsContainer: {
    marginTop: 4,
  },
  vitaminsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  vitaminsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vitaminBadge: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
  },
  vitaminText: {
    fontSize: 11,
    color: '#1976D2',
    fontWeight: '500',
  },
});

export default NutritionCard;
