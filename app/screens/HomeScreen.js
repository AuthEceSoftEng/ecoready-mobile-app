import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import common from '../styles/common';

const HomeScreen = ({ navigation }) => {
  const { width, height } = useWindowDimensions();

  const cardsData = [
    {
      title: 'Eco News',
      description: 'Latest news on Food Security, Climate Change, and Sustainability.',
      targetTab: 'News',
    },
    {
      title: 'Metrics',
      description: 'Useful metrics to measure and understand environmental footprint.',
      targetTab: 'Calculators',
    },
    {
      title: 'Eco Games',
      description: 'Games that teach you about eco solutions and sustainable practices.',
      targetTab: 'Games',
    },
    {
      title: 'Sustainable Tips',
      description: 'Practical tips for living a more sustainable lifestyle.',
      targetTab: 'Tips',
    },
  ];

  const handleCardPress = (targetTab) => {
    // Reset the navigation state of the target tab
    navigation.reset({
      index: 0,
      routes: [{ name: targetTab }],
    });
  };

  return (
    <SafeAreaView style={common.safeArea}>
      <View style={styles.container}>
        {/* Welcome Section */}
        <ImageBackground
          source={require('../assets/images/image.png')}
          style={styles.welcomeSection}
          resizeMode="cover"
        >
          <Text style={[styles.title, { fontSize: width * 0.06 }]}>
            Welcome to ECOReady!
          </Text>
          <Text
            style={[
              styles.subtitle,
              { fontSize: width * 0.04, marginHorizontal: width * 0.1 },
            ]}
          >
            Get ready to simplify your life with eco-friendly solutions.
          </Text>
        </ImageBackground>

        {/* Highlights Section */}
        <View style={styles.highlightsSection}>
          <Text
            style={[
              styles.highlightsTitle,
              { fontSize: width * 0.05, marginBottom: height * 0.02, marginTop: height * 0.01 },
            ]}
          >
            What We Offer
          </Text>
          <View style={styles.cards}>
            {cardsData.map((card, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  {
                    padding: width * 0.03,
                  },
                ]}
                onPress={() => handleCardPress(card.targetTab)} // Reset and navigate
              >
                <Text
                  style={[styles.cardTitle, { fontSize: width * 0.04 }]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {card.title}
                </Text>
                <Text
                  style={[
                    styles.cardDescription,
                    { fontSize: width * 0.035 },
                  ]}
                  numberOfLines={3}
                  adjustsFontSizeToFit
                >
                  {card.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              { fontSize: width * 0.035 },
            ]}
          >
            Join us in making the world a better place. 🌿
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeSection: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    color: '#f0f0f0',
    textAlign: 'center',
    marginTop: 10,
  },
  highlightsSection: {
    flex: 5,
    paddingHorizontal: '4%',
    justifyContent: 'flex-start',
  },
  highlightsTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E4E75',
  },
  cards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: '4%',
  },
  cardTitle: {
    fontWeight: 'bold',
    color: '#1E4E75',
    marginBottom: 5,
    textAlign: 'center',
  },
  cardDescription: {
    color: '#6C757D',
    textAlign: 'center',
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    textAlign: 'center',
    color: '#6C757D',
  },
});

export default HomeScreen;
