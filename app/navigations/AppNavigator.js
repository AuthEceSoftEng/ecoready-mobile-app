import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

// Import your screen components
import HomeScreen from '../screens/HomeScreen';
import SectionDetails from '../screens/DetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GamesScreen from '../screens/GamesScreen';
import TipsScreen from '../screens/TipScreen'; // Import the new TipsScreen

// Create the Tab Navigator
const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            switch (route.name) {
              case 'Home':
                return <MaterialIcons name="home" size={size} color={color} />;
              case 'Calculators':
                return <MaterialIcons name="calculate" size={size} color={color} />;
              case 'Games':
                return <MaterialIcons name="sports-esports" size={size} color={color} />;
              case 'News':
                return <MaterialIcons name="feed" size={size} color={color} />;
              case 'Tips':
                return <MaterialIcons name="tips-and-updates" size={size} color={color} />;
              default:
                return null;
            }
          },
          tabBarActiveTintColor: '#94C83D', // Active tab color
          tabBarInactiveTintColor: '#000', // Inactive tab color
          tabBarStyle: {
            backgroundColor: '#E8ECEF', // Tab bar background
            height: 50,
          },
          headerShown: false, // Disable default headers
          unmountOnBlur: true, // Force each tab to unmount when unfocused
        })}
      >
        {/* Home Tab */}
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            unmountOnBlur: true, // Reset Home tab when switching away
          }}
        />

        {/* News Tab with Reset */}
        <Tab.Screen
          name="News"
          component={ProfileScreen}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault(); // Prevent default behavior
              navigation.reset({
                index: 0,
                routes: [{ name: 'News' }], // Reset the stack for News tab
              });
            },
          })}
        />

        {/* Tips Tab */}
        <Tab.Screen
          name="Tips"
          component={TipsScreen}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault(); // Prevent default behavior
              navigation.reset({
                index: 0,
                routes: [{ name: 'Tips' }], // Reset the stack for News tab
              });
            },
          })}
        />

        {/* Calculators Tab with Reset */}
        <Tab.Screen
          name="Calculators"
          component={SectionDetails}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault(); // Prevent default behavior
              navigation.reset({
                index: 0,
                routes: [{ name: 'Calculators' }], // Reset the stack for Calculators tab
              });
            },
          })}
        />

        {/* Games Tab with Reset */}
        <Tab.Screen
          name="Games"
          component={GamesScreen}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault(); // Prevent default behavior
              navigation.reset({
                index: 0,
                routes: [{ name: 'Games' }], // Reset the stack for Games tab
              });
            },
          })}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
