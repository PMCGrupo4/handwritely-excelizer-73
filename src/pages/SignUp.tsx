import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileSpreadsheet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import SocialAuthButtons from '@/components/SocialAuthButtons';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Confirm password is required' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signUp, signInWithGoogle } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    const { error } = await signUp(data.email, data.password, data.name);
    if (error) {
      console.error('Sign up error:', error);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('Google sign up error:', error);
        setAuthError('Error al registrarse con Google.');
      }
    } catch (error) {
      console.error('Google sign up error:', error);
      setAuthError('Error al registrarse con Google.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm py-4 px-6 md:px-12 flex items-center justify-between">
        <button
          className="flex items-center space-x-2 text-foreground border border-foreground/20 rounded-md px-4 py-2 text-sm font-medium hover:bg-foreground/10 hover:text-foreground transition-all"
          onClick={() => navigate('/sign-in')}
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
          <h1 className="text-3xl font-bold tracking-tight mb-2">{t('auth.createAccount')}</h1>
          <p className="text-muted-foreground">{t('auth.createAccountDescription')}</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {t('auth.signUp')}
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
            onGoogleClick={handleGoogleSignUp}
          />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">{t('auth.alreadyHaveAccount')} </span>
            <Link to="/sign-in" className="text-primary hover:underline">
              {t('auth.signIn')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 