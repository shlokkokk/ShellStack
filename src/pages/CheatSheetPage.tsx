import { useState, useMemo, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Copy, Check, Search, ChevronRight, Terminal, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { masterCheatSheet, type CheatCommand } from '../data/masterCheatSheet';

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
      gsap.fromTo(header, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
      gsap.fromTo(content, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 1500);
  };

  // Filter logic
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
          
          if (catMatches || secMatches) {
            return sec; // Include all commands in this section if parent/self matches
          }

          const filteredCmds = sec.commands.filter(
            (c) => c.cmd.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
          );

          return { ...sec, commands: filteredCmds };
        }).filter((sec) => sec.commands.length > 0);

        return { ...cat, sections: filteredSections };
      })
      .filter((cat) => cat.sections.length > 0);
  }, [searchQuery]);

  const totalCommands = masterCheatSheet.reduce(
    (acc, cat) => acc + cat.sections.reduce((a, s) => a + s.commands.length, 0), 0
  );

  const currentCategory = filteredCategories.find((c) => c.id === activeCategory) || filteredCategories[0];

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const highlightVariables = (cmd: string) => {
    // Highlight <VARIABLES> in cyan
    return cmd.split(/(<[^>]+>)/).map((part, i) =>
      part.startsWith('<') && part.endsWith('>') ? (
        <span key={i} className="text-[#00F0FF] font-bold">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Header */}
      <div ref={headerRef} className="w-full px-6 lg:px-12 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/terminal" className="flex items-center gap-2 text-xs font-mono text-[#A7B0BC] hover:text-[#39FF14] transition-colors">
            <ArrowLeft className="w-4 h-4" /> TERMINAL
          </Link>
          <span className="text-[#A7B0BC]/30">/</span>
          <span className="text-xs font-mono text-[#39FF14]">CHEAT_SHEET</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Terminal className="w-6 h-6 text-[#39FF14]" />
              <h1 className="text-3xl lg:text-5xl font-bold text-[#F2F5F9]">
                MASTER <span className="text-[#39FF14]">CHEAT SHEET</span>
              </h1>
            </div>
            <p className="text-base text-[#A7B0BC] max-w-2xl">
              {totalCommands}+ tactical commands across {masterCheatSheet.length} operational categories.
              From passive recon to domain dominance — every payload you will ever need.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7B0BC]" />
            <input
              type="text"
              placeholder="Search commands, tools, payloads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#0B0E16] border border-[rgba(243,245,249,0.08)] rounded-lg text-sm font-mono text-[#F2F5F9] placeholder:text-[#A7B0BC]/50 focus:outline-none focus:border-[#39FF14]/50 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div ref={contentRef} className="w-full px-6 lg:px-12 flex gap-8">
        {/* Sidebar — Category Nav */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide pr-2 space-y-1">
            <p className="text-[10px] font-mono text-[#A7B0BC]/60 uppercase tracking-widest mb-3 px-3">
              TACTICAL PHASES
            </p>
            {filteredCategories.map((cat) => {
              const cmdCount = cat.sections.reduce((a, s) => a + s.commands.length, 0);
              return (
                <button
                  key={cat.id}
                  onClick={() => scrollToCategory(cat.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center gap-3 transition-all duration-200 group border backdrop-blur-sm ${
                    activeCategory === cat.id
                      ? 'bg-[rgba(57,255,20,0.12)] border-[rgba(57,255,20,0.3)] shadow-[0_0_15px_rgba(57,255,20,0.05)]'
                      : 'bg-[#0B0E16]/30 border-transparent hover:bg-[rgba(243,245,249,0.05)] hover:border-[rgba(243,245,249,0.1)]'
                  }`}
                >
                  <span className="text-lg filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-mono truncate uppercase tracking-wider ${
                      activeCategory === cat.id ? 'text-[#39FF14]' : 'text-[#F2F5F9]/80 group-hover:text-[#39FF14]'
                    }`}>
                      {cat.name}
                    </p>
                    <p className="text-[9px] font-mono text-[#A7B0BC]/50 uppercase">{cmdCount} tactical items</p>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-all duration-300 ${
                    activeCategory === cat.id ? 'text-[#39FF14] translate-x-0.5' : 'text-[#A7B0BC]/20 group-hover:text-[#39FF14]/40'
                  }`} />
                </button>
              );
            })}
          </div>
        </aside>

        {/* Mobile Category Selector */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#05060B]/95 backdrop-blur-md border-t border-[rgba(243,245,249,0.08)] overflow-x-auto">
          <div className="flex gap-1 p-2">
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[rgba(57,255,20,0.1)] text-[#39FF14] border border-[rgba(57,255,20,0.3)]'
                    : 'text-[#A7B0BC] border border-transparent'
                }`}
              >
                {cat.icon} {cat.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 min-w-0 pb-20 lg:pb-0">
          {currentCategory && (
            <div>
              {/* Category Header */}
              <div className="mb-8 pb-6 border-b border-[rgba(243,245,249,0.08)]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{currentCategory.icon}</span>
                  <h2 className="text-2xl font-bold text-[#F2F5F9]">{currentCategory.name}</h2>
                </div>
                <p className="text-sm text-[#A7B0BC]">{currentCategory.description}</p>
              </div>

              {/* Sections */}
              {currentCategory.sections.map((section) => (
                <div key={section.title} className="mb-10">
                  <h3 className="text-sm font-mono font-bold text-[#39FF14] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#39FF14] rounded-full" />
                    {section.title}
                  </h3>

                  <div className="space-y-2">
                    {section.commands.map((cmd, idx) => (
                      <CommandRow
                        key={`${section.title}-${idx}`}
                        cmd={cmd}
                        copiedCmd={copiedCmd}
                        onCopy={copyToClipboard}
                        highlightVariables={highlightVariables}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredCategories.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <Search className="w-12 h-12 text-[#A7B0BC]/30 mb-4" />
              <p className="text-lg font-mono text-[#A7B0BC]">No commands match "{searchQuery}"</p>
              <p className="text-sm text-[#A7B0BC]/60 mt-2">Try a different keyword like "nmap", "reverse shell", or "privesc"</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Memoized row to prevent re-renders on copy
const CommandRow = ({
  cmd,
  copiedCmd,
  onCopy,
  highlightVariables,
}: {
  cmd: CheatCommand;
  copiedCmd: string | null;
  onCopy: (text: string) => void;
  highlightVariables: (text: string) => React.ReactNode[];
}) => {
  const isCopied = copiedCmd === cmd.cmd;
  return (
    <div className="group flex items-start gap-3 p-3 rounded-lg border border-[rgba(243,245,249,0.04)] bg-[#0B0E16]/80 backdrop-blur-sm hover:border-[rgba(57,255,20,0.15)] hover:bg-[#0B0E16]/95 transition-all duration-200">
      <div className="flex-1 min-w-0">
        <code className="block text-sm font-mono text-[#F2F5F9] break-all whitespace-pre-wrap leading-relaxed">
          <span className="text-[#39FF14] select-none mr-2">$</span>
          {highlightVariables(cmd.cmd)}
        </code>
        <p className="text-xs text-[#A7B0BC] mt-1.5">{cmd.desc}</p>
      </div>
      <button
        onClick={() => onCopy(cmd.cmd)}
        className={`flex-shrink-0 p-2 rounded-md transition-all duration-200 ${
          isCopied
            ? 'bg-[rgba(57,255,20,0.1)] text-[#39FF14]'
            : 'text-[#A7B0BC]/40 hover:text-[#39FF14] hover:bg-[rgba(57,255,20,0.05)]'
        }`}
        title="Copy to clipboard"
      >
        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default CheatSheetPage;
