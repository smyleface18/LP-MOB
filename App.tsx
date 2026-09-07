import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet } from 'react-native';
import { AppNavigator } from '@/app/navigation/AppNavigator';
import TokenRefreshProvider from '@/features/auth/hooks/TokenRefreshProvider';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <NavigationContainer>
          <TokenRefreshProvider>
            <AppNavigator />
          </TokenRefreshProvider>
        </NavigationContainer>
        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 1280 : undefined,
    alignSelf: 'center',
  },
});
export default App;
