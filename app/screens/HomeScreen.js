import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import common from '../styles/common';

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={common.safeArea}>
      <View style={styles.container}>
        {/* Welcome Section */}
        <ImageBackground
          source={require('../assets/images/landing-bg2.jpg')} // Background image
          style={styles.welcomeSection}
        >
          <Text style={styles.title}>Welcome to EcoReady!</Text>
          <Text style={styles.subtitle}>
            Get ready to simplify your life with eco-friendly solutions.
          </Text>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => navigation.navigate('News')}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </ImageBackground>

        {/* Highlights Section */}
        <View style={styles.highlights}>
          <Text style={styles.highlightsTitle}>What We Offer</Text>
          <View style={styles.cards}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Eco News</Text>
              <Text style={styles.cardDescription}>
                Stay updated with the latest news on sustainability and eco-friendly innovations.
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Metrics</Text>
              <Text style={styles.cardDescription}>
                Find useful metrics to measure and understand your environmental footprint.
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Play Eco Games</Text>
              <Text style={styles.cardDescription}>
                Engage in fun games that teach you about eco solutions and sustainable practices.
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Sustainable Tips</Text>
              <Text style={styles.cardDescription}>
                Learn practical tips and tricks for living a more sustainable lifestyle.
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Join us in making the world a better place. 🌿
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ensures the container fills the screen height
    justifyContent: 'space-between', // Distributes content evenly
    backgroundColor: '#f5f5f5',
  },
  welcomeSection: {
    flex: 0.4, // Take up 40% of the screen
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: '10%',
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginVertical: 10,
    marginHorizontal: '10%',
  },
  getStartedButton: {
    backgroundColor: '#94C83D',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  getStartedText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  highlights: {
    flex: 0.6, // Takes up half the remaining height
    paddingHorizontal: 16,
  },
  highlightsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1E4E75',
  },
  cards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%', // Two cards per row
    aspectRatio: 1,
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15, // Add spacing between rows
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E4E75',
    marginBottom: 5,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
  },
  footer: {
    height: 30, // Footer height
    justifyContent: 'center',
    alignItems: 'center'
  },
  footerText: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
  },
});

export default HomeScreen;
