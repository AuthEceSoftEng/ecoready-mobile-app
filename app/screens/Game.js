import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  BackHandler,
  Modal,
  ScrollView,
  Dimensions,
  useWindowDimensions,
  Platform,
  StatusBar,
  SafeAreaView
} from 'react-native';
import FeedbackModal from '../components/FeedbackModal';
import { shouldShowFeedback, incrementSessionCounter, resetFeedbackCounters } from '../utils/feedbackFrequency';

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
    scenario: "🌧️ Heavy rainfall has flooded fields. What's your solution?",
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
    scenario: "👨‍👩‍👧 Population growth is increasing food demand. What's your plan?",
    options: [
      { text: "🌾 Expand farmland", cost: 60, food: 50, environment: -30 },
      { text: "🏙️ Promote urban farming", cost: 25, food: 20, environment: 15 },
      { text: "🚢 Import food", cost: 40, food: 30, environment: -10 },
    ],
  },
  {
    scenario: "🔥 Climate change is causing extreme weather. What's your strategy?",
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
  const [instructionsVisible, setInstructionsVisible] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Get dynamic window dimensions for responsive layout
  const { width, height } = useWindowDimensions();

  // Calculate responsive sizes based on device dimensions
  const getFontSize = (baseSize) => {
    const scaleFactor = Math.min(width, height) / 400; // Reference width
    return Math.round(baseSize * scaleFactor);
  };

  // Get proper padding based on device size
  const getHorizontalPadding = () => {
    return width * 0.03; // Reduced from 5% to 3% of screen width
  };

  // Get button width based on screen size
  const getButtonWidth = () => {
    return width > 600 ? '70%' : '90%'; // Increased from 85% to 90% on smaller screens
  };

  useEffect(() => {
    const handleBackPress = () => {
      resetGame();
      onExit();
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => backHandler.remove();
  }, [onExit]);

  const handleDecision = async (option) => {
    const newMetrics = {
      food: Math.max(0, metrics.food + option.food),
      environment: Math.max(0, metrics.environment + option.environment),
      budget: Math.max(0, metrics.budget - option.cost),
    };

    if (Object.values(newMetrics).some((metric) => metric <= 0)) {
      await incrementSessionCounter();
      const shouldShow = await shouldShowFeedback();
      Alert.alert(
        "💔 Game Over",
        "One of your resources dropped to zero! Unfortunately, your region couldn't survive the challenges.",
        [
          { 
            text: "Try Again", 
            onPress: () => {
              if (shouldShow) {
                setShowFeedbackModal(true);
              }
              resetGame();
            }
          },
          {
            text: "🎮 Back to Game Hub",
            style: "cancel",
            onPress: () => {
              if (shouldShow) {
                setShowFeedbackModal(true);
              }
              resetGame();
              onExit();
            }
          }
        ]
      );
      return;
    }

    setMetrics(newMetrics);
    const nextScenario = (currentScenario + 1) % decisions.length;

    if (currentYear === 10) {
      await incrementSessionCounter();
      const shouldShow = await shouldShowFeedback();
      Alert.alert(
        "🎉 Congratulations!",
        `You successfully managed your region for 10 years! 🌟\n\n
         Final Scores:\n🌾 Food Security: ${newMetrics.food}\n🌿 Environment: ${newMetrics.environment}\n💰 Budget: ${newMetrics.budget}\n\nYour leadership was inspiring!`,
        [
          { 
            text: "Play Again", 
            onPress: () => {
              if (shouldShow) {
                setShowFeedbackModal(true);
              }
              resetGame();
            }
          },
          {
            text: "🎮 Back to Game Hub",
            style: "cancel",
            onPress: () => {
              if (shouldShow) {
                setShowFeedbackModal(true);
              }
              resetGame();
              onExit();
            }
          }
        ]
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
    setShowFeedbackModal(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[
        styles.container,
        { paddingHorizontal: getHorizontalPadding() }
      ]}>
        <Text style={[
          styles.mainTitle,
          { fontSize: getFontSize(22) }
        ]}>🌍 Eco Strategy Game 🌱</Text>

        {/* Instructions Button */}
        <TouchableOpacity
          style={[
            styles.instructionsButton,
            { paddingVertical: Math.max(6, height * 0.008) }
          ]}
          onPress={() => setInstructionsVisible(true)}
        >
          <Text style={[
            styles.instructionsButtonText,
            { fontSize: getFontSize(12) }
          ]}>ℹ️ How to Play</Text>
        </TouchableOpacity>

        <Text style={[
          styles.yearText,
          { fontSize: getFontSize(18), marginBottom: height * 0.01 }
        ]}>📅 Year: {currentYear} / 10</Text>

        <Text style={[
          styles.scenarioText,
          {
            fontSize: getFontSize(16),
            paddingHorizontal: width * 0.02,
            marginBottom: height * 0.015
          }
        ]}>{decisions[currentScenario].scenario}</Text>

        <ScrollView
          style={{ width: '100%' }}
          contentContainerStyle={{ alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          {decisions[currentScenario].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                {
                  width: getButtonWidth(),
                  paddingVertical: height * 0.018,
                  paddingHorizontal: width * 0.04
                }
              ]}
              onPress={() => handleDecision(option)}
            >
              <Text style={[
                styles.optionText,
                { fontSize: getFontSize(16) }
              ]}>{option.text}</Text>

              <View style={styles.impactContainer}>
                <Text style={[
                  styles.impactText,
                  option.cost > 0 ? styles.negativeImpact : styles.positiveImpact,
                  { fontSize: getFontSize(14) }
                ]}>
                  💰 {option.cost > 0 ? `-${option.cost}` : `+${Math.abs(option.cost)}`}
                </Text>
                <Text style={[
                  styles.impactText,
                  option.food < 0 ? styles.negativeImpact : styles.positiveImpact,
                  { fontSize: getFontSize(14) }
                ]}>
                  🌾 {option.food > 0 ? `+${option.food}` : option.food}
                </Text>
                <Text style={[
                  styles.impactText,
                  option.environment < 0 ? styles.negativeImpact : styles.positiveImpact,
                  { fontSize: getFontSize(14) }
                ]}>
                  🌿 {option.environment > 0 ? `+${option.environment}` : option.environment}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <View style={[
            styles.metricsContainer,
            { marginTop: height * 0.01, marginBottom: height * 0.02 }
          ]}>
            <Text style={[
              styles.metricsTitle,
              { fontSize: getFontSize(16) }
            ]}>Current Status</Text>

            <View style={styles.metricsGrid}>
              <View style={styles.metricPillar}>
                <Text style={styles.metricEmoji}>🌾</Text>
                <Text style={[
                  styles.metricLabel,
                  { fontSize: getFontSize(12) }
                ]}>Food</Text>
                <View style={[
                  styles.metricValueContainer,
                  {
                    backgroundColor: metrics.food < 40 ? '#ffcdd2' : metrics.food > 70 ? '#c8e6c9' : '#fff9c4',
                    width: 40,
                    height: 40
                  }
                ]}>
                  <Text style={[
                    styles.metricValue,
                    { fontSize: getFontSize(15) }
                  ]}>{metrics.food}</Text>
                </View>
              </View>

              <View style={styles.metricPillar}>
                <Text style={styles.metricEmoji}>🌿</Text>
                <Text style={[
                  styles.metricLabel,
                  { fontSize: getFontSize(12) }
                ]}>Envir.</Text>
                <View style={[
                  styles.metricValueContainer,
                  {
                    backgroundColor: metrics.environment < 40 ? '#ffcdd2' : metrics.environment > 70 ? '#c8e6c9' : '#fff9c4',
                    width: 40,
                    height: 40
                  }
                ]}>
                  <Text style={[
                    styles.metricValue,
                    { fontSize: getFontSize(15) }
                  ]}>{metrics.environment}</Text>
                </View>
              </View>

              <View style={styles.metricPillar}>
                <Text style={styles.metricEmoji}>💰</Text>
                <Text style={[
                  styles.metricLabel,
                  { fontSize: getFontSize(12) }
                ]}>Budget</Text>
                <View style={[
                  styles.metricValueContainer,
                  {
                    backgroundColor: metrics.budget < 40 ? '#ffcdd2' : metrics.budget > 70 ? '#c8e6c9' : '#fff9c4',
                    width: 40,
                    height: 40
                  }
                ]}>
                  <Text style={[
                    styles.metricValue,
                    { fontSize: getFontSize(15) }
                  ]}>{metrics.budget}</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Instructions Modal */}
      <Modal
        visible={instructionsVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setInstructionsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent,
            {
              width: width > 600 ? '70%' : '85%',
              maxHeight: height * 0.8,
              padding: width * 0.05
            }
          ]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[
                styles.modalTitle,
                { fontSize: getFontSize(24) }
              ]}>🎮 How to Play</Text>

              <Text style={[
                styles.instructionSubtitle,
                { fontSize: getFontSize(18) }
              ]}>🎯 Goal</Text>
              <Text style={[
                styles.instructionText,
                { fontSize: getFontSize(16) }
              ]}>
                Manage your region through 10 years of environmental challenges while balancing three key resources:
              </Text>
              <View style={[
                styles.resourceExplanation,
                { padding: width * 0.03, marginVertical: height * 0.015 }
              ]}>
                <Text style={[
                  styles.resourceItem,
                  { fontSize: getFontSize(15) }
                ]}>🌾 <Text style={styles.bold}>Food Security</Text> - The ability to feed your population</Text>
                <Text style={[
                  styles.resourceItem,
                  { fontSize: getFontSize(15) }
                ]}>🌿 <Text style={styles.bold}>Environment</Text> - The health of your ecosystem</Text>
                <Text style={[
                  styles.resourceItem,
                  { fontSize: getFontSize(15) }
                ]}>💰 <Text style={styles.bold}>Budget</Text> - The financial resources available</Text>
              </View>

              <Text style={[
                styles.instructionSubtitle,
                { fontSize: getFontSize(18) }
              ]}>🎲 Gameplay</Text>
              <Text style={[
                styles.instructionText,
                { fontSize: getFontSize(16) }
              ]}>
                1. Each year, you'll face a different environmental challenge.
              </Text>
              <Text style={[
                styles.instructionText,
                { fontSize: getFontSize(16) }
              ]}>
                2. Choose one of three responses to address the challenge.
              </Text>
              <Text style={[
                styles.instructionText,
                { fontSize: getFontSize(16) }
              ]}>
                3. Each choice will impact your resources - pay attention to the numbers:
              </Text>
              <View style={[
                styles.exampleContainer,
                { padding: width * 0.03, marginVertical: height * 0.015 }
              ]}>
                <Text style={[
                  styles.exampleText,
                  { fontSize: getFontSize(15) }
                ]}>
                  <Text style={styles.bold}>💰 -40</Text>: Costs 40 budget points
                </Text>
                <Text style={[
                  styles.exampleText,
                  { fontSize: getFontSize(15) }
                ]}>
                  <Text style={styles.bold}>🌾 +30</Text>: Increases food security by 30
                </Text>
                <Text style={[
                  styles.exampleText,
                  { fontSize: getFontSize(15) }
                ]}>
                  <Text style={styles.bold}>🌿 -15</Text>: Decreases environmental health by 15
                </Text>
              </View>

              <Text style={[
                styles.instructionSubtitle,
                { fontSize: getFontSize(18) }
              ]}>⚠️ Game Over</Text>
              <Text style={[
                styles.instructionText,
                { fontSize: getFontSize(16) }
              ]}>
                If any resource drops to zero, your region fails and the game ends.
              </Text>

              <Text style={[
                styles.instructionSubtitle,
                { fontSize: getFontSize(18) }
              ]}>🏆 Victory</Text>
              <Text style={[
                styles.instructionText,
                { fontSize: getFontSize(16) }
              ]}>
                Successfully manage your region for all 10 years to win!
              </Text>

              <Text style={[
                styles.instructionSubtitle,
                { fontSize: getFontSize(18) }
              ]}>💡 Strategy Tips</Text>
              <Text style={[
                styles.instructionText,
                { fontSize: getFontSize(16) }
              ]}>
                • Balance short-term gains with long-term sustainability
              </Text>
              <Text style={[
                styles.instructionText,
                { fontSize: getFontSize(16) }
              ]}>
                • Environmental health is crucial for food production
              </Text>
              <Text style={[
                styles.instructionText,
                { fontSize: getFontSize(16) }
              ]}>
                • Budget allows you to respond to emergencies
              </Text>
              <Text style={[
                styles.instructionText,
                { fontSize: getFontSize(16) }
              ]}>
                • Sometimes doing nothing can be better than a costly intervention
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.closeButton,
                {
                  paddingVertical: height * 0.015,
                  paddingHorizontal: width * 0.05,
                  marginTop: height * 0.02
                }
              ]}
              onPress={() => setInstructionsVisible(false)}
            >
              <Text style={[
                styles.closeButtonText,
                { fontSize: getFontSize(16) }
              ]}>Got it!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Feedback Modal */}
      <FeedbackModal
        visible={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          resetFeedbackCounters();
        }}
        context="game"
        contextId="resource-management"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1f8e9',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f1f8e9',
  },
  yearText: {
    fontWeight: 'bold',
    color: '#388e3c',
    marginBottom: '4%',
  },
  scenarioText: {
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: '4%',
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#c8e6c9',
    borderRadius: 8,
    marginBottom: '3%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  optionText: {
    color: '#004d40',
    marginBottom: '2%',
    textAlign: 'center',
  },
  impactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '2%',
  },
  impactText: {
    fontWeight: 'bold',
  },
  positiveImpact: {
    color: '#2e7d32',
  },
  negativeImpact: {
    color: '#c62828',
  },
  metricsContainer: {
    marginTop: '5%',
    alignItems: 'center',
    paddingVertical: '3%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 8,
    width: '90%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  metricsTitle: {
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: '3%',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: '2%',
  },
  metricPillar: {
    alignItems: 'center',
    width: '30%',
  },
  metricEmoji: {
    fontSize: 20,
    marginBottom: '2%',
  },
  metricLabel: {
    color: '#1b5e20',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: '2%',
  },
  metricValueContainer: {
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#388e3c',
  },
  metricValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  exitButton: {
    backgroundColor: '#e57373',
    borderRadius: 8,
    marginTop: '5%',
  },
  exitText: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  mainTitle: {
    fontWeight: 'bold',
    color: '#2e7d32',
    marginVertical: '4%',
    textAlign: 'center',
  },
  instructionsButton: {
    backgroundColor: '#8bc34a',
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: '3%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  instructionsButtonText: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: '5%',
  },
  instructionSubtitle: {
    fontWeight: 'bold',
    color: '#388e3c',
    marginTop: '4%',
    marginBottom: '2%',
  },
  instructionText: {
    color: '#333',
    marginBottom: '1.5%',
    lineHeight: 22,
  },
  resourceExplanation: {
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
  },
  resourceItem: {
    color: '#1b5e20',
    marginVertical: '1%',
  },
  exampleContainer: {
    backgroundColor: '#f1f8e9',
    borderRadius: 8,
  },
  exampleText: {
    color: '#33691e',
    marginVertical: '1%',
  },
  bold: {
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  closeButtonText: {
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
});