import React from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSignup } from './useSignup';
import { SignupView } from './Signup.view';

const SignupScreen = () => {
  const navigation = useNavigation();
  const {
    signUpForm,
    onEmailChange,
    onNicknameChange,
    onPasswordChange,
    onConfirmPasswordChange,
    loading,
    error,
    handleSignUp,
  } = useSignup();

  const handleLoginRedirect = () => {
    navigation.navigate('SignIn' as never);
  };

  const handleSubmit = async () => {
    const result = await handleSignUp();
    if (result.ok) {
      Alert.alert('Éxito', result.message ?? 'Registro completado', [
        { text: 'OK', onPress: handleLoginRedirect },
      ]);
    }
  };

  return (
    <SignupView
      form={signUpForm}
      loading={loading}
      error={error}
      onEmailChange={onEmailChange}
      onNicknameChange={onNicknameChange}
      onPasswordChange={onPasswordChange}
      onConfirmPasswordChange={onConfirmPasswordChange}
      onSubmit={handleSubmit}
      onLoginRedirect={handleLoginRedirect}
    />
  );
};

export default SignupScreen;
