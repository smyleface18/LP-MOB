import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminDashboardScreen from '@/features/auth/screens/AdminDashboard';
import { UserRoles } from '@/features/auth/types';
import { ArenaStack } from './ArenaStack';
import { ExploreStack } from './ExploreStack';
import { ProfileStack } from './ProfileStack';
import { TabBarWeb } from './Tab-Bar-Web/TabBarWeb';
import { CategoriesStack } from './CategoriesStack';
import { QuestionsStack } from './QuestionsStack';
import { StoriesAdminStack } from './StoriesAdminStack';

const Tab = createBottomTabNavigator();

export interface MainTabsProps {
  role?: UserRoles;
}

/**
 * Variante web del menú principal, en un sidebar vertical
 * (`tabBarPosition: "left"`). Los mismos tabs base que la nativa:
 * - Jugador: Arena, Explorar y Perfil (su dashboard personal).
 * - Admin: lo mismo, más Dashboard (estadísticas de usuarios y de la app) y
 *   Categorías/Preguntas/Historietas, que son solo de escritorio a propósito (ver MainTabs.tsx, la variante nativa, que no las
 *   registra ni las importa).
 * El primer tab registrado es el que se abre al entrar.
 */
export const MainTabs: React.FC<MainTabsProps> = ({ role }) => {
  const isAdmin = role === UserRoles.ADMIN;

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarPosition: 'left' }}
      tabBar={(props) => <TabBarWeb {...props} />}
    >
      {isAdmin && <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />}
      <Tab.Screen name="Arena" component={ArenaStack} />
      <Tab.Screen name="Explorar" component={ExploreStack} />
      <Tab.Screen name="Perfil" component={ProfileStack} />
      {isAdmin && <Tab.Screen name="Categorias" component={CategoriesStack} />}
      {isAdmin && <Tab.Screen name="Preguntas" component={QuestionsStack} />}
      {isAdmin && <Tab.Screen name="Historietas" component={StoriesAdminStack} />}
    </Tab.Navigator>
  );
};
