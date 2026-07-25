import { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, Terminal, ExternalLink, BookOpen, AlertTriangle, Zap, Target, ArrowDown, ChevronDown, Play } from 'lucide-react';
import type { Tool } from '../data/kaliTools';
import InteractiveCommandBuilder from './InteractiveCommandBuilder';
import { useRunInTerminal } from '../hooks/useRunInTerminal';

interface ToolDetailModalProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
}

const ToolDetailModal = ({ tool, isOpen, onClose }: ToolDetailModalProps) => {
  const { runInTerminal } = useRunInTerminal();
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'commands' | 'info' | 'examples' | 'guide'>('commands');
  const [canScroll, setCanScroll] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setCanScroll(scrollHeight - scrollTop > clientHeight + 10);
      if (scrollTop > 20) {
        setHasScrolled(true);
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      scrollRef.current.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }

    setHasScrolled(false);
    checkScroll();
    // Re-check after a short delay to account for content rendering/images
    const timer = window.setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      window.removeEventListener('resize', checkScroll);
      window.clearTimeout(timer);
    };
  }, [activeTab, tool]);

  useEffect(() => {
    if (tool?.detailedReport) {
      setActiveTab('guide');
    } else {
      setActiveTab('commands');
    }
  }, [tool]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      // Always clean up — never leave no-scroll stuck on the body
      document.body.classList.remove('no-scroll');
    }
    return () => {
      // Cleanup on unmount: always safe to remove
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen || !tool) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCommand(id);
    setTimeout(() => setCopiedCommand(null), 2000);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-[#39FF14] bg-[rgba(57,255,20,0.15)] border-[rgba(57,255,20,0.3)]';
      case 'intermediate': return 'text-[#00F0FF] bg-[rgba(0,240,255,0.15)] border-[rgba(0,240,255,0.3)]';
      case 'advanced': return 'text-[#FF6B00] bg-[rgba(255,107,0,0.15)] border-[rgba(255,107,0,0.3)]';
      case 'expert': return 'text-[#FF2D2D] bg-[rgba(255,45,45,0.15)] border-[rgba(255,45,45,0.3)]';
      default: return 'text-[#A7B0BC] bg-[rgba(167,176,188,0.15)]';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[99999] flex items-center justify-center pt-20 pb-5 px-3 sm:px-6"
      data-modal-open="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#05060B]/95 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-5xl h-full max-h-[calc(100vh-100px)] cyber-panel overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Compact Header */}
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 border-b border-[rgba(243,245,249,0.08)] bg-[#0B0E16] shrink-0">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-lg md:text-xl font-bold text-[#F2F5F9] font-mono tracking-tight">{tool.name}</h2>
              <span className={`px-2 py-0.5 text-[10px] font-mono uppercase rounded border ${getDifficultyColor(tool.difficulty)}`}>
                {tool.difficulty}
              </span>

              {/* Tags */}
              <div className="hidden sm:flex items-center gap-1.5 ml-2">
                {tool.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] font-mono text-[#A7B0BC]/60 bg-[#05060B] px-1.5 py-0.5 rounded border border-[rgba(243,245,249,0.05)]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-[#A7B0BC] line-clamp-1 leading-relaxed">{tool.description}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Compact Install Pill */}
            {tool.installation && (
              <div className="flex items-center gap-2 bg-[#05060B] border border-[rgba(0,240,255,0.3)] px-2.5 py-1 rounded-lg font-mono text-[11px] text-[#00F0FF]">
                <span className="text-[#39FF14] font-bold select-none">$</span>
                <code className="truncate max-w-[180px] sm:max-w-[260px] select-all">{tool.installation}</code>
                <button
                  onClick={() => runInTerminal(tool.installation!, { onCloseModal: onClose })}
                  className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold text-[#39FF14] bg-[rgba(57,255,20,0.15)] border border-[rgba(57,255,20,0.4)] hover:bg-[rgba(57,255,20,0.25)] rounded transition-all cursor-pointer shrink-0"
                  title="Run installation in terminal"
                >
                  <Play className="w-2.5 h-2.5 fill-[#39FF14]" />
                  <span>Run</span>
                </button>
                <button
                  onClick={() => copyToClipboard(tool.installation!, 'install')}
                  className="p-0.5 text-[#A7B0BC] hover:text-[#00F0FF] transition-colors cursor-pointer shrink-0"
                  title="Copy command"
                >
                  {copiedCommand === 'install' ? <Check className="w-3 h-3 text-[#39FF14]" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-[#A7B0BC] hover:text-[#FF2D2D] hover:bg-[rgba(255,45,45,0.1)] rounded-lg transition-colors cursor-pointer shrink-0 ml-1"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="relative z-20 flex border-b border-[rgba(243,245,249,0.08)] bg-[#05060B] shrink-0 items-center justify-between">
          <div className="flex flex-1 overflow-x-auto scrollbar-hide">
            {[
              { id: 'guide', label: 'Guide', icon: BookOpen, hide: !tool.detailedReport },
              { id: 'commands', label: 'Commands', icon: Terminal },
              { id: 'info', label: 'Information', icon: Zap },
              { id: 'examples', label: 'Examples', icon: Target },
            ].map((tab) => {
              if (tab.hide) return null;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 md:px-6 md:py-3 text-[11px] md:text-sm font-mono uppercase tracking-wider transition-all whitespace-nowrap group shrink-0 ${
                    activeTab === tab.id
                      ? 'text-[#39FF14] border-b-2 border-[#39FF14] bg-[rgba(57,255,20,0.05)]'
                      : 'text-[#A7B0BC] hover:text-[#F2F5F9] hover:bg-[rgba(255,255,255,0.01)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Collapse/Expand Toggle for Mobile Header */}
          <button
            onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
            className="md:hidden flex items-center justify-center px-4 border-l border-[rgba(243,245,249,0.08)] text-[#A7B0BC] bg-[rgba(167,176,188,0.08)] hover:text-[#39FF14] hover:bg-[rgba(57,255,20,0.08)] transition-all shrink-0 self-stretch"
            title={isHeaderExpanded ? "Collapse header" : "Expand header"}
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isHeaderExpanded ? 'rotate-180' : 'rotate-0'}`} />
          </button>
        </div>

        {/* Content */}
        <div 
          ref={scrollRef}
          onScroll={checkScroll}
          data-lenis-prevent
          className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-hide relative z-10 overscroll-contain"
        >
          {activeTab === 'guide' && tool.detailedReport && (
            <div className="space-y-8 pb-8">
              {/* Legal Warning */}
              <div className="p-4 bg-[rgba(255,45,45,0.1)] border border-[rgba(255,45,45,0.3)] rounded-lg animate-pulse-subtle">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#FF2D2D] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#FF2D2D] mb-1 font-mono uppercase tracking-widest">
                      [CRITICAL_LEGAL_WARNING]
                    </h4>
                    <p className="text-sm text-[#F2F5F9]/80 leading-relaxed italic">
                      {tool.detailedReport.legalWarning}
                    </p>
                  </div>
                </div>
              </div>

              {/* Why This Tool */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#F2F5F9] border-l-4 border-[#39FF14] pl-3">
                  Why {tool.name}?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tool.detailedReport.whyThisTool.map((reason, idx) => (
                    <div key={idx} className="p-4 bg-[rgba(243,245,249,0.03)] border border-[rgba(243,245,249,0.08)] rounded hover:border-[rgba(57,255,20,0.3)] transition-colors group">
                      <div className="flex gap-3">
                        <Check className="w-4 h-4 text-[#39FF14] mt-1 shrink-0 group-hover:scale-110 transition-transform" />
                        <p className="text-sm text-[#A7B0BC]">{reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step by Step */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#F2F5F9] border-l-4 border-[#00F0FF] pl-3">
                  Tactical Walkthrough
                </h3>
                <div className="relative space-y-4">
                  {/* Vertical Line */}
                  <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-[rgba(0,240,255,0.15)]" />
                  
                  {tool.detailedReport.stepByStep.map((step) => (
                    <div key={step.step} className="relative flex gap-3 md:gap-6 group">
                      <div className="z-10 w-10 h-10 rounded-full bg-[#05060B] border-2 border-[rgba(0,240,255,0.3)] flex items-center justify-center font-mono text-sm text-[#00F0FF] group-hover:border-[#00F0FF] transition-colors shrink-0">
                        {step.step}
                      </div>
                      <div className="flex-1 pt-1">
                        <h4 className="text-[#F2F5F9] font-bold mb-1">{step.title}</h4>
                        <p className="text-sm text-[#A7B0BC] mb-3 leading-relaxed">
                          {step.description}
                        </p>
                        {step.code && (
                          <div className="bg-[#05060B] p-3 rounded border border-[rgba(243,245,249,0.05)] font-mono text-xs text-[#00F0FF] overflow-x-auto whitespace-pre-wrap break-all">
                            {step.code}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTF Tips */}
              <div className="p-4 md:p-6 bg-gradient-to-br from-[rgba(57,255,20,0.05)] to-transparent border border-[rgba(57,255,20,0.2)] rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Target className="w-24 h-24 text-[#39FF14]" />
                </div>
                <h3 className="text-lg font-bold text-[#39FF14] flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5" />
                  CTF TACTICS & TIPS
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                  {tool.detailedReport.ctfTips.map((tip, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-[#A7B0BC]">
                      <span className="text-[#39FF14] font-bold">»</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Use Cases */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#F2F5F9] border-l-4 border-[#FFE600] pl-3">
                  Operational Use Cases
                </h3>
                <div className="space-y-3">
                  {tool.detailedReport.useCases.map((uc, idx) => (
                    <div key={idx} className="p-4 bg-[rgba(243,245,249,0.02)] border border-[rgba(243,245,249,0.05)] rounded-lg hover:bg-[rgba(255,230,0,0.02)] hover:border-[rgba(255,230,0,0.2)] transition-all">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <h4 className="font-bold text-[#F2F5F9]">{uc.title}</h4>
                        <div className="self-start sm:self-auto px-2 py-0.5 rounded text-[10px] font-mono bg-[rgba(255,230,0,0.1)] text-[#FFE600] border border-[rgba(255,230,0,0.2)] uppercase">
                          SCENARIO_{idx + 1}
                        </div>
                      </div>
                      <p className="text-sm text-[#A7B0BC] mb-4">{uc.context}</p>
                      <div className="space-y-1.5">
                        {uc.commands.map((cmd, cIdx) => (
                          <div key={cIdx} className="flex items-center gap-2 bg-[#05060B] px-3 py-2 rounded font-mono text-xs text-[#00F0FF] overflow-x-auto whitespace-pre-wrap break-all">
                            <span className="text-gray-600">$</span> {cmd}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'commands' && (
            <div className="space-y-8">
              {/* Interactive Builders */}
              {tool.interactiveCommands && tool.interactiveCommands.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-[#F2F5F9] flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-[#00F0FF]" />
                    Interactive Command Builders
                  </h3>
                  {tool.interactiveCommands.map((interactiveCmd, index) => (
                    <InteractiveCommandBuilder key={index} command={interactiveCmd} onCloseModal={onClose} />
                  ))}
                </div>
              )}

              {/* Static Commands */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#F2F5F9] flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#39FF14]" />
                  Essential Commands
                </h3>
                
                <div className="space-y-3">
                {tool.commands.map((cmd, index) => (
                  <div
                    key={index}
                    className="cyber-panel p-4 group hover:border-[rgba(57,255,20,0.4)] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <code className="text-xs md:text-sm font-mono text-[#00F0FF] block mb-2 overflow-x-auto whitespace-pre-wrap break-all">
                          {cmd.command}
                        </code>
                        <p className="text-sm text-[#A7B0BC]">{cmd.description}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => runInTerminal(cmd.command, { onCloseModal: onClose })}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-medium rounded bg-[rgba(57,255,20,0.12)] text-[#39FF14] border border-[rgba(57,255,20,0.3)] hover:bg-[rgba(57,255,20,0.22)] hover:border-[#39FF14] hover:shadow-[0_0_12px_rgba(57,255,20,0.25)] transition-all cursor-pointer"
                          title="Run live in Terminal"
                        >
                          <Play className="w-3 h-3 fill-[#39FF14]" />
                          <span className="hidden sm:inline">Run</span>
                        </button>
                        <button
                          onClick={() => copyToClipboard(cmd.command, `cmd-${index}`)}
                          className="p-2 text-[#A7B0BC] hover:text-[#39FF14] transition-colors"
                          title="Copy command"
                        >
                          {copiedCommand === `cmd-${index}` ? (
                            <Check className="w-4 h-4 text-[#39FF14]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Common Flags */}
              {tool.commonFlags && tool.commonFlags.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-mono uppercase tracking-wider text-[#A7B0BC] mb-3">
                    Common Flags
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tool.commonFlags.map((flag, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-[rgba(57,255,20,0.05)] rounded border border-[rgba(57,255,20,0.1)]"
                      >
                        <code className="text-sm font-mono text-[#39FF14] whitespace-nowrap">
                          {flag.flag}
                        </code>
                        <span className="text-sm text-[#A7B0BC]">{flag.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* When to Use */}
              <div>
                <h3 className="text-lg font-bold text-[#F2F5F9] flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-[#39FF14]" />
                  When to Use
                </h3>
                <ul className="space-y-2">
                  {tool.whenToUse.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-sm text-[#A7B0BC]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] mt-1.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related Tools */}
              {tool.relatedTools && tool.relatedTools.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-[#F2F5F9] mb-3">Related Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {tool.relatedTools.map((relatedTool) => (
                      <span
                        key={relatedTool}
                        className="px-3 py-1.5 text-sm font-mono text-[#A7B0BC] bg-[#0B0E16] rounded border border-[rgba(243,245,249,0.08)] hover:border-[rgba(57,255,20,0.3)] hover:text-[#39FF14] transition-colors cursor-pointer"
                      >
                        {relatedTool}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Website */}
              {tool.website && (
                <div>
                  <h3 className="text-lg font-bold text-[#F2F5F9] mb-3">Official Website</h3>
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[#00F0FF] hover:text-[#39FF14] transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {tool.website}
                  </a>
                </div>
              )}

              {/* Installation */}
              {tool.installation && (
                <div>
                  <h3 className="text-lg font-bold text-[#F2F5F9] mb-3">Installation</h3>
                  <code className="block p-3 bg-[#05060B] rounded text-xs md:text-sm font-mono text-[#F2F5F9] overflow-x-auto whitespace-pre-wrap break-all">
                    {tool.installation}
                  </code>
                </div>
              )}
            </div>
          )}

          {activeTab === 'examples' && (
            <div className="space-y-6">
              {/* Output Example */}
              {tool.outputExample && tool.outputExample.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-[#F2F5F9] flex items-center gap-2 mb-3">
                    <Terminal className="w-5 h-5 text-[#39FF14]" />
                    Sample Output
                  </h3>
                  <div className="cyber-panel p-4 bg-[#05060B] font-mono text-xs overflow-x-auto">
                    <pre className="text-[#A7B0BC]">
                      {tool.outputExample.join('\n')}
                    </pre>
                  </div>
                </div>
              )}

              {/* Warning */}
              <div className="p-4 bg-[rgba(255,45,45,0.1)] border border-[rgba(255,45,45,0.3)] rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#FF2D2D] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#FF2D2D] mb-1">Legal Notice</h4>
                    <p className="text-sm text-[#A7B0BC]">
                      This tool should only be used on systems you own or have explicit written 
                      permission to test. Unauthorized access to computer systems is illegal 
                      under various laws including the Computer Fraud and Abuse Act (CFAA).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scroll Indicator Fade */}
        <div 
          className={`absolute bottom-[57px] md:bottom-[61px] left-0 right-0 h-16 bg-gradient-to-t from-[#05060B] to-transparent pointer-events-none flex items-end justify-center pb-2 transition-opacity duration-300 ${
            (canScroll && !hasScrolled) ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <span className="text-[#39FF14] text-[10px] font-mono uppercase tracking-widest animate-bounce flex flex-col items-center gap-1 opacity-70">
            Scroll for more
            <ArrowDown className="w-3 h-3" />
          </span>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[rgba(243,245,249,0.08)] flex items-center justify-between gap-2 flex-wrap md:flex-nowrap shrink-0">
          <span className="text-xs font-mono text-[#A7B0BC]">
            Category: <span className="text-[#39FF14]">{tool.category}</span>
          </span>
          <button
            onClick={onClose}
            className="cyber-btn text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolDetailModal;
