import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import LoginScreen from "./src/screens/Login.screen";
import SignupScreen from "./src/screens/Signup.screen";
import HomeScreen from "./src/screens/Home.screen";
import AdminDashboardScreen from "./src/screens/AdminDashboard.screen";
import ManageQuestionsScreen from "./src/screens/ManageQuestions.screen";
import CreateQuestionScreen from "./src/screens/CreateQuestion.screen";
import QuestionDetailScreen from "./src/screens/QuestionDetail.screen";
import ManageCategoriesScreen from "./src/screens/ManageCategories.screen";
import CategoryDetailScreen from "./src/screens/CategoryDetail.screen";
import CreateCategoryScreen from "./src/screens/CreateCategory.screen";
import GameScreen from "./src/screens/Game.screen";
import UserDashboardScreen from "./src/screens/UserDashboard.screen";
import { AppNavigator } from "./src/navigation/AppNavigator";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
