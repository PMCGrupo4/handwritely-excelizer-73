
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      <div className="gradient-blur bottom-20 left-[20%]" />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-primary/90 to-primary rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-10">
            <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_12_2)">
                <path fillRule="evenodd" clipRule="evenodd" d="M340 0H0V340H340V0ZM40 80H80V120H40V80ZM160 80H120V120H160V80ZM240 80H200V120H240V80ZM320 80H280V120H320V80ZM80 160H40V200H80V160ZM160 160H120V200H160V160ZM240 160H200V200H240V160ZM320 160H280V200H320V160ZM80 240H40V280H80V240ZM160 240H120V280H160V240ZM240 240H200V280H240V240ZM320 240H280V280H320V240Z" fill="currentColor" />
              </g>
              <defs>
                <clipPath id="clip0_12_2">
                  <rect width="400" height="400" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-16 relative z-10">
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
                ¿Listo para transformar tus datos manuscritos?
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                Únete a miles de profesionales que ahorran horas cada semana automatizando la conversión de notas manuscritas a hojas de cálculo.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span className="text-white/90">Prueba gratuita de 14 días con acceso completo a todas las funciones</span>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span className="text-white/90">No se requiere tarjeta de crédito para comenzar</span>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span className="text-white/90">Cancela cuando quieras, sin preguntas</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild
                  className="inline-flex h-12 px-8 items-center justify-center rounded-full bg-white text-primary font-medium transition-all hover:bg-white/90 active:scale-95"
                >
                  <Link to="/demo">
                    Iniciar Prueba Gratuita
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="inline-flex h-12 px-8 items-center justify-center rounded-full bg-primary/20 text-white font-medium border border-white/30 transition-all hover:bg-primary/30 active:scale-95"
                >
                  Ver Precios
                </Button>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-2">
                  <span>Más Popular</span>
                </div>
                <h3 className="text-2xl font-medium text-white mb-1">Plan Pro</h3>
                <p className="text-white/70 text-sm">Perfecto para profesionales y equipos pequeños</p>
              </div>
              
              <div className="flex items-baseline mb-6">
                <span className="text-4xl font-bold text-white">$9.99</span>
                <span className="text-white/70 ml-2">/ mes</span>
              </div>
              
              <div className="space-y-3 mb-8">
                {[
                  "Escaneos de documentos ilimitados",
                  "Reconocimiento avanzado de tablas",
                  "Exportación directa a Excel y Google Sheets",
                  "Almacenamiento en la nube para todos tus documentos",
                  "Soporte prioritario al cliente",
                  "Funciones de colaboración para equipos",
                ].map((feature, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                    <span className="text-white/90">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button asChild className="w-full h-12 rounded-full bg-white text-primary font-medium transition-all hover:bg-white/90 active:scale-95">
                <Link to="/demo">
                  Comenzar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
