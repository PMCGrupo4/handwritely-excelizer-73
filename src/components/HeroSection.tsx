import React from 'react';
import { ArrowRight, FileSpreadsheet, Pen, ScanText } from 'lucide-react';
import AnimatedImage from './AnimatedImage';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient effect */}
      <div className="gradient-blur top-20 left-[10%]" />
      <div className="gradient-blur bottom-20 right-[10%]" />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in">
            <span>{t('hero.tagline')}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 max-w-4xl animate-fade-up">
            {t('hero.title')}
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mb-10 animate-fade-up" style={{ animationDelay: '100ms' }}>
            {t('hero.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <Button 
              asChild
              className="inline-flex h-12 px-8 items-center justify-center rounded-full bg-primary text-white font-medium transition-all hover:bg-primary/90 active:scale-95"
            >
              <Link to="/demo">
                {t('hero.startFreeTrial')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild className="inline-flex h-12 px-8 items-center justify-center rounded-full bg-secondary text-primary font-medium transition-all hover:bg-secondary/80 active:scale-95">
              <Link to="/demo">
                {t('hero.watchDemo')}
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="relative mt-20 animate-fade-up" style={{ animationDelay: '300ms' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent h-20 -bottom-5 z-10"></div>
          <div className="rounded-xl overflow-hidden border shadow-soft relative">
            <AnimatedImage 
              src="https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
              alt={t('hero.feature1')} 
              className="w-full h-full object-cover"
              priority
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent opacity-60"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-white/50 backdrop-blur-sm animate-fade-up" style={{ animationDelay: '400ms' }}>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Pen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">{t('hero.feature1')}</h3>
            <p className="text-muted-foreground text-sm">{t('hero.feature1Description')}</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-white/50 backdrop-blur-sm animate-fade-up" style={{ animationDelay: '500ms' }}>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ScanText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">{t('hero.feature2')}</h3>
            <p className="text-muted-foreground text-sm">{t('hero.feature2Description')}</p>
          </div>
          
          <div className="flex flex-col items-center text-center p-6 rounded-xl border bg-white/50 backdrop-blur-sm animate-fade-up" style={{ animationDelay: '600ms' }}>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileSpreadsheet className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">{t('hero.feature3')}</h3>
            <p className="text-muted-foreground text-sm">{t('hero.feature3Description')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
