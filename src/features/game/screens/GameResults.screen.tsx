import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from '@/shared/components/Button.component';
import { PlayerInfo } from '../types';
import { colors } from '@/shared/ui/tokens';
import PlayerCard from '../components/PlayerCard.component';

interface GameResultsProps {
  players: PlayerInfo[];
  onPlayAgain: () => void;
}

const GameResults: React.FC<GameResultsProps> = ({ players, onPlayAgain }) => {
  // Sort players by score in descending order
  const rankedPlayers = [...players].sort((a, b) => b.matchScore - a.matchScore);

  const getRankStyle = (index: number) => {
    if (index === 0) return styles.rank1;
    if (index === 1) return styles.rank2;
    if (index === 2) return styles.rank3;
    return {};
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Game Over! 🏆</Text>
      <Text style={styles.subtitle}>Here are the final results:</Text>

      <ScrollView style={styles.resultsList}>
        {rankedPlayers.map((player, index) => (
          <View key={player.userId} style={styles.playerRow}>
            <Text style={[styles.rank, getRankStyle(index)]}>{index + 1}</Text>
            <View style={styles.playerCardContainer}>
              <PlayerCard player={player} isHost={false} />
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.actions}>
        <Button title="Play Again" onPress={onPlayAgain} variant="primary" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 24,
  },
  resultsList: {
    width: '100%',
    flex: 1,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  rank: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.secondary,
    marginRight: 16,
    width: 40,
    textAlign: 'center',
  },
  rank1: {
    color: '#FFD700', // Gold
  },
  rank2: {
    color: '#C0C0C0', // Silver
  },
  rank3: {
    color: '#CD7F32', // Bronze
  },
  playerCardContainer: {
    flex: 1,
  },
  actions: {
    width: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border.subtle,
  },
});

export default GameResults;
