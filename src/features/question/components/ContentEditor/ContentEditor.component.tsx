import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { FilterChip } from '@/shared/components/FilterChip';
import Input from '@/shared/components/Input/Input.component';
import { ContentObject } from '@/shared/types/common/cores.type';
import { ContentType } from '@/shared/types/common';
import { ImageView } from '../content-types/ImageView';
import { AudioView } from '../content-types/AudioView';
import { VideoViewComponent } from '../content-types/VideoView';

export interface ContentEditorProps {
  label?: string;
  value: ContentObject;
  onChange: (content: ContentObject) => void;
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
    if (type === value.type) return;
    // El valor anterior (texto u otra URL) no es válido para el nuevo tipo.
    onChange({ type, value: '' });
  };

  const handleValueChange = (text: string) => {
    onChange({ ...value, value: text });
  };

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.typeRow}>
        {CONTENT_TYPES.map(({ type, label: typeLabel }) => (
          <FilterChip
            key={type}
            label={typeLabel}
            isActive={value.type === type}
            onPress={() => handleTypeChange(type)}
          />
        ))}
      </View>

      {value.type === ContentType.TEXT ? (
        <Input
          placeholder="Enter text..."
          value={value.value}
          onChangeText={handleValueChange}
          variant="outlined"
          multiline
          numberOfLines={2}
        />
      ) : (
        <>
          <Input
            placeholder={URL_PLACEHOLDER[value.type] ?? 'https://...'}
            value={value.value}
            onChangeText={handleValueChange}
            variant="outlined"
          />
          {value.value.trim() !== '' && (
            <View style={styles.preview}>
              {value.type === ContentType.IMAGE && <ImageView url={value.value} />}
              {value.type === ContentType.AUDIO && <AudioView url={value.value} />}
              {value.type === ContentType.VIDEO && <VideoViewComponent url={value.value} />}
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
