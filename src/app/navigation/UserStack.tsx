import GameScreen from '@/features/game/screens/Game';
import UserDashboardScreen from '@/features/auth/screens/UserDashboard';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const UserStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1 } }}>
    <Stack.Screen name="UserDashboard" component={UserDashboardScreen} />
    <Stack.Screen name="GameScreen" component={GameScreen} />
  </Stack.Navigator>
);
