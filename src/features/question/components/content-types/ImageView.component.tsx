import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface ImageViewProps {
  url: string;
}

export const ImageView: React.FC<ImageViewProps> = ({ url }) => {
  return <Image source={{ uri: url }} style={styles.image} resizeMode="contain" />;
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
});
