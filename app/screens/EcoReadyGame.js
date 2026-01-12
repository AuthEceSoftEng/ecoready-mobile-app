import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Animated,
  Dimensions,
  BackHandler,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import FeedbackModal from '../components/FeedbackModal';
import { shouldShowFeedback, incrementSessionCounter, resetFeedbackCounters } from '../utils/feedbackFrequency';

const { width, height } = Dimensions.get('window');

const gameData = {
  completedScenarios: [],
  scenarios: [
    {
      id: 1,
      title: "Thirsty Planet Agriculture",
      description: "A severe, prolonged drought grips your region, threatening crops and water supplies.",
      backgroundColor: '#D4A373',
      initialStats: { food: 60, biodiversity: 65, wellbeing: 60, resilience: 40 },
      decisions: [
        {
          level: "Community Initiative",
          prompt: "The town's reservoir is critically low. What is the immediate priority?",
          options: [
            { 
              text: "Invest in water-saving tech for farms.", 
              effects: { food: 5, biodiversity: 0, wellbeing: 5, resilience: 15 }, 
              feedback: "Smart move! Improving efficiency helps everyone in the long run." 
            },
            { 
              text: "Allocate subsidies for water-intensive export crops to protect the economy.", 
              effects: { food: -20, biodiversity: -15, wellbeing: -10, resilience: -20 }, 
              feedback: "This strains water resources further, creating conflict and harming the environment." 
            },
            { 
              text: "Promote planting of drought-tolerant crops like millet and sorghum.", 
              effects: { food: 15, biodiversity: 10, wellbeing: 10, resilience: 10 }, 
              feedback: "Adapting crops to the new reality is key to future food security." 
            }
          ]
        },
        {
          level: "Policy Choice",
          prompt: "A regional policy is up for debate. Which do you support?",
          options: [
            { 
              text: "Enforce strict water resource management policies.", 
              effects: { food: 10, biodiversity: 5, wellbeing: -5, resilience: 20 }, 
              feedback: "A tough but necessary choice that builds long-term resilience, even if unpopular." 
            },
            { 
              text: "Permit unregulated water use to support short-term agricultural output.", 
              effects: { food: 5, biodiversity: -20, wellbeing: 0, resilience: -25 }, 
              feedback: "Unregulated use leads to a rapid depletion of aquifers, making future droughts even more devastating." 
            },
            { 
              text: "Launch a public awareness campaign on water conservation.", 
              effects: { food: 0, biodiversity: 5, wellbeing: 10, resilience: 5 }, 
              feedback: "Awareness helps, but without concrete policies, its impact is limited during a severe crisis." 
            }
          ]
        }
      ],
      quiz: {
        question: "Which region of Europe is most at risk of desertification under climate change?",
        answers: ["Mediterranean Europe", "Northern Europe", "Equally across all of Europe"],
        correct: 0,
        explanation: "Southern and Mediterranean parts of Europe face the highest desertification risk as the climate warms, due to increasing temperatures and prolonged droughts."
      }
    },
    {
      id: 2,
      title: "The Pollinator Crash",
      description: "Local bee and butterfly populations have plummeted, and yields of fruits and vegetables are suffering.",
      backgroundColor: '#C1DBB3',
      initialStats: { food: 50, biodiversity: 30, wellbeing: 50, resilience: 45 },
      decisions: [
        {
          level: "Farm-level Decision",
          prompt: "As a community leader, how do you advise local farmers to respond?",
          options: [
            { 
              text: "Encourage planting wildflower corridors between fields.", 
              effects: { food: 5, biodiversity: 20, wellbeing: 5, resilience: 10 }, 
              feedback: "An excellent strategy! This provides vital habitat and food for remaining pollinators, boosting biodiversity." 
            },
            { 
              text: "Suggest an increased, targeted use of chemical pesticides to control other pests.", 
              effects: { food: -5, biodiversity: -25, wellbeing: -5, resilience: -15 }, 
              feedback: "This worsens the problem, further harming non-target pollinators and degrading the ecosystem." 
            },
            { 
              text: "Rely on expensive hand-pollination for high-value crops.", 
              effects: { food: 0, biodiversity: -5, wellbeing: -10, resilience: -5 }, 
              feedback: "A costly short-term fix that doesn't address the root cause of pollinator decline." 
            }
          ]
        },
        {
          level: "Regional Policy",
          prompt: "A new regional budget is being set. What should be the priority for agriculture?",
          options: [
            { 
              text: "Subsidize intensive monoculture farming to maximize staple grain output.", 
              effects: { food: 10, biodiversity: -20, wellbeing: 0, resilience: -10 }, 
              feedback: "This maximizes grain but destroys the diverse habitats pollinators need to survive." 
            },
            { 
              text: "Fund research into organic and biodiversity-friendly farming practices.", 
              effects: { food: 5, biodiversity: 15, wellbeing: 10, resilience: 20 }, 
              feedback: "Investing in knowledge and sustainable methods creates a more resilient and healthy food system for the future." 
            },
            { 
              text: "Ban the most harmful pesticides known to affect bees.", 
              effects: { food: 0, biodiversity: 25, wellbeing: 5, resilience: 15 }, 
              feedback: "A bold and effective move! Protecting pollinators directly safeguards biodiversity and future crop yields." 
            }
          ]
        }
      ],
      quiz: {
        question: "Roughly what proportion of European crops benefit from animal pollinators like bees?",
        answers: ["Over 80%", "Around 10%", "None"],
        correct: 0,
        explanation: "About 84% of crop species in the EU are at least partially dependent on insect pollinators, linking biodiversity directly to farm productivity."
      }
    },
    {
      id: 3,
      title: "Food Nationalism",
      description: "Following global supply chain shocks, countries are imposing trade restrictions. Imported goods are scarce and expensive.",
      backgroundColor: '#8D99AE',
      initialStats: { food: 40, biodiversity: 60, wellbeing: 35, resilience: 30 },
      decisions: [
        {
          level: "Community Action",
          prompt: "Essential imported foods are unavailable. How does your community adapt?",
          options: [
            { 
              text: "Establish community gardens and a local food exchange network.", 
              effects: { food: 20, biodiversity: 5, wellbeing: 20, resilience: 15 }, 
              feedback: "Strengthening local food systems is a powerful way to build resilience and community cohesion." 
            },
            { 
              text: "Demand the government provide emergency food aid.", 
              effects: { food: 10, biodiversity: 0, wellbeing: -5, resilience: -10 }, 
              feedback: "While it provides temporary relief, it creates dependency and doesn't solve the underlying supply problem." 
            },
            { 
              text: "Organize protests demanding the borders reopen for food trade.", 
              effects: { food: -5, biodiversity: 0, wellbeing: -10, resilience: -5 }, 
              feedback: "The protests cause local disruption without changing the international situation, straining community well-being." 
            }
          ]
        },
        {
          level: "National Policy",
          prompt: "The national government is deciding on a long-term strategy. What do you advocate for?",
          options: [
            { 
              text: "Promote strict protectionist policies and aim for 100% self-sufficiency.", 
              effects: { food: 5, biodiversity: -15, wellbeing: -10, resilience: -20 }, 
              feedback: "Aiming for total self-sufficiency leads to intensive pressure on local land, harming biodiversity and creating new vulnerabilities." 
            },
            { 
              text: "Invest in resilient local supply chains while fostering new, transparent international trade partnerships.", 
              effects: { food: 15, biodiversity: 10, wellbeing: 15, resilience: 25 }, 
              feedback: "A balanced approach! This secures food for all while promoting sustainable practices both at home and abroad." 
            },
            { 
              text: "Acquire farmland in other countries to secure food for our nation ('land grabs').", 
              effects: { food: 10, biodiversity: -10, wellbeing: 5, resilience: -15 }, 
              feedback: "This approach secures food for your nation but often at the expense of local communities and ecosystems in other countries." 
            }
          ]
        }
      ],
      quiz: {
        question: "Which dietary change can significantly reduce an individual's environmental footprint?",
        answers: ["Eating less red meat and more plant-based proteins", "Eating only meat", "Doubling beef consumption"],
        correct: 0,
        explanation: "Shifting towards a more plant-rich diet generally lowers greenhouse gas emissions and land use, as livestock, especially beef, has a much larger environmental impact."
      }
    }
  ]
};

