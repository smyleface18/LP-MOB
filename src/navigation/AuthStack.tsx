import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Login.screen";
import SignupScreen from "../screens/Signup.screen";

const Stack = createStackNavigator();

export const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);
