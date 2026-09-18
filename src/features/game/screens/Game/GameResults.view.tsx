import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import PlayerCard from '../../components/PlayerCard';
import { PlayerInfo } from '../../types';

const PAGE_MAX_WIDTH = 560;
const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32']; // oro, plata, bronce

interface GameResultsProps {
  players: PlayerInfo[];
  onPlayAgain: () => void;
  isMultiplayer: boolean;
}

const GameResults: React.FC<GameResultsProps> = ({ players, onPlayAgain, isMultiplayer }) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  const rankedPlayers = [...players].sort((a, b) => b.matchScore - a.matchScore);

  return (
    <View style={styles.container}>
      <View style={styles.page}>
        <Text style={styles.title}>🏆 Game Over! 🏆</Text>
        <Text style={styles.subtitle}>Here are the final results:</Text>

        <ScrollView style={styles.resultsList} showsVerticalScrollIndicator={false}>
          {rankedPlayers.map((player, index) => (
            <View key={player.userId} style={styles.playerRow}>
              <Text style={[styles.rank, index < 3 && { color: RANK_COLORS[index] }]}>
                {index + 1}
              </Text>
              <View style={styles.playerCardContainer}>
                <PlayerCard player={player} isHost={false} />
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.actions}>
          <Button
            title={isMultiplayer ? 'Request Rematch' : 'Play Again'}
            onPress={onPlayAgain}
            variant="primary"
          />
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      padding: theme.spacing.lg,
      backgroundColor: theme.color.background,
    },
    page: {
      flex: 1,
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
      alignItems: 'center',
    },
    title: {
      fontSize: isDesktop ? 36 : theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
      marginBottom: theme.spacing.lg,
    },
    resultsList: {
      width: '100%',
      flex: 1,
    },
    playerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
      width: '100%',
    },
    rank: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textSecondary,
      marginRight: theme.spacing.md,
      width: 32,
      textAlign: 'center',
    },
    playerCardContainer: {
      flex: 1,
    },
    actions: {
      width: '100%',
      paddingTop: theme.spacing.lg,
      borderTopWidth: theme.borderWidth.xs,
      borderTopColor: theme.color.border,
    },
  });

export default GameResults;
