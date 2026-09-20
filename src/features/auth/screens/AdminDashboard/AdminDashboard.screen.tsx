import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import {
  AdminDashboardView,
  AdminDashboardMetrics,
  LevelUsage,
  CategoryShare,
} from './AdminDashboard.view';

// TODO: reemplazar por datos reales cuando el backend exponga estas métricas.
const METRICS: AdminDashboardMetrics = {
  totalQuestions: 156,
  totalCategories: 12,
  totalUsers: 2847,
  activeUsers: 1234,
  totalGames: 8921,
  questionsAnswered: 45678,
  newUsersThisWeek: 156,
  averageScore: 76,
  completionRate: 85,
  retentionRate: 72,
};

const LEVEL_USAGE: LevelUsage[] = [
  { label: 'Beginners', percentage: 65 },
  { label: 'Intermediate', percentage: 25 },
  { label: 'Advanced', percentage: 10 },
];

const CATEGORY_DISTRIBUTION: CategoryShare[] = [
  { label: 'Vocabulary', percentage: 35 },
  { label: 'Grammar', percentage: 25 },
  { label: 'Listening', percentage: 20 },
  { label: 'Speaking', percentage: 15 },
  { label: 'Others', percentage: 5 },
];

const AdminDashboardScreen = () => {
  const navigation = useNavigation();
  const { handleSignOut, loading: signOutLoading } = useAuth();
  const [confirmSignOutVisible, setConfirmSignOutVisible] = useState(false);

  const handleConfirmSignOut = () => {
    setConfirmSignOutVisible(false);
    handleSignOut();
  };

  return (
    <>
      <AdminDashboardView
        metrics={METRICS}
        levelUsage={LEVEL_USAGE}
        categoryDistribution={CATEGORY_DISTRIBUTION}
        onNavigateToQuestions={() => navigation.navigate('ManageQuestionsScreen' as never)}
        onNavigateToCategories={() => navigation.navigate('ManageCategoriesScreen' as never)}
        onSignOut={() => setConfirmSignOutVisible(true)}
        signOutLoading={signOutLoading}
      />

      <ConfirmDialog
        visible={confirmSignOutVisible}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmLabel="Sign Out"
        cancelLabel="Cancel"
        destructive
        onConfirm={handleConfirmSignOut}
        onCancel={() => setConfirmSignOutVisible(false)}
      />
    </>
  );
};

export default AdminDashboardScreen;
