import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSignIn } from './useSignIn';
import { SignInView } from './SignIn.view';

const SignInScreen = () => {
  const navigation = useNavigation();
  const { email, setEmail, password, setPassword, loading, error, handleLogin } = useSignIn();

  return (
    <SignInView
      email={email}
      password={password}
      loading={loading}
      error={error}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleLogin}
      onSignupRedirect={() => navigation.navigate('Signup' as never)}
    />
  );
};

export default SignInScreen;
