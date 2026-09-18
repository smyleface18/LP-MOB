import type { Meta, StoryObj } from '@storybook/react';
import { SignupView } from './Signup.view';

const meta: Meta<typeof SignupView> = {
  title: 'Screens/Signup',
  component: SignupView,
  args: {
    form: { email: '', nickname: '', password: '', confirmPassword: '' },
    loading: false,
    onEmailChange: () => {},
    onNicknameChange: () => {},
    onPasswordChange: () => {},
    onConfirmPasswordChange: () => {},
    onSubmit: () => {},
    onLoginRedirect: () => {},
  },
  argTypes: {
    onEmailChange: { action: 'email-change' },
    onNicknameChange: { action: 'nickname-change' },
    onPasswordChange: { action: 'password-change' },
    onConfirmPasswordChange: { action: 'confirm-password-change' },
    onSubmit: { action: 'submit' },
    onLoginRedirect: { action: 'login-redirect' },
  },
};

export default meta;

type Story = StoryObj<typeof SignupView>;

export const Default: Story = {};

export const SigningUp: Story = {
  args: {
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    error: 'Las contraseñas no coinciden',
  },
};

export const PasswordChecklistPartial: Story = {
  args: {
    form: { email: '', nickname: '', password: 'abcdefgh', confirmPassword: '' },
  },
};

export const PasswordChecklistComplete: Story = {
  args: {
    form: { email: '', nickname: '', password: 'Abcdefg1!', confirmPassword: 'Abcdefg1!' },
  },
};
