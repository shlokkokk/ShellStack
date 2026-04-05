import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Clock, GraduationCap, Play, CheckCircle } from 'lucide-react';
import { cehModules } from '../data/cehModules';

gsap.registerPlugin(ScrollTrigger);

interface CEHModulesProps {
  onModuleSelect: (moduleId: string) => void;
}

const CEHModules = ({ onModuleSelect }: CEHModulesProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [studyMode, setStudyMode] = useState(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const header = headerRef.current;
    const scrollContainer = scrollContainerRef.current;

    if (!section || !header || !scrollContainer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        header,
        { opacity: 0, y: 30 },
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

      const cards = scrollContainer.querySelectorAll('.module-card');
      gsap.fromTo(
        cards,
        { opacity: 0, x: 60, rotateY: 10 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: scrollContainer,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // Load completed modules from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ceh_completed_modules');
    if (saved) {
      setCompletedModules(JSON.parse(saved));
    }
  }, []);

  const toggleComplete = (moduleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newCompleted = completedModules.includes(moduleId)
      ? completedModules.filter(id => id !== moduleId)
      : [...completedModules, moduleId];
    setCompletedModules(newCompleted);
    localStorage.setItem('ceh_completed_modules', JSON.stringify(newCompleted));
  };

  const getProgress = () => {
    return Math.round((completedModules.length / cehModules.length) * 100);
  };

  return (
    <section
      ref={sectionRef}
      id="ceh-modules"
      className="relative w-full py-20 lg:py-28"
    >
      <div className="w-full">
        {/* Header */}
        <div ref={headerRef} className="px-6 lg:px-12 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="w-5 h-5 text-[#39FF14]" />
                <span className="text-xs font-mono text-[#39FF14] uppercase tracking-wider">
                  Certification Prep
                </span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#F2F5F9] mb-3">
                CEH <span className="text-[#39FF14]">MODULES</span>
              </h2>
              <p className="text-lg text-[#A7B0BC]">
                Navigate all {cehModules.length} exam domains. Master the CEH v13 curriculum.
              </p>
            </div>

            {/* Study Mode Toggle & Progress */}
            <div className="flex flex-col items-end gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#A7B0BC]">Study Mode</span>
                <button
                  onClick={() => setStudyMode(!studyMode)}
                  className={`relative w-14 h-7 rounded-full border transition-all duration-300 ${
                    studyMode
                      ? 'bg-[rgba(57,255,20,0.2)] border-[rgba(57,255,20,0.5)]'
                      : 'bg-[#0B0E16] border-[rgba(243,245,249,0.08)]'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 rounded-full transition-all duration-300 ${
                      studyMode
                        ? 'left-8 bg-[#39FF14]'
                        : 'left-1 bg-[#A7B0BC]'
                    }`}
                  />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="w-48">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#A7B0BC]">Progress</span>
                  <span className="text-[#39FF14]">{getProgress()}%</span>
                </div>
                <div className="h-2 bg-[rgba(243,245,249,0.05)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#39FF14] to-[#00F0FF] rounded-full transition-all duration-500"
                    style={{ width: `${getProgress()}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Exam Info Bar */}
          <div className="mt-8 flex flex-wrap gap-6 py-4 border-y border-[rgba(243,245,249,0.08)]">
            {[
              { label: 'Exam Code', value: '312-50' },
              { label: 'Questions', value: '125' },
              { label: 'Duration', value: '4 hours' },
              { label: 'Passing Score', value: '60-85%' },
              { label: 'Format', value: 'Multiple Choice' },
            ].map((info) => (
              <div key={info.label} className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#A7B0BC]">
                  {info.label}:
                </span>
                <span className="text-sm font-mono text-[#F2F5F9]">
                  {info.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-6 scrollbar-hide"
        >
          <div className="flex gap-4 lg:gap-5 px-6 lg:px-12" style={{ width: 'max-content' }}>
            {cehModules.map((module) => {
              const isCompleted = completedModules.includes(module.id);
              
              return (
                <div
                  key={module.id}
                  onClick={() => onModuleSelect(module.id)}
                  className={`module-card w-[320px] lg:w-[360px] cyber-panel p-5 lg:p-6 flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 ${
                    isCompleted
                      ? 'border-[rgba(57,255,20,0.5)]'
                      : 'hover:border-[rgba(57,255,20,0.65)]'
                  }`}
                  style={{ perspective: '1000px' }}
                >
                  {/* Module Number & Weight */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold font-mono text-[#39FF14]">
                        {module.number}
                      </span>
                      {isCompleted && (
                        <CheckCircle className="w-5 h-5 text-[#39FF14]" />
                      )}
                    </div>
                    <span className="px-2 py-1 text-xs font-mono text-[#00F0FF] bg-[rgba(0,240,255,0.1)] rounded border border-[rgba(0,240,255,0.2)]">
                      {module.examWeight}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#F2F5F9] mb-2 group-hover:text-[#39FF14] transition-colors duration-300 line-clamp-2">
                    {module.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-[#A7B0BC] mb-4 line-clamp-2 flex-1">
                    {module.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs font-mono text-[#A7B0BC] mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {module.topics.length} topics
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {module.duration}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#A7B0BC]">Progress</span>
                      <span className={isCompleted ? 'text-[#39FF14]' : 'text-[#A7B0BC]'}>
                        {isCompleted ? 'Completed' : 'Not Started'}
                      </span>
                    </div>
                    <div className="h-1 bg-[rgba(243,245,249,0.05)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-[#39FF14] w-full' : 'bg-[#A7B0BC] w-0'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onModuleSelect(module.id);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-[rgba(57,255,20,0.1)] text-[#39FF14] rounded border border-[rgba(57,255,20,0.3)] hover:bg-[rgba(57,255,20,0.2)] transition-colors text-sm font-mono"
                    >
                      <Play className="w-4 h-4" />
                      Start
                    </button>
                    
                    {studyMode && (
                      <button
                        onClick={(e) => toggleComplete(module.id, e)}
                        className={`p-2 rounded border transition-colors ${
                          isCompleted
                            ? 'bg-[rgba(57,255,20,0.2)] border-[rgba(57,255,20,0.5)] text-[#39FF14]'
                            : 'bg-[#0B0E16] border-[rgba(243,245,249,0.08)] text-[#A7B0BC] hover:border-[rgba(57,255,20,0.3)]'
                        }`}
                        title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="px-6 lg:px-12 mt-4 flex items-center justify-between">
          <p className="text-xs font-mono text-[#A7B0BC]/60 flex items-center gap-2">
            <span className="w-4 h-4 border border-[#A7B0BC]/30 rounded flex items-center justify-center">
              →
            </span>
            Scroll horizontally to view all modules
          </p>
          
          <div className="text-xs font-mono text-[#A7B0BC]">
            {completedModules.length} / {cehModules.length} modules completed
          </div>
        </div>

        {/* Study Tips */}
        {studyMode && (
          <div className="mx-6 lg:mx-12 mt-8 p-4 cyber-panel border-l-4 border-l-[#39FF14]">
            <h4 className="text-sm font-bold text-[#F2F5F9] mb-2">Study Tips</h4>
            <ul className="space-y-1 text-sm text-[#A7B0BC]">
              <li>• Focus on high-weight modules: M02, M03, M06, M14</li>
              <li>• Practice commands in a lab environment</li>
              <li>• Understand countermeasures for each attack type</li>
              <li>• Review the exam blueprint regularly</li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default CEHModules;
