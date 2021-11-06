import React from 'react';
import {
  SafeAreaView
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import OnMe from "./index";
import OnMeSearch from "./OnMeSearch";

const Tab = createMaterialTopTabNavigator();

export const OnMeNavigation = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
    <Tab.Navigator
      initialRouteName="OnMe"
      screenOptions={{
        tabBarActiveTintColor: '#030303',
        tabBarLabelStyle: { fontSize: 18 },
        tabBarStyle: { backgroundColor: '#D3E3F2'},
      }}
      >
      <Tab.Screen
        name="OnMe"
        component={OnMe}
        options={{ tabBarLabel: 'Мой подотчет' }}
      />
      <Tab.Screen
        name="OnMeSearch"
        component={OnMeSearch}
        options={{ tabBarLabel: 'Поиск' }}
      />
    </Tab.Navigator>
    </SafeAreaView>
  );
}
