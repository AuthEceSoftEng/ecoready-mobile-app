import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler, ScrollView } from 'react-native';
const TOTAL_QUESTIONS = 10; // Constant to ensure consistent question count

const questionPool = [
  {
    question: "What is the main cause of soil erosion?",
    options: ["Deforestation", "Urbanization", "Crop Rotation", "Recycling"],
    answer: "Deforestation",
    explanation: " When trees are removed, their roots no longer hold soil in place. This exposes soil to wind and rain, causing significant erosion."
  },
  {
    question: "Which gas is most responsible for global warming?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Methane"],
    answer: "Carbon Dioxide",
    explanation: " Carbon dioxide (CO2) is the primary greenhouse gas due to its abundance and long lifetime in the atmosphere."
  },
  {
    question: "What percentage of Earth's water is fresh water?",
    options: ["1%", "10%", "2.5%", "5%"],
    answer: "2.5%",
    explanation: " Only 2.5% of Earth's water is fresh, and most of this is frozen in glaciers. Less than 1% is accessible for use."
  },
  {
    question: "Which agricultural practice can help reduce soil degradation?",
    options: ["Overgrazing", "Crop Rotation", "Monoculture", "Deforestation"],
    answer: "Crop Rotation",
    explanation: " Rotating different crops helps maintain soil nutrients and reduces pest problems. This prevents soil from becoming depleted."
  },
  {
    question: "What is the main source of renewable energy in agriculture?",
    options: ["Solar energy", "Coal", "Nuclear power", "Natural gas"],
    answer: "Solar energy",
    explanation: " Solar energy is widely used in agriculture for irrigation systems and drying facilities. It's both environmentally friendly and cost-effective."
  },
  {
    question: "Which farming method is most eco-friendly?",
    options: ["Organic farming", "Monoculture", "Slash and burn", "Hydroponics"],
    answer: "Organic farming",
    explanation: " Organic farming avoids synthetic pesticides and promotes biodiversity. It works with natural ecosystems to maintain soil health."
  },
  {
    question: "What is agroforestry?",
    options: [
      "The cultivation of forests for timber",
      "Combining agriculture with tree planting",
      "Building cities in forests",
      "Clearing forests for crops"
    ],
    answer: "Combining agriculture with tree planting",
    explanation: " Agroforestry combines trees with crops or livestock. This creates a sustainable system with multiple benefits for farmers."
  },
  {
    question: "What is the biggest challenge to food security?",
    options: ["Urbanization", "Pest attacks", "Climate Change", "None of the above"],
    answer: "Climate Change",
    explanation: " Climate change affects crop yields through extreme weather and changing rainfall patterns. This threatens global food production."
  },
  {
    question: "What is the purpose of crop rotation?",
    options: [
      "Increase crop yield",
      "Reduce pests and improve soil health",
      "Harvest more water",
      "Maximize fertilizer use"
    ],
    answer: "Reduce pests and improve soil health",
    explanation: " Rotating crops breaks pest cycles and maintains nutrient balance. Different crops have varying nutrient needs, preventing soil depletion."
  },
  {
    question: "Which practice helps reduce water waste in irrigation?",
    options: ["Flood irrigation", "Drip irrigation", "Sprinklers", "Canals"],
    answer: "Drip irrigation",
    explanation: " Drip irrigation delivers water directly to plant roots. This minimizes waste through evaporation and runoff."
  },
  {
    question: "What is permaculture?",
    options: [
      "Permanent agriculture",
      "Temporary farming",
      "Urban gardening",
      "Industrial farming"
    ],
    answer: "Permanent agriculture",
    explanation: "Permaculture focuses on creating sustainable agricultural ecosystems."
  },
  {
    question: "Which of these helps in carbon sequestration?",
    options: [
      "Cover crops",
      "Intensive tilling",
      "Burning crop residue",
      "Removing vegetation"
    ],
    answer: "Cover crops",
    explanation: "Cover crops help capture and store carbon dioxide in the soil."
  },
  {
    question: "What is the purpose of a greenhouse?",
    options: [
      "To trap heat and extend growing season",
      "To keep plants dry",
      "To block sunlight",
      "To prevent plant growth"
    ],
    answer: "To trap heat and extend growing season",
    explanation: "Greenhouses create a controlled environment for year-round growing."
  },
  {
    question: "Which practice helps conserve soil moisture?",
    options: [
      "Mulching",
      "Deep plowing",
      "Removing ground cover",
      "Frequent tilling"
    ],
    answer: "Mulching",
    explanation: "Mulch helps retain soil moisture and suppress weed growth."
  },
  {
    question: "What is sustainable agriculture?",
    options: [
      "Farming that meets current and future needs",
      "Using only organic methods",
      "Traditional farming only",
      "Industrial farming"
    ],
    answer: "Farming that meets current and future needs",
    explanation: "Sustainable agriculture balances current production with future resource preservation."
  },
  {
    question: "Which is a natural pest control method?",
    options: [
      "Beneficial insects",
      "Chemical pesticides",
      "Crop burning",
      "Soil sterilization"
    ],
    answer: "Beneficial insects",
    explanation: "Beneficial insects like ladybugs naturally control harmful pests."
  },
  {
    question: "What is vertical farming?",
    options: [
      "Growing crops in vertical layers",
      "Traditional field farming",
      "Underground farming",
      "Hillside farming"
    ],
    answer: "Growing crops in vertical layers",
    explanation: "Vertical farming maximizes space by growing crops in stacked layers."
  },
  {
    question: "Which helps prevent water pollution in agriculture?",
    options: [
      "Buffer zones",
      "Heavy fertilization",
      "Unrestricted grazing",
      "Stream modification"
    ],
    answer: "Buffer zones",
    explanation: "Buffer zones filter runoff and protect water sources from contamination."
  }
];

