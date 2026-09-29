import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import Button from '@/shared/components/Button/Button.component';
import { Loading } from '@/shared/components/Loading';
import { FilterToolbar } from '@/shared/components/FilterToolbar';
import { Level } from '@/shared/types/common';
import StoryHeader from '../../components/StoryHeader';
import StoryHistoryCard from '../../components/StoryHistoryCard';
import { StoryHistoryItem, StoryListSource } from '../../types';

/** Textos de la lista según de dónde salen las historietas. */
const COPY: Record<
  StoryListSource,
  { title: string; backLabel: string; emptyEmoji: string; emptyTitle: string; emptyHint: string }
> = {
  history: {
    title: '📚 My stories',
    backLabel: 'Back to profile',
    emptyEmoji: '📚',
    emptyTitle: 'No stories yet',
    emptyHint:
      'When you finish a story with your friends, you can read and listen to it again here.',
  },
  catalog: {
    title: '🌍 Explore stories',
    backLabel: 'Back',
    emptyEmoji: '🌍',
    emptyTitle: 'No stories to explore yet',
    emptyHint: 'Stories finished by every player appear here. Write one and be the first!',
  },
};

const PAGE_MAX_WIDTH = 640;

export interface StoryHistoryViewProps {
  items: StoryHistoryItem[];
  total: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  onRefresh: () => void;
  onLoadMore: () => void;
  onOpen: (storyId: string) => void;
  /** Sin esto no se muestra el botón de volver (ej. el catálogo como raíz de un tab). */
  onBack?: () => void;
  /** Por defecto, el historial propio. */
  source?: StoryListSource;
  /** Búsqueda y filtro por nivel (solo el catálogo). */
  filters?: StoryListFilters;
}

export interface StoryListFilters {
  search: string;
  onSearchChange: (text: string) => void;
  levels: Level[];
  onToggleLevel: (level: Level) => void;
  visible: boolean;
  onToggleVisible: () => void;
  onClear: () => void;
}

const StoryHistoryView: React.FC<StoryHistoryViewProps> = ({
  items,
  total,
  loading,
  loadingMore,
  error,
  onRefresh,
  onLoadMore,
  onOpen,
  onBack,
  source = 'history',
  filters,
}) => {
  const copy = COPY[source];
  const filtering = !!filters && (!!filters.search.trim() || filters.levels.length > 0);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <Loading size={64} />
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Button
            title="Try again"
            variant="outlined"
            icon="ArrowCounterClockwiseIcon"
            onPress={onRefresh}
          />
        </View>
      );
    }
    return (
      <View style={styles.center}>
        <Text style={styles.emptyEmoji}>{filtering ? '🔍' : copy.emptyEmoji}</Text>
        <Text style={styles.emptyTitle}>
          {filtering ? 'No stories match your filters' : copy.emptyTitle}
        </Text>
        <Text style={styles.hint}>
          {filtering ? 'Try another search or clear the filters.' : copy.emptyHint}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StoryHeader title={copy.title} onBack={onBack} backLabel={copy.backLabel} />
      {filters && (
        <View style={styles.filters}>
          <FilterToolbar
            searchText={filters.search}
            onSearchChange={filters.onSearchChange}
            searchPlaceholder="Search by title, player or text..."
            filtersVisible={filters.visible}
            onToggleFilters={filters.onToggleVisible}
            onClearFilters={filters.onClear}
            filtersLabel="Filters"
            clearLabel="Clear"
            groups={[
              {
                key: 'level',
                title: 'Level',
                hint: 'Choose one or more',
                options: Object.values(Level).map((level) => ({ value: level, label: level })),
                selected: filters.levels,
                onToggle: (value) => filters.onToggleLevel(value as Level),
              },
            ]}
          />
        </View>
      )}
      <FlatList
        data={items}
        keyExtractor={(item) => item.storyId}
        contentContainerStyle={[styles.list, items.length === 0 && styles.listEmpty]}
        ListHeaderComponent={
          items.length > 0 ? (
            <Text style={styles.count}>
              {total} {total === 1 ? 'story' : 'stories'}
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <StoryHistoryCard item={item} onPress={() => onOpen(item.storyId)} />
          </View>
        )}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator style={styles.footer} color={theme.color.primary} />
          ) : error && items.length > 0 ? (
            <Text style={[styles.error, styles.footer]}>{error}</Text>
          ) : null
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl refreshing={loading && items.length > 0} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
    },
    filters: {
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
      alignSelf: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
    },
    // Sin alignItems: 'center' acá: en web cada ítem va en una celda que no
    // ocupa todo el ancho. Cada ítem se centra solo (alignSelf).
    list: {
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    listEmpty: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    item: {
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
      alignSelf: 'center',
    },
    count: {
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
      alignSelf: 'center',
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    center: {
      alignItems: 'center',
      alignSelf: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      maxWidth: 420,
    },
    emptyEmoji: {
      fontSize: 48,
    },
    emptyTitle: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
    },
    hint: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
    error: {
      fontSize: theme.fontSize.md,
      color: theme.color.textError,
      textAlign: 'center',
    },
    footer: {
      marginVertical: theme.spacing.md,
    },
  });

export default StoryHistoryView;
