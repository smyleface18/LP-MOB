import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import LoginScreen from './src/screens/Login.screen';
import SignupScreen from './src/screens/Signup.screen';
import HomeScreen from './src/screens/Home.screen';
import AdminDashboardScreen from './src/screens/AdminDashboard.screen';
import ManageQuestionsScreen from './src/screens/ManageQuestions.screen';
import CreateQuestionScreen from './src/screens/CreateQuestion.screen';
import QuestionDetailScreen from './src/screens/QuestionDetail.screen';
import ManageCategoriesScreen from './src/screens/ManageCategories.screen';
import CategoryDetailScreen from './src/screens/CategoryDetail.screen';
import CreateCategoryScreen from './src/screens/CreateCategory.screen';
import GameScreen from './src/screens/Game.screen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF" 
        translucent={true}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Home"
            screenOptions={{ 
              headerShown: false,
              cardStyle: { backgroundColor: '#FFFFFF' }
            }}
          >
            <Stack.Screen name="ManageQuestionsScreen" component={ManageQuestionsScreen} />
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="CreateQuestionScreen" component={CreateQuestionScreen} />
            <Stack.Screen name="QuestionDetail" component={QuestionDetailScreen} />
            <Stack.Screen name="ManageCategoriesScreen" component={ManageCategoriesScreen} />
            <Stack.Screen name="CategoryDetailScreen" component={CategoryDetailScreen} />
            <Stack.Screen name="CreateCategoryScreen" component={CreateCategoryScreen} />
            <Stack.Screen name="GameScreen" component={GameScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}