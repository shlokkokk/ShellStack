import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Search,
  Bug,
  Globe2,
  Database,
  Lock,
  Wifi,
  Cpu,
  Zap,
  Eye,
  FileSearch,
  FileText,
  Users,
  ChevronRight,
  Terminal,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { categories, tools, searchTools, type Tool } from '../data/kaliTools';

gsap.registerPlugin(ScrollTrigger);

interface KaliHubProps {
  onToolSelect: (toolId: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Search,
  Bug,
  Globe: Globe2,
  Database,
  Lock,
  Wifi,
  Cpu,
  Zap,
  Eye,
  FileSearch,
  FileText,
  Users,
  ArrowRight,
};

const KaliHub = ({ onToolSelect }: KaliHubProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const cards = cardsRef.current;

    if (!section || !header || !cards) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        header,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const cardElements = cards.querySelectorAll('.category-card');
      gsap.fromTo(
        cardElements,
        { opacity: 0, y: 60, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cards,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.length > 0) {
      const results = searchTools(searchQuery);
      setFilteredTools(results.slice(0, 10));
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setFilteredTools([]);
    }
  }, [searchQuery]);

  const getCardClasses = (size: string) => {
    const baseClasses =
      'category-card cyber-panel p-5 lg:p-6 cursor-pointer group transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(57,255,20,0.65)]';
    switch (size) {
      case 'large':
        return `${baseClasses} col-span-12 md:col-span-6 lg:col-span-6 min-h-[200px] lg:min-h-[240px]`;
      case 'medium':
        return `${baseClasses} col-span-12 sm:col-span-6 lg:col-span-4 min-h-[180px] lg:min-h-[200px]`;
      case 'small':
        return `${baseClasses} col-span-12 sm:col-span-6 lg:col-span-3 min-h-[160px] lg:min-h-[180px]`;
      default:
        return `${baseClasses} col-span-12 sm:col-span-6 lg:col-span-4 min-h-[180px]`;
    }
  };

  const getCategoryTools = (categoryId: string): Tool[] => {
    return tools.filter(t => t.category === categoryId);
  };

