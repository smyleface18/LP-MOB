import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
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
  { label: 'Beginners', percentage: 65, color: 'primary' },
  { label: 'Intermediate', percentage: 25, color: 'secondary' },
  { label: 'Advanced', percentage: 10, color: 'accent' },
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

  const handleSignOutPress = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => handleSignOut() },
    ]);
  };

  return (
    <AdminDashboardView
      metrics={METRICS}
      levelUsage={LEVEL_USAGE}
      categoryDistribution={CATEGORY_DISTRIBUTION}
      onNavigateToQuestions={() => navigation.navigate('ManageQuestionsScreen' as never)}
      onNavigateToCategories={() => navigation.navigate('ManageCategoriesScreen' as never)}
      onSignOut={handleSignOutPress}
      signOutLoading={signOutLoading}
    />
  );
};

export default AdminDashboardScreen;
