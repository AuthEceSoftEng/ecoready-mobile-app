import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';

const questionPool = [
  {
    question: "What is the main cause of soil erosion?",
    options: ["Deforestation", "Urbanization", "Crop Rotation", "Recycling"],
    answer: "Deforestation",
  },
  {
    question: "Which gas is most responsible for global warming?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Methane"],
    answer: "Carbon Dioxide",
  },
  {
    question: "What percentage of Earth's water is fresh water?",
    options: ["1%", "10%", "2.5%", "5%"],
    answer: "2.5%",
  },
  {
    question: "Which agricultural practice can help reduce soil degradation?",
    options: ["Overgrazing", "Crop Rotation", "Monoculture", "Deforestation"],
    answer: "Crop Rotation",
  },
  {
    question: "What is the main source of renewable energy in agriculture?",
    options: ["Solar energy", "Coal", "Nuclear power", "Natural gas"],
    answer: "Solar energy",
  },
  {
    question: "Which farming method is most eco-friendly?",
    options: ["Organic farming", "Monoculture", "Slash and burn", "Hydroponics"],
    answer: "Organic farming",
  },
  {
    question: "What is agroforestry?",
    options: [
      "The cultivation of forests for timber",
      "Combining agriculture with tree planting",
      "Building cities in forests",
      "Clearing forests for crops",
    ],
    answer: "Combining agriculture with tree planting",
  },
  {
    question: "What is the biggest challenge to food security?",
    options: ["Urbanization", "Pest attacks", "Climate Change", "None of the above"],
    answer: "Climate Change",
  },
  {
    question: "What is the purpose of crop rotation?",
    options: [
      "Increase crop yield",
      "Reduce pests and improve soil health",
      "Harvest more water",
      "Maximize fertilizer use",
    ],
    answer: "Reduce pests and improve soil health",
  },
  {
    question: "Which practice helps reduce water waste in irrigation?",
    options: ["Flood irrigation", "Drip irrigation", "Sprinklers", "Canals"],
    answer: "Drip irrigation",
  },
];

export default function Quiz({ onExit }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [questions, setQuestions] = useState([]);

  // Randomly select 7 questions from the question pool at the start
  useEffect(() => {
    const shuffled = questionPool.sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 7));
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
    const isCorrect = questions[currentQuestionIndex].answer === selectedOption;
    if (isCorrect) {
      setScore(score + 1);
    }

    // Delay to show the correct answer for 3 seconds before moving to the next question
    setTimeout(() => {
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex < questions.length) {
        setCurrentQuestionIndex(nextQuestionIndex);
        setSelectedOption(null); // Reset selection
      } else {
        setShowScore(true);
      }
    }, 1000); // 1-second delay
  };

  const resetQuiz = () => {
    setScore(0);
    setCurrentQuestionIndex(0);
    setShowScore(false);
    setSelectedOption(null);
    const shuffled = questionPool.sort(() => 0.5 - Math.random());
    setQuestions(shuffled.slice(0, 7)); // Generate new random questions
  };

  const getEndMessage = () => {
    if (score === questions.length) {
      return "🎉 Perfect Score! You're a climate and agriculture expert!";
    } else if (score > questions.length / 2) {
      return "👏 Great job! You have a good grasp of these topics.";
    } else {
      return "Keep learning and try again to improve your score!";
    }
  };

  // Wait for questions to load before rendering
  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading questions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showScore ? (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>🌟 Your Score: {score}/{questions.length}</Text>
          <Text style={styles.endMessage}>{getEndMessage()}</Text>
          <TouchableOpacity onPress={resetQuiz} style={styles.restartButton}>
            <Text style={styles.buttonText}>Restart Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
                resetQuiz(); // Reset the quiz state
                onExit();    // Navigate back to the game selection screen
            }}
            style={styles.exitButton}
            >
            <Text style={styles.buttonText}>🎮 Back to Game Hub</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.quizContainer}>
          <Text style={styles.questionText}>
            {questions[currentQuestionIndex].question}
          </Text>
          {questions[currentQuestionIndex].options.map((option, index) => {
            const isCorrect = option === questions[currentQuestionIndex].answer;
            const buttonStyle =
              selectedOption === null
                ? styles.optionButton
                : option === questions[currentQuestionIndex].answer
                ? [styles.optionButton, styles.correct]
                : selectedOption === option
                ? [styles.optionButton, styles.incorrect]
                : styles.optionButton;

            return (
              <TouchableOpacity
                key={index}
                style={buttonStyle}
                onPress={() => handleAnswer(option)}
                disabled={selectedOption !== null} // Disable selection after the first answer
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#e8f5e9',
  },
  loadingText: {
    fontSize: 18,
    color: '#1b5e20',
  },
  quizContainer: {
    alignItems: 'center',
    width: '100%',
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5e20', // Dark green for question text
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#c8e6c9', // Light green button background
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  correct: {
    backgroundColor: '#66bb6a', // Green for correct answer
  },
  incorrect: {
    backgroundColor: '#ef5350', // Red for incorrect answer
  },
  optionText: {
    fontSize: 16,
    color: '#004d40', // Dark green for button text
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
  },
  endMessage: {
    fontSize: 18,
    color: '#1b5e20',
    marginBottom: 20,
    textAlign: 'center',
  },
  restartButton: {
    backgroundColor: '#81c784', // Brighter green for restart button
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  exitButton: {
    backgroundColor: '#e57373', // Red for exit button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff', // White text for buttons
  },
});
