import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Button from '@/shared/components/Button/Button.component';
import { Loading } from '@/shared/components/Loading';
import { Icon } from '@/shared/components/Icon';
import ConfirmDialog from '@/shared/components/ConfirmDialog/ConfirmDialog.component';
import { useAuthState } from '@/store';
import type { StoriesAdminStackParamList } from '@/app/navigation/StoriesAdminStack';
import StoryAvatar from '../../components/StoryAvatar';
import StoryReviewView from '../../screens/Story/StoryReview.view';
import RemoveStoryDialog from '../components/RemoveStoryDialog';
import { useAdminStoryDetail } from '../useAdminStories';
import {
  AdminStoryDetail,
  missingImageOrders,
  REMOVAL_REASON_LABELS,
  RemoveStoryInput,
  StoryModerationAction,
  StoryVisibility,
} from '../types';

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' });

/**
 * Panel lateral: volver a la lista, estado, quién la quitó (si aplica),
 * quitar o restaurar, el historial de moderación y los jugadores con su cuenta.
 */
const ModerationPanel: React.FC<{
  story: AdminStoryDetail;
  /** Viñetas que se están regenerando (vacío si ninguna). */
  regeneratingOrders: number[];
  imagesMessage: string | null;
  onRegenerateImages: () => void;
  updating: boolean;
  /** Error de la última acción (restaurar); el de quitar se muestra en su diálogo. */
  actionError: string | null;
  onRemove: () => void;
  onRestore: () => void;
  /** Vuelve a la lista de historietas. */
  onBack: () => void;
}> = ({
  story,
  regeneratingOrders,
  imagesMessage,
  onRegenerateImages,
  updating,
  actionError,
  onRemove,
  onRestore,
  onBack,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, true), [theme]);
  const removed = story.visibility === StoryVisibility.REMOVED;
  const missing = missingImageOrders(story);
  // Viñetas en pantalla desde 1.
  const panelList = (orders: number[]) => orders.map((order) => order + 1).join(', ');

  return (
    <View style={styles.panel}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessibilityRole="button"
        accessibilityLabel="Volver a la lista de historietas"
      >
        <Icon name="ArrowLeftIcon" size="md" color={theme.color.primary} />
        <Text style={styles.backText}>Volver a la lista</Text>
      </TouchableOpacity>
      <Text style={styles.panelTitle}>{story.title ?? 'Sin título'}</Text>
      <Text style={styles.meta}>
        Partida {story.gameId} · {story.level} · {story.panelsCount} viñetas
      </Text>
      <Text style={styles.meta}>Terminada: {formatDateTime(story.finishedAt)}</Text>

      <View style={[styles.status, removed ? styles.statusRemoved : styles.statusPublished]}>
        <Text style={[styles.statusText, removed && styles.statusTextRemoved]}>
          {removed ? 'Quitada: no se muestra a los jugadores' : 'Publicada en el catálogo'}
        </Text>
        {story.removal && (
          <>
            <Text style={styles.statusDetail}>
              Motivo: {REMOVAL_REASON_LABELS[story.removal.reason]}
            </Text>
            {story.removal.note && (
              <Text style={styles.statusDetail}>Nota: {story.removal.note}</Text>
            )}
            <Text style={styles.statusDetail}>
              Por {story.removal.removedBy?.username ?? '(cuenta eliminada)'} el{' '}
              {formatDateTime(story.removal.removedAt)}
            </Text>
          </>
        )}
      </View>

      {removed ? (
        <Button
          title={updating ? 'Restaurando...' : 'Restaurar historieta'}
          icon="ArrowCounterClockwiseIcon"
          onPress={onRestore}
          disabled={updating}
        />
      ) : (
        <Button
          title="Quitar historieta"
          variant="outlined"
          icon="TrashIcon"
          onPress={onRemove}
          disabled={updating}
          style={styles.removeButton}
        />
      )}
      {actionError && <Text style={styles.error}>{actionError}</Text>}

      {missing.length > 0 && (
        <View style={styles.imagesBox}>
          <Text style={styles.sectionTitle}>Imágenes</Text>
          {regeneratingOrders.length > 0 ? (
            <Text style={styles.meta}>
              Generando {regeneratingOrders.length} imagen(es) (viñetas{' '}
              {panelList(regeneratingOrders)}). Se actualiza sola; puede tardar unos minutos.
            </Text>
          ) : (
            <>
              <Text style={styles.meta}>
                {missing.length === 1 ? 'Falta 1 imagen' : `Faltan ${missing.length} imágenes`}{' '}
                (viñetas {panelList(missing)}).
              </Text>
              <Button
                title={`Regenerar imágenes faltantes (${missing.length})`}
                variant="outlined"
                icon="ArrowClockwiseIcon"
                onPress={onRegenerateImages}
              />
            </>
          )}
          {imagesMessage && <Text style={styles.meta}>{imagesMessage}</Text>}
        </View>
      )}

      {story.moderationHistory.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Historial de moderación</Text>
          {story.moderationHistory.map((entry, index) => (
            <View key={`${entry.at}-${index}`} style={styles.historyEntry}>
              <Text
                style={[
                  styles.historyAction,
                  entry.action === StoryModerationAction.REMOVED
                    ? styles.historyRemoved
                    : styles.historyRestored,
                ]}
              >
                {entry.action === StoryModerationAction.REMOVED ? 'Quitada' : 'Restaurada'}
                {entry.reason ? ` · ${REMOVAL_REASON_LABELS[entry.reason]}` : ''}
              </Text>
              {entry.note && <Text style={styles.statusDetail}>{entry.note}</Text>}
              <Text style={styles.meta}>
                {entry.admin?.username ?? '(cuenta eliminada)'} · {formatDateTime(entry.at)}
              </Text>
            </View>
          ))}
        </>
      )}

      <Text style={styles.sectionTitle}>Jugadores</Text>
      {story.participants.map((player) => (
        <View key={player.userId} style={styles.player}>
          <StoryAvatar name={player.username} avatarUrl={player.avatarUrl} size={32} />
          <View style={styles.playerInfo}>
            <Text style={styles.playerName}>
              #{player.position} {player.username}
              {player.currentUsername && player.currentUsername !== player.username
                ? ` (ahora ${player.currentUsername})`
                : ''}
              {player.left ? ' · salió' : ''}
            </Text>
            <Text style={styles.meta} selectable>
              {player.email ?? '(cuenta eliminada)'}
            </Text>
            <Text style={styles.meta}>
              {player.panelsWritten} viñetas · {player.totalScore} pts
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

/**
 * Detalle de una historieta para el admin (solo web): la historieta completa
 * tal como la ven los jugadores y, al lado, el panel de moderación.
 */
const AdminStoryDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const { params } = useRoute<RouteProp<StoriesAdminStackParamList, 'AdminStoryDetail'>>();
  const { user } = useAuthState();
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);
  const {
    story,
    loading,
    error,
    updating,
    reload,
    remove,
    restore,
    regenerateImages,
    regeneratingOrders,
  } = useAdminStoryDetail(params.storyId);
  const [imagesMessage, setImagesMessage] = useState<string | null>(null);

  const handleRegenerateImages = async () => {
    setImagesMessage(null);
    const failure = await regenerateImages();
    if (failure) setImagesMessage(failure);
  };
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  const reactionsUsed = useMemo(
    () => [
      ...new Set(story?.manifest.panels.flatMap((panel) => Object.values(panel.reactions)) ?? []),
    ],
    [story],
  );

  const handleRemove = async (input: RemoveStoryInput) => {
    setRemoveError(null);
    const failure = await remove(input);
    if (failure) setRemoveError(failure);
    else setDialogOpen(false);
  };

  const handleRestore = async () => {
    setRestoreOpen(false);
    setRestoreError(await restore());
  };

  if (!story) {
    return (
      <View style={styles.center}>
        {loading ? (
          <Loading size={64} />
        ) : (
          <>
            <Text style={styles.error}>{error ?? 'No se pudo cargar la historieta'}</Text>
            <Button title="Reintentar" variant="outlined" onPress={() => void reload()} />
            <Button title="Volver" variant="outlined" onPress={() => navigation.goBack()} />
          </>
        )}
      </View>
    );
  }

  const panel = (
    <ModerationPanel
      story={story}
      regeneratingOrders={regeneratingOrders}
      imagesMessage={imagesMessage}
      onRegenerateImages={() => void handleRegenerateImages()}
      updating={updating}
      actionError={restoreError}
      onRemove={() => {
        setRemoveError(null);
        setDialogOpen(true);
      }}
      onRestore={() => {
        setRestoreError(null);
        setRestoreOpen(true);
      }}
      onBack={() => navigation.goBack()}
    />
  );

  return (
    <View style={styles.container}>
      {isDesktop ? (
        <View style={styles.columns}>
          <View style={styles.storyColumn}>
            <StoryReviewView
              manifest={story.manifest}
              userId={user?.id ?? ''}
              reactionOptions={reactionsUsed}
              title="Historieta"
            />
          </View>
          <ScrollView style={styles.panelColumn} contentContainerStyle={styles.panelContent}>
            {panel}
          </ScrollView>
        </View>
      ) : (
        <>
          <ScrollView style={styles.panelTop}>{panel}</ScrollView>
          <StoryReviewView
            manifest={story.manifest}
            userId={user?.id ?? ''}
            reactionOptions={reactionsUsed}
            title="Historieta"
          />
        </>
      )}

      <RemoveStoryDialog
        visible={dialogOpen}
        storyLabel={story.title ?? story.gameId}
        submitting={updating}
        error={removeError}
        onConfirm={(input) => void handleRemove(input)}
        onCancel={() => setDialogOpen(false)}
      />
      <ConfirmDialog
        visible={restoreOpen}
        title="Restaurar historieta"
        message={`«${story.title ?? story.gameId}» vuelve a publicarse en el catálogo y en el historial de sus jugadores.`}
        confirmLabel="Restaurar"
        cancelLabel="Cancelar"
        onConfirm={() => void handleRestore()}
        onCancel={() => setRestoreOpen(false)}
      />
    </View>
  );
};

const PANEL_WIDTH = 360;

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
    },
    columns: {
      flex: 1,
      flexDirection: 'row',
    },
    storyColumn: {
      flex: 1,
      minWidth: 0,
    },
    panelColumn: {
      width: PANEL_WIDTH,
      flexGrow: 0,
      borderLeftWidth: theme.borderWidth.xs,
      borderLeftColor: theme.color.border,
      backgroundColor: theme.color.surfaceElevated,
    },
    panelContent: {
      padding: theme.spacing.lg,
    },
    panelTop: {
      maxHeight: 280,
      padding: theme.spacing.md,
      borderBottomWidth: theme.borderWidth.xs,
      borderBottomColor: theme.color.border,
    },
    panel: {
      gap: theme.spacing.sm,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: theme.spacing.xs,
      marginBottom: theme.spacing.xs,
    },
    backText: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.primary,
    },
    panelTitle: {
      fontSize: isDesktop ? theme.fontSize.xl : theme.fontSize.lg,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
    },
    meta: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    status: {
      padding: theme.spacing.sm,
      borderRadius: theme.radius.md,
      gap: 2,
    },
    statusPublished: {
      backgroundColor: theme.color.successSubtle,
    },
    statusRemoved: {
      backgroundColor: theme.color.errorSubtle,
    },
    statusText: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.success,
    },
    statusTextRemoved: {
      color: theme.color.error,
    },
    statusDetail: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textPrimary,
    },
    removeButton: {
      borderColor: theme.color.error,
    },
    imagesBox: {
      gap: theme.spacing.xs,
    },
    historyEntry: {
      paddingVertical: theme.spacing.xs,
      borderBottomWidth: theme.borderWidth.xs,
      borderBottomColor: theme.color.border,
      gap: 2,
    },
    historyAction: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
    },
    historyRemoved: {
      color: theme.color.error,
    },
    historyRestored: {
      color: theme.color.success,
    },
    sectionTitle: {
      marginTop: theme.spacing.md,
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    player: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    playerInfo: {
      flex: 1,
    },
    playerName: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.md,
      padding: theme.spacing.lg,
      backgroundColor: theme.color.background,
    },
    error: {
      fontSize: theme.fontSize.md,
      color: theme.color.textError,
      textAlign: 'center',
    },
  });

export default AdminStoryDetailScreen;
