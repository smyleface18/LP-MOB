export interface SignInViewProps {
  email: string;
  password: string;
  loading: boolean;
  error?: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onSignupRedirect: () => void;
}
