import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { navigationRef } from './NavigationService'; // Import the navigationRef

import HomeScreen from '../screens/HomeScreen';
import SectionDetails from '../screens/DetailsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GamesScreen from '../screens/GamesScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'Home') {
              return <MaterialIcons name="home" size={size} color={color} />;
            } else if (route.name === 'Calculators') {
              return <MaterialIcons name="calculate" size={size} color={color} />;
            } else if (route.name === 'Games') {
              return <MaterialIcons name="sports-esports" size={size} color={color} />;
            } else if (route.name === 'News') {
              return <MaterialIcons name="feed" size={size} color={color} />;
            }
          },
          tabBarActiveTintColor: '#94C83D',
          tabBarInactiveTintColor: '#000',
          tabBarStyle: {
            backgroundColor: '#E8ECEF',
            height: 60,
          },
          headerShown: false, // No default headers
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />
        <Tab.Screen
          name="News"
          component={ProfileScreen}
        />
        <Tab.Screen
          name="Calculators"
          component={SectionDetails}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              // Prevent default behavior
              e.preventDefault();

              // Navigate to Calculators and reset state
              navigation.navigate('Calculators', { reset: true });
            },
          })}
        />
        <Tab.Screen
  name="Games"
  component={GamesScreen}
  listeners={({ navigation }) => ({
    tabPress: (e) => {
      // Prevent default tab behavior
      e.preventDefault();

      // Navigate to Games and reset its state
      navigation.navigate('Games', { reset: true });
    },
  })}
  />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
