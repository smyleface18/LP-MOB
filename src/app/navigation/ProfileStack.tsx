import { createStackNavigator } from '@react-navigation/stack';
import UserDashboardScreen from '@/features/auth/screens/UserDashboard';
import StoryHistoryScreen from '@/features/story/screens/StoryHistory';
import StoryHistoryDetailScreen from '@/features/story/screens/StoryHistoryDetail';
import type { StoryListStackParamList } from './storyListRoutes';

export type ProfileStackParamList = { ProfileHome: undefined } & StoryListStackParamList;

const Stack = createStackNavigator<ProfileStackParamList>();

/**
 * Tab "Perfil": el dashboard personal y, desde ahí, el historial de
 * historietas del jugador. "Volver" desde el historial regresa al perfil.
 */
export const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1 } }}>
    <Stack.Screen name="ProfileHome" component={UserDashboardScreen} />
    <Stack.Screen name="StoryHistory" component={StoryHistoryScreen} />
    <Stack.Screen name="StoryHistoryDetail" component={StoryHistoryDetailScreen} />
  </Stack.Navigator>
);
