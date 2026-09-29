import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import { Icon, IconName } from '@/shared/components/Icon';
import type { ArenaStackParamList } from '@/app/navigation/ArenaStack';

const PAGE_MAX_WIDTH = 900;

interface ModeCardProps {
  emoji: string;
  title: string;
  description: string;
  cta: string;
  icon: IconName;
  onPress: () => void;
}

/** Tarjeta de un modo de juego: toda la tarjeta es el botón. */
const ModeCard: React.FC<ModeCardProps> = ({ emoji, title, description, cta, icon, onPress }) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{description}</Text>
      <View style={styles.cta}>
        <Icon name={icon} size="sm" color={theme.color.onPrimary} weight="fill" />
        <Text style={styles.ctaText}>{cta}</Text>
      </View>
    </TouchableOpacity>
  );
};

/** Inicio del tab "Arena": el jugador elige entre el modo Historieta y la trivia. */
const ArenaHomeScreen: React.FC = () => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);
  const navigation = useNavigation<StackNavigationProp<ArenaStackParamList>>();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.page}>
        <Text style={styles.title}>🎮 Arena</Text>
        <Text style={styles.subtitle}>Choose how you want to practice your English today.</Text>

        <View style={styles.cards}>
          <ModeCard
            emoji="📖"
            title="Story Mode"
            description="Write a comic in English, one panel at a time — alone or with your friends. The AI checks your English and draws your story."
            cta="Play Story Mode"
            icon="BookOpenIcon"
            onPress={() => navigation.navigate('Story')}
          />
          <ModeCard
            emoji="🧠"
            title="Trivia"
            description="Answer English questions against the clock. Play alone or challenge your friends in a room."
            cta="Play Trivia"
            icon="PlayIcon"
            onPress={() => navigation.navigate('Game')}
          />
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
    content: {
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    page: {
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
      gap: theme.spacing.md,
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
    },
    subtitle: {
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
    },
    cards: {
      flexDirection: isDesktop ? 'row' : 'column',
      gap: theme.spacing.lg,
      marginTop: theme.spacing.md,
    },
    card: {
      flex: isDesktop ? 1 : undefined,
      padding: theme.spacing.xl,
      gap: theme.spacing.sm,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.color.surface,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
    },
    emoji: {
      fontSize: 48,
    },
    cardTitle: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
    },
    cardText: {
      flexGrow: 1,
      fontSize: theme.fontSize.md,
      color: theme.color.textSecondary,
      lineHeight: theme.fontSize.md * theme.lineHeight.md,
    },
    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.xs,
      marginTop: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.primary,
    },
    ctaText: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.onPrimary,
    },
  });

export default ArenaHomeScreen;
