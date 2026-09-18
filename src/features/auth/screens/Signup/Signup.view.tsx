import React, { useMemo } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Input from '@/shared/components/Input/Input.component';
import Button from '@/shared/components/Button/Button.component';
import AuthBackground from '@/features/auth/components/AuthBackground';
import { Logo } from '@/assets';
import { SignupViewProps } from './Signup.types';
import { PasswordChecklist } from './PasswordChecklist';

const FORM_MAX_WIDTH = 400;

const SignupView: React.FC<SignupViewProps> = ({
  form,
  loading,
  error,
  onEmailChange,
  onNicknameChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  onLoginRedirect,
}) => {
  const theme = useTheme();
  const { isDesktop } = useBreakpoint();
  const styles = useMemo(() => createStyles(theme, isDesktop), [theme, isDesktop]);

  return (
    <View style={styles.container}>
      <AuthBackground />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.formContainer}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />

          <Text style={styles.title}>Crea tu cuenta</Text>
          <Text style={styles.subtitle}>Empieza tu aventura en inglés hoy</Text>

          <Input
            placeholder="Correo electrónico"
            keyboardType="email-address"
            autoCapitalize="none"
            variant="outlined"
            style={styles.input}
            value={form.email}
            onChangeText={onEmailChange}
          />

          <Input
            placeholder="Nickname"
            autoCapitalize="none"
            variant="outlined"
            style={styles.input}
            value={form.nickname}
            onChangeText={onNicknameChange}
          />

          <Input
            placeholder="Contraseña"
            secureTextEntry
            autoCapitalize="none"
            variant="outlined"
            style={styles.input}
            value={form.password}
            onChangeText={onPasswordChange}
          />

          {form.password.length > 0 && <PasswordChecklist password={form.password} />}

          <Input
            placeholder="Confirmar contraseña"
            secureTextEntry
            autoCapitalize="none"
            variant="outlined"
            style={styles.input}
            value={form.confirmPassword}
            onChangeText={onConfirmPasswordChange}
            onSubmitEditing={onSubmit}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Button
            title={loading ? 'Registrando...' : 'Crear cuenta'}
            variant="primary"
            size="medium"
            style={styles.signupButton}
            onPress={onSubmit}
            disabled={loading}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>
              ¿Ya estás registrado?{' '}
              <Text style={styles.loginLink} onPress={onLoginRedirect}>
                Inicia sesión aquí
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    keyboardView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    formContainer: {
      width: '100%',
      maxWidth: isDesktop ? FORM_MAX_WIDTH : undefined,
      paddingHorizontal: isDesktop ? 0 : theme.spacing.xl,
      alignItems: 'center',
    },
    logo: {
      width: 96,
      height: 96,
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
    signupButton: {
      width: '100%',
      marginTop: theme.spacing.xs,
    },
    loginContainer: {
      marginTop: theme.spacing.lg,
    },
    loginText: {
      color: theme.color.textPrimary,
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.body,
    },
    loginLink: {
      color: theme.color.primary,
      fontFamily: theme.fontFamily.bodyBold,
    },
  });

export { SignupView };
