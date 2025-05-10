import React from 'react';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ReviewsSection = () => {
  const { t } = useLanguage();

  const reviews = [
    {
      name: t('reviews.review1.name'),
      role: t('reviews.review1.role'),
      comment: t('reviews.review1.comment'),
    },
    {
      name: t('reviews.review2.name'),
      role: t('reviews.review2.role'),
      comment: t('reviews.review2.comment'),
    },
    {
      name: t('reviews.review3.name'),
      role: t('reviews.review3.role'),
      comment: t('reviews.review3.comment'),
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-gray-50">
      <div className="gradient-blur top-40 right-[20%]" />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
            {t('reviews.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('reviews.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-soft border border-gray-100 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-6">{review.comment}</p>
              <div>
                <h4 className="font-medium">{review.name}</h4>
                <p className="text-sm text-muted-foreground">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection; 