import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
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
import { ThemeProvider, useTheme } from '@/app/providers/theme.provider';
import TokenRefreshProvider from '@/features/auth/providers/TokenRefreshProvider';

SplashScreen.preventAutoHideAsync();

// Sin esto, la versión web no sincroniza la pantalla actual con la URL/
// historial del navegador: el botón "atrás" del navegador no navega dentro
// de la app. AppNavigator monta AuthStack/UserStack/AdminStack como árboles
// separados (no anidados bajo un navigator raíz común), pero linking igual
// resuelve por nombre de pantalla sin importar cuál esté montado.
const linking = {
  prefixes: [],
  config: {
    screens: {
      SignIn: 'sign-in',
      Signup: 'sign-up',
      UserDashboard: 'dashboard',
      GameScreen: 'game',
      AdminDashboard: 'admin',
    },
  },
};

// Separado de App() porque necesita useTheme(), que solo funciona dentro de
// ThemeProvider (App() todavía no está "adentro" del Provider que él mismo
// renderiza).
function AppShell() {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <NavigationContainer linking={linking}>
        <TokenRefreshProvider>
          <AppNavigator />
        </TokenRefreshProvider>
      </NavigationContainer>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

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
        <AppShell />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.color.background,
    },
  });

