import { Level } from "../../types/type";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  idToken: string | null;
  refreshToken: string | null;
  signInStatus: (authenticated: Authenticated) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

interface User {
  name: string;
  avatar: Object;
  username: string;
  email: string;
  score: number;
  userRole: UserRoles;
  level: Level;
}

export enum UserRoles {
  PLAYER = "PLAYER",
  ADMIN = "ADMIN",
}

export interface Authenticated {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}
