import { useTheme } from '@/app/providers/theme.provider';
import React, { useEffect, useId, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import {
  GradientColors,
  GRADIENT_PRESETS,
  warnIfOutOfHierarchyOrder,
} from '@/shared/ui/theme/progressGradients';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface CircularProgressProps {
  percentage: number;
  label: string;
  strokeWidth?: number;
  /** Colores del gradiente del arco, en orden (2 o más tokens de
   * theme.color). Ver GRADIENT_PRESETS para combinaciones listas, o pasa tu
   * propio array para una combinación custom. */
  colors?: GradientColors;
}

const CIRCLE_SIZE = 80;

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  label,
  strokeWidth,
  colors = GRADIENT_PRESETS.secondaryToPrimary,
}) => {
  const theme = useTheme();
  const thickness = strokeWidth ?? theme.borderWidth.xl;
  const gradientId = `circularProgressGradient-${useId()}`;

  warnIfOutOfHierarchyOrder(colors);

  const { radius, circumference } = useMemo(() => {
    const r = (CIRCLE_SIZE - thickness) / 2;
    return { radius: r, circumference: 2 * Math.PI * r };
  }, [thickness]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const trackColor = theme.color.border;

  const gradientStops = useMemo(
    () =>
      colors.map((key, index) => ({
        offset: colors.length === 1 ? 0 : index / (colors.length - 1),
        color: theme.color[key],
      })),
    [colors, theme],
  );

  const clamped = Math.min(100, Math.max(0, percentage));

  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: clamped,
      duration: theme.duration.normal,
      easing: theme.easing.decelerate,
      useNativeDriver: true,
    }).start();
  }, [clamped]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={styles.container}>
      <View style={{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }}>
        <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
          <Defs>
            <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              {gradientStops.map((stop) => (
                <Stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
              ))}
            </LinearGradient>
          </Defs>

          <Circle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={radius}
            stroke={trackColor}
            strokeWidth={thickness}
            fill="none"
          />
          <AnimatedCircle
            cx={CIRCLE_SIZE / 2}
            cy={CIRCLE_SIZE / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
            rotation={-90}
            originX={CIRCLE_SIZE / 2}
            originY={CIRCLE_SIZE / 2}
          />
        </Svg>
        <View style={styles.percentageOverlay}>
          <Text style={styles.percentage}>{Math.round(clamped)}%</Text>
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    percentageOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
    },
    percentage: {
      fontSize: theme.fontSize.lg,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
    },
    label: {
      marginTop: theme.spacing.sm,
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.body,
      color: theme.color.secondary,
      textAlign: 'center',
    },
  });

export { CircularProgress };
