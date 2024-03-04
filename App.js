import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as SQLite from "expo-sqlite";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/HomeScreen';
import GamesScreen from './screens/GamesScreen';
import ScoringScreen from './screens/ScoringScreen';

const homeName = "Home";
const gamesName = "Games";
const scoringName = "Scoring";

const Stack = createStackNavigator();


export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={homeName}>

        <Stack.Screen name = {homeName} component={HomeScreen}/>
        <Stack.Screen name = {gamesName} component={GamesScreen}
          options={{
            headerRight: () => {<Button title = "Add"></Button>}
          }}
        />
        <Stack.Screen name = {scoringName} component={ScoringScreen}/>
        {/* <Stack.Screen name = {scoringName} component={ScoringScreen}/> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
