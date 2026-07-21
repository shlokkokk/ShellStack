import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navigation from './components/Navigation';
import CustomCursor from './components/CustomCursor';
import CyberBackground from './components/CyberBackground';
import Footer from './sections/Footer';

import Home from './pages/Home';
import ToolsDirectory from './pages/ToolsDirectory';
import CEHModules from './sections/CEHModules';
import LiveTerminal from './sections/LiveTerminal';
import StudyToolkit from './sections/StudyToolkit';
import CheatSheetPage from './pages/CheatSheetPage';

import ModuleDetailModal from './components/ModuleDetailModal';
import GithubEngagementToast from './components/GithubEngagementToast';
import SmoothScroll from './components/SmoothScroll';
// import ChatBot from './components/ChatBot';
import { cehModules, type Module } from './data/cehModules';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

const ROUTE_SKELETON_DELAY_MS = 650;

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full flex justify-center">{children}</div>;
};

const ToolsRouteSkeleton = () => (
  <div className="w-full px-6 lg:px-12 pt-28 pb-16 animate-pulse">
    <div className="max-w-screen-2xl mx-auto">
      <div className="mb-10">
        <div className="h-3 w-44 rounded bg-[rgba(57,255,20,0.2)] mb-4" />
        <div className="h-12 w-96 rounded bg-[rgba(243,245,249,0.12)] mb-4" />
        <div className="h-4 w-full max-w-2xl rounded bg-[rgba(243,245,249,0.1)] mb-2" />
        <div className="h-4 w-full max-w-xl rounded bg-[rgba(243,245,249,0.08)]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-8">
        <div className="space-y-4">
          <div className="h-11 rounded-xl bg-[rgba(243,245,249,0.1)]" />
          <div className="cyber-panel p-4 space-y-2">
            <div className="h-3 w-20 rounded bg-[rgba(243,245,249,0.12)] mb-3" />
            {Array.from({ length: 11 }).map((_, idx) => (
              <div key={idx} className="h-9 rounded bg-[rgba(243,245,249,0.08)]" />
            ))}
          </div>
        </div>

        <div className="cyber-panel p-6 lg:p-7">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="w-full max-w-xl">
              <div className="h-8 w-44 rounded bg-[rgba(243,245,249,0.14)] mb-3" />
              <div className="h-3 w-full rounded bg-[rgba(243,245,249,0.1)] mb-2" />
              <div className="h-3 w-5/6 rounded bg-[rgba(243,245,249,0.08)]" />
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-7 w-20 rounded bg-[rgba(57,255,20,0.16)]" />
              ))}
            </div>
          </div>

          <div className="h-px w-full bg-[rgba(243,245,249,0.08)] mb-5" />

          <div className="space-y-3 mb-5">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-14 rounded-lg bg-[rgba(243,245,249,0.08)]" />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
            <div className="h-8 rounded bg-[rgba(243,245,249,0.08)]" />
            <div className="h-8 rounded bg-[rgba(243,245,249,0.08)]" />
          </div>

          <div className="h-10 rounded bg-[rgba(57,255,20,0.14)]" />
        </div>
      </div>
    </div>
  </div>
);

