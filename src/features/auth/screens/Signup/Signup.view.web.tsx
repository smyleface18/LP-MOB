import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Input from '@/shared/components/Input/Input.component';
import Button from '@/shared/components/Button/Button.component';
import AuthBackground from '@/features/auth/components/AuthBackground';
import { Logo } from '@/shared/components/Logo';
import { SignupViewProps } from './Signup.types';
import { PasswordChecklist } from './PasswordChecklist';

const FORM_MAX_WIDTH = 440;

const FEATURES = [
  {
    icon: '⚡',
    title: 'Partidas rápidas de 60s',
    description: 'Duelos 1v1 intensos para entrenar agilidad léxica.',
  },
  {
    icon: '🎯',
    title: 'Práctica por niveles MCER (A1-C2)',
    description: 'Contenido adaptado a estándares oficiales europeos.',
  },
  {
    icon: '📈',
    title: 'Estadísticas y rachas en tiempo real',
    description: 'Monitorea tu XP, progreso y rachas continuas.',
  },
];

// Layout de dos columnas para web (basado en el diseño "LinguaPlay - Registro
// (Web Desktop)" de Stitch). Se resuelve automáticamente en builds web
// gracias a la extensión .web.tsx; los apps nativos usan Signup.view.tsx.
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.layout}>
        <View style={styles.marketingPanel}>
          <AuthBackground />

          <Logo
            imageSize={theme.iconSize.lg * 2}
            layout="horizontal"
            textSize={theme.fontSize.lg}
            style={styles.logo}
          />

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Plataforma interactiva</Text>
          </View>

          <Text style={styles.headline}>
            Únete a la comunidad de <Text style={styles.headlineAccent}>LinguaPlay</Text>.
          </Text>

          <Text style={styles.marketingSubtitle}>
            Aprende idiomas compitiendo, superando desafíos diarios y midiendo tu dominio en tiempo
            real.
          </Text>

          {isDesktop && (
            <View style={styles.featureList}>
              {FEATURES.map((feature) => (
                <View key={feature.title} style={styles.featureRow}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <View style={styles.featureTextGroup}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.formPanel}>
          <View style={styles.formInner}>
            <Text style={styles.formTitle}>Crear cuenta</Text>
            <Text style={styles.formSubtitle}>
              Comienza a practicar gratis en menos de un minuto.
            </Text>

            <Input
              placeholder="Nombre de usuario"
              autoCapitalize="none"
              variant="outlined"
              style={styles.gridInput}
              value={form.nickname}
              onChangeText={onNicknameChange}
            />
            <Input
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              variant="outlined"
              style={styles.gridInput}
              value={form.email}
              onChangeText={onEmailChange}
            />
            <Input
              placeholder="Contraseña"
              secureTextEntry
              autoCapitalize="none"
              variant="outlined"
              style={styles.gridInput}
              value={form.password}
              onChangeText={onPasswordChange}
            />
            <Input
              placeholder="Confirmar contraseña"
              secureTextEntry
              autoCapitalize="none"
              variant="outlined"
              style={styles.gridInput}
              value={form.confirmPassword}
              onChangeText={onConfirmPasswordChange}
              onSubmitEditing={onSubmit}
            />

            {form.password.length > 0 && <PasswordChecklist password={form.password} />}

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              title={loading ? 'Registrando...' : 'Crear cuenta'}
              variant="primary"
              size="medium"
              style={styles.submitButton}
              onPress={onSubmit}
              disabled={loading}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>
                ¿Ya tienes cuenta?{' '}
                <Text style={styles.loginLink} onPress={onLoginRedirect}>
                  Inicia sesión aquí
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyles = (theme: ReturnType<typeof useTheme>, isDesktop: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    layout: {
      flex: 1,
      flexDirection: isDesktop ? 'row' : 'column',
      minHeight: isDesktop ? 700 : undefined,
    },
    marketingPanel: {
      flex: isDesktop ? 1 : undefined,
      padding: isDesktop ? theme.spacing.xl * 1.5 : theme.spacing.xl,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    logo: {
      alignSelf: 'flex-start',
      marginBottom: theme.spacing.lg,
    },
    badge: {
      alignSelf: 'flex-start',
      backgroundColor: theme.color.primarySubtle,
      borderRadius: theme.radius.full,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs,
      marginBottom: theme.spacing.md,
    },
    badgeText: {
      color: theme.color.primary,
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.bodyBold,
    },
    headline: {
      fontSize: isDesktop ? 36 : theme.fontSize.xxl,
      lineHeight: isDesktop ? 42 : undefined,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.md,
    },
    headlineAccent: {
      color: theme.color.primary,
    },
    marketingSubtitle: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.lg,
      maxWidth: theme.maxContentWidth,
    },
    featureList: {
      gap: theme.spacing.md,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: theme.spacing.sm,
    },
    featureIcon: {
      fontSize: theme.fontSize.lg,
    },
    featureTextGroup: {
      flex: 1,
    },
    featureTitle: {
      fontFamily: theme.fontFamily.bodyBold,
      fontSize: theme.fontSize.md,
      color: theme.color.textPrimary,
    },
    featureDescription: {
      fontFamily: theme.fontFamily.body,
      fontSize: theme.fontSize.sm,
      color: theme.color.textPrimary,
    },
    formPanel: {
      flex: isDesktop ? 1 : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
      backgroundColor: theme.color.background,
    },
    formInner: {
      width: '100%',
      maxWidth: FORM_MAX_WIDTH,
    },
    formTitle: {
      fontSize: theme.fontSize.xxl,
      fontFamily: theme.fontFamily.headingExtra,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    formSubtitle: {
      fontSize: theme.fontSize.md,
      fontFamily: theme.fontFamily.body,
      color: theme.color.textSecondary,
      marginBottom: theme.spacing.xl,
    },
    gridInput: {
      height: 56,
      marginBottom: theme.spacing.md,
    },
    errorText: {
      alignSelf: 'flex-start',
      color: theme.color.error,
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.body,
      marginBottom: theme.spacing.md,
    },
    submitButton: {
      width: '100%',
      marginTop: theme.spacing.xs,
    },
    loginContainer: {
      marginTop: theme.spacing.lg,
      alignItems: 'center',
    },
    loginText: {
      color: theme.color.textPrimary,
      fontSize: theme.fontSize.sm,
      fontFamily: theme.fontFamily.body,
      textAlign: 'center',
    },
    loginLink: {
      color: theme.color.primary,
      fontFamily: theme.fontFamily.bodyBold,
    },
  });

export { SignupView };
