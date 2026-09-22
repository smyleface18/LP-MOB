import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserDashboardScreen from '@/features/auth/screens/UserDashboard';
import AdminDashboardScreen from '@/features/auth/screens/AdminDashboard';
import ProfileScreen from '@/features/auth/screens/Profile';
import GameScreen from '@/features/game/screens/Game';
import RankingScreen from '@/features/ranking/screens/Ranking';
import { UserRoles } from '@/features/auth/types';
import { TabBarWeb } from './Tab-Bar-Web/TabBarWeb';
import { CategoriesStack } from './CategoriesStack';
import { QuestionsStack } from './QuestionsStack';

const Tab = createBottomTabNavigator();

export interface MainTabsProps {
  role?: UserRoles;
}

/**
 * Variante web del menú principal: los mismos 4 tabs base que la nativa,
 * mostrados en un sidebar vertical (`tabBarPosition: "left"`), más dos tabs
 * extra (Categorías/Preguntas) solo para ADMIN — esas dos secciones son
 * solo de escritorio a propósito (ver MainTabs.tsx, la variante nativa, que
 * no las registra ni las importa).
 */
export const MainTabs: React.FC<MainTabsProps> = ({ role }) => {
  const isAdmin = role === UserRoles.ADMIN;

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarPosition: 'left' }}
      tabBar={(props) => <TabBarWeb {...props} />}
    >
      <Tab.Screen
        name="Dashboard"
        component={isAdmin ? AdminDashboardScreen : UserDashboardScreen}
      />
      <Tab.Screen name="Arena" component={GameScreen} />
      <Tab.Screen name="Ranking" component={RankingScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
      {isAdmin && <Tab.Screen name="Categorias" component={CategoriesStack} />}
      {isAdmin && <Tab.Screen name="Preguntas" component={QuestionsStack} />}
    </Tab.Navigator>
  );
};
