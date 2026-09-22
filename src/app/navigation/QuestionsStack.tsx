import ManageQuestionsScreen from '@/features/question/screens/ManageQuestions.screen';
import CreateQuestionScreen from '@/features/question/screens/CreateQuestion.screen';
import QuestionDetailScreen from '@/features/question/screens/QuestionDetail.screen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

/** Solo se importa desde MainTabs.web.tsx — nunca desde la variante nativa,
 * así estas pantallas no entran al bundle de iOS/Android. */
export const QuestionsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1 } }}>
    <Stack.Screen name="ManageQuestions" component={ManageQuestionsScreen} />
    <Stack.Screen name="CreateQuestion" component={CreateQuestionScreen} />
    <Stack.Screen name="QuestionDetail" component={QuestionDetailScreen} />
  </Stack.Navigator>
);
