import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import { Loading } from '@/shared/components/Loading';
import { RefreshButton } from '@/shared/components/RefreshButton';
import { FilterGroup, FilterToolbar } from '@/shared/components/FilterToolbar';
import type { StoriesAdminStackParamList } from '@/app/navigation/StoriesAdminStack';
import AdminStoryCard from '../components/AdminStoryCard';
import { useAdminStories } from '../useAdminStories';
import { AdminStoryItem, StoryVisibility } from '../types';

const PAGE_MAX_WIDTH = 1400;
const CARD_MIN_WIDTH = 320;

const VISIBILITY_LABELS: Record<StoryVisibility, string> = {
  [StoryVisibility.PUBLISHED]: 'Publicadas',
  [StoryVisibility.REMOVED]: 'Quitadas',
};

/**
 * Moderación de historietas (solo web, rol ADMIN): todas las historietas
 * terminadas, con búsqueda y filtro por estado. Tocar una abre su detalle,
 * donde se puede leer completa y quitarla.
 */
const ManageStoriesScreen: React.FC = () => {
  const theme = useTheme();
  const { width, isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);
  const navigation = useNavigation<StackNavigationProp<StoriesAdminStackParamList>>();

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [visibility, setVisibility] = useState<StoryVisibility | null>(null);
  const stories = useAdminStories({ search: searchText, visibility });
  const { refresh } = stories;

  // Al volver del detalle (donde se pudo quitar una) se recarga; la primera
  // vez no, porque el hook ya cargó al montar.
  const firstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }
      void refresh();
    }, [refresh]),
  );

  const numColumns = useMemo(() => {
    const usableWidth = Math.min(width, PAGE_MAX_WIDTH) - theme.spacing.lg * 2;
    return Math.max(1, Math.floor(usableWidth / CARD_MIN_WIDTH));
  }, [width, theme.spacing.lg]);

  // Un solo estado a la vez: tocar el activo lo desmarca (= todas).
  const filterGroups: FilterGroup[] = [
    {
      key: 'visibility',
      title: 'Estado',
      hint: 'Sin selección: todas',
      options: Object.values(StoryVisibility).map((value) => ({
        value,
        label: VISIBILITY_LABELS[value],
      })),
      selected: visibility ? [visibility] : [],
      onToggle: (value) =>
        setVisibility((prev) => (prev === value ? null : (value as StoryVisibility))),
    },
  ];

  const handleClearFilters = () => {
    setVisibility(null);
    setSearchText('');
  };

  const renderItem = ({ item }: { item: AdminStoryItem }) => (
    <View style={styles.gridItem}>
      <AdminStoryCard
        story={item}
        onPress={(storyId) => navigation.navigate('AdminStoryDetail', { storyId })}
      />
    </View>
  );

  const renderEmpty = () => {
    if (stories.loading) {
      return (
        <View style={styles.center}>
          <Loading size={80} />
          <Text style={styles.subtext}>Cargando historietas...</Text>
        </View>
      );
    }
    if (stories.error) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorTitle}>No se pudieron cargar las historietas</Text>
          <Text style={styles.subtext}>{stories.error}</Text>
          <Button title="Reintentar" onPress={() => void refresh()} />
        </View>
      );
    }
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No hay historietas</Text>
        <Text style={styles.subtext}>
          {searchText || visibility
            ? 'Prueba con otra búsqueda o quita los filtros'
            : 'Las historietas terminadas aparecen acá'}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <View style={[styles.header, styles.headerRow]}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Moderación de historietas</Text>
            <Text style={styles.subtitle}>Total: {stories.total} historietas</Text>
          </View>
          <RefreshButton
            onPress={() => void refresh()}
            refreshing={stories.loading}
            accessibilityLabel="Actualizar historietas"
          />
        </View>

        <View style={styles.toolbarWrap}>
          <FilterToolbar
            searchText={searchText}
            onSearchChange={setSearchText}
            searchPlaceholder="Buscar por título, jugador, código o texto..."
            filtersVisible={filtersVisible}
            onToggleFilters={() => setFiltersVisible((prev) => !prev)}
            onClearFilters={handleClearFilters}
            groups={filterGroups}
          />
        </View>

        <FlatList
          key={numColumns}
          data={stories.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.storyId}
          numColumns={numColumns}
          columnWrapperStyle={numColumns > 1 ? styles.gridRow : undefined}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          ListFooterComponent={
            stories.loadingMore ? (
              <ActivityIndicator style={styles.footer} color={theme.color.primary} />
            ) : stories.error && stories.items.length > 0 ? (
              <Text style={[styles.subtext, styles.footer]}>{stories.error}</Text>
            ) : null
          }
          onEndReached={stories.loadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
      alignItems: 'center',
    },
    page: {
      flex: 1,
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
    },
    header: {
      padding: isDesktop ? theme.spacing.xl : theme.spacing.lg,
      backgroundColor: theme.color.surfaceElevated,
      borderBottomWidth: theme.borderWidth.xs,
      borderBottomColor: theme.color.border,
      borderBottomLeftRadius: theme.radius.lg,
      borderBottomRightRadius: theme.radius.lg,
    },
    headerRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    headerText: {
      flex: 1,
      minWidth: 200,
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
    toolbarWrap: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    listContent: {
      padding: theme.spacing.lg,
      flexGrow: 1,
    },
    gridRow: {
      gap: theme.spacing.md,
    },
    gridItem: {
      flex: 1,
      marginBottom: theme.spacing.md,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
      gap: theme.spacing.sm,
    },
    errorTitle: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.error,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
    },
    subtext: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
    footer: {
      marginVertical: theme.spacing.md,
    },
  });

export default ManageStoriesScreen;
