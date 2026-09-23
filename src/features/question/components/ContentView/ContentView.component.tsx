import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
 * TEXT usa `text`; IMAGE/AUDIO/VIDEO muestran el enunciado (`text`) seguido de
 * la media (MediaAsset). La media se monta con `key={url}` para que al cambiar
 * de pregunta se cree un reproductor nuevo que arranque solo.
 */
export const ContentView: React.FC<ContentViewProps> = ({ contentType, text, media }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const url = media?.url;

  if (contentType === ContentType.TEXT) {
    return <TextView text={text ?? ''} />;
  }

  const renderMedia = () => {
    if (!url) return null;
    switch (contentType) {
      case ContentType.IMAGE:
        return <ImageView key={url} url={url} />;
      case ContentType.VIDEO:
        return <VideoViewComponent key={url} url={url} />;
      case ContentType.AUDIO:
        return <AudioView key={url} url={url} />;
      default:
        return <Text style={styles.unsupported}>Contenido no soportado</Text>;
    }
  };

  return (
    <View style={styles.container}>
      {!!text?.trim() && <TextView text={text} />}
      {renderMedia()}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      width: '100%',
      gap: theme.spacing.md,
    },
    unsupported: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
      textAlign: 'center',
    },
  });
