import { ContentObject } from '@/shared/types/common/cores.type';
import React from 'react';
import { View, Text } from 'react-native';
import { TextView } from './content-types/TextView.component';
import { ContentType } from '@/shared/types/common';
import { ImageView } from './content-types/ImageView.component';
import { AudioView } from './content-types/AudioView.component';
import { VideoViewComponent } from './content-types/VideoView.component';

interface ContentViewProps {
  content: ContentObject;
}

/**
 * Componente despachador que renderiza el tipo de contenido adecuado
 * basado en el ContentObject.
 */
export const ContentView: React.FC<ContentViewProps> = ({ content }) => {
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
      return (
        <View>
          <Text>Contenido no soportado</Text>
        </View>
      );
  }
};
