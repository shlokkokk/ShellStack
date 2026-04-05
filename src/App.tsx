import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import CyberGrid from './components/CyberGrid';
import Footer from './sections/Footer';

// Pages
import Home from './pages/Home';
import ToolsDirectory from './pages/ToolsDirectory';
import CEHModules from './sections/CEHModules';
import LiveTerminal from './sections/LiveTerminal';
import StudyToolkit from './sections/StudyToolkit';
import CheatSheetPage from './pages/CheatSheetPage';

// Shared modals that may be required outside of standard page flows
import ModuleDetailModal from './components/ModuleDetailModal';
import { cehModules, type Module } from './data/cehModules';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

// ScrollToTop component to handle routing
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Wrapper for sections that need to be wrapped as standalone pages
const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex justify-center">
      {children}
    </div>
  );
};

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const handleModuleSelect = (moduleId: string) => {
    const module = cehModules.find(m => m.id === moduleId);
    if (module) {
      setSelectedModule(module);
      setIsModuleModalOpen(true);
    }
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div ref={mainRef} className="relative min-h-screen cyber-bg-primary flex flex-col">
        {/* Background Effects */}
        <CyberGrid />
        <div className="grid-overlay" />
        <div className="scanlines" />
        <div className="noise-overlay" />
        
        {/* Custom Cursor */}
        <CustomCursor />
        
        {/* Navigation */}
        <Navigation />
        
        {/* Main Routing Content */}
        <main className="relative z-10 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<ToolsDirectory />} />
            <Route 
              path="/ceh" 
              element={
                <PageWrapper>
                  <CEHModules onModuleSelect={handleModuleSelect} />
                </PageWrapper>
              } 
            />
            <Route 
              path="/terminal" 
              element={
                <PageWrapper>
                  <LiveTerminal />
                </PageWrapper>
              } 
            />
            <Route 
              path="/study" 
              element={
                <PageWrapper>
                  <StudyToolkit />
                </PageWrapper>
              } 
            />
            <Route path="/cheatsheet" element={<CheatSheetPage />} />
          </Routes>
        </main>
        
        {/* Global Footer */}
        <Footer />

        {/* Global Modals */}
        <ModuleDetailModal 
          module={selectedModule} 
          isOpen={isModuleModalOpen} 
          onClose={() => setIsModuleModalOpen(false)} 
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
