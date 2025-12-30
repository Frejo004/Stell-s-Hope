import { useAuth as useAuthFromContext } from '../contexts/AuthContext';

/**
 * Hook to access AuthContext.
 * Redirects to the context version to unify auth state across the app.
 */
export const useAuth = () => {
  return useAuthFromContext();
};