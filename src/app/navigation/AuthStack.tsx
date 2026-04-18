import SignInScreen from '@/features/auth/screens/SignIn.screen';
import SignupScreen from '@/features/auth/screens/Signup.screen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);
