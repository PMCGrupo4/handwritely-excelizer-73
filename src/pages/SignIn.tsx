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

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

const SignIn = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Sign in attempt with:', data);
    toast.success('Sign in successful!');
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google sign in
    toast({
      title: t('auth.googleSignInComingSoon'),
      description: t('auth.featureComingSoon'),
    });
  };

  const handleFacebookSignIn = () => {
    // TODO: Implement Facebook sign in
    toast({
      title: t('auth.facebookSignInComingSoon'),
      description: t('auth.featureComingSoon'),
    });
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
              <Button type="submit" className="w-full">
                {t('auth.signIn')}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6 space-y-4">
            <p className="text-sm text-muted-foreground">{t('auth.socialText')}</p>
            <SocialAuthButtons
              onGoogleClick={handleGoogleSignIn}
              onFacebookClick={handleFacebookSignIn}
            />
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              {t('auth.dontHaveAccount')}{' '}
              <Link to="/sign-up" className="text-primary hover:underline">
                {t('auth.signUp')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn; 