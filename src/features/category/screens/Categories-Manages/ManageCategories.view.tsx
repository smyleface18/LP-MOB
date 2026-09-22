import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import { Loading } from '@/shared/components/Loading';
import Input from '@/shared/components/Input/Input.component';
import { Icon, IconName } from '@/shared/components/Icon';
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
  onToggleActive: (categoryId: string) => void;
  onRetry: () => void;
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
  onToggleActive,
  onRetry,
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
      <CategoryCard
        category={item}
        onDelete={onDeleteCategory}
        onToggleActive={onToggleActive}
        onPress={onCategoryPress}
      />
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

        <View style={styles.toolbarCard}>
          <View style={styles.toolbarRow}>
            <View style={styles.searchWrap}>
              <View style={styles.searchIcon}>
                <Icon name="MagnifyingGlassIcon" size="sm" color={theme.color.textSecondary} />
              </View>
              <Input
                placeholder="Buscar categorías por descripción..."
                value={searchText}
                onChangeText={onSearchChange}
                style={styles.searchInput}
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  style={styles.clearSearchButton}
                  onPress={() => onSearchChange('')}
                >
                  <Icon name="XIcon" size="sm" color={theme.color.textSecondary} />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={[styles.filterToggle, filtersVisible && styles.filterToggleActive]}
              onPress={onToggleFilters}
            >
              <Icon name="SlidersIcon" size="sm" color={theme.color.primary} />
              <Text style={styles.filterToggleText}>Filtros</Text>
              {activeFiltersCount > 0 && (
                <View style={styles.filterCountBadge}>
                  <Text style={styles.filterCountBadgeText}>{activeFiltersCount}</Text>
                </View>
              )}
              <Icon name="CaretDownIcon" size="sm" color={theme.color.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.clearFiltersButton} onPress={onClearFilters}>
              <Icon name="ArrowCounterClockwiseIcon" size="sm" color={theme.color.textSecondary} />
              <Text style={styles.clearFiltersButtonText}>Limpiar</Text>
            </TouchableOpacity>
          </View>

          {filtersVisible && (
            <View style={styles.filterPanel}>
              <View style={styles.filterGroup}>
                <View style={styles.filterGroupHeader}>
                  <Text style={styles.filterGroupTitle}>Nivel MCER (CEFR)</Text>
                  <Text style={styles.filterGroupHint}>Selecciona uno o más</Text>
                </View>
                <View style={styles.pillsWrap}>
                  {Object.values(Level).map((level) => (
                    <FilterPill
                      key={level}
                      label={level}
                      isActive={selectedLevels.includes(level)}
                      onPress={() => onToggleLevel(level)}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.filterGroup}>
                <View style={styles.filterGroupHeader}>
                  <Text style={styles.filterGroupTitle}>Tipo de Habilidad</Text>
                  <Text style={styles.filterGroupHint}>Macrodestrezas lingüísticas</Text>
                </View>
                <View style={styles.pillsWrap}>
                  {Object.values(TypeQuestionCategory).map((type) => (
                    <FilterPill
                      key={type}
                      label={CATEGORY_TYPE_META[type].label}
                      icon={CATEGORY_TYPE_META[type].icon}
                      iconColor={getCategoryPaletteColor(
                        theme,
                        Object.values(TypeQuestionCategory),
                        type,
                      )}
                      isActive={selectedTypes.includes(type)}
                      onPress={() => onToggleType(type)}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>

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

interface FilterPillProps {
  label: string;
  icon?: IconName;
  iconColor?: string;
  isActive: boolean;
  onPress: () => void;
}

/** Chip de filtro con ícono opcional — se define local porque el
 * `FilterChip` compartido no soporta ícono y esta pantalla es la única que
 * necesita esa variante. */
const FilterPill: React.FC<FilterPillProps> = ({ label, icon, iconColor, isActive, onPress }) => {
  const theme = useTheme();
  const styles = useMemo(() => createFilterPillStyles(theme), [theme]);

  return (
    <TouchableOpacity
      style={[styles.pill, isActive ? styles.pillActive : styles.pillInactive]}
      onPress={onPress}
    >
      {icon && <Icon name={icon} size="sm" color={isActive ? theme.color.onPrimary : iconColor} />}
      <Text style={[styles.pillText, isActive ? styles.pillTextActive : styles.pillTextInactive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const createFilterPillStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      borderRadius: theme.radius.md,
    },
    pillActive: {
      backgroundColor: theme.color.primary,
    },
    pillInactive: {
      backgroundColor: theme.color.surfaceElevated,
    },
    pillText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
    },
    pillTextActive: {
      color: theme.color.onPrimary,
    },
    pillTextInactive: {
      color: theme.color.textSecondary,
    },
  });

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
    toolbarCard: {
      backgroundColor: theme.color.surface,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.lg,
      ...theme.shadow.sm,
    },
    toolbarRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    searchWrap: {
      flex: 1,
      minWidth: 220,
      position: 'relative',
      justifyContent: 'center',
    },
    searchIcon: {
      position: 'absolute',
      left: theme.spacing.sm,
      zIndex: theme.zIndex.base + 1,
    },
    searchInput: {
      paddingLeft: theme.spacing.xl,
      paddingRight: theme.spacing.xl,
    },
    clearSearchButton: {
      position: 'absolute',
      right: theme.spacing.sm,
      padding: theme.spacing.xs,
    },
    filterToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.primarySubtle,
    },
    filterToggleActive: {
      backgroundColor: theme.color.primarySubtle,
    },
    filterToggleText: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.primary,
    },
    filterCountBadge: {
      width: theme.iconSize.md,
      height: theme.iconSize.md,
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filterCountBadgeText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.onPrimary,
    },
    clearFiltersButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.background,
    },
    clearFiltersButtonText: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
    },
    filterPanel: {
      marginTop: theme.spacing.md,
      paddingTop: theme.spacing.md,
      borderTopWidth: theme.borderWidth.xs,
      borderTopColor: theme.color.border,
      gap: theme.spacing.md,
    },
    filterGroup: {
      gap: theme.spacing.sm,
    },
    filterGroupHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    filterGroupTitle: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    filterGroupHint: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textPlaceholder,
    },
    pillsWrap: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
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
