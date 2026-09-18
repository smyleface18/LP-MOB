import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import CategoryItem from '@/features/category/components/CategoryItem/CategoryItem.component';
import { MetricCard } from '@/shared/components/Metric/Metric.component';
import { CircularProgress } from '@/shared/components/CircularProgress/CircularProgress.component';
import { ProgressBar } from '@/shared/components/ProgressBar/ProgressBar.component';
import { StatItem } from '@/shared/components/StatItem/Statitem.component';
import Button from '@/shared/components/Button/Button.component';
import { GRADIENT_PRESETS } from '@/shared/ui/theme/progressGradients';

const LEVEL_USAGE_GRADIENTS = [
  GRADIENT_PRESETS.secondaryToPrimary,
  GRADIENT_PRESETS.secondaryToAccent,
  GRADIENT_PRESETS.tricolorProgress,
];

const PAGE_MAX_WIDTH = 960;

export interface AdminDashboardMetrics {
  totalQuestions: number;
  totalCategories: number;
  totalUsers: number;
  activeUsers: number;
  totalGames: number;
  questionsAnswered: number;
  newUsersThisWeek: number;
  averageScore: number;
  completionRate: number;
  retentionRate: number;
}

export interface LevelUsage {
  label: string;
  percentage: number;
}

export interface CategoryShare {
  label: string;
  percentage: number;
}

export interface AdminDashboardViewProps {
  metrics: AdminDashboardMetrics;
  levelUsage: LevelUsage[];
  categoryDistribution: CategoryShare[];
  onNavigateToQuestions: () => void;
  onNavigateToCategories: () => void;
  onSignOut: () => void;
  signOutLoading?: boolean;
}

const formatNumber = (value: number) => value.toLocaleString('en-US');

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  metrics,
  levelUsage,
  categoryDistribution,
  onNavigateToQuestions,
  onNavigateToCategories,
  onSignOut,
  signOutLoading = false,
}) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  const categoryColors = useMemo(
    () => [
      theme.color.primary,
      theme.color.secondary,
      theme.color.accent,
      theme.color.success,
      theme.color.textSecondary,
    ],
    [theme],
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>LinguaPlay Overview</Text>
        </View>

        {/* Main Metrics */}
        <View style={styles.metricsGrid}>
          <MetricCard
            value={formatNumber(metrics.totalQuestions)}
            label="Questions"
            subLabel="+12 this week"
          />
          <MetricCard
            value={formatNumber(metrics.totalCategories)}
            label="Categories"
            subLabel="3 levels"
            color="secondary"
          />
          <MetricCard
            value={formatNumber(metrics.totalUsers)}
            label="Users"
            subLabel="Total registered"
            color="accent"
          />
          <MetricCard
            value={formatNumber(metrics.activeUsers)}
            label="Active"
            subLabel="Last 7 days"
            color="success"
          />
        </View>

        {/* Performance Charts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Performance</Text>
          <View style={styles.chartsRow}>
            <CircularProgress
              percentage={metrics.averageScore}
              label="Average Score"
              colors={GRADIENT_PRESETS.secondaryToPrimary}
            />
            <CircularProgress
              percentage={metrics.completionRate}
              label="Completion Rate"
              colors={GRADIENT_PRESETS.successToPrimary}
            />
            <CircularProgress
              percentage={metrics.retentionRate}
              label="Retention"
              colors={GRADIENT_PRESETS.tricolorEnergy}
            />
          </View>
        </View>

        {/* Usage Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usage Statistics</Text>
          <View style={styles.statsContainer}>
            {levelUsage.map((level, index) => (
              <ProgressBar
                key={level.label}
                percentage={level.percentage}
                label={level.label}
                colors={LEVEL_USAGE_GRADIENTS[index % LEVEL_USAGE_GRADIENTS.length]}
              />
            ))}
          </View>

          <View style={styles.additionalStats}>
            <StatItem value={formatNumber(metrics.totalGames)} label="Games Completed" />
            <StatItem
              value={formatNumber(metrics.questionsAnswered)}
              label="Questions Answered"
              color="secondary"
            />
            <StatItem
              value={formatNumber(metrics.newUsersThisWeek)}
              label="New This Week"
              color="accent"
            />
          </View>
        </View>

        {/* Category Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category Distribution</Text>
          <View style={styles.categoryDistribution}>
            {categoryDistribution.map((category, index) => (
              <CategoryItem
                key={category.label}
                color={categoryColors[index % categoryColors.length]}
                text={`${category.label} (${category.percentage}%)`}
              />
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
          <Button
            title="Manage Questions"
            variant="primary"
            size="large"
            onPress={onNavigateToQuestions}
            style={styles.actionButton}
          />
          <Button
            title="Manage Categories"
            variant="primary"
            size="large"
            onPress={onNavigateToCategories}
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
              <ActivityIndicator size="small" color={theme.color.error} />
              <Text style={styles.loadingText}>Signing out...</Text>
            </View>
          )}
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
    },
    page: {
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
    },
    header: {
      padding: isDesktop ? theme.spacing.xl : theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      backgroundColor: theme.color.surfaceElevated,
      borderBottomWidth: theme.borderWidth.xs,
      borderBottomColor: theme.color.border,
      borderBottomLeftRadius: theme.radius.lg,
      borderBottomRightRadius: theme.radius.lg,
      ...theme.shadow.sm,
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
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
      marginBottom: theme.spacing.lg,
    },
    additionalStats: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme.spacing.md,
    },
    categoryDistribution: {
      marginTop: theme.spacing.xs,
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

export { AdminDashboardView };
