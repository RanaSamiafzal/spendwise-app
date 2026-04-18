'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { apiRequest } from '@/lib/api-client';

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  currency: string;
};

type AuthPayload = { token: string; user: User };

type AuthContextValue = {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (payload: { email: string; password: string }) => Promise<AuthPayload | null>;
  signup: (payload: { name: string; email: string; phone: string; password: string }) => Promise<AuthPayload | null>;
  hydrate: (payload: AuthPayload | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      loading,
      error,
      login: async ({ email, password }) => {
        setLoading(true);
        setError(null);
        try {
          const response = await apiRequest<AuthPayload>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
          });
          setToken(response.token);
          setUser(response.user);
          return response;
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Login failed');
          return null;
        } finally {
          setLoading(false);
        }
      },
      signup: async ({ name, email, phone, password }) => {
        setLoading(true);
        setError(null);
        try {
          const response = await apiRequest<AuthPayload>('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, phone, password })
          });
          setToken(response.token);
          setUser(response.user);
          return response;
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Signup failed');
          return null;
        } finally {
          setLoading(false);
        }
      },
      hydrate: (payload) => {
        setToken(payload?.token || null);
        setUser(payload?.user || null);
      },
      logout: () => {
        setToken(null);
        setUser(null);
      }
    }),
    [token, user, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthSession() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthSession must be used within ReduxProvider');
  return ctx;
}
