import AdminDashboardScreen from '@/features/auth/screens/AdminDashboard';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
  </Stack.Navigator>
);
