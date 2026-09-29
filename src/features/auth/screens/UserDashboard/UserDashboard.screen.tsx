import React, { useCallback, useRef, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useGame } from '@/features/game/hooks/useGame';
import { usePlayerStats } from '@/features/stats/useStats';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { UserDashboardView } from './UserDashboard.view';

// Racha con la que "Streak Power" llega al 100%.
const STREAK_POWER_FULL = 10;

/**
 * Tab "Perfil" (jugadores y admins): el dashboard personal con las
 * estadísticas reales (`GET /stats/me`), el acceso a sus historietas y el
 * cierre de sesión.
 */
const UserDashboardScreen = () => {
  const navigation = useNavigation();
  const { state } = useGame();
  const { user, getMe } = useUser();
  // Se recargan solas al volver a esta pantalla (ej. después de una partida).
  const stats = usePlayerStats();
  const [refreshing, setRefreshing] = useState(false);

  // getMe se recrea en cada render: el ref da siempre la versión actual sin
  // re-disparar el efecto de foco.
  const getMeRef = useRef(getMe);
  getMeRef.current = getMe;

  // El usuario (nombre y avatar) también se actualiza al volver.
  useFocusEffect(
    useCallback(() => {
      void getMeRef.current();
    }, []),
  );

  const { refresh: refreshStats } = stats;
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([getMeRef.current(), refreshStats()]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshStats]);

  const { handleSignOut, loading: signOutLoading } = useAuth();
  const [confirmSignOutVisible, setConfirmSignOutVisible] = useState(false);

  const handleConfirmSignOut = () => {
    setConfirmSignOutVisible(false);
    handleSignOut();
  };

  const data = stats.data;
  const currentStreak = data?.currentStreak ?? user?.currentStreak ?? 0;

  return (
    <>
      <UserDashboardView
        username={user?.username}
        avatarUrl={user?.avatar?.url}
        isConnected={state.user.isConnected}
        stats={{
          scoreLabel: `${data?.score ?? user?.score ?? 0} XP`,
          gamesWon: data?.gamesWon ?? user?.gamesWon ?? 0,
          currentStreak,
          categoriesCount: data?.trivia.categoriesPracticed ?? 0,
          accuracyPercentage: data?.trivia.accuracy ?? 0,
          winRatePercentage: data?.winRate ?? 0,
          streakPowerPercentage: Math.min(
            Math.round((currentStreak / STREAK_POWER_FULL) * 100),
            100,
          ),
        }}
        levelProgress={(data?.levels ?? []).map((level) => ({
          label: `${level.level} · ${level.answered} answers`,
          percentage: level.accuracy,
        }))}
        stories={{
          played: data?.stories.played ?? 0,
          panelsWritten: data?.stories.panelsWritten ?? 0,
          averagePanelScore: data?.stories.averagePanelScore ?? 0,
        }}
        statsError={stats.error}
        // El historial está en el stack de Perfil: "volver" regresa acá.
        onOpenStories={() => navigation.navigate('StoryHistory' as never)}
        onSignOut={() => setConfirmSignOutVisible(true)}
        signOutLoading={signOutLoading}
        onRefresh={refresh}
        refreshing={refreshing || (stats.loading && !data)}
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
