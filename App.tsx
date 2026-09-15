import React, { useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts as useBaloo,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from '@expo-google-fonts/baloo-2';
import {
  useFonts as useNunito,
  Nunito_400Regular,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { AppNavigator } from '@/app/navigation/AppNavigator';
import { ThemeProvider } from '@/app/providers/theme.provider';
import TokenRefreshProvider from '@/features/auth/hooks/TokenRefreshProvider';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [balooLoaded] = useBaloo({
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
  });

  const [nunitoLoaded] = useNunito({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  useEffect(() => {
    if (balooLoaded && nunitoLoaded) {
      SplashScreen.hideAsync();
    }
  }, [balooLoaded, nunitoLoaded]);

  if (!balooLoaded || !nunitoLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <NavigationContainer>
            <TokenRefreshProvider>
              <AppNavigator />
            </TokenRefreshProvider>
          </NavigationContainer>
          <StatusBar style="dark" />
        </SafeAreaView>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 1280 : undefined,
    alignSelf: 'center',
  },
});

