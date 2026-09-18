import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import Input from '@/shared/components/Input/Input.component';
import { Level } from '@/shared/types/common';

const PAGE_MAX_WIDTH = 560;

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
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);
  const [joinRoomId, setJoinRoomId] = useState('');

  const handleJoinGame = useCallback(() => {
    if (!joinRoomId.trim()) {
      Alert.alert('Error', 'Please enter a room ID');
      return;
    }
    onJoinGame(joinRoomId.trim());
  }, [joinRoomId, onJoinGame]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.page}>
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
            <Input
              placeholder="e.g., car_tree_green"
              variant="outlined"
              value={joinRoomId}
              onChangeText={setJoinRoomId}
              autoCapitalize="none"
              style={styles.roomInput}
            />
            <Button
              title="🔗 Join Game"
              variant="outlined"
              onPress={handleJoinGame}
              disabled={!joinRoomId.trim()}
              style={styles.joinButton}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
      backgroundColor: theme.color.background,
    },
    scrollContent: {
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
    },
    page: {
      width: '100%',
      maxWidth: PAGE_MAX_WIDTH,
    },
    section: {
      marginBottom: theme.spacing.lg,
    },
    sectionTitle: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    levelButtons: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: theme.spacing.sm,
    },
    levelButton: {
      maxWidth: '30%',
    },
    createButtons: {
      flexDirection: isDesktop ? 'row' : 'column',
      gap: theme.spacing.sm,
    },
    createButton: {
      flex: 1,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: theme.spacing.sm,
      gap: theme.spacing.md,
    },
    dividerLine: {
      flex: 1,
      height: theme.borderWidth.xs,
      backgroundColor: theme.color.border,
    },
    dividerText: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
    },
    joinLabel: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
      fontFamily: theme.fontFamily.bodyBold,
      marginBottom: theme.spacing.xs,
    },
    roomInput: {
      marginBottom: theme.spacing.sm,
    },
    joinButton: {
      width: '100%',
    },
  });

export default GameMainMenu;