const EcoReadyGame = ({ navigation, route, onExit }) => {
  const [gameState, setGameState] = useState('start'); // 'start', 'selection', 'playing'
  const [currentScenario, setCurrentScenario] = useState(null);
  const [currentDecisionIndex, setCurrentDecisionIndex] = useState(0);
  const [stats, setStats] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [completedScenarios, setCompletedScenarios] = useState([]);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Reset when navigating to this screen
  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.reset) {
        setGameState('start');
        setCurrentScenario(null);
        setCurrentDecisionIndex(0);
        setStats({});
        setCompletedScenarios([]);
      }
    }, [route.params])
  );

  // Handle back button
  useEffect(() => {
    const handleBackPress = () => {
      if (gameState === 'playing') {
        setGameState('selection');
        return true;
      } else if (gameState === 'selection') {
        setGameState('start');
        return true;
      } else if (gameState === 'start' && onExit) {
        onExit();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    return () => backHandler.remove();
  }, [gameState, onExit]);

  const updateStats = async (effects, feedback) => {
    const newStats = {
      food: Math.max(0, Math.min(100, stats.food + effects.food)),
      biodiversity: Math.max(0, Math.min(100, stats.biodiversity + effects.biodiversity)),
      wellbeing: Math.max(0, Math.min(100, stats.wellbeing + effects.wellbeing)),
      resilience: Math.max(0, Math.min(100, stats.resilience + effects.resilience))
    };

    setStats(newStats);

    // Check for game over first
    if (newStats.food <= 0 || newStats.biodiversity <= 0 || newStats.wellbeing <= 0 || newStats.resilience <= 0) {
      let reason = "";
      if (newStats.food <= 0) reason = "Your community is facing severe food shortages.";
      else if (newStats.biodiversity <= 0) reason = "Your local ecosystem has collapsed.";
      else if (newStats.wellbeing <= 0) reason = "Community morale is at an all-time low.";
      else if (newStats.resilience <= 0) reason = "Your community is not prepared for future challenges.";
      
      showModal('gameOver', { reason });
      await incrementSessionCounter();
      const shouldShow = await shouldShowFeedback();
      if (shouldShow) {
        setTimeout(() => setShowFeedbackModal(true), 1500);
      }
    } else {
      // Show feedback modal with manual continue button
      showModal('feedback', { feedback });
    }
  };

  const showModal = (type, data) => {
    setModalContent({ type, ...data });
    setModalVisible(true);
  };

  const startScenario = (scenarioId) => {
    const scenario = gameData.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    setCurrentScenario(scenario);
    setCurrentDecisionIndex(0);
    setStats({ ...scenario.initialStats });
    setGameState('playing');
  };

  const restartScenario = () => {
    setModalVisible(false);
    if (currentScenario) {
      startScenario(currentScenario.id);
    }
  };

  const handleQuizAnswer = (answerIndex) => {
    const isCorrect = answerIndex === currentScenario.quiz.correct;
    if (isCorrect) {
      setStats(prev => ({
        ...prev,
        resilience: Math.min(100, prev.resilience + 10)
      }));
    }
    showModal('quizResult', { 
      isCorrect, 
      explanation: currentScenario.quiz.explanation 
    });
  };

  const completeScenario = async () => {
    setModalVisible(false);
    setCompletedScenarios(prev => [...prev, currentScenario.id]);
    showModal('scenarioComplete', {});
    await incrementSessionCounter();
    const shouldShow = await shouldShowFeedback();
    if (shouldShow) {
      setTimeout(() => setShowFeedbackModal(true), 1000);
    }
  };

  const goToSelection = () => {
    setModalVisible(false);
    setGameState('selection');
  };

  const ProgressBar = ({ label, value, color, icon }) => (
    <View style={styles.progressContainer}>
      <Text style={styles.progressLabel}>{icon} {label}</Text>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${value}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.progressValue}>{Math.round(value)}%</Text>
    </View>
  );

  const renderStartScreen = () => (
    <ScrollView contentContainerStyle={styles.startScreen}>
      {onExit && (
        <TouchableOpacity style={styles.backButton} onPress={onExit}>
          <Text style={styles.backButtonText}>← Back to Games</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>Eco-Ready: Your Food Future</Text>
      <Text style={styles.subtitle}>Can you build a resilient community in a changing world?</Text>
      <Text style={styles.description}>
        Based on research from the EU's ECO-READY project, this game lets you step into the shoes of a community leader. 
        You'll face challenges drawn from real-world climate projections. Your choices will shape the future of your town's 
        food security, environment, and well-being.
      </Text>
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={() => setGameState('selection')}
      >
        <Text style={styles.startButtonText}>Start Playing</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderScenarioSelection = () => (
    <ScrollView contentContainerStyle={styles.selectionScreen}>
      <Text style={styles.selectionTitle}>Choose Your Challenge</Text>
      {gameData.scenarios.map((scenario) => {
        const isCompleted = completedScenarios.includes(scenario.id);
        const isLocked = scenario.id > 1 && !completedScenarios.includes(scenario.id - 1);
        
        return (
          <TouchableOpacity
            key={scenario.id}
            style={[
              styles.scenarioCard,
              { backgroundColor: scenario.backgroundColor },
              isLocked && styles.lockedCard
            ]}
            onPress={() => !isLocked && startScenario(scenario.id)}
            disabled={isLocked}
          >
            <Text style={styles.scenarioTitle}>{scenario.title}</Text>
            <Text style={styles.scenarioDescription}>{scenario.description}</Text>
            {isCompleted && <Text style={styles.completedIcon}>✅</Text>}
            {isLocked && (
              <View style={styles.lockedOverlay}>
                <Text style={styles.lockedText}>🔒 LOCKED</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderGameScreen = () => {
    if (!currentScenario) return null;

    const isQuizTime = currentDecisionIndex >= currentScenario.decisions.length;
    const currentDecision = currentScenario.decisions[currentDecisionIndex];

    return (
      <View style={[styles.gameScreen, { backgroundColor: currentScenario.backgroundColor }]}>
        {/* Stats Header */}
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>{currentScenario.title}: Community Status</Text>
          <View style={styles.statsGrid}>
            <ProgressBar label="Food Security" value={stats.food} color="#10B981" icon="🍲" />
            <ProgressBar label="Biodiversity" value={stats.biodiversity} color="#3B82F6" icon="🦋" />
            <ProgressBar label="Well-being" value={stats.wellbeing} color="#F59E0B" icon="😊" />
            <ProgressBar label="Resilience" value={stats.resilience} color="#8B5CF6" icon="🌍" />
          </View>
        </View>

        {/* Game Content */}
        <ScrollView style={styles.gameContent}>
          <View style={styles.gameCard}>
            {isQuizTime ? (
              <View>
                <Text style={styles.levelText}>Knowledge Check</Text>
                <Text style={styles.promptText}>{currentScenario.quiz.question}</Text>
                {currentScenario.quiz.answers.map((answer, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionButton}
                    onPress={() => handleQuizAnswer(index)}
                  >
                    <Text style={styles.optionText}>{answer}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : currentDecision ? (
              <View>
                <Text style={styles.levelText}>{currentDecision.level}</Text>
                <Text style={styles.promptText}>{currentDecision.prompt}</Text>
                {currentDecision.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionButton}
                    onPress={() => updateStats(option.effects, option.feedback)}
                  >
                    <Text style={styles.optionText}>{option.text}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.scenarioIntro}>
                <Text style={styles.scenarioIntroTitle}>{currentScenario.title}</Text>
                <Text style={styles.scenarioIntroDesc}>{currentScenario.description}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderModal = () => {
    const { type } = modalContent;
    
    let title = '';
    let content = '';
    let buttons = [];

    switch (type) {
      case 'feedback':
        title = 'Result';
        content = modalContent.feedback;
        buttons = [
          { text: 'Continue', onPress: () => {
            setModalVisible(false);
            setCurrentDecisionIndex(prev => prev + 1);
          }, style: styles.modalButton }
        ];
        break;
      case 'gameOver':
        title = 'Scenario Failed';
        content = `${modalContent.reason} Try again to find a more resilient path!`;
        buttons = [
          { text: 'Try Again', onPress: restartScenario, style: styles.modalButton }
        ];
        break;
      case 'quizResult':
        title = modalContent.isCorrect ? 'Correct!' : 'Not Quite...';
        content = `${modalContent.isCorrect ? "You've earned a resilience bonus!" : "Here's the key takeaway:"}\n\n${modalContent.explanation}`;
        buttons = [
          { text: 'Continue', onPress: completeScenario, style: styles.modalButton }
        ];
        break;
      case 'scenarioComplete':
        title = 'Scenario Complete!';
        content = "You've successfully navigated the challenge. Your choices have made the community more resilient!";
        buttons = [
          { text: 'Back to Challenges', onPress: goToSelection, style: styles.modalButton }
        ];
        break;
    }

    return (
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalText}>{content}</Text>
            {buttons.map((button, index) => (
              <TouchableOpacity key={index} style={button.style} onPress={button.onPress}>
                <Text style={styles.modalButtonText}>{button.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {gameState === 'start' && renderStartScreen()}
      {gameState === 'selection' && renderScenarioSelection()}
      {gameState === 'playing' && renderGameScreen()}
      {renderModal()}
      
      {/* Feedback Modal */}
      <FeedbackModal
        visible={showFeedbackModal}
        onClose={() => {
          setShowFeedbackModal(false);
          resetFeedbackCounters();
        }}
        context="game"
        contextId={currentScenario ? `scenario-${currentScenario.id}` : 'eco-ready-game'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0EFEA',
  },
  startScreen: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: height - 100,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(15, 118, 110, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0F766E',
  },
  backButtonText: {
    color: '#0F766E',
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0F766E',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'left',
    lineHeight: 24,
    marginBottom: 30,
  },
  startButton: {
    backgroundColor: '#0F766E',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectionScreen: {
    padding: 20,
  },
  selectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F766E',
    textAlign: 'center',
    marginBottom: 30,
  },
  scenarioCard: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    position: 'relative',
  },
  scenarioTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  scenarioDescription: {
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
  },
  completedIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 24,
  },
  lockedCard: {
    opacity: 0.6,
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameScreen: {
    flex: 1,
  },
  statsHeader: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 15,
    margin: 10,
    borderRadius: 15,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F766E',
    textAlign: 'center',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  progressContainer: {
    width: '48%',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 5,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressValue: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'right',
    marginTop: 2,
  },
  gameContent: {
    flex: 1,
    padding: 15,
  },
  gameCard: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
    borderRadius: 15,
    minHeight: 300,
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#5EEAD4',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  promptText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    lineHeight: 24,
  },
  optionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  scenarioIntro: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  scenarioIntroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5EEAD4',
    textAlign: 'center',
    marginBottom: 15,
  },
  scenarioIntroDesc: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    maxWidth: 350,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F766E',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#0F766E',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EcoReadyGame;
