import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import Input from '@/shared/components/Input/Input.component';
import { Icon, IconName } from '@/shared/components/Icon';

export interface FilterOption {
  value: string;
  label: string;
  icon?: IconName;
  /** Color del ícono cuando la opción no está activa. */
  iconColor?: string;
}

export interface FilterGroup {
  key: string;
  title: string;
  hint?: string;
  options: FilterOption[];
  /** Valores seleccionados (selección múltiple). */
  selected: string[];
  onToggle: (value: string) => void;
}

export interface FilterToolbarProps {
  searchText: string;
  onSearchChange: (text: string) => void;
  searchPlaceholder: string;
  filtersVisible: boolean;
  onToggleFilters: () => void;
  groups: FilterGroup[];
  onClearFilters: () => void;
  filtersLabel?: string;
  clearLabel?: string;
}

/**
 * Barra de búsqueda + panel de filtros desplegable con chips de selección
 * múltiple, compartida por las pantallas de gestión (categorías, preguntas).
 * La pantalla guarda el estado y hace el filtrado; esto solo lo muestra.
 */
const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchText,
  onSearchChange,
  searchPlaceholder,
  filtersVisible,
  onToggleFilters,
  groups,
  onClearFilters,
  filtersLabel = 'Filtros',
  clearLabel = 'Limpiar',
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const activeFiltersCount = groups.reduce((total, group) => total + group.selected.length, 0);

  return (
    <View style={styles.toolbarCard}>
      <View style={styles.toolbarRow}>
        <View style={styles.searchWrap}>
          <View style={styles.searchIcon}>
            <Icon name="MagnifyingGlassIcon" size="sm" color={theme.color.textSecondary} />
          </View>
          <Input
            placeholder={searchPlaceholder}
            value={searchText}
            onChangeText={onSearchChange}
            style={styles.searchInput}
          />
          {searchText.length > 0 && (
            <TouchableOpacity style={styles.clearSearchButton} onPress={() => onSearchChange('')}>
              <Icon name="XIcon" size="sm" color={theme.color.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterToggle, filtersVisible && styles.filterToggleActive]}
          onPress={onToggleFilters}
        >
          <Icon name="SlidersIcon" size="sm" color={theme.color.primary} />
          <Text style={styles.filterToggleText}>{filtersLabel}</Text>
          {activeFiltersCount > 0 && (
            <View style={styles.filterCountBadge}>
              <Text style={styles.filterCountBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
          <Icon name="CaretDownIcon" size="sm" color={theme.color.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearFiltersButton} onPress={onClearFilters}>
          <Icon name="ArrowCounterClockwiseIcon" size="sm" color={theme.color.textSecondary} />
          <Text style={styles.clearFiltersButtonText}>{clearLabel}</Text>
        </TouchableOpacity>
      </View>

      {filtersVisible && (
        <View style={styles.filterPanel}>
          {groups.map((group) => (
            <View key={group.key} style={styles.filterGroup}>
              <View style={styles.filterGroupHeader}>
                <Text style={styles.filterGroupTitle}>{group.title}</Text>
                {group.hint && <Text style={styles.filterGroupHint}>{group.hint}</Text>}
              </View>
              <View style={styles.pillsWrap}>
                {group.options.map((option) => (
                  <FilterPill
                    key={option.value}
                    label={option.label}
                    icon={option.icon}
                    iconColor={option.iconColor}
                    isActive={group.selected.includes(option.value)}
                    onPress={() => group.onToggle(option.value)}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
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

/** Chip de filtro con ícono opcional (el `FilterChip` compartido no soporta ícono). */
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

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
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
  });

export default FilterToolbar;
