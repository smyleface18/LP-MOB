import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { PASSWORD_RULES } from './passwordRules';

export interface PasswordChecklistProps {
  password: string;
}

// Compartido entre la vista mobile y la vista web de Signup: ambas necesitan
// el mismo feedback en vivo de la política de contraseña de Cognito.
export const PasswordChecklist: React.FC<PasswordChecklistProps> = ({ password }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.checklist}>
      {PASSWORD_RULES.map((rule) => {
        const passed = rule.test(password);
        return (
          <View key={rule.id} style={styles.checklistRow}>
            <View
              style={[
                styles.checklistDot,
                { backgroundColor: passed ? theme.color.success : theme.color.border },
              ]}
            />
            <Text style={[styles.checklistLabel, passed && { color: theme.color.success }]}>
              {rule.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    checklist: {
      width: '100%',
      alignSelf: 'flex-start',
      marginTop: -theme.spacing.xs,
      marginBottom: theme.spacing.md,
      gap: theme.spacing.xs / 2,
    },
    checklistRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    checklistDot: {
      width: 6,
      height: 6,
      borderRadius: theme.radius.full,
    },
    checklistLabel: {
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
    },
  });
