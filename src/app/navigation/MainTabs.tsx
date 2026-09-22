import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserDashboardScreen from '@/features/auth/screens/UserDashboard';
import AdminDashboardScreen from '@/features/auth/screens/AdminDashboard';
import ProfileScreen from '@/features/auth/screens/Profile';
import GameScreen from '@/features/game/screens/Game';
import RankingScreen from '@/features/ranking/screens/Ranking';
import { UserRoles } from '@/features/auth/types';
import { TabBarMobile } from './Tab-Bar-Mobile/TabBarMobile';

const Tab = createBottomTabNavigator();

export interface MainTabsProps {
  role?: UserRoles;
}

/**
 * Variante nativa (iOS/Android) del menú principal: los 4 tabs base con
 * bottom nav. Las secciones de administración (Categorías/Preguntas) son
 * solo de escritorio y viven en MainTabs.web.tsx — Metro resuelve ese
 * archivo en su lugar al bundlear para web, así que ManageCategories,
 * ManageQuestions, etc. nunca entran al bundle nativo.
 */
export const MainTabs: React.FC<MainTabsProps> = ({ role }) => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <TabBarMobile {...props} />}
  >
    <Tab.Screen
      name="Dashboard"
      component={role === UserRoles.ADMIN ? AdminDashboardScreen : UserDashboardScreen}
    />
    <Tab.Screen name="Arena" component={GameScreen} />
    <Tab.Screen name="Ranking" component={RankingScreen} />
    <Tab.Screen name="Perfil" component={ProfileScreen} />
  </Tab.Navigator>
);