export default function Quiz({ onExit }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  


  // Randomly select 7 questions from the question pool at the start
  useEffect(() => {
    const getRandomQuestions = () => {
      const shuffled = [...questionPool].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, TOTAL_QUESTIONS);
    };
    setQuestions(getRandomQuestions());
  }, []);

  // Handle back button press
  useEffect(() => {
    const handleBackPress = () => {
      resetQuiz(); // Reset all state variables
      onExit();    // Navigate back to the game selection screen
      return true; // Prevent default back behavior
    };
  
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
  
    return () => {
      resetQuiz(); // Reset state on unmount
      backHandler.remove();
    };
  }, [onExit]);
  
  
  const handleAnswer = (selectedOption) => {
    setSelectedOption(selectedOption);
    if (questions[currentQuestionIndex].answer === selectedOption) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setSelectedOption(null);
    } else {
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    const newQuestions = [...questionPool].sort(() => 0.5 - Math.random()).slice(0, TOTAL_QUESTIONS);
    setQuestions(newQuestions);
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowScore(false);
    setSelectedOption(null);
  };


  const getEndMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) {
      return {
        title: "🏆 Perfect Score! You're a Master!",
        message: "Outstanding achievement! You've demonstrated expert knowledge in environmental and agricultural topics!",
        emoji: "🌟"
      };
    } else if (percentage >= 80) {
      return {
        title: "🎉 Excellent Performance!",
        message: "Great work! You have a strong understanding of these important topics!",
        emoji: "👏"
      };
    } else if (percentage >= 60) {
      return {
        title: "👍 Good Job!",
        message: "You're on the right track! Keep learning to become an expert!",
        emoji: "📚"
      };
    } else {
      return {
        title: "Keep Learning!",
        message: "Every question is an opportunity to learn. Try again to improve your score!",
        emoji: "💪"
      };
    }
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Main Title */}
        <Text style={styles.mainTitle}>🌍 Eco & Agriculture Quiz 🌱</Text>

        {showScore ? (
          <View style={styles.scoreContainer}>
            <Text style={styles.resultTitle}>{getEndMessage().title}</Text>
            <Text style={styles.resultEmoji}>{getEndMessage().emoji}</Text>
            <Text style={styles.scoreText}>Your Score: {score}/{questions.length}</Text>
            <Text style={styles.resultMessage}>{getEndMessage().message}</Text>
            <TouchableOpacity onPress={resetQuiz} style={styles.button}>
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                resetQuiz();
                onExit();
              }} 
              style={[styles.button, styles.exitButton]}
            >
              <Text style={styles.buttonText}>🎮 Back to Game Hub</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.quizContainer}>
            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Question {currentQuestionIndex + 1} of {TOTAL_QUESTIONS}
              </Text>
            </View>
            
            {/* Question */}
            <Text style={styles.questionText}>
              {questions[currentQuestionIndex].question}
            </Text>
            
            {/* Options */}
            <View style={styles.optionsContainer}>
              {questions[currentQuestionIndex].options.map((option, index) => {
                const isCorrect = option === questions[currentQuestionIndex].answer;
                const buttonStyle =
                  selectedOption === null
                    ? styles.optionButton
                    : isCorrect
                    ? [styles.optionButton, styles.correct]
                    : selectedOption === option
                    ? [styles.optionButton, styles.incorrect]
                    : styles.optionButton;

                return (
                  <TouchableOpacity
                    key={index}
                    style={buttonStyle}
                    onPress={() => handleAnswer(option)}
                    disabled={selectedOption !== null}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Explanation - Only shown after answer selection */}
            {selectedOption && (
              <View style={styles.explanationSection}>
                <Text>ℹ️</Text>
                <Text style={styles.explanationText}>
                {questions[currentQuestionIndex].explanation}
                </Text>
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNextQuestion}
                >
                  <Text style={styles.buttonText}>
                    {currentQuestionIndex === questions.length - 1 ? 'Show Results' : 'Next Question'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#e8f5e9',
  },
  container: {
    minHeight: '100%',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 18,
    color: '#1b5e20',
  },
  quizContainer: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#c8e6c9',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  correct: {
    backgroundColor: '#66bb6a',
  },
  incorrect: {
    backgroundColor: '#ef5350',
  },
  optionText: {
    fontSize: 16,
    color: '#004d40',
    textAlign: 'center',
  },
  explanationSection: {
    width: '90%',
    maxWidth: 400,
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 12,
    padding: 15,
  },
  explanationText: {
    fontSize: 15,
    color: '#1a5653',
    marginBottom: 15,
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  nextButton: {
    backgroundColor: '#2196f3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    padding: 20,
    width: '100%',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultEmoji: {
    fontSize: 48,
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 10,
  },
  resultMessage: {
    fontSize: 16,
    color: '#1b5e20',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#2196f3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 8,
    width: '80%',
    alignItems: 'center',
  },
  exitButton: {
    backgroundColor: '#e57373',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
