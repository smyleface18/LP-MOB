import { createStackNavigator } from '@react-navigation/stack';
import StoryHistoryScreen from '@/features/story/screens/StoryHistory';
import StoryHistoryDetailScreen from '@/features/story/screens/StoryHistoryDetail';
import type { StoryListStackParamList } from './storyListRoutes';

const Stack = createStackNavigator<StoryListStackParamList>();

/** Tab "Explorar": el catálogo con las historietas de todos los jugadores. */
export const ExploreStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1 } }}>
    <Stack.Screen
      name="StoryHistory"
      component={StoryHistoryScreen}
      initialParams={{ source: 'catalog' }}
    />
    <Stack.Screen name="StoryHistoryDetail" component={StoryHistoryDetailScreen} />
  </Stack.Navigator>
);
