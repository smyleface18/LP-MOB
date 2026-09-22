import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import DashboardBackground from '@/features/auth/components/DashboardBackground';
import { Loading } from '@/shared/components/Loading';
import { MetricCard } from '@/shared/components/Metric/Metric.component';
import { CircularProgress } from '@/shared/components/CircularProgress/CircularProgress.component';
import { ProgressBar } from '@/shared/components/ProgressBar/ProgressBar.component';
import Button from '@/shared/components/Button/Button.component';
import { GRADIENT_PRESETS } from '@/shared/ui/theme/progressGradients';

const PAGE_MAX_WIDTH = 720;
const DEFAULT_AVATAR_URL = 'https://cdn-icons-png.flaticon.com/512/7178/7178489.png';

const LEVEL_PROGRESS_GRADIENTS = [
  GRADIENT_PRESETS.secondaryToPrimary,
  GRADIENT_PRESETS.secondaryToAccent,
  GRADIENT_PRESETS.tricolorProgress,
];

export interface UserDashboardStats {
  scoreLabel: string;
  gamesWon: number;
  currentStreak: number;
  categoriesCount: number;
  averageScore: number;
  winRatePercentage: number;
  streakPowerPercentage: number;
}

export interface LevelProgress {
  label: string;
  percentage: number;
}

export interface UserDashboardViewProps {
  username?: string;
  avatarUrl?: string;
  isConnected: boolean;
  stats: UserDashboardStats;
  levelProgress: LevelProgress[];
  onHowToPlay: () => void;
  onSignOut: () => void;
  signOutLoading?: boolean;
}

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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

          {/* Main Metrics */}
          <View style={styles.metricsGrid}>
            <MetricCard value={stats.scoreLabel} label="Score" />
            <MetricCard value={stats.gamesWon} label="Games Won" color="secondary" />
            <MetricCard value={stats.currentStreak} label="Current Streak" color="accent" />
            <MetricCard value={stats.categoriesCount} label="Categories" color="success" />
          </View>

          {/* Performance Charts */}
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

          {/* Level Progress */}
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

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
    },
    scrollView: {
      flex: 1,
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
      padding: isDesktop ? theme.spacing.xl : theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      borderBottomLeftRadius: theme.radius.lg,
      borderBottomRightRadius: theme.radius.lg,
      alignItems: 'center',
      overflow: 'hidden',
      backgroundColor: theme.color.background,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: theme.radius.full,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      marginBottom: theme.spacing.sm,
      backgroundColor: theme.color.surface,
      borderWidth: theme.borderWidth.sm,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    nickname: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.secondary,
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
      color: theme.color.secondary,
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
    },
    section: {
      padding: theme.spacing.lg,
      borderBottomWidth: theme.borderWidth.xs,
      borderBottomColor: theme.color.border,
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
      justifyContent: 'center',
      gap: theme.spacing.lg,
    },
    statsContainer: {
      gap: theme.spacing.xs,
    },
    actionsSection: {
      padding: theme.spacing.lg,
      alignItems: 'center',
    },
    actionButton: {
      marginBottom: theme.spacing.md,
      maxWidth: 480,
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
