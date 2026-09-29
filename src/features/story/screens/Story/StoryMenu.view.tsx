import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import Button from '@/shared/components/Button/Button.component';
import Input from '@/shared/components/Input/Input.component';

const PAGE_MAX_WIDTH = 560;

export interface StoryMenuViewProps {
  creating: boolean;
  joining: boolean;
  onCreate: () => void;
  onJoin: (gameId: string) => void;
}

const HOW_IT_WORKS = [
  '✍️ Take turns writing one panel of a comic in English — or write them all yourself.',
  '🧑‍🏫 An AI teacher checks your English before you confirm.',
  '🎭 Create characters that everyone can use in their panels.',
  '🏆 Fewer mistakes, more points. Read the whole story at the end!',
];

const StoryMenuView: React.FC<StoryMenuViewProps> = ({ creating, joining, onCreate, onJoin }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [gameId, setGameId] = useState('');

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.page}>
          <View style={styles.hero}>
            <Text style={styles.heroEmoji}>📖</Text>
            <Text style={styles.title}>Story Mode</Text>
            <Text style={styles.subtitle}>Write a comic on your own or with your friends.</Text>
          </View>

          <View style={styles.card}>
            {HOW_IT_WORKS.map((line) => (
              <Text key={line} style={styles.step}>
                {line}
              </Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Create a story</Text>
            <Button
              title={creating ? 'Creating...' : 'New story'}
              icon="BookOpenIcon"
              onPress={onCreate}
              disabled={creating || joining}
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Join a story</Text>
            <Input
              placeholder="Story code, e.g. car_tree_green"
              variant="outlined"
              value={gameId}
              onChangeText={setGameId}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Button
              title={joining ? 'Joining...' : 'Join story'}
              variant="outlined"
              onPress={() => onJoin(gameId.trim())}
              disabled={!gameId.trim() || creating || joining}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
    },
    scrollContent: {
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    page: {
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
      gap: theme.spacing.lg,
    },
    hero: {
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    heroEmoji: {
      fontSize: 48,
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
    },
    subtitle: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
    card: {
      backgroundColor: theme.color.surface,
      borderRadius: theme.radius.lg,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    step: {
      fontSize: theme.fontSize.md,
      color: theme.color.textPrimary,
    },
    section: {
      gap: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    dividerLine: {
      flex: 1,
      height: theme.borderWidth.xs,
      backgroundColor: theme.color.border,
    },
    dividerText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPlaceholder,
    },
  });

export default StoryMenuView;
