import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';

const TipsScreen = () => {
  // Categories and tips data
  const categoriesData = [
    {
      id: '1',
      category: 'Water Conservation',
      emoji: '🌊',
      tips: [
        '💧 Turn off the tap while brushing your teeth.',
        '🔧 Fix leaky faucets to save water.',
        '🚿 Take shorter showers to reduce water usage.',
      ],
      color: '#A2D5F2', // Light Blue
    },
    {
      id: '2',
      category: 'Energy Efficiency',
      emoji: '⚡',
      tips: [
        '💡 Switch to LED lightbulbs to save energy.',
        '🔌 Unplug devices when not in use to prevent phantom energy usage.',
        '🌞 Use solar panels if possible to harness clean energy.',
      ],
      color: '#F9D5A7', // Light Orange
    },
    {
      id: '3',
      category: 'Waste Reduction',
      emoji: '♻️',
      tips: [
        '🍂 Compost organic waste to reduce landfill contributions.',
        '🛍️ Use reusable bags, bottles, and containers instead of disposable ones.',
        '🔄 Recycle paper, plastic, glass, and metal properly.',
      ],
      color: '#D4A5A5', // Soft Red
    },
    {
      id: '4',
      category: 'Climate Change',
      emoji: '🌍',
      tips: [
        '🌱 Plant trees to absorb carbon dioxide and provide oxygen.',
        '🚲 Use bikes or walk for short distances instead of driving.',
        '📢 Advocate for policies that promote renewable energy and sustainability.',
      ],
      color: '#94C83D', // Green
    },
    {
      id: '5',
      category: 'Food Security',
      emoji: '🌾',
      tips: [
        '🥦 Grow your own vegetables in a home garden.',
        '🍽️ Avoid food waste by planning meals and storing food properly.',
        '🤝 Support local farmers and sustainable agriculture.',
      ],
      color: '#FFE69A', // Soft Yellow
    },
    {
      id: '6',
      category: 'Biodiversity',
      emoji: '🦋',
      tips: [
        '🌸 Plant native flowers to support pollinators like bees and butterflies.',
        '🐦 Build bird feeders or birdhouses to encourage wildlife in your area.',
        '🚯 Avoid using harmful chemicals that can harm ecosystems.',
      ],
      color: '#B3E5BE', // Light Green
    },
  ];

  // State for selected category and modal visibility
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Function to open the modal and show tips for a category
  const openModal = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedCategory(null);
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>ECO Tips</Text>

      {/* Categories Grid */}
      <View style={styles.grid}>
        {categoriesData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: item.color, // Assign category-specific color
              },
            ]}
            onPress={() => openModal(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.cardEmoji}>{item.emoji}</Text>
            <Text style={styles.cardTitle}>{item.category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal for Showing Tips */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Category Title */}
            <Text style={styles.modalTitle}>
              {selectedCategory?.emoji} {selectedCategory?.category}
            </Text>

            {/* List of Tips */}
            {selectedCategory?.tips.map((tip, index) => (
              <Text key={index} style={styles.modalTip}>
                {tip}
              </Text>
            ))}

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E4E75',
    textAlign: 'center',
    marginBottom: 10,
    height: '8%',
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 20,
  },
  grid: {
    height: '90%',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Center the grid horizontally
    alignItems: 'center', // Center the grid vertically
  },
  card: {
    width: '45%', // Each card takes up 45% of the available width
    height: '30%', // Each card takes up 30% of the screen's height
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '2.5%', // 5% margin around each card
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 5,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E4E75',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalTip: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 10,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#94C83D',
    padding: 10,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default TipsScreen;
