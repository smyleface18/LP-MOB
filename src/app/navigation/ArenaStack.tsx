import { createStackNavigator } from '@react-navigation/stack';
import GameScreen from '@/features/game/screens/Game';
import StoryScreen from '@/features/story/screens/Story';

export type ArenaStackParamList = {
  Game: undefined;
  Story: undefined;
};

const Stack = createStackNavigator<ArenaStackParamList>();

/** Tab "Arena": la trivia (menú principal) y el modo Historieta, que se abre desde ahí. */
export const ArenaStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1 } }}>
    <Stack.Screen name="Game" component={GameScreen} />
    <Stack.Screen name="Story" component={StoryScreen} />
  </Stack.Navigator>
);
