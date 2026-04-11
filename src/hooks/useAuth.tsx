import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, metadata: Record<string, string>) => Promise<{ error: string | null; session: Session | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const translateAuthError = (message: string | null) => {
    if (!message) return null;

    if (message.includes('Invalid login credentials')) return 'Credenciais inválidas.';
    if (message.includes('User not found')) return 'Usuário não encontrado.';
    if (message.includes('Password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.';
    if (message.includes('User already registered')) return 'Este e-mail já está cadastrado.';
    if (message.includes('Invalid password')) return 'Senha inválida.';
    if (message.includes('Invalid email')) return 'E-mail inválido.';
    if (message.includes('Password is required')) return 'Senha é obrigatória.';
    if (message.includes('Email is required')) return 'E-mail é obrigatório.';

    return message;
  };

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: translateAuthError(error?.message ?? null) };
  }, []);

  const signUp = useCallback(async (email: string, password: string, metadata: Record<string, string>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { error: translateAuthError(error?.message ?? null), session: data.session ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error: translateAuthError(error?.message ?? null) };
  }, []);

  const updatePassword = useCallback(async (password: string) => {
    const { error } = await supabase.auth.updateUser({ password });
    return { error: translateAuthError(error?.message ?? null) };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
