import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '@/features/game/hooks/useGame';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import { UserDashboardView, LevelProgress } from './UserDashboard.view';

// TODO: reemplazar por datos reales cuando el backend exponga historial de partidas.
const TOTAL_GAMES_PLAYED = 45;
const CURRENT_STREAK = 5;
const AVERAGE_SCORE = 76;

const LEVEL_PROGRESS: LevelProgress[] = [
  { label: 'Beginner', percentage: 65 },
  { label: 'Intermediate', percentage: 25 },
  { label: 'Advanced', percentage: 10 },
];

const UserDashboardScreen = () => {
  const navigation = useNavigation();
  const { state } = useGame();
  const { user, getMe } = useUser();
  const { handleSignOut, loading: signOutLoading } = useAuth();

  useEffect(() => {
    getMe();
  }, []);

  const handleSignOutPress = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => handleSignOut() },
    ]);
  };

  const gamesWon = user?.score ?? 0;

  return (
    <UserDashboardView
      username={user?.username}
      avatarUrl={user?.avatar?.url}
      isConnected={state.user.isConnected}
      stats={{
        scoreLabel: `${user?.score ?? 0} XP`,
        gamesWon,
        currentStreak: CURRENT_STREAK,
        categoriesCount: 0,
        averageScore: AVERAGE_SCORE,
        winRatePercentage: Math.round((gamesWon / TOTAL_GAMES_PLAYED) * 100),
        streakPowerPercentage: CURRENT_STREAK * 10,
      }}
      levelProgress={LEVEL_PROGRESS}
      onHowToPlay={() => navigation.navigate('GameScreen' as never)}
      onSignOut={handleSignOutPress}
      signOutLoading={signOutLoading}
    />
  );
};

export default UserDashboardScreen;
