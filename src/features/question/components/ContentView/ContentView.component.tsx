import React, { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { ContentObject } from '@/shared/types/common/cores.type';
import { ContentType } from '@/shared/types/common';
import { useTheme } from '@/app/providers/theme.provider';
import { TextView } from '../content-types/TextView';
import { ImageView } from '../content-types/ImageView';
import { AudioView } from '../content-types/AudioView';
import { VideoViewComponent } from '../content-types/VideoView';

export interface ContentViewProps {
  content: ContentObject;
}

/**
 * Componente despachador que renderiza el tipo de contenido adecuado
 * basado en el ContentObject.
 */
export const ContentView: React.FC<ContentViewProps> = ({ content }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const url = content.value;

  switch (content.type) {
    case ContentType.TEXT:
      return <TextView text={content.value} />;

    case ContentType.IMAGE:
      return <ImageView url={url} />;

    case ContentType.VIDEO:
      return <VideoViewComponent url={url} />;

    case ContentType.AUDIO:
      return <AudioView url={url} />;

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
