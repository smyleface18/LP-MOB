import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Button from '@/shared/components/Button.component';
import { Level } from '@/shared/types/common';

interface GameMainMenuProps {
  selectedLevel: Level;
  onLevelSelect: (level: Level) => void;
  onCreateSinglePlayer: () => void;
  onCreateMultiplayer: () => void;
  onJoinGame: (roomId: string) => void;
}

const GameMainMenu: React.FC<GameMainMenuProps> = ({
  selectedLevel,
  onLevelSelect,
  onCreateSinglePlayer,
  onCreateMultiplayer,
  onJoinGame,
}) => {
  const [joinRoomId, setJoinRoomId] = React.useState('');

  const handleJoinGame = useCallback(() => {
    if (!joinRoomId.trim()) {
      Alert.alert('Error', 'Please enter a room ID');
      return;
    }
    onJoinGame(joinRoomId.trim());
  }, [joinRoomId, onJoinGame]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Level Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Level</Text>
          <View style={styles.levelButtons}>
            {(Object.values(Level) as Level[]).map((lvl) => (
              <Button
                key={lvl}
                title={lvl}
                variant={selectedLevel === lvl ? 'primary' : 'outlined'}
                size="small"
                onPress={() => onLevelSelect(lvl)}
                style={styles.levelButton}
              />
            ))}
          </View>
        </View>

        {/* Create Game Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Create Game</Text>
          <View style={styles.createButtons}>
            <Button
              title="🎯 Single Player"
              variant="primary"
              onPress={onCreateSinglePlayer}
              style={styles.createButton}
            />
            <Button
              title="👥 Multiplayer"
              variant="secondary"
              onPress={onCreateMultiplayer}
              style={styles.createButton}
            />
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Join Game Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Join Game</Text>
          <Text style={styles.joinLabel}>Enter Room ID</Text>
          <TextInput
            style={[styles.roomInput, { writingDirection: 'ltr' }]}
            placeholder="e.g., car_tree_green"
            value={joinRoomId}
            onChangeText={setJoinRoomId}
            autoCapitalize="none"
            placeholderTextColor="#cbd5e1"
          />
          <Button
            title="🔗 Join Game"
            variant="outlined"
            onPress={handleJoinGame}
            disabled={!joinRoomId.trim()}
            style={styles.joinButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  levelButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  levelButton: {
    maxWidth: '30%',
  },
  createButtons: {
    gap: 10,
  },
  createButton: {
    width: '100%',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  joinLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 8,
  },
  roomInput: {
    height: 50,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
  },
  joinButton: {
    width: '100%',
  },
});

export default GameMainMenu;
