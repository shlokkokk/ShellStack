import { useEffect, useRef, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { BookOpen, Clock, Zap, Shield, Filter, Search, Award, ChevronRight } from 'lucide-react';
import { cehModules } from '../data/cehModules';

interface CEHModulesProps {
  onModuleSelect: (moduleId: string) => void;
}

const CEHModules = ({ onModuleSelect }: CEHModulesProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  // Advanced Mapping for Tactical Domains
  const domainMapping: Record<string, string[]> = {
    'ALL': [],
    'RECON': ['reconnaissance', 'footprinting', 'osint', 'enumeration'],
    'SYSTEM_HACK': ['system hacking', 'password cracking', 'privilege escalation'],
    'NETWORK': ['scanning networks', 'sniffing', 'session hijacking'],
    'WEB_APP': ['web application', 'web server', 'sql injection'],
    'WIRELESS': ['wireless'],
    'CLOUD_IOT': ['cloud', 'iot', 'ot'],
    'CRYPTO': ['cryptography']
  };

  const domains = Object.keys(domainMapping);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const grid = gridRef.current;

    if (!section || !header || !grid) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(header, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power4.out' });
      
      const cards = grid.querySelectorAll('.module-card');
      gsap.fromTo(cards, 
        { opacity: 0, y: 30, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.05, ease: 'power2.out', scrollTrigger: {
          trigger: grid,
          start: 'top 80%',
        }}
      );
    }, section);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('ceh_completed_modules');
    if (saved) setCompletedModules(JSON.parse(saved));
  }, []);

  const filteredModules = useMemo(() => {
    return cehModules.filter(m => {
      const searchContent = `${m.title} ${m.description} ${m.id}`.toLowerCase();
      const matchesSearch = searchContent.includes(searchQuery.toLowerCase());
      
      let matchesFilter = activeFilter === 'ALL';
      if (!matchesFilter) {
        const keywords = domainMapping[activeFilter] || [];
        matchesFilter = keywords.some(kw => searchContent.includes(kw));
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  const progress = Math.round((completedModules.length / cehModules.length) * 100);

  return (
    <section ref={sectionRef} className="relative w-full py-24 px-6 lg:px-12 bg-transparent overflow-hidden">
      
      {/* Background Decorative HUD */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] select-none overflow-hidden">
        <div className="absolute top-20 left-10 text-[120px] font-black text-white">CEH_EXPLORER</div>
        <div className="absolute bottom-20 right-10 text-[120px] font-black text-[#4ade80]">MISSION_CONTROL</div>
      </div>

      <div className="max-w-screen-2xl mx-auto relative z-10">
        
        {/* Cinematic Header */}
        <header ref={headerRef} className="mb-16 space-y-8">
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.4em] text-[#4ade80] animate-pulse">
            <Award className="w-4 h-4" />
            <span>CERTIFICATION_PATHWAY_ACTIVE</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.85]">
                <span className="text-white">CEH</span><br />
                <span className="text-[#4ade80] drop-shadow-[0_0_30px_rgba(74,222,128,0.3)]">V13_ACADEMY</span>
              </h1>
              <p className="text-[#94a3b8] max-w-2xl font-mono text-base leading-relaxed border-l-2 border-[#4ade80]/30 pl-6 py-2">
                Master the world's most advanced ethical hacking certification. Comprehensive coverage of {cehModules.length} operational domains.
              </p>
            </div>

            {/* Global Stats HUD */}
            <div className="cyber-panel p-6 min-w-[320px] bg-black/40 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-widest">Global Progress</span>
                  <span className="text-3xl font-bold text-white">{progress}%</span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-[#4ade80]/20 flex items-center justify-center relative">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/5" />
                    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="126" strokeDashoffset={126 - (126 * progress) / 100} className="text-[#4ade80] transition-all duration-1000" />
                  </svg>
                  <Shield className="absolute w-4 h-4 text-[#4ade80]" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-[#94a3b8]">MODULES_COMPLETED</span>
                  <span className="text-[#4ade80]">{completedModules.length}/{cehModules.length}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4ade80]/40 to-[#4ade80] transition-all duration-1000" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Tactical Control Bar */}
        <div className="cyber-panel p-4 mb-10 flex flex-col md:flex-row items-center gap-6 bg-black/20">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4ade80]" />
            <input 
              type="text" 
              placeholder="SEARCH_MODULE_SIG..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-xl font-mono text-sm text-white focus:border-[#4ade80]/50 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <Filter className="w-4 h-4 text-[#94a3b8] flex-shrink-0" />
            {domains.map(d => (
              <button
                key={d}
                onClick={() => setActiveFilter(d)}
                className={`px-4 py-2 rounded-lg font-mono text-[10px] tracking-widest whitespace-nowrap transition-all border ${
                  activeFilter === d 
                    ? 'bg-[#4ade80] border-[#4ade80] text-[#020617] font-bold shadow-[0_0_15px_rgba(74,222,128,0.3)]' 
                    : 'bg-white/5 border-white/10 text-[#94a3b8] hover:bg-white/10'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Goated Grid Container */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 items-stretch">
          {filteredModules.map((m) => (
            <ModuleCard 
              key={m.id} 
              module={m} 
              isCompleted={completedModules.includes(m.id)}
              onSelect={onModuleSelect}
            />
          ))}
        </div>

        {filteredModules.length === 0 && (
          <div className="py-32 text-center cyber-panel bg-black/20">
            <Zap className="w-16 h-16 text-[#94a3b8]/20 mx-auto mb-6 animate-pulse" />
            <h3 className="text-xl font-mono text-white mb-2">NO_MODULES_MATCH_SIGNATURE</h3>
            <p className="text-[#94a3b8] font-mono text-sm">"Re-scanning the curriculum database..."</p>
          </div>
        )}

      </div>
    </section>
  );
};

const ModuleCard = ({ module, isCompleted, onSelect }: any) => {
  return (
    <div
      onClick={() => onSelect(module.id)}
      className={`module-card group relative cyber-panel p-6 cursor-pointer transition-all duration-500 overflow-hidden flex flex-col h-full ${
        isCompleted ? 'border-[#4ade80]/50 bg-[#4ade80]/5' : 'hover:border-[#4ade80]/40'
      }`}
    >
      {/* Background Glow Effect */}
      <div className={`absolute -inset-20 bg-gradient-to-br from-[#4ade80]/10 to-transparent blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />

      {/* Header Info */}
      <div className="relative z-10 flex items-start justify-between mb-8">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-[#94a3b8] tracking-[0.2em] uppercase mb-1">Module_{module.number}</span>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isCompleted ? 'bg-[#4ade80]' : 'bg-[#94a3b8]/30'} animate-pulse`} />
            <span className={`text-[10px] font-mono ${isCompleted ? 'text-[#4ade80]' : 'text-[#94a3b8]/50'}`}>
              {isCompleted ? 'DEPLOYED' : 'READY'}
            </span>
          </div>
        </div>
        <div className="px-2 py-1 bg-[#22d3ee]/10 border border-[#22d3ee]/30 rounded text-[9px] font-mono text-[#22d3ee] font-bold">
          WT: {module.examWeight}
        </div>
      </div>

      {/* Title & Description */}
      <div className="relative z-10 mb-8 space-y-3 flex-grow">
        <h3 className="text-xl font-bold text-white group-hover:text-[#4ade80] transition-colors duration-300 tracking-tight leading-tight uppercase">
          {module.title}
        </h3>
        <p className="text-xs text-[#94a3b8] leading-relaxed line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity">
          {module.description}
        </p>
      </div>

      {/* Footer Stats */}
      <div className="relative z-10 pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#94a3b8]">
            <BookOpen className="w-3 h-3 text-[#4ade80]" />
            {module.topics.length}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#94a3b8]">
            <Clock className="w-3 h-3 text-[#22d3ee]" />
            {module.duration}
          </div>
        </div>
        <button className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:bg-[#4ade80] group-hover:text-[#020617] group-hover:border-[#4ade80] transition-all duration-300">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Scanline */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-[#4ade80]/40 -translate-y-full group-hover:animate-scanline pointer-events-none" />
    </div>
  );
};

export default CEHModules;
