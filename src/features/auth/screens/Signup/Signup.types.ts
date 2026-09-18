export interface SignupFormValues {
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
}

export interface SignupViewProps {
  form: SignupFormValues;
  loading: boolean;
  error?: string;
  onEmailChange: (value: string) => void;
  onNicknameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: () => void;
  onLoginRedirect: () => void;
}
