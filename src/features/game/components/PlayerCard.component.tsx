import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { PlayerInfo } from '../types';

interface PlayerCardProps {
  player: PlayerInfo;
  isHost?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, isHost = false }) => {
  const showHostBadge = isHost === true;

  const getInitials = (username: string): string => {
    return username
      .split(' ')
      .map((name) => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const statusColor = player.isConnected ? '#10b981' : '#ef4444';
  const opacityStyle = player.isConnected ? 1 : 0.6;

  return (
    <View style={[styles.card, { opacity: opacityStyle }]}>
      {/* Avatar */}
      <View style={styles.avatarSection}>
        {player.avatar ? (
          <Image source={{ uri: player.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.initials}>{getInitials(player.username)}</Text>
          </View>
        )}
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>

      {/* Player Info */}
      <View style={styles.infoSection}>
        <View style={styles.nameRow}>
          <Text style={styles.username} numberOfLines={1}>
            {player.username}
          </Text>
          <Text style={styles.levelBadge}>Level {player.level}</Text>
          {showHostBadge && <Text style={styles.hostBadge}>👑 Host</Text>}
        </View>
        <Text style={styles.status}>{player.isConnected ? '🟢 Connected' : '🔴 Disconnected'}</Text>
      </View>

      {/* Score */}
      <View style={styles.scoreSection}>
        <Text style={styles.scoreLabel}>Score</Text>
        <Text style={styles.scoreValue}>{player.totalScore}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 12,
  },
  avatarSection: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e2e8f0',
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#667eea',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  infoSection: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
  hostBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f59e0b',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338ca',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  status: {
    fontSize: 12,
    color: '#64748b',
  },
  scoreSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  scoreLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 2,
  },
});

export default PlayerCard;
