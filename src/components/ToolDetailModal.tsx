import { useState, useEffect } from 'react';
import { X, Copy, Check, Terminal, ExternalLink, BookOpen, AlertTriangle, Zap, Target } from 'lucide-react';
import type { Tool } from '../data/kaliTools';

interface ToolDetailModalProps {
  tool: Tool | null;
  isOpen: boolean;
  onClose: () => void;
}

const ToolDetailModal = ({ tool, isOpen, onClose }: ToolDetailModalProps) => {
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'commands' | 'info' | 'examples'>('commands');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#05060B]/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] cyber-panel overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[rgba(243,245,249,0.08)]">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-[#F2F5F9]">{tool.name}</h2>
              <span className={`px-2 py-1 text-xs font-mono uppercase rounded border ${getDifficultyColor(tool.difficulty)}`}>
                {tool.difficulty}
              </span>
            </div>
            <p className="text-[#A7B0BC] text-sm">{tool.description}</p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {tool.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-[#A7B0BC] hover:text-[#FF2D2D] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[rgba(243,245,249,0.08)]">
          {[
            { id: 'commands', label: 'Commands', icon: Terminal },
            { id: 'info', label: 'Information', icon: BookOpen },
            { id: 'examples', label: 'Examples', icon: Target },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-mono uppercase tracking-wider transition-all ${
                  activeTab === tab.id
                    ? 'text-[#39FF14] border-b-2 border-[#39FF14] bg-[rgba(57,255,20,0.05)]'
                    : 'text-[#A7B0BC] hover:text-[#F2F5F9]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'commands' && (
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
                        <code className="text-sm font-mono text-[#00F0FF] block mb-2">
                          {cmd.command}
                        </code>
                        <p className="text-sm text-[#A7B0BC]">{cmd.description}</p>
                      </div>
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
                  <code className="block p-3 bg-[#05060B] rounded text-sm font-mono text-[#F2F5F9]">
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

        {/* Footer */}
        <div className="p-4 border-t border-[rgba(243,245,249,0.08)] flex items-center justify-between">
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
