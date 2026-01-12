import foodDatabase from '../data/foodNutritionDB.json';

/**
 * Get food data by ID
 */
export const getFoodById = (foodId) => {
  return foodDatabase.foods.find(food => food.id === foodId);
};

/**
 * Get food data by name (case-insensitive)
 */
export const getFoodByName = (foodName) => {
  const normalizedName = foodName.toLowerCase().trim();
  return foodDatabase.foods.find(
    food => food.name.toLowerCase() === normalizedName
  );
};

/**
 * Get all foods by category
 */
export const getFoodsByCategory = (category) => {
  return foodDatabase.foods.filter(food => food.category === category);
};

/**
 * Get all available categories
 */
export const getCategories = () => {
  const categories = [...new Set(foodDatabase.foods.map(food => food.category))];
  return categories.sort();
};

/**
 * Calculate combined sustainability + nutrition score
 */
export const calculateCombinedScore = (food) => {
  if (!food) return 0;
  // Weight: 60% sustainability, 40% nutrition
  return (food.sustainabilityScore * 0.6) + (food.nutritionScore * 0.4);
};

/**
 * Generate alert message based on food's carbon and nutrition profile
 */
export const generateAlert = (food, servingSize = 100) => {
  if (!food) return null;

  const { carbonPerKg, sustainabilityScore, nutritionScore } = food;
  const combinedScore = calculateCombinedScore(food);
  
  // Calculate carbon for serving
  const carbonForServing = (carbonPerKg * servingSize) / 1000;

  let alertType = 'green'; // green, yellow, red
  let title = '';
  let message = '';
  let icon = '🟢';

  // High carbon, low nutrition - RED ALERT
  if (sustainabilityScore <= 3 && nutritionScore <= 6) {
    alertType = 'red';
    icon = '🔴';
    title = 'High Impact, Consider Alternatives';
    message = `${food.name} has a high carbon footprint (${carbonPerKg} kg CO₂/kg) and limited nutritional benefits. Consider plant-based alternatives for better sustainability.`;
  }
  // High carbon, good nutrition - YELLOW ALERT
  else if (sustainabilityScore <= 4 && nutritionScore >= 7) {
    alertType = 'yellow';
    icon = '🟡';
    title = 'Good Nutrition, High Carbon';
    message = `${food.name} is nutritious but has a significant carbon footprint (${carbonPerKg} kg CO₂/kg). Try to moderate consumption or choose similar foods with lower impact.`;
  }
  // Low carbon, low nutrition - YELLOW ALERT
  else if (sustainabilityScore >= 8 && nutritionScore <= 5) {
    alertType = 'yellow';
    icon = '🟡';
    title = 'Low Impact, Limited Nutrition';
    message = `${food.name} is eco-friendly (${carbonPerKg} kg CO₂/kg) but has limited nutritional value. Pair with nutrient-rich foods for a balanced meal.`;
  }
  // Excellent choice - GREEN ALERT
  else if (combinedScore >= 7.5) {
    alertType = 'green';
    icon = '🟢';
    title = 'Excellent Choice!';
    message = `${food.name} is both sustainable (${carbonPerKg} kg CO₂/kg) and nutritious. Great for your health and the planet!`;
  }
  // Good choice - GREEN ALERT
  else if (combinedScore >= 6) {
    alertType = 'green';
    icon = '🟢';
    title = 'Good Choice';
    message = `${food.name} offers a balanced combination of nutrition and sustainability (${carbonPerKg} kg CO₂/kg).`;
  }
  // Moderate choice - YELLOW ALERT
  else {
    alertType = 'yellow';
    icon = '🟡';
    title = 'Moderate Choice';
    message = `${food.name} has a moderate environmental and nutritional profile. Consider balancing with higher-rated foods.`;
  }

  return {
    alertType,
    icon,
    title,
    message,
    carbonForServing,
    combinedScore: combinedScore.toFixed(1),
  };
};

/**
 * Get alternative food suggestions with better sustainability
 */
