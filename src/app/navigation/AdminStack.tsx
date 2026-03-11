import { createStackNavigator } from "@react-navigation/stack";
import AdminDashboardScreen from "../screens/AdminDashboard.screen";
import ManageQuestionsScreen from "../screens/ManageQuestions.screen";
import ManageCategoriesScreen from "../screens/ManageCategories.screen";

const Stack = createStackNavigator();

export const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
    <Stack.Screen name="ManageQuestions" component={ManageQuestionsScreen} />
    <Stack.Screen name="ManageCategories" component={ManageCategoriesScreen} />
  </Stack.Navigator>
);
