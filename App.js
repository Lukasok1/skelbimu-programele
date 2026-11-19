import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdsProvider } from './src/context/AdsContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AdDetailsScreen from './src/screens/AdDetailsScreen';
import AdFormScreen from './src/screens/AdFormScreen';
import AdsListScreen from './src/screens/AdsListScreen';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen
          name="AdsList"
          component={AdsListScreen}
          options={{ title: 'Technikos skelbimai' }}
        />
        <Stack.Screen
          name="AdDetails"
          component={AdDetailsScreen}
          options={{ title: 'Skelbimo detalės' }}
        />
        <Stack.Screen
          name="AdForm"
          component={AdFormScreen}
          options={({ route }) => ({
            title: route.params?.ad
              ? 'Redaguoti skelbimą'
              : 'Naujas skelbimas',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AdsProvider>
        <RootNavigator />
      </AdsProvider>
    </ThemeProvider>
  );
}