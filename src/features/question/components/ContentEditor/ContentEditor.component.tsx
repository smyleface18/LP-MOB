import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { FilterChip } from '@/shared/components/FilterChip';
import Input from '@/shared/components/Input/Input.component';
import { ContentType } from '@/shared/types/common';
import { ImageView } from '../content-types/ImageView';
import { AudioView } from '../content-types/AudioView';
import { VideoViewComponent } from '../content-types/VideoView';

/**
 * NOTA: hasta que exista el StorageModule (subida/presign a S3 en el backend),
 * este editor sigue dejando pegar una URL libre para IMAGE/AUDIO/VIDEO, pero esa
 * URL ya no se puede persistir (el backend exige un media_id real vía un
 * CHECK constraint). Guardar una pregunta no-TEXT va a fallar hasta que se
 * conecte la subida real. Decisión explícita: dejarlo así por ahora.
 */
export interface ContentEditorValue {
  contentType: ContentType;
  text: string;
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

const URL_PLACEHOLDER: Partial<Record<ContentType, string>> = {
  [ContentType.IMAGE]: 'https://...jpg',
  [ContentType.AUDIO]: 'https://...mp3',
  [ContentType.VIDEO]: 'https://...mp4',
};

const ContentEditor: React.FC<ContentEditorProps> = ({ label, value, onChange }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleTypeChange = (type: ContentType) => {
    if (type === value.contentType) return;
    // El valor anterior (texto u otra URL) no es válido para el nuevo tipo.
    onChange({ contentType: type, text: '' });
  };

  const handleValueChange = (text: string) => {
    onChange({ ...value, text });
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

      {value.contentType === ContentType.TEXT ? (
        <Input
          placeholder="Enter text..."
          value={value.text}
          onChangeText={handleValueChange}
          variant="outlined"
          multiline
          numberOfLines={2}
        />
      ) : (
        <>
          <Input
            placeholder={URL_PLACEHOLDER[value.contentType] ?? 'https://...'}
            value={value.text}
            onChangeText={handleValueChange}
            variant="outlined"
          />
          {value.text.trim() !== '' && (
            <View style={styles.preview}>
              {value.contentType === ContentType.IMAGE && <ImageView url={value.text} />}
              {value.contentType === ContentType.AUDIO && <AudioView url={value.text} />}
              {value.contentType === ContentType.VIDEO && (
                <VideoViewComponent url={value.text} />
              )}
            </View>
          )}
        </>
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
  });

export default ContentEditor;
