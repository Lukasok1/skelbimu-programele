import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdsProvider } from './src/context/AdsContext';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import AdDetailsScreen from './src/screens/AdDetailsScreen';
import AdFormScreen from './src/screens/AdFormScreen';
import AdsListScreen from './src/screens/AdsListScreen';
import AuthScreen from './src/screens/AuthScreen';

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
            title: route.params?.ad ? 'Redaguoti skelbimą' : 'Naujas skelbimas',
          })}
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ title: 'Paskyra' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdsProvider>
          <RootNavigator />
        </AdsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
/*11–44 eil. (RootNavigator): sukuria navigacijos medį su 3 ekranais: sąrašo (AdsList), detalių (AdDetails) ir formos (AdForm).

33–39 eil.: dinamiškai keičia formos ekrano viršutinės juostos pavadinimą – jei perduotas ad objektas, rodo „Redaguoti skelbimą“, jei ne – „Naujas skelbimas“.

46–54 eil. (App): apgaubia visą programėlę ThemeProvider ir AdsProvider, kad bet kuris ekranas galėtų pasiekti valiutą, spalvas ir skelbimų sąrašą. */