  return (
    <section
      ref={sectionRef}
      id="kali-hub"
      className="relative w-full py-20 lg:py-28"
    >
      <div className="w-full px-6 lg:px-12">
        {/* Intro Context Block */}
        <div className="mb-12 lg:mb-16 relative z-20">
          <div className="relative overflow-hidden rounded-[28px] border border-[rgba(243,245,249,0.08)] bg-[linear-gradient(135deg,rgba(2,6,23,0.96)_0%,rgba(5,10,24,0.92)_45%,rgba(4,18,24,0.9)_100%)] px-6 py-8 shadow-[0_30px_80px_rgba(0,0,0,0.35)] lg:px-10 lg:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(57,255,20,0.13),transparent_28%),radial-gradient(circle_at_78%_22%,rgba(34,211,238,0.18),transparent_20%),linear-gradient(rgba(57,255,20,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(57,255,20,0.06)_1px,transparent_1px)] bg-[length:auto,auto,72px_72px,72px_72px] opacity-70 pointer-events-none" />
            <div className="absolute inset-y-0 right-[18%] w-px bg-gradient-to-b from-transparent via-[rgba(34,211,238,0.5)] to-transparent pointer-events-none hidden lg:block" />
            <div className="absolute top-8 right-8 hidden lg:flex items-center gap-2 rounded-full border border-[rgba(34,211,238,0.2)] bg-[rgba(5,10,24,0.82)] px-3 py-1.5 backdrop-blur-sm">
              <div className="h-2 w-2 rounded-full bg-[#39FF14] shadow-[0_0_12px_rgba(57,255,20,0.9)]" />
              <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[#C8F9FF]">
                foundation online
              </span>
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.9fr)] lg:items-end">
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(57,255,20,0.22)] bg-[rgba(57,255,20,0.08)] px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.28em] text-[#39FF14]">
                    <Terminal className="h-3.5 w-3.5" />
                    Platform Overview
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(243,245,249,0.08)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.24em] text-[#A7B0BC]">
                    Linux core
                    <ArrowRight className="h-3.5 w-3.5 text-[#22d3ee]" />
                    Kali workflow
                  </span>
                </div>

                <h2 className="mt-5 max-w-5xl text-4xl font-black uppercase tracking-[-0.04em] text-[#F2F5F9] leading-[0.9] sm:text-5xl lg:text-7xl">
                  Master the
                  <span className="mx-3 text-[#39FF14] drop-shadow-[0_0_18px_rgba(57,255,20,0.28)]">system.</span>
                  <br />
                  Command the
                  <span className="mx-3 text-[#22d3ee] drop-shadow-[0_0_20px_rgba(34,211,238,0.22)]">toolkit.</span>
                </h2>

                <p className="mt-5 max-w-3xl text-base leading-relaxed text-[#A7B0BC] lg:text-lg">
                  Strong security work starts below the tools. Learn how Linux behaves first, then use Kali Linux as a
                  purpose-built environment for testing, auditing, and offensive workflows.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  {[
                    'Permissions, processes, and shell fluency',
                    'Debian-based testing environment',
                    'Fast pivot from fundamentals to execution',
                  ].map((item) => (
                    <div
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(243,245,249,0.08)] bg-[rgba(255,255,255,0.03)] px-4 py-2 text-sm text-[#D7DEE7] backdrop-blur-sm"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-[#39FF14]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                <article className="relative overflow-hidden rounded-[24px] border border-[rgba(57,255,20,0.14)] bg-[linear-gradient(180deg,rgba(57,255,20,0.08)_0%,rgba(8,12,20,0.92)_100%)] p-5 lg:p-6">
                  <div className="absolute right-4 top-4 rounded-full border border-[rgba(57,255,20,0.18)] bg-[rgba(57,255,20,0.08)] p-2">
                    <Cpu className="h-4 w-4 text-[#39FF14]" />
                  </div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#39FF14]">Layer 01</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-[rgba(57,255,20,0.35)] to-transparent" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-[#F2F5F9]">Linux</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#A7B0BC] lg:text-base">
                    Linux is the operating system layer underneath the workflow. It gives you control over files,
                    permissions, networking, packages, and the shell that powers serious hands-on security work.
                  </p>
                  <p className="mt-4 font-mono text-xs uppercase tracking-[0.22em] text-[#89FF71]">
                    Open source. Precise control. Built for depth.
                  </p>
                </article>

                <article className="relative overflow-hidden rounded-[24px] border border-[rgba(34,211,238,0.16)] bg-[linear-gradient(180deg,rgba(34,211,238,0.08)_0%,rgba(8,12,20,0.94)_100%)] p-5 lg:p-6">
                  <div className="absolute right-4 top-4 rounded-full border border-[rgba(34,211,238,0.2)] bg-[rgba(34,211,238,0.08)] p-2">
                    <Lock className="h-4 w-4 text-[#22d3ee]" />
                  </div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-[0.28em] text-[#22d3ee]">Layer 02</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-[rgba(34,211,238,0.35)] to-transparent" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-[#F2F5F9]">Kali Linux</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#A7B0BC] lg:text-base">
                    Kali Linux is a Debian-based security distribution that packages the tools, defaults, and workflow
                    setup used for penetration testing, forensics, reconnaissance, and assessment.
                  </p>
                  <p className="mt-4 font-mono text-xs uppercase tracking-[0.22em] text-[#67E8F9]">
                    Security-focused. Tool-ready. Field-tested.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div ref={headerRef} className="mb-12 lg:mb-16 relative z-30">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-5 h-5 text-[#39FF14]" />
                <span className="text-xs font-mono text-[#39FF14] uppercase tracking-wider">
                  Tools Reference
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#F2F5F9] mb-3">
                KALI <span className="text-[#39FF14]">LINUX</span>
              </h2>
              <p className="text-lg text-[#A7B0BC]">
                Browse {tools.length}+ tools across {categories.length} categories with detailed commands and examples.
              </p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 relative z-40">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A7B0BC]" />
                <input
                  type="text"
                  placeholder="Search tools, commands, tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-72 pl-10 pr-4 py-2.5 bg-[#0B0E16] border border-[rgba(243,245,249,0.08)] rounded-lg text-sm text-[#F2F5F9] placeholder:text-[#A7B0BC]/50 focus:outline-none focus:border-[#39FF14] transition-colors"
                />
                
                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 cyber-panel max-h-80 overflow-y-auto z-[120]">
                    {filteredTools.length > 0 ? (
                      filteredTools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => {
                            onToolSelect(tool.id);
                            setSearchQuery('');
                            setShowSearchResults(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 text-left hover:bg-[rgba(57,255,20,0.05)] border-b border-[rgba(243,245,249,0.05)] transition-colors"
                        >
                          <Terminal className="w-4 h-4 text-[#39FF14]" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-[#F2F5F9]">{tool.name}</div>
                            <div className="text-xs text-[#A7B0BC] truncate">{tool.description}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#A7B0BC]" />
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-[#A7B0BC]">
                        No tools found matching &quot;{searchQuery}&quot;
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0B0E16] border border-[rgba(243,245,249,0.08)] rounded-lg text-sm text-[#A7B0BC] hover:text-[#39FF14] hover:border-[rgba(57,255,20,0.3)] transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <div ref={cardsRef} className="grid grid-cols-12 gap-4 lg:gap-5 relative z-10">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Terminal;
            const categoryTools = getCategoryTools(category.id);
            
            return (
              <div
                key={category.id}
                className={getCardClasses(
                  category.id === 'information-gathering' || category.id === 'exploitation-tools'
                    ? 'large'
                    : category.id === 'database-assessment' || category.id === 'reverse-engineering' || category.id === 'reporting' || category.id === 'social-engineering'
                    ? 'small'
                    : 'medium'
                )}
              >
                <div className="flex flex-col h-full">
                  {/* Icon & Count */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-[rgba(57,255,20,0.08)] rounded-lg border border-[rgba(57,255,20,0.15)] group-hover:bg-[rgba(57,255,20,0.12)] group-hover:border-[rgba(57,255,20,0.25)] transition-all duration-300">
                      <Icon className="w-5 h-5 text-[#39FF14]" />
                    </div>
                    <span className="text-xs font-mono text-[#A7B0BC]">
                      {category.toolCount} tools
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-lg lg:text-xl font-bold text-[#F2F5F9] mb-2 group-hover:text-[#39FF14] transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm text-[#A7B0BC] line-clamp-2 mb-3">
                      {category.description}
                    </p>
                    
                    {/* Featured Tools */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {categoryTools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToolSelect(tool.id);
                          }}
                          aria-label={`Open ${tool.name} details`}
                          title={`Open ${tool.name}`}
                          className="group/chip inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[#A7B0BC] bg-[#05060B] rounded border border-[rgba(243,245,249,0.08)] hover:border-[rgba(57,255,20,0.45)] hover:text-[#39FF14] hover:bg-[rgba(57,255,20,0.06)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#39FF14] focus-visible:ring-offset-0 transition-all"
                        >
                          <span>{tool.name}</span>
                          <ChevronRight className="w-3 h-3 opacity-45 group-hover/chip:opacity-100 group-hover/chip:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <div className="mt-12 lg:mt-16 flex flex-wrap justify-center gap-8 lg:gap-16 py-6 border-t border-[rgba(243,245,249,0.08)]">
          {[
            { value: 'Curated', label: 'Tooling' },
            { value: 'Multi-Domain', label: 'Coverage' },
            { value: 'Actionable', label: 'Commands' },
            { value: 'Evergreen', label: 'Maintained' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-[#39FF14] font-mono">
                {stat.value}
              </div>
              <div className="text-xs font-mono text-[#A7B0BC] uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Featured Tools Quick Access */}
        <div className="mt-12 p-6 cyber-panel">
          <h3 className="text-lg font-bold text-[#F2F5F9] mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#39FF14]" />
            Essential Tools
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['nmap', 'metasploit', 'sqlmap', 'burpsuite', 'hashcat', 'wireshark'].map((toolId) => {
              const tool = tools.find(t => t.id === toolId);
              if (!tool) return null;
              return (
                <button
                  key={toolId}
                  onClick={() => onToolSelect(toolId)}
                  className="p-3 text-left bg-[#05060B] rounded-lg border border-[rgba(243,245,249,0.08)] hover:border-[rgba(57,255,20,0.4)] transition-all group"
                >
                  <div className="text-sm font-mono text-[#F2F5F9] group-hover:text-[#39FF14] transition-colors">
                    {tool.name}
                  </div>
                  <div className="text-xs text-[#A7B0BC] mt-1 truncate">
                    {tool.tags[0]}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default KaliHub;
