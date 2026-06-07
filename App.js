import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';

import { AuthProvider } from './src/context/AuthContext';
import { AppDataProvider } from './src/context/AppDataContext';
import RootNavigator from './src/navigation/RootNavigator';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const appTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0f172a',
    card: '#1e293b',
    text: '#ffffff',
    border: '#334155',
    primary: '#22c55e',
  },
};

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <NavigationContainer theme={appTheme}>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </AppDataProvider>
    </AuthProvider>
  );
}
