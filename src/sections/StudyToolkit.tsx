import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FileText,
  CheckSquare,
  BookOpen,
  Scale,
  Download,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

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
    description: 'One-page command references for quick lookup during engagements.',
    icon: FileText,
    action: 'Download',
    link: '#',
  },
  {
    id: 'checklists',
    title: 'Lab Checklists',
    description: 'Step-by-step practice tasks to build muscle memory.',
    icon: CheckSquare,
    action: 'View',
    link: '#',
  },
  {
    id: 'notes',
    title: 'Exam Notes',
    description: 'Key concepts and mnemonics for CEH certification.',
    icon: BookOpen,
    action: 'Read',
    link: '#',
  },
  {
    id: 'comparisons',
    title: 'Tool Comparison',
    description: 'When to use what—side-by-side feature analysis.',
    icon: Scale,
    action: 'Compare',
    link: '#',
  },
];

const StudyToolkit = () => {
  const sectionRef = useRef<HTMLElement>(null);

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
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
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
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="study-toolkit"
      className="relative w-full py-20 lg:py-28"
    >
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
            return (
              <div
                key={resource.id}
                className="resource-card cyber-panel p-5 lg:p-6 flex flex-col min-h-[220px] group transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(57,255,20,0.65)]"
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

                <a
                  href={resource.link}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#A7B0BC] group-hover:text-[#39FF14] transition-colors duration-300"
                >
                  {resource.action === 'Download' && (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  {resource.action === 'View' && (
                    <ExternalLink className="w-3.5 h-3.5" />
                  )}
                  {resource.action === 'Read' && (
                    <BookOpen className="w-3.5 h-3.5" />
                  )}
                  {resource.action === 'Compare' && (
                    <Scale className="w-3.5 h-3.5" />
                  )}
                  {resource.action}
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </div>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-wrap gap-3">
          {['GitHub', 'Discord', 'Twitter', 'YouTube'].map((link) => (
            <a
              key={link}
              href="#"
              className="community-chip px-3 py-1.5 text-xs font-mono text-[#A7B0BC] border border-[rgba(243,245,249,0.08)] rounded hover:border-[rgba(57,255,20,0.3)] hover:text-[#39FF14] transition-all duration-300"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StudyToolkit;
