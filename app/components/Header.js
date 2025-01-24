import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context'; // Ensure this is imported
import { navigate } from '../navigations/NavigationService'; // Import global navigate function
import common from '../styles/common';

const Header = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={common.headerContainer}>
        {/* Left Spacer */}
        <View style={{ flex: 1 }} />

        {/* Centered Logo */}
        <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} onPress={() => navigate('Home')}>
          <Image
            source={require('../assets/images/logo.png')} // Logo path
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Right Spacer */}
        <View style={{ flex: 1 }} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#1E4E75', // Match the header background color
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 40,
    alignSelf: 'center',
  },
  notificationIcon: {
    position: 'relative',
    alignItems: 'flex-end',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    backgroundColor: '#a1c63b',
    borderRadius: 5,
  },
});

export default Header;
