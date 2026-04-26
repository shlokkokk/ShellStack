import { useState, useEffect } from 'react';
import { X, BookOpen, Terminal, Shield, CheckCircle, AlertTriangle, ChevronRight, ChevronDown, ArrowRight, Target } from 'lucide-react';
import type { Module } from '../data/cehModules';
import { tools, type Tool } from '../data/kaliTools';
import ToolDetailModal from './ToolDetailModal';
import { CIATriadDeepDive } from './CIATriadDeepDive';


interface ModuleDetailModalProps {
  module: Module | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModuleDetailModal = ({ module, isOpen, onClose }: ModuleDetailModalProps) => {
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<'topics' | 'tools' | 'countermeasures' | 'exam-tips' | 'scenarios'>('topics');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [showCIADeepDive, setShowCIADeepDive] = useState(false);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }

    return () => {
      // Check if any other modals are still open before removing the class
      const activeModals = document.querySelectorAll('[data-modal-open="true"]');
      if (activeModals.length <= 1) {
        document.body.classList.remove('no-scroll');
      }
    };
  }, [isOpen]);

  // Handle module-specific side effects
  useEffect(() => {
    if (isOpen && module && module.topics.length > 0) {
      setExpandedTopics([module.topics[0].id]);
    }
  }, [isOpen, module?.id]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen || !module) return null;

  const toggleTopic = (topicId: string) => {
    setExpandedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      data-modal-open="true"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#05060B]/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] cyber-panel overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Subtle Background Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0 bg-[#39FF14]/5" />
        </div>
        
        {/* Header */}
        <div className="relative z-10 flex items-start justify-between p-8 border-b border-[rgba(57,255,20,0.1)]">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <div className="px-3 py-1 bg-[rgba(57,255,20,0.1)] border border-[#39FF14]/30 rounded text-[#39FF14] font-mono text-xs tracking-tighter animate-pulse-subtle">
                ID: {module.number} / INTEL_LVL_9
              </div>
              <h2 className="text-3xl font-bold text-[#F2F5F9] tracking-tight text-glow-green italic">{module.title}</h2>
            </div>
            <p className="text-[#A7B0BC] text-sm mb-3">{module.description}</p>
            
            {/* Stats & Prerequisites */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 px-2 py-1 bg-[rgba(0,240,255,0.1)] text-[#00F0FF] rounded border border-[rgba(0,240,255,0.2)]">
                  <Shield className="w-3 h-3" />
                  Exam Weight: {module.examWeight}
                </span>
                <span className="flex items-center gap-1.5 px-2 py-1 bg-[rgba(57,255,20,0.1)] text-[#39FF14] rounded border border-[rgba(57,255,20,0.2)]">
                  <BookOpen className="w-3 h-3" />
                  ~{module.estimatedQuestions} Questions
                </span>
                <span className="flex items-center gap-1.5 px-2 py-1 bg-[rgba(255,230,0,0.1)] text-[#FFE600] rounded border border-[rgba(255,230,0,0.2)]">
                  <Terminal className="w-3 h-3" />
                  {module.duration}
                </span>
              </div>
              
              {module.prerequisites && module.prerequisites.length > 0 && (
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-[#A7B0BC]">Prerequisites:</span>
                  <div className="flex flex-wrap gap-2">
                    {module.prerequisites.map((prereq, idx) => (
                      <span key={idx} className="text-[#FF2D2D] bg-[rgba(255,45,45,0.1)] px-2 py-0.5 rounded border border-[rgba(255,45,45,0.2)]">
                        {prereq}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-[#A7B0BC] hover:text-[#FF2D2D] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tactical Control Bar */}
        <div className="relative z-20 flex border-y border-[rgba(57,255,20,0.1)] bg-[#05060B]">
          <div className="flex flex-1 overflow-x-auto scrollbar-hide">
            {[
              { id: 'topics', label: 'Topics', icon: BookOpen },
              { id: 'tools', label: 'Key Tools', icon: Terminal },
              { id: 'countermeasures', label: 'Countermeasures', icon: Shield },
              { id: 'exam-tips', label: 'Exam Tips', icon: CheckCircle },
              { id: 'scenarios', label: 'Scenarios', icon: AlertTriangle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`relative flex items-center gap-3 px-6 py-4 transition-all duration-300 whitespace-nowrap group border-r border-[rgba(57,255,20,0.05)] ${
                    isActive
                      ? 'bg-[rgba(57,255,20,0.08)] text-[#39FF14]'
                      : 'text-[#A7B0BC] hover:text-[#F2F5F9] hover:bg-[rgba(255,255,255,0.01)]'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-all duration-300 ${
                    isActive ? 'scale-110 text-[#39FF14] drop-shadow-[0_0_8px_rgba(57,255,20,0.6)]' : 'opacity-70 group-hover:opacity-100'
                  }`} />
                  
                  <span className={`text-[11px] font-mono uppercase tracking-[0.2em] relative z-10 ${
                    isActive ? 'font-bold' : 'font-medium'
                  }`}>
                    {tab.label}
                  </span>
                  
                  {/* Active Indicator Bar */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Section with custom scrollbar */}
        <div className="flex-1 overflow-y-auto p-8 cyber-scrollbar relative z-10">
          {activeSection === 'topics' && (
            <div className="space-y-6">
              <h3 className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.4em] text-[#39FF14] mb-8 opacity-70">
                <div className="w-8 h-[1px] bg-[#39FF14]/30" />
                <BookOpen className="w-4 h-4" />
                INTEL_DATABASE / {module.topics.length} CLASSIFIED_ENTRIES
              </h3>
              
              <div className="space-y-3">
                {module.topics.map((topic, index) => {
                  const isExpanded = expandedTopics.includes(topic.id);
                  return (
                    <div
                      key={topic.id}
                      className="pixel-border bg-[rgba(10,15,29,0.6)] overflow-hidden transition-all duration-500 hover:border-glow-green"
                    >
                      <button
                        onClick={() => toggleTopic(topic.id)}
                        className={`w-full flex items-center justify-between p-5 text-left transition-all duration-500 ${
                          isExpanded ? 'bg-[rgba(57,255,20,0.08)]' : 'hover:bg-[rgba(57,255,20,0.03)]'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className={`w-8 h-8 flex items-center justify-center text-xs font-mono transition-colors duration-500 ${
                            isExpanded ? 'bg-[#39FF14] text-[#020617]' : 'bg-[rgba(57,255,20,0.1)] text-[#39FF14]'
                          } rounded`}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className={`font-bold tracking-tight transition-colors duration-500 ${
                            isExpanded ? 'text-[#39FF14] text-glow-green' : 'text-[#F2F5F9]'
                          }`}>{topic.title}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-[#39FF14]" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-[#A7B0BC]" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-[rgba(243,245,249,0.05)]">
                          <div className="pt-4 space-y-4">
                            <p className="text-sm text-[#A7B0BC] leading-relaxed">
                              {topic.content}
                            </p>
                            
                            {/* Deep Dive Button for CIA Triad */}
                            {(topic.title.toLowerCase().includes('cia triad') || 
                              topic.content.toLowerCase().includes('cia triad') ||
                              topic.keyPoints?.some(kp => kp.toLowerCase().includes('cia triad'))) && (
                              <div className="mt-4 p-4 bg-[rgba(57,255,20,0.03)] border border-[rgba(57,255,20,0.1)] rounded-lg flex items-center justify-between group/cia transition-all hover:border-[rgba(57,255,20,0.3)]">
                                <div className="flex items-center gap-3">
                                  <Shield className="w-5 h-5 text-[#39FF14]" />
                                  <div>
                                    <span className="text-[#F2F5F9] text-sm font-bold block">CIA Triad Concept</span>
                                    <span className="text-[#A7B0BC] text-xs">Learn more about the core security pillars</span>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowCIADeepDive(true);
                                  }}
                                  className="px-4 py-2 bg-[#39FF14]/10 hover:bg-[#39FF14]/20 border border-[#39FF14]/30 rounded font-mono text-xs text-[#39FF14] transition-all flex items-center gap-2"
                                >
                                  Read More
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            )}

                            {/* Key Points */}
                            {topic.keyPoints && topic.keyPoints.length > 0 && (
                              <div className="mt-6">
                                <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#39FF14] mb-3">
                                  <Target className="w-4 h-4" />
                                  Key Intelligence
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {topic.keyPoints.map((point, idx) => {
                                    const parts = point.split(':');
                                    const hasTerm = parts.length > 1 && parts[0].length < 45 && !point.startsWith('http');
                                    
                                    return (
                                      <div
                                        key={idx}
                                        className="relative flex items-start gap-3 p-4 bg-[#05060B] border border-[rgba(243,245,249,0.05)] rounded-lg group hover:border-[#39FF14]/30 hover:bg-[rgba(57,255,20,0.02)] transition-all overflow-hidden"
                                      >
                                        <div className="absolute top-0 left-0 w-1 h-full bg-[rgba(57,255,20,0.2)] group-hover:bg-[#39FF14] transition-colors" />
                                        
                                        <div className="text-[10px] font-mono text-[#39FF14] mt-0.5 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                                          [{String(idx + 1).padStart(2, '0')}]
                                        </div>
                                        
                                        <div className="text-sm text-[#A7B0BC] leading-relaxed">
                                          {hasTerm ? (
                                            <>
                                              <span className="text-[#F2F5F9] font-bold block mb-1 text-xs font-mono uppercase tracking-wide">
                                                {parts[0]}
                                              </span>
                                              <span className="text-[#A7B0BC]/90">
                                                {parts.slice(1).join(':').trim()}
                                              </span>
                                            </>
                                          ) : (
                                            <span className="text-[#A7B0BC]/90">{point}</span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                            
                            {/* Commands */}
                            {topic.commands && topic.commands.length > 0 && (
                              <div className="mt-6">
                                <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#00F0FF] mb-3">
                                  <Terminal className="w-4 h-4" />
                                  Tactical Commands
                                </h4>
                                <div className="space-y-3">
                                  {topic.commands.map((cmd, idx) => {
                                    const matchedTool = tools.find(t => 
                                      cmd.command.toLowerCase().startsWith(t.id.toLowerCase()) || 
                                      cmd.command.toLowerCase().startsWith(t.name.toLowerCase())
                                    );

                                    return (
                                      <div
                                        key={idx}
                                        className="relative p-4 bg-[#05060B] rounded-lg border border-[rgba(0,240,255,0.1)] hover:border-[rgba(0,240,255,0.3)] transition-colors flex flex-col gap-3 group"
                                      >
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00F0FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                                        
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                          <code className="text-sm font-mono text-[#00F0FF] bg-[rgba(0,240,255,0.05)] px-3 py-1.5 rounded flex-1 border border-[rgba(0,240,255,0.1)]">
                                            <span className="text-gray-500 mr-2 select-none">$</span>
                                            {cmd.command}
                                          </code>
                                        </div>
                                        
                                        <div className="text-sm text-[#A7B0BC] pl-1">
                                          {cmd.description}
                                        </div>
                                        
                                        {matchedTool && (
                                          <div className="mt-1 pt-3 border-t border-[rgba(243,245,249,0.05)]">
                                            <button 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedTool(matchedTool);
                                              }}
                                              className="flex items-center gap-2 text-xs font-mono text-[#00F0FF] hover:text-[#F2F5F9] hover:bg-[rgba(0,240,255,0.1)] px-3 py-1.5 rounded transition-all"
                                            >
                                              <BookOpen className="w-3.5 h-3.5" />
                                              Analyze {matchedTool.name} Documentation
                                              <ArrowRight className="w-3 h-3 ml-auto opacity-50 group-hover:opacity-100" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Common Ports */}
              {module.commonPorts && module.commonPorts.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-bold text-[#F2F5F9] mb-4">Common Ports</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[rgba(243,245,249,0.1)]">
                          <th className="text-left py-2 px-3 text-[#A7B0BC] font-mono">Port</th>
                          <th className="text-left py-2 px-3 text-[#A7B0BC] font-mono">Protocol</th>
                          <th className="text-left py-2 px-3 text-[#A7B0BC] font-mono">Service</th>
                          <th className="text-left py-2 px-3 text-[#A7B0BC] font-mono">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {module.commonPorts.map((port, idx) => (
                          <tr key={idx} className="border-b border-[rgba(243,245,249,0.05)]">
                            <td className="py-2 px-3 font-mono text-[#39FF14]">{port.port}</td>
                            <td className="py-2 px-3 text-[#A7B0BC]">{port.protocol}</td>
                            <td className="py-2 px-3 text-[#F2F5F9]">{port.service}</td>
                            <td className="py-2 px-3 text-[#A7B0BC]">{port.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === 'tools' && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#A7B0BC] mb-6">
                <Terminal className="w-4 h-4 text-[#39FF14]" />
                Primary Tactical Tools / Registry
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {module.keyTools.map((toolName, index) => {
                  const matchedTool = tools.find(t => 
                    t.name.toLowerCase() === toolName.toLowerCase() || 
                    t.id.toLowerCase() === toolName.toLowerCase()
                  );

                  if (matchedTool) {
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedTool(matchedTool)}
                        className="flex flex-col gap-3 p-5 cyber-panel hover:border-[rgba(57,255,20,0.4)] transition-all cursor-pointer group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 flex shrink-0 items-center justify-center bg-[rgba(57,255,20,0.1)] rounded-lg border border-[rgba(57,255,20,0.2)] group-hover:bg-[rgba(57,255,20,0.15)] transition-colors">
                            <Terminal className="w-5 h-5 text-[#39FF14]" />
                          </div>
                          <div>
                            <span className="font-bold text-[#F2F5F9] group-hover:text-[#39FF14] transition-colors block mb-1">
                              {matchedTool.name}
                            </span>
                            <span className="text-xs text-[#A7B0BC] line-clamp-2">
                              {matchedTool.description}
                            </span>
                          </div>
                        </div>
                        <div className="mt-auto self-end">
                          <span className="flex items-center gap-1 text-xs font-mono text-[#39FF14] opacity-0 group-hover:opacity-100 transition-opacity">
                            View Docs <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // Fallback for tools not in DB yet
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 cyber-panel border-[rgba(243,245,249,0.08)] opacity-75"
                    >
                      <div className="w-10 h-10 flex shrink-0 items-center justify-center bg-[#05060B] rounded-lg border border-[rgba(243,245,249,0.1)]">
                        <Terminal className="w-5 h-5 text-[#A7B0BC]" />
                      </div>
                      <span className="font-mono text-[#A7B0BC]">
                        {toolName}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeSection === 'countermeasures' && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#A7B0BC] mb-6">
                <Shield className="w-4 h-4 text-[#39FF14]" />
                Defensive Protocols & Countermeasures
              </h3>
              
              <div className="space-y-3">
                {module.countermeasures.map((measure, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 cyber-panel"
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-[rgba(57,255,20,0.1)] rounded flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-[#39FF14]" />
                    </div>
                    <span className="text-[#A7B0BC]">{measure}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-[rgba(255,45,45,0.1)] border border-[rgba(255,45,45,0.3)] rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#FF2D2D] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-[#FF2D2D] mb-1">Important Note</h4>
                    <p className="text-sm text-[#A7B0BC]">
                      Understanding countermeasures is crucial for the CEH exam. 
                      You must know both how to attack and how to defend against 
                      each type of attack.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'exam-tips' && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#A7B0BC] mb-6">
                <CheckCircle className="w-4 h-4 text-[#39FF14]" />
                ANSI/CEH Examination Intelligence
              </h3>
              
              <div className="space-y-3">
                {module.examTips && module.examTips.length > 0 ? (
                  module.examTips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-[#05060B] border border-[rgba(57,255,20,0.2)] rounded-lg"
                    >
                      <div className="text-[#39FF14] font-bold font-mono mt-0.5">
                        TIP #{index + 1}
                      </div>
                      <span className="text-[#F2F5F9]">{tip}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[#A7B0BC]">No specific exam tips available yet.</p>
                )}
              </div>
            </div>
          )}

          {activeSection === 'scenarios' && (
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-[#A7B0BC] mb-6">
                <AlertTriangle className="w-4 h-4 text-[#FFE600]" />
                Operational Field Scenarios / Simulation
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {module.realWorldScenarios && module.realWorldScenarios.length > 0 ? (
                  module.realWorldScenarios.map((scenario, index) => (
                    <div
                      key={index}
                      className="p-5 cyber-panel border-l-4 border-l-[#FFE600]"
                    >
                      <h4 className="text-[#FFE600] font-bold font-mono mb-2 uppercase text-sm">
                        Scenario Alpha-{index + 1}
                      </h4>
                      <p className="text-[#A7B0BC] leading-relaxed">
                        {scenario}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#A7B0BC]">No scenarios available for this module yet.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[rgba(243,245,249,0.08)] flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-mono text-[#A7B0BC]">
            <span>{module.topics.length} Topics</span>
            <span>•</span>
            <span>{module.keyTools.length} Tools</span>
            <span>•</span>
            <span>{module.countermeasures.length} Countermeasures</span>
          </div>
          <button onClick={onClose} className="cyber-btn text-xs">
            Close
          </button>
        </div>

        {/* CIA Triad Deep Dive Overlay */}
        {showCIADeepDive && (
          <CIATriadDeepDive onClose={() => setShowCIADeepDive(false)} />
        )}

        {/* Nested Tool Modal */}
        {selectedTool && (
          <ToolDetailModal
            tool={selectedTool}
            isOpen={!!selectedTool}
            onClose={() => setSelectedTool(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ModuleDetailModal;
