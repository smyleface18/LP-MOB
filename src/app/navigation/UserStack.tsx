import { createStackNavigator } from "@react-navigation/stack";
import UserDashboardScreen from "../screens/UserDashboard.screen";
import GameScreen from "../screens/Game.screen";

const Stack = createStackNavigator();

export const UserStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UserDashboard" component={UserDashboardScreen} />
    <Stack.Screen name="GameScreen" component={GameScreen} />
  </Stack.Navigator>
);
