import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style="dark" translucent />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
export default App;
