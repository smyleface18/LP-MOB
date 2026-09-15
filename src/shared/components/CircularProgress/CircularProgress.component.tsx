import { useTheme } from '@/app/providers/theme.provider';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface CircularProgressProps {
  percentage: number;
  label: string;
  color?: string;
  strokeWidth?: number;
}

const CIRCLE_SIZE = 80;

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  label,
  color,
  strokeWidth,
}) => {
  const theme = useTheme();
  const thickness = strokeWidth ?? theme.borderWidth.xl;


  const { radius, circumference } = useMemo(() => {
    const r = (CIRCLE_SIZE - thickness) / 2;
    return { radius: r, circumference: 2 * Math.PI * r };
  }, [thickness]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const progressColor = color ?? theme.color.primary;
  const trackColor = theme.color.border;

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
            stroke={progressColor}
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