import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { SignUpDto } from '../../types';
import { isPasswordValid } from './passwordRules';

const EMPTY_FORM = { email: '', nickname: '', password: '', confirmPassword: '' };

export const useSignup = () => {
  const [signUpForm, setSignUpForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | undefined>(undefined);
  const { signUp, loading, error } = useAuth();

  const updateField = (field: keyof typeof EMPTY_FORM) => (value: string) => {
    setSignUpForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (): Promise<{ ok: boolean; message?: string }> => {
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setFormError('Las contraseñas no coinciden');
      return { ok: false };
    }

    if (!isPasswordValid(signUpForm.password)) {
      setFormError('La contraseña no cumple los requisitos de seguridad');
      return { ok: false };
    }

    setFormError(undefined);
    const signUpDto: SignUpDto = {
      email: signUpForm.email,
      username: signUpForm.nickname,
      password: signUpForm.password,
    };

    const result = await signUp(signUpDto);
    setSignUpForm(EMPTY_FORM);

    if (!result?.ok) {
      const message = error ?? 'No se pudo completar el registro';
      setFormError(message);
      return { ok: false, message };
    }

    return { ok: true, message: result.data?.message };
  };

  return {
    signUpForm,
    onEmailChange: updateField('email'),
    onNicknameChange: updateField('nickname'),
    onPasswordChange: updateField('password'),
    onConfirmPasswordChange: updateField('confirmPassword'),
    loading,
    error: formError,
    handleSignUp,
  };
};
