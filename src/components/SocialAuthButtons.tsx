import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.3 9 3.4l6.7-6.7C35.5 2.5 30.1 0 24 0 14.6 0 6.4 5.5 2.5 13.5l7.9 6.1C12.5 12 17.8 9.5 24 9.5z" />
    <path fill="#34A853" d="M46.5 24c0-1.5-.1-3-.4-4.5H24v9h12.7c-1.1 3-3.2 5.5-6.2 7.2l7.9 6.1c4.6-4.2 7.1-10.4 7.1-17.8z" />
    <path fill="#FBBC05" d="M10.4 28.5c-1.5-3-1.5-6.5 0-9.5l-7.9-6.1C.7 16.5 0 20.2 0 24s.7 7.5 2.5 10.5l7.9-6z" />
    <path fill="#4285F4" d="M24 48c6.5 0 12-2.1 16-5.7l-7.9-6.1c-2.2 1.5-5 2.3-8.1 2.3-6.2 0-11.5-4-13.4-9.5l-7.9 6.1C6.4 42.5 14.6 48 24 48z" />
    <path fill="none" d="M0 0h48v48H0z" />
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-blue-600">
    <path
      fill="currentColor"
      d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.324-.593 1.324-1.326V1.326C24 .593 23.407 0 22.675 0z"
    />
  </svg>
);

const SocialAuthButtons: React.FC<{ onGoogleClick: () => void; onFacebookClick: () => void }> = ({
  onGoogleClick,
  onFacebookClick,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex space-x-4">
      <Button
        variant="outline"
        className="flex-1 flex items-center justify-center gap-2"
        onClick={onGoogleClick}
      >
        <GoogleIcon />
        {t('auth.signInWithGoogle')}
      </Button>
      <Button
        variant="outline"
        className="flex-1 flex items-center justify-center gap-2"
        onClick={onFacebookClick}
      >
        <FacebookIcon />
        {t('auth.signInWithFacebook')}
      </Button>
    </div>
  );
};

export default SocialAuthButtons; 