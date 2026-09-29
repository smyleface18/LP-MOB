import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import CategoryItem from '@/features/category/components/CategoryItem/CategoryItem.component';
import { Loading } from '@/shared/components/Loading';
import { MetricCard } from '@/shared/components/Metric/Metric.component';
import { CircularProgress } from '@/shared/components/CircularProgress/CircularProgress.component';
import { ProgressBar } from '@/shared/components/ProgressBar/ProgressBar.component';
import { StatItem } from '@/shared/components/StatItem/Statitem.component';
import Button from '@/shared/components/Button/Button.component';
import { RefreshButton } from '@/shared/components/RefreshButton';
import { AdminStats } from '@/features/stats/types';
import { GRADIENT_PRESETS } from '@/shared/ui/theme/progressGradients';

const LEVEL_USAGE_GRADIENTS = [
  GRADIENT_PRESETS.secondaryToPrimary,
  GRADIENT_PRESETS.secondaryToAccent,
  GRADIENT_PRESETS.tricolorProgress,
];

const PAGE_MAX_WIDTH = 960;

export interface AdminDashboardViewProps {
  /** null mientras carga la primera vez. */
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  /** Solo en web: las secciones de administración no existen en el celular. */
  onNavigateToQuestions?: () => void;
  onNavigateToCategories?: () => void;
  onNavigateToStories?: () => void;
}

const formatNumber = (value: number) => value.toLocaleString('en-US');

const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  stats,
  loading,
  error,
  onRefresh,
  onNavigateToQuestions,
  onNavigateToCategories,
  onNavigateToStories,
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
        <View style={[styles.header, styles.headerRow]}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Admin Dashboard</Text>
            <Text style={styles.subtitle}>LinguaPlay Overview</Text>
          </View>
          <RefreshButton
            onPress={onRefresh}
            refreshing={loading}
            accessibilityLabel="Actualizar estadísticas"
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        {!stats ? (
          loading && (
            <View style={styles.loadingState}>
              <Loading size={64} />
            </View>
          )
        ) : (
          <>
            {/* Main Metrics */}
            <View style={styles.metricsGrid}>
              <MetricCard
                value={formatNumber(stats.content.questions)}
                label="Questions"
                subLabel={`${formatNumber(stats.content.categories)} categories`}
              />
              <MetricCard
                value={formatNumber(stats.users.players)}
                label="Players"
                subLabel={`${formatNumber(stats.users.admins)} admins`}
                color="secondary"
              />
              <MetricCard
                value={formatNumber(stats.users.activeThisWeek)}
                label="Active"
                subLabel="Last 7 days"
                color="success"
              />
              <MetricCard
                value={formatNumber(stats.users.newThisWeek)}
                label="New Users"
                subLabel="Last 7 days"
                color="accent"
              />
            </View>

            {/* Performance Charts */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overall Performance</Text>
              <View style={styles.chartsRow}>
                <CircularProgress
                  percentage={stats.trivia.accuracy}
                  label="Correct Answers"
                  colors={GRADIENT_PRESETS.secondaryToPrimary}
                />
                <CircularProgress
                  percentage={stats.trivia.winRate}
                  label="Win Rate"
                  colors={GRADIENT_PRESETS.successToPrimary}
                />
                <CircularProgress
                  percentage={stats.users.activeRate}
                  label="Active This Week"
                  colors={GRADIENT_PRESETS.tricolorEnergy}
                />
              </View>
            </View>

            {/* Usage Statistics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Usage by Level</Text>
              <View style={styles.statsContainer}>
                {stats.levelUsage.map((level, index) => (
                  <ProgressBar
                    key={level.level}
                    percentage={level.percentage}
                    label={`${level.level} · ${level.triviaGames} trivia · ${level.stories} stories`}
                    colors={LEVEL_USAGE_GRADIENTS[index % LEVEL_USAGE_GRADIENTS.length]}
                  />
                ))}
                {stats.levelUsage.length === 0 && (
                  <Text style={styles.emptyText}>No games or stories yet.</Text>
                )}
              </View>

              <View style={styles.additionalStats}>
                <StatItem value={formatNumber(stats.trivia.games)} label="Trivia Games" />
                <StatItem
                  value={formatNumber(stats.trivia.questionsAnswered)}
                  label="Questions Answered"
                  color="secondary"
                />
                <StatItem
                  value={formatNumber(stats.users.total)}
                  label="Registered Users"
                  color="accent"
                />
              </View>
            </View>

            {/* Stories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Stories</Text>
              <View style={styles.additionalStats}>
                <StatItem value={formatNumber(stats.stories.published)} label="Published" />
                <StatItem
                  value={formatNumber(stats.stories.removed)}
                  label="Removed"
                  color="secondary"
                />
                <StatItem
                  value={formatNumber(stats.stories.panels)}
                  label="Panels Written"
                  color="accent"
                />
              </View>
            </View>

            {/* Category Distribution */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Answers by Category</Text>
              <View style={styles.categoryDistribution}>
                {stats.categoryDistribution.map((category, index) => (
                  <CategoryItem
                    key={category.category}
                    color={categoryColors[index % categoryColors.length]}
                    text={`${category.category} (${category.percentage}%)`}
                  />
                ))}
                {stats.categoryDistribution.length === 0 && (
                  <Text style={styles.emptyText}>No answers yet.</Text>
                )}
              </View>
            </View>
          </>
        )}

        {/* Action Buttons (solo web) */}
        {(onNavigateToQuestions || onNavigateToCategories || onNavigateToStories) && (
          <View style={styles.actionsSection}>
            {onNavigateToQuestions && (
              <Button
                title="Manage Questions"
                variant="primary"
                size="large"
                onPress={onNavigateToQuestions}
                style={styles.actionButton}
              />
            )}
            {onNavigateToCategories && (
              <Button
                title="Manage Categories"
                variant="primary"
                size="large"
                onPress={onNavigateToCategories}
                style={styles.actionButton}
              />
            )}
            {onNavigateToStories && (
              <Button
                title="Moderate Stories"
                variant="primary"
                size="large"
                onPress={onNavigateToStories}
                style={styles.actionButton}
              />
            )}
          </View>
        )}
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
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    headerText: {
      flex: 1,
    },
    errorText: {
      fontSize: theme.fontSize.md,
      color: theme.color.textError,
      textAlign: 'center',
      padding: theme.spacing.md,
    },
    loadingState: {
      alignItems: 'center',
      padding: theme.spacing.xl,
    },
    emptyText: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
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
