import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Import navigation hooks
import Game from './Game';
import Quiz from './Quiz';

export default function GamesScreen() {
  const [screen, setScreen] = useState('main'); // 'main', 'quiz', or 'strategy'
  const navigation = useNavigation();
  const route = useRoute();

  // Reset the game state and return to the Game Hub when navigating to the Games tab
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (route.params?.reset) {
        setScreen('main'); // Reset to the main screen
      }
    });

    return unsubscribe; // Clean up the listener on unmount
  }, [navigation, route.params]);

  const renderScreen = () => {
    switch (screen) {
      case 'quiz':
        return <Quiz onExit={() => setScreen('main')} />;
      case 'strategy':
        return <Game onExit={() => setScreen('main')} />;
      default:
        return <MainScreen onSelect={(game) => setScreen(game)} />;
    }
  };

  return <SafeAreaView style={styles.container}>{renderScreen()}</SafeAreaView>;
}

function MainScreen({ onSelect }) {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.header}>🎮 Game Hub</Text>
      <Text style={styles.description}>Choose a game to start playing!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onSelect('quiz')}
      >
        <Text style={styles.buttonText}>🧠 Quiz Game</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => onSelect('strategy')}
      >
        <Text style={styles.buttonText}>🌍 Climate Strategy Game</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f0f4c3',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#1b5e20',
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#81c784',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
