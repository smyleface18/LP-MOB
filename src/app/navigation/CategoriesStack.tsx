import ManageCategoriesScreen from '@/features/category/screens/Categories-Manages/ManageCategories.screen';
import CreateCategoryScreen from '@/features/category/screens/Cateory-Create/CreateCategory.screen';
import CategoryDetailScreen from '@/features/category/screens/Category-Detail/CategoryDetail.screen';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

/** Solo se importa desde MainTabs.web.tsx — nunca desde la variante nativa,
 * así estas pantallas (y sus íconos) no entran al bundle de iOS/Android. */
export const CategoriesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { flex: 1 } }}>
    <Stack.Screen name="ManageCategories" component={ManageCategoriesScreen} />
    <Stack.Screen name="CreateCategory" component={CreateCategoryScreen} />
    <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
  </Stack.Navigator>
);
