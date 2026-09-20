import React, { useMemo } from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { LogoDark, LogoLight } from '@/assets';

export type LogoLayout = 'vertical' | 'horizontal';

export interface LogoProps {
  imageSize?: number;
  layout?: LogoLayout;
  showText?: boolean;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
  textSize?: number;
}

const Logo: React.FC<LogoProps> = ({
  imageSize = 64,
  layout = 'vertical',
  showText = true,
  gap,
  style,
  imageStyle,
  textStyle,
  textSize,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // El logo ya no trae el texto dibujado: LogoDark tiene acentos oscuros
  // (para fondo del theme claro) y LogoLight acentos claros (para fondo
  // del theme oscuro) — por eso la fuente se invierte respecto al modo.
  const source = theme.isDark ? LogoLight : LogoDark;
  const resolvedGap = gap ?? theme.spacing.sm;
  const resolvedTextSize = textSize ?? theme.fontSize.xl;

  return (
    <View
      style={[
        styles.container,
        { flexDirection: layout === 'horizontal' ? 'row' : 'column', gap: resolvedGap },
        style,
      ]}
    >
      <Image
        source={source}
        style={[{ width: imageSize, height: imageSize }, imageStyle]}
        resizeMode="contain"
      />

      {showText && (
        <Text style={[styles.text, { fontSize: resolvedTextSize }, textStyle]}>
          <Text style={{ color: theme.color.textPrimary }}>Lingua</Text>
          <Text style={{ color: theme.color.primary }}>Play</Text>
        </Text>
      )}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    text: {
      fontFamily: theme.fontFamily.headingExtra,
    },
  });

export default Logo;
