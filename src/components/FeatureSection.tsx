import React from 'react';
import { Check, FileSpreadsheet, Scan, CloudUpload, ArrowRight } from 'lucide-react';
import AnimatedImage from './AnimatedImage';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

const FeatureSection = () => {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="gradient-blur top-60 left-[30%]" />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span>{t('features.title')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
            {t('features.heading')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.description')}
          </p>
        </div>

        {/* Feature 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span>{t('features.recognition.badge')}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
              {t('features.recognition.title')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('features.recognition.description')}
            </p>
            
            <ul className="space-y-3 mb-8">
              {[
                t('features.recognition.point1'),
                t('features.recognition.point2'),
                t('features.recognition.point3'),
                t('features.recognition.point4')
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
            
            <button className="inline-flex items-center text-primary font-medium hover:underline group">
              {t('features.recognition.cta')}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-soft">
              <AnimatedImage 
                src="https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt={t('features.recognition.imageAlt')} 
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-primary/20 to-transparent opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <div>
            <div className="relative rounded-2xl overflow-hidden shadow-soft">
              <AnimatedImage 
                src="https://images.unsplash.com/photo-1506097425191-7ad538b29cef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt={t('features.structure.imageAlt')} 
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-primary/20 to-transparent opacity-60"></div>
            </div>
          </div>
          
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span>{t('features.structure.badge')}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
              {t('features.structure.title')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('features.structure.description')}
            </p>
            
            <ul className="space-y-3 mb-8">
              {[
                t('features.structure.point1'),
                t('features.structure.point2'),
                t('features.structure.point3'),
                t('features.structure.point4')
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
            
            <button className="inline-flex items-center text-primary font-medium hover:underline group">
              {t('features.structure.cta')}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span>{t('features.integration.badge')}</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
              {t('features.integration.title')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('features.integration.description')}
            </p>
            
            <ul className="space-y-3 mb-8">
              {[
                t('features.integration.point1'),
                t('features.integration.point2'),
                t('features.integration.point3'),
                t('features.integration.point4')
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
            
            <button className="inline-flex items-center text-primary font-medium hover:underline group">
              {t('features.integration.cta')}
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-soft">
              <AnimatedImage 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt={t('features.integration.imageAlt')} 
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-primary/20 to-transparent opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
