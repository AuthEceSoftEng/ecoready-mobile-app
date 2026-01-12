import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialIcons } from '@expo/vector-icons';
import { navigationRef } from './NavigationService'; // Import the navigationRef

// Import your screen components
import HomeScreen from '../screens/HomeScreen';
import SectionDetails from '../screens/DetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NewsScreen from '../screens/NewsScreen';
import GamesScreen from '../screens/GamesScreen';
import TipsScreen from '../screens/TipScreen'; // Import the new TipsScreen
import SettingsScreen from '../screens/SettingsScreen'; // Import Settings Screen

// Create the Tab Navigator and Stack Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const TabNavigator = () => {
  return (
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
              case 'Profile':
                return <MaterialIcons name="account-circle" size={size} color={color} />;
              case 'News':
                return <MaterialIcons name="newspaper" size={size} color={color} />;
              case 'Tips':
                return <MaterialIcons name="tips-and-updates" size={size} color={color} />;
              case 'Settings':
                return <MaterialIcons name="settings" size={size} color={color} />;
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
          unmountOnBlur: true, // <-- Added globally for all tabs
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

        {/* News Tab */}
        <Tab.Screen
          name="News"
          component={NewsScreen}
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
                routes: [{ name: 'Tips' }], // Reset the stack for Tips tab
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
  );
};

export default AppNavigator;
