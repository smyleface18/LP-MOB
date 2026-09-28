import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';

export interface StoryAvatarProps {
  name: string;
  /** URL firmada del avatar; sin ella (o si no carga) se muestran las iniciales. */
  avatarUrl: string | null;
  size?: number;
}

const getInitials = (name: string): string =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

/** Avatar redondo de un jugador; cae a sus iniciales si no tiene imagen. */
const StoryAvatar: React.FC<StoryAvatarProps> = ({ name, avatarUrl, size = 44 }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme, size), [theme, size]);
  // Una URL vencida o rota no debe dejar un círculo vacío.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  if (avatarUrl && failedUrl !== avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={styles.avatar}
        onError={() => setFailedUrl(avatarUrl)}
        accessibilityLabel={name}
      />
    );
  }

  return (
    <View style={styles.placeholder} accessibilityLabel={name}>
      <Text style={styles.initials}>{getInitials(name) || '?'}</Text>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, size: number) =>
  StyleSheet.create({
    avatar: {
      width: size,
      height: size,
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.border,
    },
    placeholder: {
      width: size,
      height: size,
      borderRadius: theme.radius.full,
      backgroundColor: theme.color.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    initials: {
      fontSize: size >= 40 ? theme.fontSize.sm : theme.fontSize.sm - 2,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.onPrimary,
    },
  });

export default StoryAvatar;
