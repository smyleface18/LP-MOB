import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export const useSignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const { signIn, loading } = useAuth();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setFormError('Por favor ingresa correo y contraseña');
      return;
    }

    setFormError(undefined);
    const response = await signIn(email, password);
    if (!response?.ok) {
      setFormError(response?.message?.toString());
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error: formError,
    handleLogin,
  };
};
