import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { Question } from '../../types';
import { ContentType, Level } from '@/shared/types/common';
import { TypeQuestionCategory } from '@/shared/types/category-question';

const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  [ContentType.TEXT]: '',
  [ContentType.IMAGE]: '[Image]',
  [ContentType.AUDIO]: '[Audio]',
  [ContentType.VIDEO]: '[Video]',
};

/** Texto corto para previsualizar contenido en listas — nunca vuelca URLs crudas. */
const describeContent = (contentType: ContentType, text?: string): string =>
  contentType === ContentType.TEXT ? text || '(empty)' : CONTENT_TYPE_LABELS[contentType];

export interface QuestionCardProps {
  question: Question;
  onToggleActive: (questionId: string) => void;
  onDelete: (questionId: string) => void;
  onPress?: (question: Question) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onToggleActive,
  onDelete,
  onPress,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const category = question.category;

  const levelColors = useMemo(
    () => [
      theme.color.primary,
      theme.color.secondary,
      theme.color.accent,
      theme.color.success,
      theme.color.error,
      theme.color.textSecondary,
    ],
    [theme],
  );

  const getBadgeColor = (values: string[], value?: string) => {
    if (!value) return theme.color.textSecondary;
    const index = values.indexOf(value);
    return levelColors[index % levelColors.length];
  };

  const levelColor = getBadgeColor(Object.values(Level), category?.level);
  const typeColor = getBadgeColor(Object.values(TypeQuestionCategory), category?.type);

  // La navegación al detalle y las acciones (switch/delete) son elementos
  // pulsables hermanos, nunca anidados: en react-native-web los toques SÍ
  // burbujean como eventos DOM normales, así que anidar un TouchableOpacity
  // dentro de otro dispararía ambos onPress con un solo tap.
  const InfoBlock = () => (
    <View>
      <Text style={styles.questionText} numberOfLines={2}>
        {describeContent(question.contentType, question.text)}
      </Text>
      <View style={styles.tagsContainer}>
        {category?.level && (
          <View style={[styles.tag, { backgroundColor: levelColor }]}>
            <Text style={styles.tagText}>{category.level}</Text>
          </View>
        )}
        {category?.type && (
          <View style={[styles.tag, { backgroundColor: typeColor }]}>
            <Text style={styles.tagText}>{category.type}</Text>
          </View>
        )}
        {(!category?.level || !category?.type) && (
          <View style={[styles.tag, { backgroundColor: theme.color.textSecondary }]}>
            <Text style={styles.tagText}>No category</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          {onPress ? (
            <TouchableOpacity style={styles.info} onPress={() => onPress(question)}>
              <InfoBlock />
            </TouchableOpacity>
          ) : (
            <View style={styles.info}>
              <InfoBlock />
            </View>
          )}

          <View style={styles.headerActions}>
            <Switch
              value={question.active}
              onValueChange={() => onToggleActive(question.id)}
              trackColor={{ false: theme.color.border, true: theme.color.primarySubtle }}
              thumbColor={question.active ? theme.color.primary : theme.color.surfaceElevated}
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => onDelete(question.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>

        {category && (
          <Text style={styles.categoryText}>Category: {category.descriptionCategory}</Text>
        )}

        <Text style={styles.optionsText}>
          {(question.options ?? []).length === 0
            ? 'No options yet'
            : `Options: ${(question.options ?? [])
                .map((op) => describeContent(op.contentType, op.text))
                .join(', ')}`}
        </Text>
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
      borderLeftColor: theme.color.primary,
      overflow: 'hidden',
    },
    cardContent: {
      padding: theme.spacing.md,
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
    headerActions: {
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    deleteButton: {
      paddingVertical: theme.spacing.xs / 2,
      paddingHorizontal: theme.spacing.xs,
    },
    deleteButtonText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.error,
    },
    questionText: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    tag: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs / 2,
      borderRadius: theme.radius.full,
    },
    tagText: {
      fontSize: theme.fontSize.sm - 2,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textInverse,
    },
    categoryText: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    optionsText: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
  });

export default QuestionCard;
