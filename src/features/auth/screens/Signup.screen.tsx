import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Input } from '@/shared/ui';
import { Button } from '@/shared/ui';
import { useAuth } from '../hooks/useAuth';
import { SignUpDto } from '../types';

const SignupScreen = () => {
  const navigation = useNavigation();

  const handleLoginRedirect = () => {
    navigation.navigate('SignIn' as never);
  };

  const { signUp, loading, error, signUpForm, setSignUpForm } = useAuth();

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(password);
  };

  const handleSignUp = async () => {
    if (signUpForm.password !== signUpForm.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (!validatePassword(signUpForm.password)) {
      alert(
        'La contraseña debe contener mayúsculas, minúsculas, números y caracteres especiales, y tener 8 caracteres o más.',
      );
      return;
    }

    const signUpDto: SignUpDto = {
      email: signUpForm.email,
      username: signUpForm.nickname,
      password: signUpForm.password,
    };

    const result = await signUp(signUpDto);

    if (!result?.ok) {
      alert(error);
      setSignUpForm({ confirmPassword: '', email: '', nickname: '', password: '' });
    } else {
      alert(result.message);
      setSignUpForm({ confirmPassword: '', email: '', nickname: '', password: '' });
      handleLoginRedirect();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <Image source={require('@/assets/LinguaPlay.png')} style={styles.logo} />

        <Input
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          variant="outlined"
          style={styles.input}
          value={signUpForm.email}
          onChangeText={(text) => setSignUpForm({ ...signUpForm, email: text })}
        />

        <Input
          placeholder="Nickname"
          autoCapitalize="none"
          variant="outlined"
          style={styles.input}
          value={signUpForm.nickname}
          onChangeText={(text) => setSignUpForm({ ...signUpForm, nickname: text })}
        />

        <Input
          placeholder="Contraseña"
          secureTextEntry
          autoCapitalize="none"
          variant="outlined"
          style={styles.input}
          value={signUpForm.password}
          onChangeText={(text) => setSignUpForm({ ...signUpForm, password: text })}
        />

        <Input
          placeholder="Confirmar contraseña"
          secureTextEntry
          autoCapitalize="none"
          variant="outlined"
          style={styles.input}
          value={signUpForm.confirmPassword}
          onChangeText={(text) => setSignUpForm({ ...signUpForm, confirmPassword: text })}
        />

        <Button
          title={loading ? 'Registrando...' : 'Registrarse'}
          variant="primary"
          size="medium"
          style={[styles.signupButton, loading && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            ¿Ya estás registrado?{' '}
            <Text style={styles.loginLink} onPress={handleLoginRedirect}>
              Inicia sesión aquí
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '80%',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 40,
  },
  input: {
    marginBottom: 16,
  },
  signupButton: {
    width: '100%',
    marginTop: 8,
  },
  loginContainer: {
    marginTop: 20,
  },
  loginText: {
    color: '#000000',
    fontSize: 14,
  },
  loginLink: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
});

export default SignupScreen;