const CEHRouteSkeleton = () => (
  <div className="w-full px-6 lg:px-12 pt-28 pb-16 animate-pulse">
    <div className="max-w-screen-2xl mx-auto">
      <div className="mb-10">
        <div className="h-3 w-36 rounded bg-[rgba(57,255,20,0.2)] mb-4" />
        <div className="h-12 w-80 rounded bg-[rgba(243,245,249,0.12)] mb-4" />
        <div className="h-4 w-full max-w-xl rounded bg-[rgba(243,245,249,0.1)] mb-6" />
        <div className="h-px w-full bg-[rgba(243,245,249,0.08)]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="cyber-panel p-5 lg:p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="h-6 w-12 rounded bg-[rgba(57,255,20,0.22)]" />
              <div className="h-6 w-8 rounded bg-[rgba(0,240,255,0.2)]" />
            </div>

            <div className="h-6 w-3/4 rounded bg-[rgba(243,245,249,0.12)] mb-3" />
            <div className="h-3 w-full rounded bg-[rgba(243,245,249,0.1)] mb-2" />
            <div className="h-3 w-5/6 rounded bg-[rgba(243,245,249,0.08)] mb-4" />

            <div className="h-2 w-full rounded bg-[rgba(243,245,249,0.08)] mb-4" />
            <div className="h-9 w-full rounded bg-[rgba(57,255,20,0.14)]" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TerminalRouteSkeleton = () => (
  <div className="w-full px-6 lg:px-12 pt-24 pb-16 animate-pulse">
    <div className="max-w-screen-2xl mx-auto">
      <div className="cyber-panel p-0 overflow-hidden">
        <div className="h-11 border-b border-[rgba(243,245,249,0.08)] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[rgba(255,45,45,0.8)]" />
            <div className="w-3 h-3 rounded-full bg-[rgba(255,230,0,0.8)]" />
            <div className="w-3 h-3 rounded-full bg-[rgba(57,255,20,0.8)]" />
          </div>
          <div className="h-3 w-40 rounded bg-[rgba(243,245,249,0.12)]" />
          <div className="h-5 w-5 rounded bg-[rgba(243,245,249,0.1)]" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2">
          <div className="p-6 lg:p-8 border-b xl:border-b-0 xl:border-r border-[rgba(243,245,249,0.08)]">
            <div className="h-3 w-28 rounded bg-[rgba(57,255,20,0.2)] mb-5" />
            <div className="h-12 w-80 rounded bg-[rgba(243,245,249,0.12)] mb-5" />
            <div className="h-4 w-full rounded bg-[rgba(243,245,249,0.1)] mb-2" />
            <div className="h-4 w-11/12 rounded bg-[rgba(243,245,249,0.08)] mb-8" />

            <div className="space-y-3 mb-8">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-14 rounded-lg bg-[rgba(243,245,249,0.08)]" />
              ))}
            </div>

            <div className="h-11 rounded bg-[rgba(57,255,20,0.16)]" />
          </div>

          <div className="p-6 lg:p-8">
            <div className="h-4 w-2/3 rounded bg-[rgba(57,255,20,0.2)] mb-6" />
            <div className="space-y-3">
              {Array.from({ length: 12 }).map((_, idx) => (
                <div key={idx} className="h-4 rounded bg-[rgba(243,245,249,0.08)] w-full" />
              ))}
            </div>
            <div className="h-px w-full bg-[rgba(243,245,249,0.08)] my-7" />
            <div className="h-4 w-1/2 rounded bg-[rgba(57,255,20,0.2)]" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StudyRouteSkeleton = () => (
  <div className="w-full px-6 lg:px-12 pt-24 pb-16 animate-pulse">
    <div className="max-w-screen-2xl mx-auto">
      <div className="mb-10">
        <div className="h-12 w-96 rounded bg-[rgba(243,245,249,0.12)] mb-4" />
        <div className="h-4 w-full max-w-2xl rounded bg-[rgba(243,245,249,0.1)]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="cyber-panel p-6">
            <div className="h-10 w-10 rounded-xl bg-[rgba(57,255,20,0.14)] mb-6" />
            <div className="h-7 w-40 rounded bg-[rgba(243,245,249,0.12)] mb-4" />
            <div className="h-3 w-full rounded bg-[rgba(243,245,249,0.1)] mb-2" />
            <div className="h-3 w-5/6 rounded bg-[rgba(243,245,249,0.08)] mb-2" />
            <div className="h-3 w-4/5 rounded bg-[rgba(243,245,249,0.08)] mb-8" />
            <div className="h-4 w-24 rounded bg-[rgba(243,245,249,0.1)]" />
          </div>
        ))}
      </div>

      <div className="h-10 w-72 rounded bg-[rgba(243,245,249,0.08)]" />
    </div>
  </div>
);

const CheatSheetRouteSkeleton = () => (
  <div className="w-full px-6 lg:px-12 pt-24 pb-16 animate-pulse">
    <div className="max-w-screen-2xl mx-auto flex gap-8">
      <aside className="hidden lg:block w-72 space-y-2">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="h-12 rounded-lg bg-[rgba(243,245,249,0.08)]" />
        ))}
      </aside>
      <div className="flex-1 space-y-6">
        <div className="h-10 w-80 rounded bg-[rgba(243,245,249,0.12)]" />
        {Array.from({ length: 3 }).map((_, blockIdx) => (
          <div key={blockIdx} className="space-y-2">
            <div className="h-4 w-52 rounded bg-[rgba(57,255,20,0.2)]" />
            {Array.from({ length: 6 }).map((_, rowIdx) => (
              <div key={rowIdx} className="h-14 rounded-lg bg-[rgba(243,245,249,0.08)]" />
            ))}
          </div>
        ))}
      </div>
    </div>
  </div>
);

const RouteSkeleton = ({ pathname }: { pathname: string }) => {
  if (pathname === '/tools') return <ToolsRouteSkeleton />;
  if (pathname === '/ceh') return <CEHRouteSkeleton />;
  if (pathname === '/terminal') return <TerminalRouteSkeleton />;
  if (pathname === '/study') return <StudyRouteSkeleton />;
  if (pathname === '/cheatsheet') return <CheatSheetRouteSkeleton />;
  return null;
};

const AppShell = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);

  useEffect(() => {
    if (pathname === '/') {
      setIsRouteLoading(false);
      return;
    }

    setIsRouteLoading(true);
    const timer = window.setTimeout(() => {
      setIsRouteLoading(false);
    }, ROUTE_SKELETON_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  const handleModuleSelect = (moduleId: string) => {
    const module = cehModules.find((m) => m.id === moduleId);
    if (module) {
      setSelectedModule(module);
      setIsModuleModalOpen(true);
    }
  };

  return (
    <>
      <ScrollToTop />
      <div ref={mainRef} className="relative min-h-screen flex flex-col">
        <CyberBackground />

        <CustomCursor />
        <Navigation />

        <main className="relative z-10 flex-grow">
          {isRouteLoading ? (
            <RouteSkeleton pathname={pathname} />
          ) : (
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
          )}
        </main>

        <Footer />

        <ModuleDetailModal
          module={selectedModule}
          isOpen={isModuleModalOpen}
          onClose={() => setIsModuleModalOpen(false)}
        />

        <GithubEngagementToast />

        {/* <ChatBot /> */}
      </div>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <AppShell />
      </SmoothScroll>
    </BrowserRouter>
  );
}

export default App;
