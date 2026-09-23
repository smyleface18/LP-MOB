import React, { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { MediaAsset } from '@/shared/types/common/cores.type';
import { ContentType } from '@/shared/types/common';
import { useTheme } from '@/app/providers/theme.provider';
import { TextView } from '../content-types/TextView';
import { ImageView } from '../content-types/ImageView';
import { AudioView } from '../content-types/AudioView';
import { VideoViewComponent } from '../content-types/VideoView';

export interface ContentViewProps {
  contentType: ContentType;
  text?: string;
  media?: MediaAsset;
}

/**
 * Componente despachador que renderiza el tipo de contenido adecuado.
 * TEXT usa `text`; IMAGE/AUDIO/VIDEO usan la URL de `media` (MediaAsset).
 */
export const ContentView: React.FC<ContentViewProps> = ({ contentType, text, media }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const url = media?.url;

  switch (contentType) {
    case ContentType.TEXT:
      return <TextView text={text ?? ''} />;

    case ContentType.IMAGE:
      return url ? <ImageView url={url} /> : null;

    case ContentType.VIDEO:
      return url ? <VideoViewComponent url={url} /> : null;

    case ContentType.AUDIO:
      return url ? <AudioView url={url} /> : null;

    default:
      return <Text style={styles.unsupported}>Contenido no soportado</Text>;
  }
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    unsupported: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
  });
