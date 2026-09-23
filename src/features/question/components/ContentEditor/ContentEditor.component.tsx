import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { FilterChip } from '@/shared/components/FilterChip';
import FilePickerButton from '@/shared/components/FilePicker';
import { ContentType } from '@/shared/types/common';
import { MediaAsset } from '@/shared/types/common/cores.type';
import { ProgressBar } from '@/shared/components/ProgressBar';
import { mediaService, UploadState, UploadStage } from '../../services/media.service';
import { ImageView } from '../content-types/ImageView';
import { AudioView } from '../content-types/AudioView';
import { VideoViewComponent } from '../content-types/VideoView';

/**
 * Selector de tipo de contenido + (si no es TEXT) subida real de archivo a S3
 * vía /media/presign -> PUT directo -> /media/:id/confirm. NO maneja texto:
 * el enunciado de la Question es siempre obligatorio y lo maneja el caller
 * (QuestionForm) como campo aparte; el texto de una QuestionOption es
 * exclusivo con media, así que el caller lo muestra solo cuando corresponde.
 */
export interface ContentEditorValue {
  contentType: ContentType;
  mediaId?: string;
  media?: MediaAsset;
}

export interface ContentEditorProps {
  label?: string;
  value: ContentEditorValue;
  onChange: (value: ContentEditorValue) => void;
}

const CONTENT_TYPES: { type: ContentType; label: string }[] = [
  { type: ContentType.TEXT, label: 'Text' },
  { type: ContentType.IMAGE, label: 'Image' },
  { type: ContentType.AUDIO, label: 'Audio' },
  { type: ContentType.VIDEO, label: 'Video' },
];

const ACCEPT_BY_TYPE: Partial<Record<ContentType, string>> = {
  [ContentType.IMAGE]: 'image/*',
  [ContentType.AUDIO]: 'audio/*',
  [ContentType.VIDEO]: 'video/*',
};

const STAGE_LABEL: Record<UploadStage, string> = {
  preparing: 'Preparando subida...',
  uploading: 'Subiendo archivo...',
  confirming: 'Procesando archivo...',
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ContentEditor: React.FC<ContentEditorProps> = ({ label, value, onChange }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [upload, setUpload] = useState<(UploadState & { fileName: string }) | null>(null);
  const uploading = upload !== null;
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleTypeChange = (type: ContentType) => {
    if (type === value.contentType) return;
    // El media anterior no es válido para el nuevo tipo.
    onChange({ contentType: type, mediaId: undefined, media: undefined });
    setUploadError(null);
  };

  const handleFileSelected = async (file: File) => {
    setUpload({ stage: 'preparing', loaded: 0, total: file.size, percent: 0, fileName: file.name });
    setUploadError(null);
    try {
      const media = await mediaService.uploadFile(file, value.contentType, (state) =>
        setUpload({ ...state, fileName: file.name }),
      );
      onChange({ contentType: value.contentType, mediaId: media.id, media });
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'No se pudo subir el archivo');
    } finally {
      setUpload(null);
    }
  };

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.typeRow}>
        {CONTENT_TYPES.map(({ type, label: typeLabel }) => (
          <FilterChip
            key={type}
            label={typeLabel}
            isActive={value.contentType === type}
            onPress={() => handleTypeChange(type)}
          />
        ))}
      </View>

      {value.contentType !== ContentType.TEXT && (
        <View>
          <FilePickerButton
            title={
              uploading
                ? 'Subiendo...'
                : value.media?.url
                  ? 'Reemplazar archivo'
                  : 'Elegir archivo de tu PC'
            }
            accept={ACCEPT_BY_TYPE[value.contentType]}
            disabled={uploading}
            onFileSelected={handleFileSelected}
          />

          {upload && (
            <View style={styles.uploadBox}>
              <Text style={styles.uploadFileName} numberOfLines={1}>
                {upload.fileName}
              </Text>
              <ProgressBar percentage={upload.percent} label={STAGE_LABEL[upload.stage]} />
              <Text style={styles.uploadBytes}>
                {formatBytes(upload.loaded)} / {formatBytes(upload.total)}
              </Text>
            </View>
          )}

          {uploadError && <Text style={styles.errorText}>{uploadError}</Text>}

          {value.media?.url && (
            <View style={styles.preview}>
              {value.contentType === ContentType.IMAGE && <ImageView url={value.media.url} />}
              {value.contentType === ContentType.AUDIO && <AudioView url={value.media.url} />}
              {value.contentType === ContentType.VIDEO && (
                <VideoViewComponent url={value.media.url} />
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    label: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    typeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: theme.spacing.sm,
    },
    preview: {
      marginTop: theme.spacing.sm,
    },
    uploadBox: {
      marginTop: theme.spacing.sm,
      padding: theme.spacing.md,
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.surface,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
    },
    uploadFileName: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    uploadBytes: {
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
    },
    errorText: {
      color: theme.color.error,
      fontSize: theme.fontSize.sm,
      marginTop: theme.spacing.xs,
    },
  });

export default ContentEditor;
