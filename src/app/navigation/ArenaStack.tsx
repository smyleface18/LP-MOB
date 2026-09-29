import { createStackNavigator } from '@react-navigation/stack';
import ArenaHomeScreen from '@/features/game/screens/ArenaHome/ArenaHome.screen';
import GameScreen from '@/features/game/screens/Game';
import StoryScreen from '@/features/story/screens/Story';

export type ArenaStackParamList = {
  ArenaHome: undefined;
  /** La trivia. */
  Game: undefined;
  Story: undefined;
};

const Stack = createStackNavigator<ArenaStackParamList>();

/** Tab "Arena": el inicio con los dos modos (Historieta y Trivia) y cada juego. */
export const ArenaStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1 } }}>
    <Stack.Screen name="ArenaHome" component={ArenaHomeScreen} />
    <Stack.Screen name="Game" component={GameScreen} />
    <Stack.Screen name="Story" component={StoryScreen} />
  </Stack.Navigator>
);
