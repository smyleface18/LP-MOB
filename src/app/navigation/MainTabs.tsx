import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { UserRoles } from '@/features/auth/types';
import { ArenaStack } from './ArenaStack';
import { ExploreStack } from './ExploreStack';
import { ProfileStack } from './ProfileStack';
import { TabBarMobile } from './Tab-Bar-Mobile/TabBarMobile';

const Tab = createBottomTabNavigator();

export interface MainTabsProps {
  role?: UserRoles;
}

/**
 * Variante nativa (iOS/Android) del menú principal, con bottom nav: Arena,
 * Explorar (catálogo de historietas) y Perfil, el dashboard personal
 * (estadísticas, sus historietas, cerrar sesión). Igual para jugadores y admins.
 * Todo lo de administración (Dashboard de admin, Categorías, Preguntas,
 * Historietas) es solo web, para el rol ADMIN, y vive en MainTabs.web.tsx:
 * Metro resuelve ese archivo en su lugar al bundlear para web, así que nunca
 * entra al bundle nativo. `role` se recibe igual que en web, pero acá no cambia nada.
 */
export const MainTabs: React.FC<MainTabsProps> = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBarMobile {...props} />}
    >
      <Tab.Screen name="Arena" component={ArenaStack} />
      <Tab.Screen name="Explorar" component={ExploreStack} />
      <Tab.Screen name="Perfil" component={ProfileStack} />
    </Tab.Navigator>
  );
};
