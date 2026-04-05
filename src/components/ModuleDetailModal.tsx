import { useState, useEffect } from 'react';
import { X, BookOpen, Terminal, Shield, CheckCircle, AlertTriangle, ChevronRight, ChevronDown } from 'lucide-react';
import type { Module } from '../data/cehModules';

interface ModuleDetailModalProps {
  module: Module | null;
  isOpen: boolean;
  onClose: () => void;
}

const ModuleDetailModal = ({ module, isOpen, onClose }: ModuleDetailModalProps) => {
  const [expandedTopics, setExpandedTopics] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<'topics' | 'tools' | 'countermeasures'>('topics');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Expand first topic by default
      if (module && module.topics.length > 0) {
        setExpandedTopics([module.topics[0].id]);
      }
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, module]);

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#05060B]/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] cyber-panel overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[rgba(243,245,249,0.08)] bg-gradient-to-r from-[#0B0E16] to-transparent">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold font-mono text-[#39FF14]">
                {module.number}
              </span>
              <h2 className="text-2xl font-bold text-[#F2F5F9]">{module.title}</h2>
            </div>
            <p className="text-[#A7B0BC] text-sm mb-3">{module.description}</p>
            
            {/* Stats */}
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
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-[#A7B0BC] hover:text-[#FF2D2D] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[rgba(243,245,249,0.08)]">
          {[
            { id: 'topics', label: 'Topics', icon: BookOpen },
            { id: 'tools', label: 'Key Tools', icon: Terminal },
            { id: 'countermeasures', label: 'Countermeasures', icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 text-sm font-mono uppercase tracking-wider transition-all ${
                  activeSection === tab.id
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
          {activeSection === 'topics' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#F2F5F9] flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-[#39FF14]" />
                Module Topics ({module.topics.length})
              </h3>
              
              <div className="space-y-3">
                {module.topics.map((topic, index) => {
                  const isExpanded = expandedTopics.includes(topic.id);
                  return (
                    <div
                      key={topic.id}
                      className="cyber-panel overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => toggleTopic(topic.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-[rgba(57,255,20,0.03)] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 flex items-center justify-center text-xs font-mono text-[#39FF14] bg-[rgba(57,255,20,0.1)] rounded">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-[#F2F5F9]">{topic.title}</span>
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
                            
                            {/* Key Points */}
                            {topic.keyPoints && topic.keyPoints.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-xs font-mono uppercase tracking-wider text-[#39FF14] mb-2">
                                  Key Points
                                </h4>
                                <ul className="space-y-2">
                                  {topic.keyPoints.map((point, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-2 text-sm text-[#A7B0BC]"
                                    >
                                      <CheckCircle className="w-4 h-4 text-[#39FF14] mt-0.5 flex-shrink-0" />
                                      {point}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* Commands */}
                            {topic.commands && topic.commands.length > 0 && (
                              <div className="mt-4">
                                <h4 className="text-xs font-mono uppercase tracking-wider text-[#00F0FF] mb-2">
                                  Commands
                                </h4>
                                <div className="space-y-2">
                                  {topic.commands.map((cmd, idx) => (
                                    <div
                                      key={idx}
                                      className="p-3 bg-[#05060B] rounded border-l-2 border-[#00F0FF]"
                                    >
                                      <code className="text-sm font-mono text-[#00F0FF] block mb-1">
                                        {cmd.command}
                                      </code>
                                      <span className="text-xs text-[#A7B0BC]">
                                        {cmd.description}
                                      </span>
                                    </div>
                                  ))}
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
              <h3 className="text-lg font-bold text-[#F2F5F9] flex items-center gap-2 mb-4">
                <Terminal className="w-5 h-5 text-[#39FF14]" />
                Key Tools for This Module
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {module.keyTools.map((tool, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 cyber-panel hover:border-[rgba(57,255,20,0.4)] transition-colors cursor-pointer group"
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-[rgba(57,255,20,0.1)] rounded-lg border border-[rgba(57,255,20,0.2)] group-hover:bg-[rgba(57,255,20,0.15)] transition-colors">
                      <Terminal className="w-5 h-5 text-[#39FF14]" />
                    </div>
                    <span className="font-mono text-[#F2F5F9] group-hover:text-[#39FF14] transition-colors">
                      {tool}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'countermeasures' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#F2F5F9] flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-[#39FF14]" />
                Security Countermeasures
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
      </div>
    </div>
  );
};

export default ModuleDetailModal;
