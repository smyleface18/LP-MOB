import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { useTheme } from './theme.provider';
import Button from '@/shared/components/Button/Button.component';

export interface AppAlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

type AlertFn = (title: string, message?: string, buttons?: AppAlertButton[]) => void;

const AppAlertContext = createContext<AlertFn | null>(null);

interface AlertState {
  title: string;
  message?: string;
  buttons: AppAlertButton[];
}

/**
 * Reemplazo cross-platform de Alert.alert() de react-native: en
 * react-native-web, Alert.alert queda stubeado como no-op (no muestra nada),
 * así que cualquier pantalla que necesite confirmar una acción o avisar un
 * resultado debe usar useAppAlert() en vez del Alert nativo. Misma firma que
 * Alert.alert(title, message?, buttons?) para que el swap sea mínimo.
 */
export const AppAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [state, setState] = useState<AlertState | null>(null);

  const alert = useCallback<AlertFn>((title, message, buttons) => {
    setState({
      title,
      message,
      buttons: buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }],
    });
  }, []);

  const handlePress = (button: AppAlertButton) => {
    setState(null);
    button.onPress?.();
  };

  return (
    <AppAlertContext.Provider value={alert}>
      {children}
      <Modal
        visible={!!state}
        transparent
        animationType="fade"
        onRequestClose={() => setState(null)}
      >
        <View style={styles.overlay}>
          <View style={styles.card}>
            <Text style={styles.title}>{state?.title}</Text>
            {!!state?.message && <Text style={styles.message}>{state.message}</Text>}
            <View style={styles.actions}>
              {state?.buttons.map((button, index) => (
                <Button
                  key={`${button.text}-${index}`}
                  title={button.text}
                  variant={button.style === 'cancel' ? 'outlined' : 'primary'}
                  size="medium"
                  onPress={() => handlePress(button)}
                  style={[styles.button, button.style === 'destructive' && styles.destructiveButton]}
                />
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </AppAlertContext.Provider>
  );
};

export const useAppAlert = (): AlertFn => {
  const ctx = useContext(AppAlertContext);
  if (!ctx) throw new Error('useAppAlert must be used within AppAlertProvider');
  return ctx;
};

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: theme.color.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing.lg,
    },
    card: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.color.surfaceElevated,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.xl,
      ...theme.shadow.sm,
    },
    title: {
      fontSize: theme.fontSize.xl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.sm,
    },
    message: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
      lineHeight: theme.fontSize.md * theme.lineHeight.md,
      marginBottom: theme.spacing.xl,
    },
    actions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    button: {
      flex: 1,
    },
    destructiveButton: {
      borderColor: theme.color.error,
    },
  });
