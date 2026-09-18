import React, { useMemo } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';

export interface TextViewProps {
  text: string;
}

export const TextView: React.FC<TextViewProps> = ({ text }) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  return <Text style={styles.text}>{text}</Text>;
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) => {
  const size = isDesktop ? theme.fontSize.xxl : theme.fontSize.xl;

  return StyleSheet.create({
    text: {
      fontSize: size,
      fontFamily: theme.fontFamily.bodyBold,
      color: theme.color.textPrimary,
      lineHeight: size * theme.lineHeight.xl,
      textAlign: 'center',
    },
  });
};
