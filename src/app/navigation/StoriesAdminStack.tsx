import { createStackNavigator } from '@react-navigation/stack';
import ManageStoriesScreen from '@/features/story/admin/screens/ManageStories.screen';
import AdminStoryDetailScreen from '@/features/story/admin/screens/AdminStoryDetail.screen';

export type StoriesAdminStackParamList = {
  ManageStories: undefined;
  AdminStoryDetail: { storyId: string };
};

const Stack = createStackNavigator<StoriesAdminStackParamList>();

/** Solo se importa desde MainTabs.web.tsx — nunca desde la variante nativa,
 * así la moderación de historietas no entra al bundle de iOS/Android. */
export const StoriesAdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1 } }}>
    <Stack.Screen name="ManageStories" component={ManageStoriesScreen} />
    <Stack.Screen name="AdminStoryDetail" component={AdminStoryDetailScreen} />
  </Stack.Navigator>
);
