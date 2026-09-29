import React, { useMemo } from 'react';
import { RefreshButton } from '@/shared/components/RefreshButton';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import { Loading } from '@/shared/components/Loading';
import { Icon } from '@/shared/components/Icon';
import { FilterToolbar } from '@/shared/components/FilterToolbar';
import { CategoryQuestion, TypeQuestionCategory } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common';
import CategoryCard from '../../components/CategoryCard';
import { CATEGORY_TYPE_META, getCategoryPaletteColor } from '../../constants/categoryMeta';

const PAGE_MAX_WIDTH = 1280;
const CARD_MIN_WIDTH = 320;

export interface ManageCategoriesViewProps {
  /** Ya filtradas por búsqueda/nivel/tipo — la vista solo renderiza. */
  categories: CategoryQuestion[];
  loading: boolean;
  error: string | null;
  searchText: string;
  onSearchChange: (text: string) => void;
  filtersVisible: boolean;
  onToggleFilters: () => void;
  selectedLevels: Level[];
  onToggleLevel: (level: Level) => void;
  selectedTypes: TypeQuestionCategory[];
  onToggleType: (type: TypeQuestionCategory) => void;
  onClearFilters: () => void;
  onCreatePress: () => void;
  onCategoryPress: (category: CategoryQuestion) => void;
  onDeleteCategory: (categoryId: string) => void;
  onRetry: () => void;
  onRefresh: () => void;
}

export const ManageCategoriesView: React.FC<ManageCategoriesViewProps> = ({
  categories,
  loading,
  error,
  searchText,
  onSearchChange,
  filtersVisible,
  onToggleFilters,
  selectedLevels,
  onToggleLevel,
  selectedTypes,
  onToggleType,
  onClearFilters,
  onCreatePress,
  onCategoryPress,
  onDeleteCategory,
  onRetry,
  onRefresh,
}) => {
  const theme = useTheme();
  const { width, isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  const numColumns = useMemo(() => {
    const usableWidth = Math.min(width, PAGE_MAX_WIDTH) - theme.spacing.xl * 2;
    return Math.max(1, Math.floor(usableWidth / CARD_MIN_WIDTH));
  }, [width, theme.spacing.xl]);

  const activeFiltersCount = selectedLevels.length + selectedTypes.length;

  const renderCategoryItem = ({ item }: { item: CategoryQuestion }) => (
    <View style={styles.gridItem}>
      <CategoryCard category={item} onDelete={onDeleteCategory} onPress={onCategoryPress} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Loading size={80} />
        <Text style={styles.loadingText}>Cargando categorías...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorTitle}>Error al cargar categorías</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <TouchableOpacity style={styles.createButton} onPress={onRetry}>
          <Text style={styles.createButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextBlock}>
            <View style={styles.eyebrowRow}>
              <View style={styles.eyebrowDot} />
              <Text style={styles.eyebrow}>Curriculum Hub</Text>
            </View>
            <Text style={styles.title}>Gestión de Categorías</Text>
            <Text style={styles.subtitle}>
              Total:{' '}
              <Text style={styles.subtitleStrong}>{categories.length} categorías registradas</Text>{' '}
              en el catálogo activo
            </Text>
          </View>

          <View style={styles.headerActions}>
            <RefreshButton
              onPress={onRefresh}
              refreshing={loading}
              accessibilityLabel="Actualizar categorías"
            />
            <View style={styles.syncPill}>
              <Icon name="CloudCheckIcon" size="sm" color={theme.color.success} />
              <Text style={styles.syncPillText}>Sincronizado con mobile</Text>
            </View>
            <TouchableOpacity style={styles.createButton} onPress={onCreatePress}>
              <Icon name="PlusCircleIcon" size="sm" color={theme.color.onPrimary} />
              <Text style={styles.createButtonText}>Crear Categoría</Text>
            </TouchableOpacity>
          </View>
        </View>

        <FilterToolbar
          searchText={searchText}
          onSearchChange={onSearchChange}
          searchPlaceholder="Buscar categorías por descripción..."
          filtersVisible={filtersVisible}
          onToggleFilters={onToggleFilters}
          onClearFilters={onClearFilters}
          groups={[
            {
              key: 'level',
              title: 'Nivel MCER (CEFR)',
              hint: 'Selecciona uno o más',
              options: Object.values(Level).map((level) => ({ value: level, label: level })),
              selected: selectedLevels,
              onToggle: (value) => onToggleLevel(value as Level),
            },
            {
              key: 'type',
              title: 'Tipo de Habilidad',
              hint: 'Macrodestrezas lingüísticas',
              options: Object.values(TypeQuestionCategory).map((type) => ({
                value: type,
                label: CATEGORY_TYPE_META[type].label,
                icon: CATEGORY_TYPE_META[type].icon,
                iconColor: getCategoryPaletteColor(
                  theme,
                  Object.values(TypeQuestionCategory),
                  type,
                ),
              })),
              selected: selectedTypes,
              onToggle: (value) => onToggleType(value as TypeQuestionCategory),
            },
          ]}
        />

        {categories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrap}>
              <Icon name="MagnifyingGlassIcon" size="lg" color={theme.color.primary} />
            </View>
            <Text style={styles.emptyText}>No se encontraron categorías</Text>
            <Text style={styles.emptySubtext}>
              {searchText || activeFiltersCount > 0
                ? 'Intenta modificar los criterios de búsqueda o remueve los filtros activos'
                : 'No hay categorías disponibles'}
            </Text>
          </View>
        ) : (
          <FlatList
            key={numColumns}
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? styles.gridRow : undefined}
            contentContainerStyle={styles.categoriesContent}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={onRetry}
          />
        )}
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
      padding: isDesktop ? theme.spacing.xl : theme.spacing.lg,
    },
    headerRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: theme.spacing.md,
      marginBottom: theme.spacing.xl,
    },
    headerTextBlock: {
      flexShrink: 1,
    },
    eyebrowRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    eyebrowDot: {
      width: theme.spacing.xs,
      height: theme.spacing.xs,
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.primary,
    },
    eyebrow: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
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
    subtitleStrong: {
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    syncPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.surfaceElevated,
    },
    syncPillText: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.primary,
    },
    createButtonText: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.onPrimary,
    },
    categoriesContent: {
      paddingBottom: theme.spacing.xl,
      flexGrow: 1,
    },
    gridRow: {
      gap: theme.spacing.md,
    },
    gridItem: {
      flex: 1,
      marginBottom: theme.spacing.md,
    },
    centerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color.background,
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
    },
    loadingText: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
    errorTitle: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.error,
      textAlign: 'center',
    },
    errorSubtext: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.xl,
      backgroundColor: theme.color.surface,
      borderRadius: theme.radius.lg,
      gap: theme.spacing.xs,
    },
    emptyIconWrap: {
      width: theme.spacing.xl * 2,
      height: theme.spacing.xl * 2,
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.primarySubtle,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: theme.spacing.sm,
    },
    emptyText: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    emptySubtext: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
  });
