import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useTheme } from '@/app/providers/theme.provider';
import { useBreakpoint } from '@/shared/ui/theme/useBreakpoint';
import Input from '@/shared/components/Input/Input.component';
import Button from '@/shared/components/Button/Button.component';
import AuthBackground from '@/features/auth/components/AuthBackground';
import { Logo } from '@/assets';
import { SignInViewProps } from './SignIn.types';

const FORM_MAX_WIDTH = 400;

const FEATURES = [
  { icon: '⚡', title: 'Multiplayer 1v1', description: 'Partidas rápidas en tiempo real' },
  { icon: '🏆', title: '+10,000 activos', description: 'Comunidad global de estudiantes' },
];

// Layout de dos columnas para web (basado en el diseño "LinguaPlay - Iniciar
// Sesión (Web Desktop)" de Stitch). Se resuelve automáticamente en builds
// web gracias a la extensión .web.tsx; los apps nativos usan SignIn.view.tsx.
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
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.layout}>
        <View style={styles.marketingPanel}>
          <AuthBackground />

          <Image source={Logo} style={styles.logo} resizeMode="contain" />

          <View style={styles.badge}>
            <Text style={styles.badgeText}>Plataforma gamificada de idiomas</Text>
          </View>

          <Text style={styles.headline}>
            Aprende inglés jugando <Text style={styles.headlineAccent}>duelos en vivo</Text> y{' '}
            <Text style={styles.headlineAccent}>retos diarios</Text>.
          </Text>

          <Text style={styles.marketingSubtitle}>
            Entrena tu vocabulario, gramática y agilidad mental mientras compites en tiempo real
            contra estudiantes de todo el mundo.
          </Text>

          {isDesktop && (
            <View style={styles.featureRow}>
              {FEATURES.map((feature) => (
                <View key={feature.title} style={styles.featureCard}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.formPanel}>
          <View style={styles.formInner}>
            <Text style={styles.formTitle}>Iniciar sesión</Text>
            <Text style={styles.formSubtitle}>
              Ingresa tus credenciales para acceder a la plataforma.
            </Text>

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
              style={styles.submitButton}
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
      minHeight: isDesktop ? 640 : undefined,
    },
    marketingPanel: {
      flex: isDesktop ? 1 : undefined,
      padding: isDesktop ? theme.spacing.xl * 1.5 : theme.spacing.xl,
      justifyContent: 'center',
      overflow: 'hidden',
    },
    logo: {
      width: 48,
      height: 48,
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
      color: theme.color.textSecondary,
      marginBottom: theme.spacing.lg,
      maxWidth: 440,
    },
    featureRow: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    featureCard: {
      flex: 1,
      backgroundColor: theme.color.surface,
      borderRadius: theme.radius.lg,
      borderWidth: theme.borderWidth.xs,
      borderColor: theme.color.border,
      padding: theme.spacing.md,
      maxWidth: 200,
    },
    featureIcon: {
      fontSize: theme.fontSize.lg,
      marginBottom: theme.spacing.xs,
    },
    featureTitle: {
      fontFamily: theme.fontFamily.bodyBold,
      fontSize: theme.fontSize.sm,
      color: theme.color.textPrimary,
      marginBottom: theme.spacing.xs / 2,
    },
    featureDescription: {
      fontFamily: theme.fontFamily.body,
      fontSize: theme.fontSize.sm,
      color: theme.color.textSecondary,
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
    submitButton: {
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
