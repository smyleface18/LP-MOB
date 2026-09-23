import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useGame } from '@/features/game/hooks/useGame';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
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
  const { user } = useUser();
  const { handleSignOut, loading: signOutLoading } = useAuth();
  const [confirmSignOutVisible, setConfirmSignOutVisible] = useState(false);

  const handleConfirmSignOut = () => {
    setConfirmSignOutVisible(false);
    handleSignOut();
  };

  const gamesWon = user?.score ?? 0;

  return (
    <>
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

export default UserDashboardScreen;
