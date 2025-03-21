
import React from 'react';
import { FileSpreadsheet, Pen, ScanText, CloudUpload, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const processSteps = [
  {
    icon: <Pen />,
    title: "Capture Your Notes",
    description: "Take a picture of your handwritten notes, lists, or tables with your smartphone or upload an existing image.",
    color: "from-blue-500/20 to-blue-500/5"
  },
  {
    icon: <ScanText />,
    title: "AI Processing",
    description: "Our advanced AI analyzes your handwriting, recognizes text, and identifies table structures automatically.",
    color: "from-purple-500/20 to-purple-500/5"
  },
  {
    icon: <CheckCircle />,
    title: "Review & Edit",
    description: "Verify the converted data and make any necessary adjustments in our intuitive editor.",
    color: "from-green-500/20 to-green-500/5"
  },
  {
    icon: <CloudUpload />,
    title: "Export & Share",
    description: "Export directly to Excel or Google Sheets with a single click, ready to use immediately.",
    color: "from-amber-500/20 to-amber-500/5"
  }
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-24 relative overflow-hidden bg-gray-50">
      <div className="gradient-blur top-40 right-[20%]" />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <span>How It Works</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
            From Paper to Spreadsheet in 4 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            HandSheet makes the process of converting handwritten notes to spreadsheet data quick and effortless.
          </p>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative z-10 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className={cn(
                  "flex flex-col items-center p-6 rounded-xl bg-white shadow-soft border border-gray-100",
                )}>
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gradient-to-b",
                    step.color
                  )}>
                    <div className="text-primary w-7 h-7">
                      {step.icon}
                    </div>
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium mb-4">
                    {index + 1}
                  </div>
                  
                  <h3 className="text-xl font-medium mb-2 text-center">{step.title}</h3>
                  <p className="text-muted-foreground text-center text-sm">{step.description}</p>
                </div>
                
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-20 text-center">
          <button className="inline-flex h-12 px-8 items-center justify-center rounded-full bg-primary text-white font-medium transition-all hover:bg-primary/90 active:scale-95 animate-fade-up">
            Try HandSheet Now
          </button>
          <p className="text-muted-foreground mt-4 text-sm animate-fade-up" style={{ animationDelay: '100ms' }}>
            No credit card required. Start converting your handwritten notes today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
