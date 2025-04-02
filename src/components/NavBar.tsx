import React, { useState, useEffect } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-12", 
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileSpreadsheet className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-medium">HandSheet</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            {t('nav.features')}
          </a>
          <a href="#process" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            {t('nav.howItWorks')}
          </a>
          <a href="#pricing" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            {t('nav.pricing')}
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <LanguageSwitcher />
          <div className="hidden md:flex items-center space-x-2">
            <Button
              asChild
              variant="ghost"
              className="text-sm font-medium"
            >
              <Link to="/sign-in">
                {t('nav.signIn')}
              </Link>
            </Button>
          </div>
          <Button
            asChild
            className="hidden md:inline-flex h-10 px-5 py-2 bg-primary text-white rounded-full text-sm font-medium transition-all hover:bg-primary/90 active:scale-95"
          >
            <Link to="/demo">
              {t('nav.tryNow')}
            </Link>
          </Button>
          <button className="md:hidden text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
