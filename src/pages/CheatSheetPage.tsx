import { useState, useMemo, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import {
  Copy,
  Check,
  Search,
  Target,
  Activity,
  ShieldCheck,
  Wifi,
  Fingerprint,
  Globe,
  Terminal,
  Key,
  Folder,
  Shield,
  ArrowRight,
  Database,
  Cpu,
  Crosshair,
  Radio,
  BookOpen,
  Users,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { masterCheatSheet } from '../data/masterCheatSheet';

const categoryIconMap: Record<string, React.ElementType> = {
  recon: Search,
  scanning: Radio,
  web: Globe,
  'reverse-shells': Terminal,
  passwords: Key,
  transfers: Folder,
  'linux-privesc': Shield,
  'win-privesc': ShieldCheck,
  pivoting: ArrowRight,
  'active-directory': Users,
  wireless: Wifi,
  'post-exploit': Target,
  crypto: Key,
  metasploit: Crosshair,
  payloads: Zap,
  forensics: Fingerprint,
  traffic: Activity,
  'linux-essentials': Terminal,
  'exploit-dev': Cpu,
  'api-pentest': Database,
  'cloud-aws': Globe,
  'cloud-azure-gcp': Globe,
  containers: Database,
  'ad-advanced': ShieldCheck,
  'red-team': Target,
  'mobile-android': Activity,
  'mobile-ios': Activity,
  'ics-scada': Cpu,
  'iot-hardware': Cpu,
  'social-engineering': Users,
  'bin-exploit-adv': Crosshair,
};

const getCategoryIcon = (categoryId: string): React.ElementType => {
  return categoryIconMap[categoryId] || BookOpen;
};

const CheatSheetPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>(masterCheatSheet[0].id);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    const content = contentRef.current;
    if (!header || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(header, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo(content, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return masterCheatSheet;
    const q = searchQuery.toLowerCase();
    
    return masterCheatSheet
      .map((cat) => {
        const catMatches = 
          cat.name.toLowerCase().includes(q) || 
          cat.description.toLowerCase().includes(q);

        const filteredSections = cat.sections.map((sec) => {
          const secMatches = sec.title.toLowerCase().includes(q);
          if (catMatches || secMatches) return sec;

          const filteredCmds = sec.commands.filter(
            (c) => c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
          );
          return { ...sec, commands: filteredCmds };
        }).filter((sec) => sec.commands.length > 0);

        return { ...cat, sections: filteredSections };
      })
      .filter((cat) => cat.sections.length > 0);
  }, [searchQuery]);

  const currentCategory = filteredCategories.find((c) => c.id === activeCategory) || filteredCategories[0];

  const highlightVariables = (cmd: string) => {
    return cmd.split(/(<[^>]+>)/).map((part, i) =>
      part.startsWith('<') && part.endsWith('>') ? (
        <span key={i} className="text-[#22d3ee] font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-transparent">
      {/* Cinematic Header Overlay */}
      <div ref={headerRef} className="w-full px-6 lg:px-12 mb-12 relative z-20">
        <div className="flex items-center gap-3 mb-6 font-mono text-[10px] tracking-[0.2em] text-[#94a3b8]">
          <Link to="/" className="hover:text-[#4ade80] transition-colors uppercase">HQ</Link>
          <span className="opacity-30">/</span>
          <span className="text-[#4ade80] uppercase">PAYLOAD_NEXUS</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-black tracking-tighter leading-none">
              <span className="text-white">COMMAND</span><br />
              <span className="text-[#4ade80] drop-shadow-[0_0_20px_rgba(74,222,128,0.3)]">CHEST</span>
            </h1>
            <p className="text-[#94a3b8] max-w-xl font-mono text-sm leading-relaxed border-l-2 border-[#4ade80]/30 pl-6">
              Strategic payload repository for CEH operators. Tactical commands indexed across {masterCheatSheet.length} operational phases.
            </p>
          </div>

          {/* Advanced Search HUD */}
          <div className="relative w-full lg:w-[450px]">
            <div className="absolute -top-8 right-0 flex items-center gap-4 text-[10px] font-mono text-[#4ade80]">
              <span className="animate-pulse flex items-center gap-1">
                <Activity className="w-3 h-3" /> LIVE_FILTER_ACTIVE
              </span>
              <span className="opacity-50">v1.4.2_SECURE</span>
            </div>
            <div className="cyber-panel p-1 rounded-xl overflow-hidden group">
              <div className="relative bg-[#0B0E16] flex items-center p-3">
                <Search className="w-4 h-4 text-[#4ade80] mr-3 group-hover:scale-110 transition-transform" />
                <input
                  type="text"
                  placeholder="SEARCH_PAYLOAD_SIGNATURES..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full font-mono text-sm text-white placeholder:text-[#94a3b8]/40"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div ref={contentRef} className="w-full px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10">
        
        {/* Left Sidebar: Operational Phases - ULTIMATE COOL REDESIGN */}
        <aside className="hidden lg:block">
          <div className="cyber-panel sticky top-36 max-h-[75vh] overflow-y-auto cyber-scrollbar flex flex-col p-0 bg-black/40 backdrop-blur-xl border-[#4ade80]/10">
            {/* HUD Header Detail */}
            <div className="p-6 pt-8 pb-4 border-b border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <ShieldCheck className="w-12 h-12 text-[#4ade80]" />
              </div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex flex-col">
                  <h3 className="text-[10px] font-mono font-bold tracking-[0.3em] text-[#4ade80]">OPERATIONAL_PHASES</h3>
                  <span className="text-[8px] font-mono text-[#94a3b8] opacity-50 uppercase mt-1">Status: Active_Session_01</span>
                </div>
                <div className="p-1.5 bg-[#4ade80]/10 rounded border border-[#4ade80]/20">
                  <Target className="w-3.5 h-3.5 text-[#4ade80] animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Navigation List */}
            <nav className="p-4 space-y-2.5">
              {filteredCategories.map((cat, idx) => (
                (() => {
                  const CategoryIcon = getCategoryIcon(cat.id);
                  return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full group relative flex items-center gap-4 p-3 rounded-lg transition-all border overflow-hidden ${
                    activeCategory === cat.id
                      ? 'bg-[#4ade80]/10 border-[#4ade80]/40 text-[#4ade80] shadow-[0_0_20px_rgba(74,222,128,0.1)]'
                      : 'bg-transparent border-white/5 text-[#94a3b8] hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  {/* Category Number Sidebar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 transition-all ${activeCategory === cat.id ? 'bg-[#4ade80]' : 'bg-transparent group-hover:bg-white/10'}`} />
                  
                  {/* Icon Container */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center text-xl transition-all ${
                    activeCategory === cat.id ? 'bg-[#4ade80]/20 scale-110' : 'bg-white/5 group-hover:bg-white/10'
                  }`}>
                    <CategoryIcon className="w-5 h-5 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]" />
                  </div>

                  <div className="flex-grow text-left">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-black tracking-widest uppercase ${
                        activeCategory === cat.id ? 'text-[#eafff2]' : 'text-[#f1f5f9] group-hover:text-white'
                      }`}>
                        {cat.name.split(' ')[0]}
                      </span>
                      <span className={`text-[10px] font-mono font-bold tracking-wider ${
                        activeCategory === cat.id ? 'text-[#b8ffcf]' : 'text-[#e2e8f0] group-hover:text-white'
                      }`}>
                        0{idx + 1}
                      </span>
                    </div>
                    <div className={`text-[10px] font-mono mt-0.5 truncate max-w-[150px] ${
                      activeCategory === cat.id
                        ? 'text-[#eafff2]'
                        : 'text-[#f1f5f9] group-hover:text-white'
                    }`}>
                      {cat.name.split(' ').slice(1).join(' ')}
                    </div>
                  </div>

                  {/* Active Scanline Effect */}
                  {activeCategory === cat.id && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#4ade80]/5 to-transparent opacity-50" />
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#4ade80]/40 animate-scanline" />
                    </div>
                  )}
                </button>
                  );
                })()
              ))}
            </nav>

            {/* Bottom Status Panel */}
            <div className="p-6 mt-auto border-t border-white/5 bg-white/5">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-3 h-3 text-[#4ade80]" />
                    <span className="text-[9px] font-mono text-[#94a3b8]">ENCRYPTED_LINK</span>
                  </div>
                  <div className="w-1.5 h-1.5 bg-[#4ade80] rounded-full animate-ping" />
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[8px] font-mono text-[#94a3b8]/50 tracking-tighter">
                    <span>MEMORY_USAGE</span>
                    <span>0x7F4E</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#4ade80]/40 to-[#4ade80] w-[88%] shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <Fingerprint className="w-3 h-3 text-[#22d3ee]" />
                  <span className="text-[8px] font-mono text-[#22d3ee]/60 tracking-[0.2em]">OPERATOR: LEVEL_A</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="space-y-10 min-w-0">
          {currentCategory ? (
            <div className="space-y-12">
              {/* Category Lead */}
              {(() => {
                const CurrentCategoryIcon = getCategoryIcon(currentCategory.id);
                return (
              <div className="relative cyber-panel p-10 overflow-hidden group bg-[#0B0E16]/60">
                <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none select-none">
                  <CurrentCategoryIcon className="w-44 h-44" />
                </div>
                <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#4ade80]/20 to-[#4ade80]/5 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(74,222,128,0.15)] border border-[#4ade80]/20">
                    <CurrentCategoryIcon className="w-10 h-10 text-[#4ade80]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 bg-[#4ade80] rounded-full animate-pulse" />
                      <span className="text-[10px] font-mono text-[#4ade80] tracking-[0.4em] uppercase font-bold">Phase_Initialized</span>
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-2 uppercase">{currentCategory.name}</h2>
                    <p className="text-[#94a3b8] text-base font-mono leading-relaxed max-w-2xl">{currentCategory.description}</p>
                  </div>
                </div>
              </div>
                );
              })()}

              {/* Payload Sections */}
              {currentCategory.sections.map((section) => (
                <div key={section.title} className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="px-3 py-1 bg-[#4ade80]/10 border border-[#4ade80]/20 rounded text-[9px] font-mono font-bold text-[#4ade80] tracking-[0.2em] uppercase">Section</div>
                    <h3 className="text-sm font-mono font-bold text-white tracking-[0.2em] uppercase">{section.title}</h3>
                    <div className="h-px bg-gradient-to-r from-[#4ade80]/20 to-transparent flex-grow" />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {section.commands.map((cmd, idx) => (
                      <PayloadCard
                        key={`${section.title}-${idx}`}
                        cmd={cmd}
                        isCopied={copiedCmd === cmd.cmd}
                        onCopy={copyToClipboard}
                        highlightVariables={highlightVariables}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="cyber-panel p-20 flex flex-col items-center justify-center text-center">
              <Search className="w-16 h-16 text-[#94a3b8]/20 mb-6" />
              <h3 className="text-xl font-mono text-white mb-2">NO_RESULTS_FOUND</h3>
              <p className="text-[#94a3b8] font-mono text-sm italic">"Try broadening your search parameters, operator."</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const PayloadCard = ({ cmd, isCopied, onCopy, highlightVariables }: any) => {
  return (
    <div className="cyber-panel relative group overflow-hidden transition-all duration-300 hover:border-[#4ade80]/40 bg-[#0B0E16]/40 hover:bg-[#0B0E16]/80">
      <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        
        <div className="flex-grow min-w-0 w-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#4ade80]/40 rounded-full" />
              <span className="text-[9px] font-mono text-[#94a3b8]/60 tracking-widest uppercase">Payload_Record</span>
            </div>
            <span className="text-[9px] font-mono text-[#4ade80]/40 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">Verified_Syntax</span>
          </div>
          
          <div className="relative group/code">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#4ade80]/20 to-transparent rounded-lg blur opacity-0 group-hover/code:opacity-100 transition-opacity" />
            <code className="relative block text-[13px] font-mono text-[#4ade80] leading-relaxed break-all bg-black/60 p-5 rounded-lg border border-white/5 transition-all group-hover:border-[#4ade80]/20">
              <span className="opacity-30 mr-3 select-none">$</span>
              {highlightVariables(cmd.cmd)}
            </code>
          </div>
          
          <div className="mt-3 flex items-center gap-3">
            <div className="h-px w-4 bg-[#4ade80]/20" />
            <p className="text-xs text-[#94a3b8]/80 leading-relaxed font-mono italic">
              {cmd.desc}
            </p>
          </div>
        </div>

        {/* Action Button - ULTRA MODERN */}
        <button
          onClick={() => onCopy(cmd.cmd)}
          className={`flex-shrink-0 relative group/btn p-4 rounded-xl transition-all duration-300 border overflow-hidden ${
            isCopied 
              ? 'bg-[#4ade80] border-[#4ade80] text-[#020617] shadow-[0_0_30px_rgba(74,222,128,0.4)]' 
              : 'bg-white/5 border-white/10 text-[#94a3b8] hover:border-[#4ade80]/50 hover:text-[#4ade80]'
          }`}
        >
          <div className="relative z-10 flex items-center gap-2">
            {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {isCopied && <span className="text-[10px] font-bold tracking-tighter uppercase">Copied</span>}
          </div>
          {!isCopied && (
            <div className="absolute inset-0 bg-gradient-to-t from-[#4ade80]/20 to-transparent translate-y-full group-hover/btn:translate-y-0 transition-transform" />
          )}
        </button>
      </div>

      {/* Decorative Scanline inside card */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#4ade80]/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </div>
  );
};

export default CheatSheetPage;
