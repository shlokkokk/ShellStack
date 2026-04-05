import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import CyberGrid from './components/CyberGrid';
import ToolDetailModal from './components/ToolDetailModal';
import ModuleDetailModal from './components/ModuleDetailModal';
import TerminalHero from './sections/TerminalHero';
import KaliHub from './sections/KaliHub';
import FeaturedTool from './sections/FeaturedTool';
import CEHModules from './sections/CEHModules';
import LiveTerminal from './sections/LiveTerminal';
import StudyToolkit from './sections/StudyToolkit';
import Footer from './sections/Footer';
import { tools, type Tool } from './data/kaliTools';
import { cehModules, type Module } from './data/cehModules';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);

  // Global scroll snap for pinned sections
  useEffect(() => {
    const setupGlobalSnap = () => {
      const pinned = ScrollTrigger.getAll()
        .filter(st => st.vars.pin)
        .sort((a, b) => a.start - b.start);
      
      const maxScroll = ScrollTrigger.maxScroll(window);
      if (!maxScroll || pinned.length === 0) return;

      const pinnedRanges = pinned.map(st => ({
        start: st.start / maxScroll,
        end: (st.end ?? st.start) / maxScroll,
        center: (st.start + ((st.end ?? st.start) - st.start) * 0.5) / maxScroll,
      }));

      ScrollTrigger.create({
        snap: {
          snapTo: (value: number) => {
            const inPinned = pinnedRanges.some(
              r => value >= r.start - 0.02 && value <= r.end + 0.02
            );
            if (!inPinned) return value;

            const target = pinnedRanges.reduce(
              (closest, r) =>
                Math.abs(r.center - value) < Math.abs(closest - value)
                  ? r.center
                  : closest,
              pinnedRanges[0]?.center ?? 0
            );
            return target;
          },
          duration: { min: 0.15, max: 0.35 },
          delay: 0,
          ease: 'power2.out',
        },
      });
    };

    const timer = setTimeout(setupGlobalSnap, 500);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  // Handle tool selection
  const handleToolSelect = (toolId: string) => {
    const tool = tools.find(t => t.id === toolId);
    if (tool) {
      setSelectedTool(tool);
      setIsToolModalOpen(true);
    }
  };

  // Handle module selection
  const handleModuleSelect = (moduleId: string) => {
    const module = cehModules.find(m => m.id === moduleId);
    if (module) {
      setSelectedModule(module);
      setIsModuleModalOpen(true);
    }
  };

  return (
    <div ref={mainRef} className="relative min-h-screen cyber-bg-primary">
      {/* Background Effects */}
      <CyberGrid />
      <div className="grid-overlay" />
      <div className="scanlines" />
      <div className="noise-overlay" />
      
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative z-10">
        <TerminalHero />
        <KaliHub onToolSelect={handleToolSelect} />
        <FeaturedTool onToolSelect={handleToolSelect} />
        <CEHModules onModuleSelect={handleModuleSelect} />
        <LiveTerminal />
        <StudyToolkit />
        <Footer />
      </main>

      {/* Modals */}
      <ToolDetailModal 
        tool={selectedTool} 
        isOpen={isToolModalOpen} 
        onClose={() => setIsToolModalOpen(false)} 
      />
      <ModuleDetailModal 
        module={selectedModule} 
        isOpen={isModuleModalOpen} 
        onClose={() => setIsModuleModalOpen(false)} 
      />
    </div>
  );
}

export default App;
