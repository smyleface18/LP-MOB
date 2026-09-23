import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/app/providers/theme.provider';
import { useAppAlert } from '@/app/providers/alert.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import { Loading } from '@/shared/components/Loading';
import QuestionForm, {
  LevelFilter,
  QuestionFormValues,
  TypeFilter,
} from '../components/QuestionForm';
import { useCategories } from '@/features/category/hooks/useCategories';
import { questionService } from '../services/question.service';
import { questionOptionsService } from '../services/question-options.service';
import {
  isOptionFilled,
  toOptionContentPayload,
  toQuestionMediaId,
} from '../utils/content-payload';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { Question } from '../types';
import { ContentType } from '@/shared/types/common';

interface RouteParams {
  questionId: string;
  question?: Question;
}

const PAGE_MAX_WIDTH = 1100;

const toFormValues = (question: Question): QuestionFormValues => ({
  contentType: question.contentType,
  text: question.text ?? '',
  mediaId: question.media?.id,
  media: question.media,
  moreInfo: question.moreInfo ?? '',
  timeLimit: question.timeLimit,
  categoryId: question.categoryId,
  options: (question.options ?? []).map((option) => ({
    id: option.id,
    contentType: option.contentType,
    text: option.text ?? '',
    mediaId: option.media?.id,
    media: option.media,
    isCorrect: option.isCorrect,
  })),
});

const QuestionDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const appAlert = useAppAlert();
  const { questionId, question: initialQuestion } = route.params as RouteParams;

  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);
  const { categories, loading: categoriesLoading } = useCategories();

  const [loading, setLoading] = useState(!initialQuestion);
  const [saving, setSaving] = useState(false);
  const [question, setQuestion] = useState<Question | null>(initialQuestion ?? null);
  // Opciones tal como están en el backend — se usa para saber cuáles borrar
  // al guardar (las que ya no aparecen en formValues.options).
  const [originalOptionIds, setOriginalOptionIds] = useState<string[]>(
    initialQuestion?.options?.map((o) => o.id) ?? [],
  );
  const [formValues, setFormValues] = useState<QuestionFormValues>(
    initialQuestion
      ? toFormValues(initialQuestion)
      : {
          contentType: ContentType.TEXT,
          text: '',
          moreInfo: '',
          timeLimit: 15,
          categoryId: '',
          options: [],
        },
  );
  const [selectedLevel, setSelectedLevel] = useState<LevelFilter>(
    initialQuestion?.category?.level ?? 'all',
  );
  const [selectedType, setSelectedType] = useState<TypeFilter>(
    initialQuestion?.category?.type ?? 'all',
  );

  useEffect(() => {
    if (initialQuestion || !questionId) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      const response = await questionService.getById(questionId);
      if (cancelled) return;

      if (!response.ok || !response.data) {
        appAlert('Error', getErrorMessage(response.message, 'No se pudo cargar la pregunta'));
        setLoading(false);
        return;
      }

      setQuestion(response.data);
      setFormValues(toFormValues(response.data));
      setOriginalOptionIds((response.data.options ?? []).map((o) => o.id));
      setSelectedLevel(response.data.category?.level ?? 'all');
      setSelectedType(response.data.category?.type ?? 'all');
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [questionId, initialQuestion]);

  const handleAddOption = () => {
    setFormValues((prev) =>
      prev.options.length < 6
        ? {
            ...prev,
            options: [
              ...prev.options,
              { contentType: ContentType.TEXT, text: '', isCorrect: false },
            ],
          }
        : prev,
    );
  };

  const handleRemoveOption = (index: number) => {
    setFormValues((prev) =>
      prev.options.length <= 2
        ? prev
        : { ...prev, options: prev.options.filter((_, i) => i !== index) },
    );
  };

  const validateForm = (): boolean => {
    if (!formValues.text.trim()) {
      appAlert('Error', 'Debe proporcionar el enunciado de la pregunta');
      return false;
    }
    if (formValues.contentType !== ContentType.TEXT && !formValues.mediaId) {
      appAlert('Error', 'Debe subir un archivo para este tipo de contenido');
      return false;
    }
    const filledOptions = formValues.options.filter(isOptionFilled);
    if (filledOptions.length < 2) {
      appAlert('Error', 'Debe proporcionar al menos 2 opciones');
      return false;
    }
    // Sobre las opciones completas: las vacías se descartan al guardar.
    if (!filledOptions.some((opt) => opt.isCorrect)) {
      appAlert('Error', 'Debe marcar una opción como la respuesta correcta');
      return false;
    }
    if (!formValues.categoryId) {
      appAlert('Error', 'Debe seleccionar una categoría');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm() || !question) return;

    setSaving(true);

    const questionResponse = await questionService.update(questionId, {
      contentType: formValues.contentType,
      text: formValues.text,
      mediaId: toQuestionMediaId(formValues),
      moreInfo: formValues.moreInfo || undefined,
      categoryId: formValues.categoryId,
      timeLimit: formValues.timeLimit,
    });

    if (!questionResponse.ok) {
      setSaving(false);
      appAlert(
        'Error',
        getErrorMessage(questionResponse.message, 'No se pudo actualizar la pregunta'),
      );
      return;
    }

    const currentOptionIds = formValues.options
      .map((opt) => opt.id)
      .filter((id): id is string => Boolean(id));
    const removedOptionIds = originalOptionIds.filter((id) => !currentOptionIds.includes(id));

    const optionWrites = await Promise.all([
      ...formValues.options.filter(isOptionFilled).map((opt) =>
        opt.id
          ? questionOptionsService.update(opt.id, {
              ...toOptionContentPayload(opt),
              isCorrect: opt.isCorrect,
            })
          : questionOptionsService.create({
              ...toOptionContentPayload(opt),
              isCorrect: opt.isCorrect,
              questionId,
            }),
      ),
      ...removedOptionIds.map((id) => questionOptionsService.delete(id)),
    ]);

    setSaving(false);

    const failed = optionWrites.some((response) => !response.ok);
    if (failed) {
      appAlert('Error', 'La pregunta se guardó, pero algunas opciones no se pudieron actualizar');
      return;
    }

    appAlert('Éxito', 'Pregunta actualizada correctamente', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const handleDelete = () => {
    appAlert('Eliminar Pregunta', '¿Estás seguro de que quieres eliminar esta pregunta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const response = await questionService.delete(questionId);
          if (!response.ok) {
            appAlert('Error', getErrorMessage(response.message, 'No se pudo eliminar la pregunta'));
            return;
          }
          appAlert('Éxito', 'Pregunta eliminada correctamente', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        },
      },
    ]);
  };

  const handleToggleActive = async () => {
    if (!question) return;

    setSaving(true);
    const response = await questionService.update(questionId, { active: !question.active });
    setSaving(false);

    if (!response.ok) {
      appAlert(
        'Error',
        getErrorMessage(response.message, 'No se pudo actualizar el estado de la pregunta'),
      );
      return;
    }

    setQuestion((prev) => (prev ? { ...prev, active: !prev.active } : prev));
  };

  if (loading || categoriesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading size={80} />
        <Text style={styles.loadingText}>Cargando pregunta...</Text>
      </View>
    );
  }

  if (!question) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>No se pudo cargar la pregunta</Text>
        <Button title="Volver" variant="primary" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Editar Pregunta</Text>
              <Text style={styles.subtitle}>ID: {questionId}</Text>
            </View>
            <Button
              title={question.active ? 'Activa' : 'Inactiva'}
              variant={question.active ? 'primary' : 'outlined'}
              size="small"
              onPress={handleToggleActive}
              disabled={saving}
              style={styles.statusButton}
            />
          </View>
        </View>

        <View style={styles.formContainer}>
          <QuestionForm
            values={formValues}
            categories={categories}
            selectedLevel={selectedLevel}
            selectedType={selectedType}
            onLevelFilterChange={setSelectedLevel}
            onTypeFilterChange={setSelectedType}
            onContentChange={(value) =>
              setFormValues((prev) => ({
                ...prev,
                contentType: value.contentType,
                mediaId: value.mediaId,
                media: value.media,
              }))
            }
            onTextChange={(text) => setFormValues((prev) => ({ ...prev, text }))}
            onMoreInfoChange={(moreInfo) => setFormValues((prev) => ({ ...prev, moreInfo }))}
            onTimeLimitChange={(timeLimit) => setFormValues((prev) => ({ ...prev, timeLimit }))}
            onCategoryChange={(categoryId) => setFormValues((prev) => ({ ...prev, categoryId }))}
            onOptionContentChange={(index, value) =>
              setFormValues((prev) => ({
                ...prev,
                options: prev.options.map((opt, i) =>
                  i === index
                    ? {
                        ...opt,
                        contentType: value.contentType,
                        mediaId: value.mediaId,
                        media: value.media,
                      }
                    : opt,
                ),
              }))
            }
            onOptionTextChange={(index, text) =>
              setFormValues((prev) => ({
                ...prev,
                options: prev.options.map((opt, i) => (i === index ? { ...opt, text } : opt)),
              }))
            }
            onAddOption={handleAddOption}
            onRemoveOption={handleRemoveOption}
            onSetCorrectOption={(index) =>
              setFormValues((prev) => ({
                ...prev,
                options: prev.options.map((opt, i) => ({ ...opt, isCorrect: i === index })),
              }))
            }
          />

          <View style={styles.actionsContainer}>
            <View style={styles.deleteButtonWrap}>
              <Button title="Eliminar" variant="outlined" onPress={handleDelete} />
            </View>
            <View style={styles.saveActions}>
              <View style={styles.actionButton}>
                <Button title="Cancelar" variant="outlined" onPress={() => navigation.goBack()} />
              </View>
              <View style={styles.submitButton}>
                <Button
                  title={saving ? 'Guardando...' : 'Guardar Cambios'}
                  variant="primary"
                  onPress={handleSave}
                  disabled={saving}
                />
              </View>
            </View>
          </View>
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
      paddingBottom: theme.spacing.xl,
    },
    page: {
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
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
    },
    statusButton: {
      width: 120,
    },
    formContainer: {
      padding: isDesktop ? theme.spacing.xl : theme.spacing.lg,
    },
    actionsContainer: {
      marginTop: theme.spacing.lg,
      flexDirection: isDesktop ? 'row' : 'column',
      justifyContent: 'space-between',
      alignItems: isDesktop ? 'center' : 'stretch',
      gap: theme.spacing.md,
    },
    deleteButtonWrap: {
      width: 140,
    },
    saveActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    actionButton: {
      width: 140,
    },
    submitButton: {
      width: 200,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color.background,
      gap: theme.spacing.sm,
      padding: theme.spacing.lg,
    },
    loadingText: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
    errorText: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.error,
      marginBottom: theme.spacing.md,
      textAlign: 'center',
    },
  });

export default QuestionDetailScreen;
