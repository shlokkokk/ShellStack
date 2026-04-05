import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FileText,
  CheckSquare,
  BookOpen,
  Scale,
  ExternalLink,
  ArrowRight,
  Github,
  MessageSquare,
  AlertCircle,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface Resource {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action: string;
  link: string;
}

const resources: Resource[] = [
  {
    id: 'cheatsheets',
    title: 'Cheat Sheets',
    description: 'Master 570+ tactical commands across 31 categories. Your definitive offensive intelligence hub.',
    icon: FileText,
    action: 'Open',
    link: '/cheatsheet',
  },
  {
    id: 'checklists',
    title: 'Lab Checklists',
    description: 'Practical, step-by-step tasks to build muscle memory and master the offensive workflow.',
    icon: CheckSquare,
    action: 'Coming Soon',
    link: '#',
  },
  {
    id: 'notes',
    title: 'Exam Flashcards',
    description: 'High-speed active recall cards covering the entire CEH v13 logical syllabus.',
    icon: BookOpen,
    action: 'Coming Soon',
    link: '#',
  },
  {
    id: 'comparisons',
    title: 'Tool Matrix',
    description: 'The ultimate side-by-side comparison of 130+ tools for mission-critical decisions.',
    icon: Scale,
    action: 'Coming Soon',
    link: '#',
  },
];

const StudyToolkit = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll('.resource-card'),
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          }
        }
      );

      gsap.fromTo(
        section.querySelectorAll('.community-chip'),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: 'power3.out',
          delay: 0.3,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleAction = (e: React.MouseEvent, resource: Resource) => {
    if (resource.action === 'Coming Soon') {
      e.preventDefault();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } else if (resource.link && resource.link !== '#') {
      navigate(resource.link);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="study-toolkit"
      className="relative w-full py-20 lg:py-28 overflow-hidden"
    >
      {/* Toast Notification */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 bg-[#0B0E16] border border-[#39FF14]/30 rounded-full transition-all duration-300 ${
        showToast ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}>
        <AlertCircle className="w-5 h-5 text-[#39FF14]" />
        <span className="text-sm font-mono text-[#F2F5F9]">ENCRYPTED_DATA_UNAVAILABLE // MODULE_COMING_SOON</span>
        <button onClick={() => setShowToast(false)} className="ml-2 hover:text-[#39FF14]">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="w-full px-6 lg:px-12">
        <div className="mb-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#F2F5F9] mb-3">
            STUDY <span className="text-[#39FF14]">TOOLKIT</span>
          </h2>
          <p className="text-lg text-[#A7B0BC]">
            Clean, quick access to the assets you actually use while practicing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
          {resources.map((resource) => {
            const Icon = resource.icon;
            const isComingSoon = resource.action === 'Coming Soon';
            
            
            return (
              <div
                key={resource.id}
                onClick={(e) => handleAction(e, resource)}
                className={`resource-card cyber-panel p-5 lg:p-6 flex flex-col min-h-[240px] group transition-all duration-300 hover:-translate-y-1.5 ${
                  isComingSoon ? 'cursor-not-allowed grayscale-[0.6]' : 'cursor-pointer hover:border-[rgba(57,255,20,0.65)]'
                }`}
              >
                <div className="mb-5 self-start inline-flex p-2.5 bg-[rgba(57,255,20,0.08)] rounded-lg border border-[rgba(57,255,20,0.15)] group-hover:bg-[rgba(57,255,20,0.12)] transition-colors duration-300">
                  <Icon className="w-5 h-5 text-[#39FF14]" />
                </div>

                <h3 className="text-lg font-bold text-[#F2F5F9] mb-2 group-hover:text-[#39FF14] transition-colors duration-300">
                  {resource.title}
                </h3>

                <p className="text-sm text-[#A7B0BC] mb-6 flex-1">
                  {resource.description}
                </p>

                <div className={`inline-flex items-center gap-1.5 text-xs font-mono transition-colors duration-300 ${
                  isComingSoon ? 'text-[#A7B0BC]/40' : 'text-[#A7B0BC] group-hover:text-[#39FF14]'
                }`}>
                  {resource.action === 'Open' ? <ExternalLink className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                  {resource.action}
                  {!isComingSoon && <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-4 items-center">
          <span className="text-[10px] font-mono text-[#A7B0BC]/40 uppercase tracking-widest">Connect:</span>
          <a
            href="https://github.com/shlokkokk/ShellStack"
            target="_blank"
            rel="noopener noreferrer"
            className="community-chip px-3 py-1.5 text-xs font-mono text-[#A7B0BC] border border-[rgba(243,245,249,0.08)] rounded hover:border-[rgba(57,255,20,0.3)] hover:text-[#39FF14] transition-all duration-300 flex items-center gap-2"
          >
            <Github className="w-3.5 h-3.5" /> GITHUB
          </a>
          <div
            className="community-chip px-3 py-1.5 text-xs font-mono text-[#A7B0BC] border border-[rgba(243,245,249,0.08)] rounded cursor-help hover:border-[rgba(57,255,20,0.3)] hover:text-[#39FF14] transition-all duration-300 flex items-center gap-2"
            title="shlokkokk"
          >
            <MessageSquare className="w-3.5 h-3.5" /> DISCORD: shlokkokk
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudyToolkit;
