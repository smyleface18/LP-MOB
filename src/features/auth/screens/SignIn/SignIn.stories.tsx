import type { Meta, StoryObj } from '@storybook/react';
import { SignInView } from './SignIn.view';

const meta: Meta<typeof SignInView> = {
  title: 'Screens/SignIn',
  component: SignInView,
  args: {
    email: '',
    password: '',
    loading: false,
    onEmailChange: () => {},
    onPasswordChange: () => {},
    onSubmit: () => {},
    onSignupRedirect: () => {},
  },
  argTypes: {
    onEmailChange: { action: 'email-change' },
    onPasswordChange: { action: 'password-change' },
    onSubmit: { action: 'submit' },
    onSignupRedirect: { action: 'signup-redirect' },
  },
};

export default meta;

type Story = StoryObj<typeof SignInView>;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    email: 'usuario@correo.com',
    password: '••••••••',
  },
};

export const LoggingIn: Story = {
  args: {
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    error: 'Credenciales inválidas',
  },
};
