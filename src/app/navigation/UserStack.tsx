import GameScreen from '@/features/game/screens/Game.screen';
import UserDashboardScreen from '@/features/auth/screens/UserDashboard.screen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const UserStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="UserDashboard" component={UserDashboardScreen} />
    <Stack.Screen name="GameScreen" component={GameScreen} />
  </Stack.Navigator>
);
