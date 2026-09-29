import React from 'react';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAdminStats } from '@/features/stats/useStats';
import { AdminDashboardView } from './AdminDashboard.view';

/**
 * Tab "Dashboard" (solo ADMIN): estadísticas reales de usuarios y de la app
 * (`GET /admin/stats`). Se recargan al volver a la pantalla.
 */
const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const { data, loading, error, refresh } = useAdminStats();
  const navigate = navigation.navigate as (name: string, params?: object) => void;
  // Las secciones de administración son tabs que solo existen en web.
  const isWeb = Platform.OS === 'web';

  return (
    <AdminDashboardView
      stats={data}
      loading={loading}
      error={error}
      onRefresh={() => void refresh()}
      onNavigateToQuestions={
        isWeb ? () => navigate('Preguntas', { screen: 'ManageQuestions' }) : undefined
      }
      onNavigateToCategories={
        isWeb ? () => navigate('Categorias', { screen: 'ManageCategories' }) : undefined
      }
      onNavigateToStories={
        isWeb ? () => navigate('Historietas', { screen: 'ManageStories' }) : undefined
      }
    />
  );
};

export default AdminDashboardScreen;
