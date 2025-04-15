import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SocialAuthButtons from '@/components/SocialAuthButtons';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { signIn, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Verificar si el usuario viene de la página de registro
  const fromSignUp = location.state?.fromSignUp || false;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        // El mensaje de error ya se muestra en el contexto de autenticación
        // pero también lo guardamos aquí para mostrar en la UI si es necesario
        if (error.message.includes('Invalid login credentials')) {
          setAuthError('El correo electrónico o la contraseña son incorrectos.');
        } else if (error.message.includes('Email not confirmed')) {
          setAuthError('Por favor, verifica tu correo electrónico antes de iniciar sesión.');
        } else if (error.message.includes('User not found')) {
          setAuthError('No existe una cuenta con este correo electrónico.');
        } else {
          setAuthError('Ha ocurrido un error al intentar iniciar sesión.');
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setAuthError('Ha ocurrido un error al intentar iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('Google sign in error:', error);
        setAuthError('Error al iniciar sesión con Google.');
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      setAuthError('Error al iniciar sesión con Google.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm py-4 px-6 md:px-12 flex items-center justify-between">
        <button
          className="flex items-center space-x-2 text-foreground border border-foreground/20 rounded-md px-4 py-2 text-sm font-medium hover:bg-foreground/10 hover:text-foreground transition-all"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
          <span>{t('auth.back')}</span>
        </button>
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
          <span className="font-display text-lg font-medium">HandSheet</span>
        </div>
        <LanguageSwitcher />
      </nav>
      <div className="flex-grow flex items-center justify-center p-4 mt-16">
        <div className="w-full max-w-md space-y-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{t('auth.welcomeBack')}</h1>
          <p className="text-muted-foreground">{t('auth.signInDescription')}</p>

          {fromSignUp && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">¡Registro exitoso!</AlertTitle>
              <AlertDescription className="text-green-700">
                Tu cuenta ha sido creada correctamente. Ahora debes iniciar sesión para continuar.
              </AlertDescription>
            </Alert>
          )}

          {authError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error de autenticación</AlertTitle>
              <AlertDescription>
                {authError}
                {authError.includes('incorrectos') && (
                  <div className="mt-2">
                    <Link to="/sign-up" className="text-primary hover:underline font-medium">
                      ¿No tienes una cuenta? Regístrate aquí
                    </Link>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.email')}</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.password')}</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : t('auth.signIn')}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('auth.orContinueWith')}
              </span>
            </div>
          </div>

          <SocialAuthButtons
            onGoogleClick={handleGoogleSignIn}
          />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">{t('auth.noAccount')} </span>
            <Link to="/sign-up" className="text-primary hover:underline">
              {t('auth.signUp')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 