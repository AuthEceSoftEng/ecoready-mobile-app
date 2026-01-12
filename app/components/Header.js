import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
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

      {/* Header content without SafeAreaView since App.js handles it */}
      <View style={styles.headerArea}>
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

          {/* Profile Icon - Right */}
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <TouchableOpacity
              style={styles.profileIcon}
              onPress={() => navigate('Profile')}
            >
              <MaterialIcons name="account-circle" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerArea: {
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
  profileIcon: {
    padding: 8,
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
