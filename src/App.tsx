import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/LanguageContext';
import NavBar from '@/components/NavBar';
import Index from '@/pages/Index';
import Demo from '@/pages/Demo';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import NotFound from '@/pages/NotFound';

const App = () => {
  return (
    <Router>
      <LanguageProvider>
        <div className="min-h-screen bg-background">
          <NavBar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/demo" element={<Demo />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </LanguageProvider>
    </Router>
  );
};

export default App;
