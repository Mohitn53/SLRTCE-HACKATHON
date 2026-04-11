import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './app/AppNavigator';
import { AuthProvider } from './store/authStore';
import { LanguageProvider } from './store/languageStore';
import { CommunityProvider } from './store/communityStore';

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <CommunityProvider>
            <StatusBar style="dark" />
            <AppNavigator />
          </CommunityProvider>
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
