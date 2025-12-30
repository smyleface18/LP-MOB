import { createStackNavigator } from "@react-navigation/stack";
import SignupScreen from "../screens/Signup.screen";
import SignInScreen from "../screens/SignIn.screen";

const Stack = createStackNavigator();

export const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="Signup" component={SignupScreen} />
  </Stack.Navigator>
);
