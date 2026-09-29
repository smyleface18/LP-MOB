import React, { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import ReactionBar from '../ReactionBar';
import { PanelReactions } from '../../types';

export interface StoryPanelCardProps {
  /** Orden de la viñeta, desde 0 (se muestra desde 1). */
  order: number;
  authorName: string;
  scene: string;
  text: string;
  /** Nombres de los personajes que aparecen. */
  characterNames?: string[];
  /** Puntos de la viñeta (se muestran arriba a la derecha). */
  score?: number;
  /**
   * 'panel': viñeta confirmada. 'draft': borrador en curso del autor (lo ven
   * los demás con `shareDrafts`), con borde punteado.
   */
  variant?: 'panel' | 'draft';
  reactions?: PanelReactions;
  reactionOptions?: string[];
  userId?: string;
  onReact?: (emoji: string) => void;
  /** Dibujo de la viñeta (URL firmada), arriba del texto. */
  imageUrl?: string | null;
  /** Reemplaza el texto plano (ej. el texto narrado con la palabra resaltada). */
  textNode?: React.ReactNode;
  /** Detalle extra debajo del texto (ej. correcciones en el review). */
  children?: React.ReactNode;
}

/** Proporción mientras no se conoce la real: la de las imágenes de FLUX.1 schnell (1024×1024). */
const DEFAULT_IMAGE_RATIO = 1;

/**
 * Proporción (ancho / alto) real de la imagen, para que el marco la muestre
 * entera: los dibujos pueden venir cuadrados (FLUX) o 4:3 (Nova Canvas, en
 * historietas viejas). La URL firmada cambia al volver a firmarse; se lee el
 * tamaño de nuevo (sale de la caché del navegador o del sistema).
 */
const useImageRatio = (imageUrl?: string | null) => {
  const [ratio, setRatio] = useState(DEFAULT_IMAGE_RATIO);
  useEffect(() => {
    if (!imageUrl) return;
    let active = true;
    Image.getSize(
      imageUrl,
      (width, height) => {
        if (active && width > 0 && height > 0) setRatio(width / height);
      },
      // Si no se puede leer, queda la proporción por defecto (y `contain` evita recortes).
      () => {},
    );
    return () => {
      active = false;
    };
  }, [imageUrl]);
  return ratio;
};

const StoryPanelCard: React.FC<StoryPanelCardProps> = ({
  order,
  authorName,
  scene,
  text,
  characterNames = [],
  score,
  variant = 'panel',
  reactions,
  reactionOptions = [],
  userId = '',
  onReact,
  imageUrl,
  textNode,
  children,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const imageRatio = useImageRatio(imageUrl);

  return (
    <View style={[styles.card, variant === 'draft' && styles.draft]}>
      <View style={styles.header}>
        <Text style={styles.order}>{variant === 'draft' ? '✏️ Draft' : `Panel ${order + 1}`}</Text>
        <Text style={styles.author} numberOfLines={1}>
          by {authorName}
        </Text>
        {score !== undefined && <Text style={styles.score}>{score} pts</Text>}
      </View>

      {!!imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.image, { aspectRatio: imageRatio }]}
          // `contain`: nunca recorta, aunque la proporción todavía no se conozca.
          resizeMode="contain"
          accessibilityLabel={scene}
        />
      )}
      {!!scene && <Text style={styles.scene}>🎬 {scene}</Text>}
      {textNode ?? <Text style={styles.text}>{text}</Text>}

      {characterNames.length > 0 && (
        <View style={styles.characters}>
          {characterNames.map((name) => (
            <Text key={name} style={styles.character}>
              {name}
            </Text>
          ))}
        </View>
      )}

      {children}

      {reactions && reactionOptions.length > 0 && (
        <ReactionBar
          reactions={reactions}
          options={reactionOptions}
          userId={userId}
          onReact={onReact}
        />
      )}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.color.surface,
      borderRadius: theme.radius.lg,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
      padding: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    draft: {
      borderStyle: 'dashed',
      borderColor: theme.color.textPlaceholder,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    order: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.primary,
    },
    author: {
      flex: 1,
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
    },
    score: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.success,
      backgroundColor: theme.color.successSubtle,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      borderRadius: theme.radius.sm,
    },
    // La proporción la pone useImageRatio (la real de cada imagen).
    image: {
      width: '100%',
      borderRadius: theme.radius.md,
      backgroundColor: theme.color.border,
    },
    scene: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.body,
      fontStyle: 'italic',
      color: theme.color.textSecondary,
    },
    text: {
      fontSize: theme.fontSize.lg,
      lineHeight: theme.fontSize.lg * theme.lineHeight.lg,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textPrimary,
    },
    characters: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.xs,
    },
    character: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.secondary,
      backgroundColor: theme.color.secondarySubtle,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 2,
      borderRadius: theme.radius.full,
      overflow: 'hidden',
    },
  });

export default StoryPanelCard;
