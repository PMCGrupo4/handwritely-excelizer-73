import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
    />
  </svg>
);

interface SocialAuthButtonsProps {
  onGoogleClick: () => void;
}

export function SocialAuthButtons({ onGoogleClick }: SocialAuthButtonsProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={onGoogleClick}
      >
        <GoogleIcon />
        <span className="ml-2">{t('auth.signInWithGoogle')}</span>
      </Button>
    </div>
  );
} 