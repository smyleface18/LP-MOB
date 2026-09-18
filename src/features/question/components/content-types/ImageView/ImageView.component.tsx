import React, { useMemo } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';

export interface ImageViewProps {
  url: string;
}

export const ImageView: React.FC<ImageViewProps> = ({ url }) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  return <Image source={{ uri: url }} style={styles.image} resizeMode="contain" />;
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    image: {
      width: '100%',
      height: isDesktop ? 320 : 200,
      borderRadius: theme.radius.lg,
      marginBottom: theme.spacing.md,
      backgroundColor: theme.color.surface,
    },
  });
