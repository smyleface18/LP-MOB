import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { Icon } from '@/shared/components/Icon';
import { CategoryQuestion, TypeQuestionCategory } from '@/shared/types/category-question';
import { Level } from '@/shared/types/common';
import { CATEGORY_TYPE_META, getCategoryPaletteColor } from '../../constants/categoryMeta';

export interface CategoryCardProps {
  category: CategoryQuestion;
  onToggleActive: (categoryId: string) => void;
  onDelete: (categoryId: string) => void;
  onPress?: (category: CategoryQuestion) => void;
}

/** Tamaño del ícono decorativo de fondo — no hay token de theme para íconos
 * de este tamaño (theme.iconSize llega hasta xl=32), es puramente ornamental. */
const DECORATIVE_ICON_SIZE = 96;

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onToggleActive,
  onDelete,
  onPress,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const levelColor = getCategoryPaletteColor(theme, Object.values(Level), category.level);
  const typeColor = getCategoryPaletteColor(theme, Object.values(TypeQuestionCategory), category.type);
  const typeMeta = CATEGORY_TYPE_META[category.type];
  const questionsCount = category.questions?.length ?? 0;

  // La navegación al detalle y las acciones (switch/delete) son elementos
  // pulsables hermanos, nunca anidados: en react-native-web los toques SÍ
  // burbujean como eventos DOM normales, así que anidar un TouchableOpacity
  // dentro de otro dispararía ambos onPress con un solo tap.
  const InfoBlock = () => (
    <View>
      <View style={styles.badgesRow}>
        <View style={[styles.levelBadge, { backgroundColor: levelColor }]}>
          <Text style={styles.levelBadgeText}>{category.level}</Text>
        </View>
        <View style={styles.typeBadge}>
          <Icon name={typeMeta.icon} size="sm" color={typeColor} />
          <Text style={[styles.typeBadgeText, { color: typeColor }]}>{category.type}</Text>
        </View>
      </View>
      <Text style={styles.categoryText} numberOfLines={3}>
        {category.descriptionCategory}
      </Text>
    </View>
  );

  return (
    <View style={[styles.card, { borderLeftColor: typeColor }]}>
      <View style={styles.decorativeIconWrap} pointerEvents="none">
        <Icon name={typeMeta.icon} size={DECORATIVE_ICON_SIZE} color={typeColor} />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.header}>
          {onPress ? (
            <TouchableOpacity style={styles.info} onPress={() => onPress(category)}>
              <InfoBlock />
            </TouchableOpacity>
          ) : (
            <View style={styles.info}>
              <InfoBlock />
            </View>
          )}

          <Switch
            value={category.active}
            onValueChange={() => onToggleActive(category.id)}
            trackColor={{ false: theme.color.border, true: theme.color.primarySubtle }}
            thumbColor={category.active ? theme.color.primary : theme.color.surfaceElevated}
          />
        </View>

        <View style={styles.footer}>
          <View style={styles.questionsPill}>
            <Icon name={typeMeta.icon} size="sm" color={typeColor} />
            <Text style={styles.questionsPillText}>
              Preguntas: <Text style={styles.questionsPillCount}>{questionsCount}</Text>
            </Text>
          </View>

          <View style={styles.footerActions}>
            <TouchableOpacity
              style={styles.iconButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="PencilSimpleIcon" size="sm" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(category.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="TrashIcon" size="sm" color={theme.color.error} />
              <Text style={styles.deleteButtonText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    card: {
      flex: 1,
      backgroundColor: theme.color.surface,
      borderRadius: theme.radius.lg,
      borderLeftWidth: theme.borderWidth.md,
      overflow: 'hidden',
    },
    decorativeIconWrap: {
      position: 'absolute',
      right: -theme.spacing.sm,
      bottom: -theme.spacing.sm,
      opacity: 0.08,
    },
    cardContent: {
      padding: theme.spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.sm,
    },
    info: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    badgesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.sm,
    },
    levelBadge: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.radius.md,
    },
    levelBadgeText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textInverse,
    },
    typeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs / 2,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.surfaceElevated,
    },
    typeBadgeText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
    },
    categoryText: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: theme.borderWidth.xs,
      borderTopColor: theme.color.border,
    },
    questionsPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.radius.full,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
      backgroundColor: theme.color.background,
    },
    questionsPillText: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    questionsPillCount: {
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    footerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    iconButton: {
      width: theme.spacing.xl,
      height: theme.spacing.xl,
      borderRadius: theme.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs / 2,
      paddingHorizontal: theme.spacing.sm,
      height: theme.spacing.xl,
      borderRadius: theme.radius.md,
    },
    deleteButtonText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.error,
    },
  });

export default CategoryCard;
