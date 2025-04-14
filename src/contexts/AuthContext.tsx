import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, signIn, signUp, signOut, getCurrentUser, getSession } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithFacebook: () => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data } = await getSession();
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Credenciales incorrectas', {
          description: 'El correo electrónico o la contraseña son incorrectos. Si no tienes una cuenta, regístrate.',
          duration: 5000,
        });
      } else if (error.message.includes('Email not confirmed')) {
        toast.error('Correo no verificado', {
          description: 'Por favor, verifica tu correo electrónico antes de iniciar sesión.',
          duration: 5000,
        });
      } else if (error.message.includes('User not found')) {
        toast.error('Usuario no encontrado', {
          description: 'No existe una cuenta con este correo electrónico. Por favor, regístrate.',
          duration: 5000,
        });
      } else {
        toast.error('Error al iniciar sesión', {
          description: error.message,
          duration: 5000,
        });
      }
    } else {
      toast.success('¡Bienvenido!', {
        description: 'Has iniciado sesión correctamente.',
        duration: 5000,
      });
      navigate('/demo');
    }

    return { error };
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      toast.error('Error al registrarse', {
        description: error.message,
        duration: 5000,
      });
    } else {
      toast.success('¡Registro exitoso!', {
        description: 'Tu cuenta ha sido creada correctamente. Ahora debes iniciar sesión para continuar.',
        duration: 5000,
      });
      setTimeout(() => {
        navigate('/sign-in', { state: { fromSignUp: true } });
      }, 1500);
    }

    return { error };
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error al cerrar sesión', {
        description: error.message,
        duration: 5000,
      });
    } else {
      toast.success('Sesión cerrada', {
        description: 'Has cerrado sesión correctamente.',
        duration: 5000,
      });
      navigate('/');
    }
    return { error };
  };

  const handleSignInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://kxtpfwtbpvwhjarkulix.supabase.co/auth/v1/callback',
      },
    });

    if (error) {
      toast.error('Error al iniciar sesión con Google', {
        description: error.message,
        duration: 5000,
      });
    }

    return { error };
  };

  const handleSignInWithFacebook = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error('Error al iniciar sesión con Facebook', {
        description: error.message,
        duration: 5000,
      });
    }

    return { error };
  };

  const handleResetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast.error('Error al enviar el correo de recuperación', {
        description: error.message,
        duration: 5000,
      });
    } else {
      toast.success('Correo enviado', {
        description: 'Se ha enviado un correo con instrucciones para recuperar tu contraseña.',
        duration: 5000,
      });
    }

    return { error };
  };

  const handleUpdatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      toast.error('Error al actualizar la contraseña', {
        description: error.message,
        duration: 5000,
      });
    } else {
      toast.success('Contraseña actualizada', {
        description: 'Tu contraseña ha sido actualizada correctamente.',
        duration: 5000,
      });
    }

    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithFacebook: handleSignInWithFacebook,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 