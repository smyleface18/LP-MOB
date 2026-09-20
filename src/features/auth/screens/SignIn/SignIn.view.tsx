import React, { useMemo } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Input from '@/shared/components/Input/Input.component';
import Button from '@/shared/components/Button/Button.component';
import { Logo } from '@/shared/components/Logo';
import { SignInViewProps } from './SignIn.types';

const FORM_MAX_WIDTH = 400;

const SignInView: React.FC<SignInViewProps> = ({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onSignupRedirect,
}) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <Logo imageSize={120} style={styles.logo} />

        <Text style={styles.title}>Bienvenido de vuelta</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar aprendiendo</Text>

        <Input
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          variant="outlined"
          style={styles.input}
          value={email}
          onChangeText={onEmailChange}
          onSubmitEditing={onSubmit}
        />

        <Input
          placeholder="Contraseña"
          secureTextEntry
          autoCapitalize="none"
          variant="outlined"
          style={styles.input}
          value={password}
          onChangeText={onPasswordChange}
          onSubmitEditing={onSubmit}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <Button
          title={loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          variant="primary"
          size="medium"
          style={styles.loginButton}
          onPress={onSubmit}
          disabled={loading}
        />

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>
            ¿No estás registrado?{' '}
            <Text style={styles.registerLink} onPress={onSignupRedirect}>
              Regístrate aquí
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
    },
    formContainer: {
      flex: 1,
      width: '100%',
      maxWidth: isDesktop ? FORM_MAX_WIDTH : undefined,
      paddingHorizontal: isDesktop ? 0 : theme.spacing.xl,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    },
    logo: {
      marginBottom: theme.spacing.md,
    },
    title: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.xs,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
      marginBottom: theme.spacing.xl,
      textAlign: 'center',
    },
    input: {
      marginBottom: theme.spacing.md,
    },
    errorText: {
      alignSelf: 'flex-start',
      color: theme.color.error,
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.body,
      marginBottom: theme.spacing.md,
    },
    loginButton: {
      marginTop: theme.spacing.xs,
      width: '100%',
    },
    registerContainer: {
      marginTop: theme.spacing.lg,
    },
    registerText: {
      color: theme.color.textPrimary,
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.body,
    },
    registerLink: {
      color: theme.color.primary,
      fontFamily: theme.fontFamily.bodyBold,
    },
  });

export { SignInView };
