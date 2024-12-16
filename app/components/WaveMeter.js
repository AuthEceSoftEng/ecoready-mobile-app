import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const getGradientColors = (percentage) => {
  if (percentage < 0.5) return ['#4CAF50', '#81C784']; // Green gradient
  if (percentage < 0.8) return ['#FFEB3B', '#FFD54F']; // Yellow gradient
  return ['#F44336', '#E57373']; // Red gradient
};

const WaveMeter = ({ value, maxValue, unit }) => {
  const { width } = Dimensions.get('window');
  const waveWidth = width * 0.8;
  const waveHeight = 150;
  const percentage = Math.min(value / maxValue, 1);
  const waveFillHeight = waveHeight * percentage;
  const [startColor, endColor] = getGradientColors(percentage);

  const animatedWave = useSharedValue(0);

  useEffect(() => {
    animatedWave.value = withTiming(waveFillHeight, { duration: 1000 });
  }, [value]);

  const animatedProps = useAnimatedProps(() => {
    const wavePath = `
      M 0 ${waveHeight - animatedWave.value} 
      Q ${waveWidth / 4} ${waveHeight - animatedWave.value - 10} 
        ${waveWidth / 2} ${waveHeight - animatedWave.value} 
      T ${waveWidth} ${waveHeight - animatedWave.value}
      V ${waveHeight}
      H 0
      Z
    `;
    return { d: wavePath };
  });

  return (
    <View style={styles.container}>
      <Svg height={waveHeight} width={waveWidth} style={styles.svg}>
        <Defs>
          <LinearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={startColor} />
            <Stop offset="100%" stopColor={endColor} />
          </LinearGradient>
        </Defs>
        <AnimatedPath animatedProps={animatedProps} fill="url(#waveGradient)" />
      </Svg>
      <Text style={styles.valueText}>
        {value.toFixed(2)} / {maxValue} {unit}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  svg: {
    position: 'absolute',
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
});

export default WaveMeter;
