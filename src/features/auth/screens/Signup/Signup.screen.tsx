import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppAlert } from '@/app/providers/alert.provider';
import { useSignup } from './useSignup';
import { SignupView } from './Signup.view';

const SignupScreen = () => {
  const navigation = useNavigation();
  const appAlert = useAppAlert();
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
      appAlert('Éxito', result.message ?? 'Registro completado', [
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
