import { useEffect, useState } from 'react';
import { Terminal, Shield, BookOpen, ChevronsDown, Cpu, Zap, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TerminalHero = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const fullText = 'The definitive reference for Kali Linux tools & CEH mastery.';

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 40);
    return () => clearInterval(timer);
  }, []);

  const scrollToKaliHub = () => {
    const section = document.getElementById('kali-hub');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 lg:px-12 pt-20 overflow-hidden">
      <div className="max-w-screen-2xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Massive Branding & CTA */}
        <div className="z-10 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#4ade80] font-mono text-xs tracking-[0.3em] opacity-80 animate-pulse">
              <Zap className="w-3 h-3" />
              SYSTEM_CORE_INITIALIZED
            </div>
            <h1 className="text-7xl sm:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85]">
              <span className="block text-white">SHELL</span>
              <span className="block text-[#4ade80] drop-shadow-[0_0_30px_rgba(74,222,128,0.3)]">STACK</span>
            </h1>
          </div>

          <div className="max-w-xl space-y-6">
            <p className="text-xl text-[#94a3b8] font-mono leading-relaxed border-l-2 border-[#4ade80]/30 pl-6 py-2">
              {typedText}
              <span className="w-2 h-5 bg-[#4ade80] inline-block ml-2 animate-pulse align-middle" />
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => navigate('/tools')}
                className="group relative px-8 py-4 bg-[#4ade80] text-[#020617] font-bold rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  <Terminal className="w-5 h-5" />
                  ACCESS TOOLS
                </span>
              </button>

              <button
                onClick={() => navigate('/ceh')}
                className="group px-8 py-4 bg-white/5 border border-white/10 hover:border-[#4ade80]/50 text-white font-bold rounded-xl backdrop-blur-md transition-all hover:bg-white/10"
              >
                <span className="flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5 text-[#4ade80]" />
                  CEH EXPLORER
                </span>
              </button>

              <button
                onClick={() => navigate('/cheatsheet')}
                className="sm:col-span-2 group px-8 py-4 bg-white/5 border border-white/10 hover:border-[#22d3ee]/50 text-white font-bold rounded-xl backdrop-blur-md transition-all hover:bg-white/10"
              >
                <span className="flex items-center justify-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#22d3ee]" />
                  COMMAND CHEATSHEET
                </span>
              </button>
            </div>
          </div>

          {/* Quick Stats HUD */}
          <div className="flex flex-wrap gap-6 pt-4">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#94a3b8] font-mono uppercase tracking-widest">Database</span>
              <span className="text-2xl font-bold text-white">230+ TOOLS</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#94a3b8] font-mono uppercase tracking-widest">Curriculum</span>
              <span className="text-2xl font-bold text-white">CEH V13</span>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#94a3b8] font-mono uppercase tracking-widest">Status</span>
              <span className="text-2xl font-bold text-[#4ade80]">ENCRYPTED</span>
            </div>
          </div>
        </div>

        {/* Right Side: Visual HUD Terminal */}
        <div className="relative hidden lg:block">
          {/* Main Console Frame */}
          <div className="cyber-panel p-1 rounded-2xl shadow-[0_0_100px_rgba(74,222,128,0.1)]">
            <div className="bg-[#0B0E16] rounded-[14px] overflow-hidden">
              {/* Terminal Header */}
              <div className="h-10 px-4 flex items-center justify-between border-b border-white/5 bg-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4ade80]" />
                </div>
                <div className="text-[10px] font-mono text-[#94a3b8] tracking-widest">MONITOR_SESSION_01</div>
                <Lock className="w-3 h-3 text-[#94a3b8]" />
              </div>
              
              {/* Terminal Body */}
              <div className="p-6 font-mono text-[11px] leading-relaxed text-[#94a3b8] h-[400px] overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[#4ade80]">root@shellstack:</span>
                  <span className="text-[#22d3ee]">~</span>
                  <span className="text-white">$</span>
                  <span className="text-white">./init_shellstack --optimized</span>
                </div>
                
                <div className="space-y-2 opacity-80">
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5">
                    <span className="flex items-center gap-2 text-[#4ade80]">
                      <Terminal className="w-3 h-3" /> KALI_TOOLSET
                    </span>
                    <span className="text-xs text-white">230_INDEXED</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5">
                    <span className="flex items-center gap-2 text-[#22d3ee]">
                      <BookOpen className="w-3 h-3" /> CEH_V13_CURRICULUM
                    </span>
                    <span className="text-xs text-white">LOADED</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded border border-white/5">
                    <span className="flex items-center gap-2 text-[#fbbf24]">
                      <Cpu className="w-3 h-3" /> CMD_DATABASE
                    </span>
                    <span className="text-xs text-white">PARSING...</span>
                  </div>
                </div>

                <div className="mt-6 space-y-1">
                  <div className="text-[#4ade80]/50">[SYS] CORE_INTEGRITY: VERIFIED</div>
                  <div className="text-[#4ade80]/50">[SYS] UPLINK: SECURE_v1.4</div>
                  <div className="flex items-center gap-1 mt-4">
                    <span className="text-[#4ade80]">#</span>
                    <span className="w-2 h-4 bg-[#4ade80] animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Integrated HUD Labels - Safely inside the frame */}
            <div className="absolute top-14 right-6 z-20 flex items-center gap-2 text-[10px] font-mono font-bold text-[#4ade80] animate-pulse">
              <span className="opacity-50">[</span>
              LIVE_FEED
              <span className="opacity-50">]</span>
            </div>
            <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 text-[10px] font-mono font-bold text-[#22d3ee] animate-pulse">
              <span className="opacity-50">[</span>
              SECURE_NODE
              <span className="opacity-50">]</span>
            </div>
          </div>

          {/* Decorative Background Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#4ade80]/10 rounded-full blur-[80px]" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#22d3ee]/10 rounded-full blur-[80px]" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToKaliHub}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#94a3b8] hover:text-white transition-colors animate-bounce-subtle"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Initialize Scroll</span>
        <ChevronsDown className="w-5 h-5 text-[#4ade80]" />
      </button>
    </section>
  );
};

export default TerminalHero;
