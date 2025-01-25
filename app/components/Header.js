import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { navigate } from '../navigations/NavigationService';
import common from '../styles/common';

const Header = () => {
  return (
    <>
      {/* Configure the StatusBar */}
      <StatusBar
        barStyle="light-content" // Set text/icons to light color
        backgroundColor="transparent" // Transparent for seamless integration
        translucent // Ensures content overlaps the StatusBar
      />

      {/* SafeAreaView to handle safe areas */}
      <SafeAreaView style={styles.safeArea}>
        <View style={common.headerContainer}>
          {/* Left Spacer */}
          <View style={{ flex: 1 }} />

          {/* Centered Logo */}
          <TouchableOpacity
            style={{ flex: 1, alignItems: 'center' }}
            onPress={() => navigate('Home')}
          >
            <Image
              source={require('../assets/images/logo.png')} // Ensure the path is correct
              style={styles.logo}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Right Spacer */}
          <View style={{ flex: 1 }} />
        </View>
      </SafeAreaView>
    </>
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
