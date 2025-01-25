import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, BackHandler } from 'react-native';

const decisions = [
  {
    scenario: "🌞 A drought has hit your region. Crops are wilting! What will you do?",
    options: [
      { text: "💧 Invest in irrigation systems", cost: 40, food: 30, environment: 15 },
      { text: "🚢 Import food", cost: 50, food: 40, environment: -10 },
      { text: "🤷 Do nothing", cost: 0, food: -30, environment: 0 },
    ],
  },
  {
    scenario: "🐛 Pests are destroying crops! How will you respond?",
    options: [
      { text: "🧪 Use chemical pesticides", cost: 30, food: 25, environment: -20 },
      { text: "🌱 Introduce natural predators", cost: 20, food: 20, environment: 20 },
      { text: "❌ Ignore the issue", cost: 0, food: -20, environment: -10 },
    ],
  },
  {
    scenario: "🌧️ Heavy rainfall has flooded fields. What’s your solution?",
    options: [
      { text: "🚜 Drain water and replant", cost: 30, food: 20, environment: 10 },
      { text: "🌾 Plant flood-resistant crops", cost: 25, food: 15, environment: 20 },
      { text: "😔 Abandon flooded fields", cost: 0, food: -25, environment: 0 },
    ],
  },
  {
    scenario: "📉 Your budget is shrinking. How will you recover funds?",
    options: [
      { text: "🔧 Cut sustainable programs", cost: 20, food: -10, environment: -30 },
      { text: "📈 Raise taxes", cost: -50, food: -20, environment: 10 },
      { text: "🌍 Seek international aid", cost: -60, food: 30, environment: 0 },
    ],
  },
  {
    scenario: "🌱 Soil fertility is declining. How will you improve it?",
    options: [
      { text: "🧪 Add synthetic fertilizers", cost: 30, food: 35, environment: -15 },
      { text: "♻️ Use compost", cost: 25, food: 25, environment: 20 },
      { text: "⏳ Let soil recover naturally", cost: 0, food: -15, environment: 15 },
    ],
  },
  {
    scenario: "👨‍👩‍👧 Population growth is increasing food demand. What’s your plan?",
    options: [
      { text: "🌾 Expand farmland", cost: 60, food: 50, environment: -30 },
      { text: "🏙️ Promote urban farming", cost: 25, food: 20, environment: 15 },
      { text: "🚢 Import food", cost: 40, food: 30, environment: -10 },
    ],
  },
  {
    scenario: "🔥 Climate change is causing extreme weather. What’s your strategy?",
    options: [
      { text: "🌾 Develop resilient crops", cost: 50, food: 30, environment: 15 },
      { text: "💧 Build water reservoirs", cost: 60, food: 20, environment: 25 },
      { text: "🔄 Diversify farming methods", cost: 30, food: 15, environment: 20 },
    ],
  },
];

export default function Game({ onExit }) {
  const [currentYear, setCurrentYear] = useState(1);
  const [metrics, setMetrics] = useState({ food: 100, environment: 100, budget: 100 });
  const [currentScenario, setCurrentScenario] = useState(0);

  useEffect(() => {
    const handleBackPress = () => {
      resetGame();
      onExit();
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove();
  }, [onExit]);

  const handleDecision = (option) => {
    const newMetrics = {
      food: Math.max(0, metrics.food + option.food),
      environment: Math.max(0, metrics.environment + option.environment),
      budget: Math.max(0, metrics.budget - option.cost),
    };

    if (Object.values(newMetrics).some((metric) => metric <= 0)) {
      Alert.alert(
        "💔 Game Over",
        "One of your resources dropped to zero! Unfortunately, your region couldn’t survive the challenges.",
        [{ text: "Try Again", onPress: resetGame }]
      );
      return;
    }

    setMetrics(newMetrics);
    const nextScenario = (currentScenario + 1) % decisions.length;

    if (currentYear === 10) {
      Alert.alert(
        "🎉 Congratulations!",
        `You successfully managed your region for 10 years! 🌟\n\n
         Final Scores:\n🌾 Food Security: ${newMetrics.food}\n🌿 Environment: ${newMetrics.environment}\n💰 Budget: ${newMetrics.budget}\n\nYour leadership was inspiring!`,
        [{ text: "Play Again", onPress: resetGame }]
      );
      return;
    }

    setCurrentScenario(nextScenario);
    setCurrentYear(currentYear + 1);
  };

  const resetGame = () => {
    setMetrics({ food: 100, environment: 100, budget: 100 });
    setCurrentScenario(0);
    setCurrentYear(1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.yearText}>📅 Year: {currentYear} / 10</Text>
      <Text style={styles.scenarioText}>{decisions[currentScenario].scenario}</Text>
      {decisions[currentScenario].options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => handleDecision(option)}
        >
          <Text style={styles.optionText}>{option.text}</Text>
        </TouchableOpacity>
      ))}
      <View style={styles.metricsContainer}>
        <Text style={styles.metricText}>🌾 Food Security: {metrics.food}</Text>
        <Text style={styles.metricText}>🌿 Environment: {metrics.environment}</Text>
        <Text style={styles.metricText}>💰 Budget: {metrics.budget}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f1f8e9',
  },
  yearText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: 20,
  },
  scenarioText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#c8e6c9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: '#004d40',
  },
  metricsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  metricText: {
    fontSize: 16,
    color: '#1b5e20',
    marginVertical: 5,
  },
  exitButton: {
    backgroundColor: '#e57373',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  exitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