export const getSuggestions = (currentFood, maxSuggestions = 3) => {
  if (!currentFood) return [];

  const { category, sustainabilityScore, carbonPerKg } = currentFood;
  const currentCombinedScore = calculateCombinedScore(currentFood);
  
  // Don't suggest alternatives if the food is already excellent (combined score >= 8.5)
  if (currentCombinedScore >= 8.5) {
    return [];
  }
  
  // Get foods from same category with ACTUALLY BETTER sustainability (lower carbon OR higher sustainability score)
  const alternatives = foodDatabase.foods.filter(food => 
    food.category === category && 
    food.id !== currentFood.id &&
    (food.sustainabilityScore > sustainabilityScore || food.carbonPerKg < carbonPerKg)
  );

  // Sort by combined score (best first)
  const sorted = alternatives.sort((a, b) => {
    const scoreA = calculateCombinedScore(a);
    const scoreB = calculateCombinedScore(b);
    return scoreB - scoreA;
  });

  // Return top suggestions with comparison data
  return sorted.slice(0, maxSuggestions).map(food => ({
    ...food,
    carbonReduction: ((currentFood.carbonPerKg - food.carbonPerKg) / currentFood.carbonPerKg * 100).toFixed(0),
    combinedScore: calculateCombinedScore(food).toFixed(1),
  }));
};

/**
 * Get comparison message between two foods
 */
export const compareFoods = (food1, food2) => {
  if (!food1 || !food2) return null;

  const carbonDiff = food1.carbonPerKg - food2.carbonPerKg;
  const carbonPercent = ((carbonDiff / food1.carbonPerKg) * 100).toFixed(0);
  
  const proteinDiff = food2.protein - food1.protein;
  const calorieDiff = food2.calories - food1.calories;

  let message = `${food2.name} vs ${food1.name}:\n`;
  
  if (carbonDiff > 0) {
    message += `✅ ${Math.abs(carbonPercent)}% less CO₂\n`;
  } else {
    message += `❌ ${Math.abs(carbonPercent)}% more CO₂\n`;
  }

  if (proteinDiff > 0) {
    message += `✅ ${proteinDiff}g more protein\n`;
  } else if (proteinDiff < 0) {
    message += `⚠️ ${Math.abs(proteinDiff)}g less protein\n`;
  } else {
    message += `= Equal protein\n`;
  }

  if (calorieDiff < 0) {
    message += `✅ ${Math.abs(calorieDiff)} fewer calories`;
  } else if (calorieDiff > 0) {
    message += `⚠️ ${calorieDiff} more calories`;
  } else {
    message += `= Equal calories`;
  }

  return message;
};

/**
 * Get nutrition quality badge
 */
export const getNutritionBadge = (nutritionScore) => {
  if (nutritionScore >= 9) return { label: 'Excellent', color: '#4CAF50', emoji: '⭐⭐⭐' };
  if (nutritionScore >= 7) return { label: 'Good', color: '#8BC34A', emoji: '⭐⭐' };
  if (nutritionScore >= 5) return { label: 'Fair', color: '#FFC107', emoji: '⭐' };
  return { label: 'Limited', color: '#FF9800', emoji: '○' };
};

/**
 * Get sustainability badge
 */
export const getSustainabilityBadge = (sustainabilityScore) => {
  if (sustainabilityScore >= 9) return { label: 'Excellent', color: '#4CAF50', emoji: '🌱🌱🌱' };
  if (sustainabilityScore >= 7) return { label: 'Good', color: '#8BC34A', emoji: '🌱🌱' };
  if (sustainabilityScore >= 5) return { label: 'Moderate', color: '#FFC107', emoji: '🌱' };
  if (sustainabilityScore >= 3) return { label: 'High Impact', color: '#FF9800', emoji: '⚠️' };
  return { label: 'Very High Impact', color: '#f44336', emoji: '🔴' };
};

/**
 * Search foods by query
 */
export const searchFoods = (query) => {
  if (!query || query.trim().length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().trim();
  
  return foodDatabase.foods.filter(food => 
    food.name.toLowerCase().includes(normalizedQuery) ||
    food.category.toLowerCase().includes(normalizedQuery)
  );
};

/**
 * Get all foods sorted by sustainability score
 */
export const getFoodsBySustainability = (ascending = false) => {
  const sorted = [...foodDatabase.foods].sort((a, b) => 
    ascending 
      ? a.sustainabilityScore - b.sustainabilityScore
      : b.sustainabilityScore - a.sustainabilityScore
  );
  return sorted;
};

/**
 * Get top eco-friendly foods
 */
export const getTopEcoFriendlyFoods = (limit = 10) => {
  return getFoodsBySustainability(false).slice(0, limit);
};

/**
 * Get foods to avoid (high carbon, low nutrition)
 */
export const getFoodsToAvoid = (limit = 10) => {
  const sorted = [...foodDatabase.foods].sort((a, b) => {
    const scoreA = calculateCombinedScore(a);
    const scoreB = calculateCombinedScore(b);
    return scoreA - scoreB; // Lowest scores first
  });
  return sorted.slice(0, limit);
};
