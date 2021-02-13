import React from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs'
import AppIntro from './src/screens/AppIntro';
import EmergencyScreen from './src/screens/EmergencyScreen';
import InjuredScreen from './src/screens/InjuredScreen';
import SupplyScreen from './src/screens/SupplyScreen';
import DemandScreen from './src/screens/DemandScreen';
import MapScreen from './src/screens/MapScreen';
import { setNavigator } from './src/navigationRef';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Provider as AppProvider } from './src/context/AppContext';
import FlashMessage from 'react-native-flash-message';

const mainFlow = createBottomTabNavigator({
  Home: {
    screen: MapScreen,
    navigationOptions: {
      tabBarLabel: false,
      tabBarIcon: ({ focused, tintColor }) => {
        return <Icon name="map-marker" size={30} color={tintColor} />;
      },
      tabBarOptions: {
        showLabel: false
      }
    }
  },
  Home2: {
    screen: EmergencyScreen,
    navigationOptions: {
      tabBarIcon: ({ focused, tintColor }) => {
        return <Icon name="exclamation-circle" size={30} color={tintColor} />;
      },
      tabBarOptions: {
        showLabel: false
      }
    }
  },
  Home3: {
    screen: InjuredScreen,
    navigationOptions: {
      tabBarIcon: ({ focused, tintColor }) => {
        return <Icon name="ambulance" size={30} color={tintColor} />;
      },
      tabBarOptions: {
        showLabel: false
      },
    },
  },
  Home4: {
    screen: DemandScreen,
    navigationOptions: {
      tabBarIcon: ({ focused, tintColor }) => {
        return <Icon name="life-ring" size={30} color={tintColor} />;
      },
      tabBarOptions: {
        showLabel: false
      },
    },
  },
  Home5: {
    screen: SupplyScreen,
    navigationOptions: {
      tabBarIcon: ({ focused, tintColor }) => {
        return <Icon name="hand-o-up" size={30} color={tintColor} />;
      },
      tabBarOptions: {
        showLabel: false
      },
    },
  },
});
const switchNavigator = createSwitchNavigator({
  AppIntro: AppIntro,
  mainFlow
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <AppProvider>
      <App ref={(navigator) => { setNavigator(navigator) }}/>
      <FlashMessage position="top" />
    </AppProvider>
  )
}
