// Correction #16 : types auth réexportent depuis index pour éviter les doublons
export type { User, Address } from './index';

export interface AuthState {
  user: import('./index').User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
