import React, { useCallback, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useGame } from '@/features/game/hooks/useGame';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { UserDashboardView, LevelProgress } from './UserDashboard.view';

// Racha con la que "Streak Power" llega al 100%.
const STREAK_POWER_FULL = 10;

// TODO: reemplazar por datos reales cuando el backend exponga estas métricas.
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
  const [refreshing, setRefreshing] = useState(false);

  // getMe se recrea en cada render: el ref da siempre la versión actual sin
  // re-disparar el efecto de foco.
  const getMeRef = useRef(getMe);
  getMeRef.current = getMe;

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await getMeRef.current();
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Al volver al dashboard (ej. después de una partida) las métricas se
  // actualizan solas; el botón es para pedirlas a mano.
  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );
  const { handleSignOut, loading: signOutLoading } = useAuth();
  const [confirmSignOutVisible, setConfirmSignOutVisible] = useState(false);

  const handleConfirmSignOut = () => {
    setConfirmSignOutVisible(false);
    handleSignOut();
  };

  const gamesWon = user?.gamesWon ?? 0;
  const gamesPlayed = user?.gamesPlayed ?? 0;
  const currentStreak = user?.currentStreak ?? 0;

  return (
    <>
      <UserDashboardView
        username={user?.username}
        avatarUrl={user?.avatar?.url}
        isConnected={state.user.isConnected}
        stats={{
          scoreLabel: `${user?.score ?? 0} XP`,
          gamesWon,
          currentStreak,
          categoriesCount: 0,
          averageScore: AVERAGE_SCORE,
          winRatePercentage: gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0,
          streakPowerPercentage: Math.min(
            Math.round((currentStreak / STREAK_POWER_FULL) * 100),
            100,
          ),
        }}
        levelProgress={LEVEL_PROGRESS}
        onHowToPlay={() => navigation.navigate('GameScreen' as never)}
        onSignOut={() => setConfirmSignOutVisible(true)}
        signOutLoading={signOutLoading}
        onRefresh={refresh}
        refreshing={refreshing}
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
