import { TokenPayload } from '@/features/auth/types';
import { jwtDecode } from 'jwt-decode';

export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwtDecode<TokenPayload>(token);
  } catch (error) {
    console.error('❌ Error decodificando token:', error);
    return null;
  }
}