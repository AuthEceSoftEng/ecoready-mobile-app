import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const crops = [
  { name: "Wheat", water: 2, yield: 10 },
  { name: "Rice", water: 5, yield: 15 },
  { name: "Corn", water: 3, yield: 12 },
];

const challenges = [
  { name: "Drought", effect: "water" },
  { name: "Pest Outbreak", effect: "yield" },
];

export default function FarmGame() {
  const [water, setWater] = useState(10);
  const [soilHealth, setSoilHealth] = useState(10);
  const [score, setScore] = useState(0);
  const [log, setLog] = useState([]);

  const plantCrop = (crop) => {
    if (water >= crop.water && soilHealth >= 1) {
      setWater(water - crop.water);
      setSoilHealth(soilHealth - 1);
      setScore(score + crop.yield);
      setLog([...log, `You planted ${crop.name} and earned ${crop.yield} points.`]);
    } else {
      setLog([...log, `Not enough resources to plant ${crop.name}.`]);
    }
  };

  const handleChallenge = () => {
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    if (challenge.effect === "water") {
      setWater(water - 3);
      setLog([...log, "A drought reduced your water supply."]);
    } else if (challenge.effect === "yield") {
      setScore(score - 5);
      setLog([...log, "A pest outbreak reduced your crop yield."]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.resourceText}>💧 Water: {water}</Text>
      <Text style={styles.resourceText}>🌱 Soil Health: {soilHealth}</Text>
      <Text style={styles.resourceText}>🌟 Score: {score}</Text>

      <Text style={styles.title}>Choose a Crop to Plant:</Text>
      {crops.map((crop, index) => (
        <TouchableOpacity
          key={index}
          style={styles.cropButton}
          onPress={() => plantCrop(crop)}
        >
          <Text style={styles.cropText}>{crop.name}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.challengeButton} onPress={handleChallenge}>
        <Text style={styles.challengeText}>⚠️ Face a Challenge</Text>
      </TouchableOpacity>

      <View style={styles.logContainer}>
        <Text style={styles.logTitle}>Game Log:</Text>
        {log.map((entry, index) => (
          <Text key={index} style={styles.logEntry}>{entry}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 16,
  },
  resourceText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#1b5e20',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#2e7d32',
  },
  cropButton: {
    backgroundColor: '#c8e6c9',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  cropText: {
    fontSize: 16,
    color: '#004d40',
  },
  challengeButton: {
    backgroundColor: '#ffcc80',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  challengeText: {
    fontSize: 16,
    color: '#bf360c',
  },
  logContainer: {
    marginTop: 20,
    width: '100%',
  },
  logTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 8,
  },
  logEntry: {
    fontSize: 14,
    color: '#004d40',
    marginBottom: 4,
  },
});
