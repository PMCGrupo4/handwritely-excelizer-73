
import React from 'react';
import { Check, FileSpreadsheet, Scan, CloudUpload, ArrowRight } from 'lucide-react';
import AnimatedImage from './AnimatedImage';
import { cn } from '@/lib/utils';

const FeatureSection = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="gradient-blur top-60 left-[30%]" />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span>Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
            Powerful Features That Save You Time
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            HandSheet combines advanced AI technology with intuitive design to transform your handwritten data into perfectly formatted spreadsheets.
          </p>
        </div>

        {/* Feature 1 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-32">
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span>Intelligent Recognition</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Capture Any Handwriting Style
            </h3>
            <p className="text-muted-foreground mb-6">
              Our advanced AI has been trained on millions of handwriting samples to accurately recognize even the most challenging handwriting styles, turning messy notes into clean data.
            </p>
            
            <ul className="space-y-3 mb-8">
              {["99.8% recognition accuracy", "Works with cursive and print handwriting", "Supports 40+ languages", "Preserves mathematical formulas"].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
            
            <button className="inline-flex items-center text-primary font-medium hover:underline group">
              Learn about our recognition technology
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-soft">
              <AnimatedImage 
                src="https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Handwriting recognition in action" 
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
                alt="Table and structure detection" 
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-bl from-primary/20 to-transparent opacity-60"></div>
            </div>
          </div>
          
          <div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span>Smart Structure Detection</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Automatic Table Organization
            </h3>
            <p className="text-muted-foreground mb-6">
              HandSheet intelligently identifies table structures, rows, columns, and cells from your handwritten notes, preserving the exact layout in your spreadsheets.
            </p>
            
            <ul className="space-y-3 mb-8">
              {["Detects tables, grids, and lists automatically", "Preserves row and column relationships", "Recognizes headers and formatting", "Maintains cell merges and spans"].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
            
            <button className="inline-flex items-center text-primary font-medium hover:underline group">
              See structure detection in action
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <span>Seamless Integration</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
              Direct Export to Your Favorite Tools
            </h3>
            <p className="text-muted-foreground mb-6">
              Send your converted data directly to Excel, Google Sheets, or other spreadsheet applications with just one click. No intermediate steps required.
            </p>
            
            <ul className="space-y-3 mb-8">
              {["One-click export to Excel and Google Sheets", "Preserves formulas and functions", "Maintains formatting and styles", "Easy sharing and collaboration options"].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
            
            <button className="inline-flex items-center text-primary font-medium hover:underline group">
              Explore integration options
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-soft">
              <AnimatedImage 
                src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Seamless export to spreadsheets" 
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
