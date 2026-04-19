import React from 'react';
import { useTokenRefresh } from './useTokenRefresh';

/**
 * Componente que inicializa el sistema de refresh automático de tokens
 *
 * Debe envolver la aplicación después de que el usuario esté autenticado
 *
 * Uso en el componente raíz:
 * Wrappear el contenido de la app con este componente cuando está autenticado
 */
interface TokenRefreshProviderProps {
  children: React.ReactNode;
}

export const TokenRefreshProvider: React.FC<TokenRefreshProviderProps> = ({ children }) => {
  // Inicializar el hook que maneja el refresh automático
  useTokenRefresh();

  return <>{children}</>;
};

export default TokenRefreshProvider;
