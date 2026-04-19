import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import Button from '@/shared/components/Button.component';
import PlayerCard from '../components/PlayerCard.component';
import { PlayerInfo } from '../types';

interface GameLobbyProps {
  roomId: string;
  level: string | null;
  mode: string | null;
  players: PlayerInfo[];
  userId: string;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({
  roomId,
  level,
  mode,
  players,
  userId,
  onStartGame,
  onLeaveRoom,
}) => {
  // Identificar al host (el primero que se unió)
  const hostId = players.length > 0 ? players[0].userId : null;
  const isHost = userId === hostId;
  console.log(`[GameLobby] Render - userId: ${userId}, hostId: ${hostId}, isHost: ${isHost}`);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEnabled={true}
      >
        {/* Header Info */}
        <View style={styles.headerInfo}>
          <Text style={styles.title}>🎯 Game Room</Text>
          <View style={styles.roomDetails}>
            <Text style={styles.label}>
              Room ID: <Text style={styles.value}>{roomId}</Text>
            </Text>
            <Text style={styles.label}>
              Level: <Text style={styles.value}>{level || '⏳ Loading...'}</Text>
            </Text>
            <Text style={styles.label}>
              Mode: <Text style={styles.value}>{mode || '⏳ Loading...'}</Text>
            </Text>
          </View>
        </View>

        {/* Players List */}
        <View style={styles.playersSection}>
          <Text style={styles.sectionTitle}>Players ({players.length})</Text>
          {players.length > 0 ? (
            <View style={styles.playersList}>
              {players.map((player) => {
                console.log(
                  `[GameLobby] Rendering player: ${player.userId} - username: ${player.username}`,
                );
                return (
                  <PlayerCard
                    key={player.userId}
                    player={player}
                    isHost={player.userId === hostId}
                  />
                );
              })}
            </View>
          ) : (
            <Text style={styles.emptyText}>Waiting for players...</Text>
          )}
        </View>

        {/* Ready to Start */}
        {players.length > 0 && (
          <View style={styles.readyContainer}>
            <Text style={styles.waitingText}>✅ Ready to start!</Text>
            {isHost ? (
              <Text style={styles.hostText}>You are the host. Click below to start the game.</Text>
            ) : (
              <Text style={styles.hostText}>Waiting for host to start the game...</Text>
            )}
          </View>
        )}
      </ScrollView>

      {/* Actions - Always visible at bottom */}
      <View style={styles.actions}>
        {isHost && players.length > 0 && (
          <Button
            title="🚀 Start Game"
            variant="primary"
            onPress={onStartGame}
            style={styles.actionButton}
          />
        )}
        <Button
          title="← Leave Room"
          variant="outlined"
          onPress={onLeaveRoom}
          style={styles.actionButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    minHeight: 0, // Important: allows ScrollView to shrink below flex content
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 20,
  },
  headerInfo: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  roomDetails: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  playersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  playersList: {
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 24,
    fontStyle: 'italic',
  },
  readyContainer: {
    backgroundColor: '#d1fae5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#86efac',
    marginBottom: 12,
  },
  waitingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 8,
    textAlign: 'center',
  },
  hostText: {
    fontSize: 14,
    color: '#047857',
    textAlign: 'center',
  },
  actions: {
    padding: 16,
    paddingBottom: 32,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  actionButton: {
    width: '100%',
  },
});

export default GameLobby;
