export interface PasswordRule {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

// Fuente de verdad única para la validación de contraseña en Signup.
// Debe reflejar dos cosas que ya están alineadas entre sí:
// 1. La política del User Pool de Cognito (MinimumLength: 8, Require Uppercase/
//    Lowercase/Numbers/Symbols: true — verificado con
//    `aws cognito-idp describe-user-pool`).
// 2. El regex de LP-API (src/modules/auth/dto/signUp.dto.ts), que es el que
//    realmente bloquea el registro antes de llamar a Cognito, y que solo
//    reconoce @ $ ! % * ? & como caracteres especiales válidos.
export const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: 'Al menos 8 caracteres', test: (password) => password.length >= 8 },
  { id: 'uppercase', label: 'Una letra mayúscula', test: (password) => /[A-Z]/.test(password) },
  { id: 'lowercase', label: 'Una letra minúscula', test: (password) => /[a-z]/.test(password) },
  { id: 'number', label: 'Un número', test: (password) => /\d/.test(password) },
  {
    id: 'symbol',
    label: 'Un carácter especial (@ $ ! % * ? &)',
    test: (password) => /[@$!%*?&]/.test(password),
  },
];

export const isPasswordValid = (password: string): boolean =>
  PASSWORD_RULES.every((rule) => rule.test(password));
