import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import DashboardBackground from '@/features/auth/components/DashboardBackground';
import { Loading } from '@/shared/components/Loading';
import { MetricCard } from '@/shared/components/Metric/Metric.component';
import { CircularProgress } from '@/shared/components/CircularProgress/CircularProgress.component';
import { ProgressBar } from '@/shared/components/ProgressBar/ProgressBar.component';
import Button from '@/shared/components/Button/Button.component';
import { GRADIENT_PRESETS } from '@/shared/ui/theme/progressGradients';
import type { UserDashboardViewProps } from './UserDashboard.view';

const PAGE_MAX_WIDTH = 1120;
const DEFAULT_AVATAR_URL = 'https://cdn-icons-png.flaticon.com/512/7178/7178489.png';

// Igual que en la versión mobile: DashboardBackground es un rojo fijo en
// ambos themes, así que el texto encima necesita un color fijo también.
const HEADER_TEXT_ON_BANNER = '#F8FAFC';

const LEVEL_PROGRESS_GRADIENTS = [
  GRADIENT_PRESETS.secondaryToPrimary,
  GRADIENT_PRESETS.secondaryToAccent,
  GRADIENT_PRESETS.tricolorProgress,
];

// Layout de escritorio para UserDashboard: banner de identidad a todo el
// ancho arriba, y debajo dos columnas (métricas/performance a la izquierda,
// progreso de nivel + acciones a la derecha) para aprovechar el ancho en
// vez de dejar una sola columna angosta centrada. Se resuelve automático en
// builds web por la extensión .web.tsx; los apps nativos usan
// UserDashboard.view.tsx.
const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  username,
  avatarUrl = DEFAULT_AVATAR_URL,
  isConnected,
  stats,
  levelProgress,
  onHowToPlay,
  onSignOut,
  signOutLoading = false,
}) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <DashboardBackground />

          <View style={styles.avatar}>
            <Image source={{ uri: avatarUrl }} style={styles.avatarImage} resizeMode="cover" />
          </View>
          <Text style={styles.nickname}>{username}</Text>
          <View style={styles.connectionStatus}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isConnected ? theme.color.success : theme.color.error },
              ]}
            />
            <Text style={styles.statusText}>{isConnected ? 'Connected' : 'Disconnected'}</Text>
          </View>
        </View>

        <View style={styles.layout}>
          {/* Main column: metrics + performance */}
          <View style={styles.mainColumn}>
            <View style={styles.metricsGrid}>
              <MetricCard value={stats.scoreLabel} label="Score" />
              <MetricCard value={stats.gamesWon} label="Games Won" color="secondary" />
              <MetricCard value={stats.currentStreak} label="Current Streak" color="accent" />
              <MetricCard value={stats.categoriesCount} label="Categories" color="success" />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Performance</Text>
              <View style={styles.chartsRow}>
                <CircularProgress
                  percentage={stats.averageScore}
                  label="Average Score"
                  colors={GRADIENT_PRESETS.secondaryToPrimary}
                />
                <CircularProgress
                  percentage={stats.winRatePercentage}
                  label="Win Rate"
                  colors={GRADIENT_PRESETS.successToPrimary}
                />
                <CircularProgress
                  percentage={stats.streakPowerPercentage}
                  label="Streak Power"
                  colors={GRADIENT_PRESETS.tricolorEnergy}
                />
              </View>
            </View>
          </View>

          {/* Side column: level progress + actions */}
          <View style={styles.sideColumn}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Level Progress</Text>
              <View style={styles.statsContainer}>
                {levelProgress.map((level, index) => (
                  <ProgressBar
                    key={level.label}
                    percentage={level.percentage}
                    label={level.label}
                    colors={LEVEL_PROGRESS_GRADIENTS[index % LEVEL_PROGRESS_GRADIENTS.length]}
                  />
                ))}
              </View>
            </View>

            <View style={styles.actionsSection}>
              <Button
                title="How to Play"
                variant="secondary"
                size="large"
                onPress={onHowToPlay}
                style={styles.actionButton}
              />

              <Button
                title="Sign Out"
                variant="outlined"
                size="large"
                onPress={onSignOut}
                disabled={signOutLoading}
                style={[styles.actionButton, styles.signOutButton]}
              />
              {signOutLoading && (
                <View style={styles.loadingContainer}>
                  <Loading size={24} />
                  <Text style={styles.loadingText}>Signing out...</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
    },
    scrollContent: {
      flexGrow: 1,
      alignItems: 'center',
      paddingBottom: theme.spacing.xl,
    },
    page: {
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
    },
    header: {
      padding: isDesktop ? theme.spacing.xl * 1.5 : theme.spacing.xl,
      paddingTop: theme.spacing.xl * 1.5,
      borderBottomLeftRadius: theme.radius.lg,
      borderBottomRightRadius: theme.radius.lg,
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: theme.color.background,
    },
    avatar: {
      width: isDesktop ? 100 : 80,
      height: isDesktop ? 100 : 80,
      borderRadius: theme.radius.full,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      marginBottom: theme.spacing.sm,
      backgroundColor: theme.color.surface,
      borderWidth: theme.borderWidth.sm,
      borderColor: HEADER_TEXT_ON_BANNER,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    nickname: {
      fontSize: isDesktop ? theme.fontSize.xxl : theme.fontSize.xl,
      fontFamily: theme.fontFamily.headingExtra,
      color: HEADER_TEXT_ON_BANNER,
      marginBottom: theme.spacing.sm,
    },
    connectionStatus: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    statusDot: {
      width: theme.iconSize.sm / 2,
      height: theme.iconSize.sm / 2,
      borderRadius: theme.radius.full,
      marginRight: theme.spacing.xs,
    },
    statusText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.body,
      color: HEADER_TEXT_ON_BANNER,
    },
    layout: {
      flexDirection: isDesktop ? 'row' : 'column',
      alignItems: 'flex-start',
      padding: theme.spacing.lg,
      gap: theme.spacing.lg,
    },
    mainColumn: {
      flex: isDesktop ? 2 : undefined,
      width: isDesktop ? undefined : '100%',
      gap: theme.spacing.lg,
    },
    sideColumn: {
      flex: isDesktop ? 1 : undefined,
      width: isDesktop ? undefined : '100%',
      minWidth: isDesktop ? 320 : undefined,
      gap: theme.spacing.lg,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    section: {
      padding: theme.spacing.lg,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.color.surface,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
    },
    sectionTitle: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.heading,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.md,
    },
    chartsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.lg,
    },
    statsContainer: {
      gap: theme.spacing.xs,
    },
    actionsSection: {
      alignItems: 'center',
    },
    actionButton: {
      marginBottom: theme.spacing.md,
      width: '100%',
    },
    signOutButton: {
      marginBottom: theme.spacing.lg,
      borderColor: theme.color.error,
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.sm,
    },
    loadingText: {
      color: theme.color.error,
      fontFamily: theme.fontFamily.bodyBold,
      fontSize: theme.fontSize.sm,
    },
  });

export { UserDashboardView };
