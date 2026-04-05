import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Github,
  Terminal,
  Shield,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;

    if (!section || !content) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const footerLinks = {
    tools: [
      { label: 'All Tools', href: '/tools' },
      { label: 'Information Gathering', href: '/tools' },
      { label: 'Vulnerability Analysis', href: '/tools' },
      { label: 'Exploitation', href: '/tools' },
    ],
    ceh: [
      { label: 'CEH Modules', href: '/ceh' },
      { label: 'Study Guide', href: '/study' },
      { label: 'Live Terminal', href: '/terminal' },
    ],
  };

  return (
    <footer
      ref={sectionRef}
      className="relative w-full py-16 lg:py-20 border-t border-[rgba(243,245,249,0.08)]"
    >
      <div ref={contentRef} className="w-full px-6 lg:px-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-[#39FF14]" />
              <span className="font-mono text-lg font-bold tracking-wider text-[#F2F5F9]">
                SHELL<span className="text-[#39FF14]">STACK</span>
              </span>
            </div>
            <p className="text-sm text-[#A7B0BC] mb-6 max-w-sm">
              The ultimate high-performance intelligence hub for hackers. 
              Master the CEH v13 curriculum with an integrated arsenal of 130+ defensive and offensive tools.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/shlokkokk/ShellStack"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-[#A7B0BC] hover:text-[#39FF14] transition-colors"
              >
                <Github className="w-4 h-4" />
                SOURCE_CODE
              </a>
            </div>
          </div>

          {/* Tools Column */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F2F5F9] mb-4">
              Tools
            </h4>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#A7B0BC] hover:text-[#39FF14] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CEH Column */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F2F5F9] mb-4">
              CEH Modules
            </h4>
            <ul className="space-y-2">
              {footerLinks.ceh.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-[#A7B0BC] hover:text-[#39FF14] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F2F5F9] mb-4">
              Explore
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/ceh" className="flex items-center gap-2 text-sm text-[#A7B0BC] hover:text-[#39FF14] transition-colors">
                  <Shield className="w-4 h-4" /> CEH Modules
                </Link>
              </li>
              <li>
                <Link to="/tools" className="flex items-center gap-2 text-sm text-[#A7B0BC] hover:text-[#39FF14] transition-colors">
                  <BookOpen className="w-4 h-4" /> Tool Arsenal
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/shlokkokk/ShellStack" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#A7B0BC] hover:text-[#39FF14] transition-colors"
                >
                  <Github className="w-4 h-4" /> Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[rgba(243,245,249,0.08)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#A7B0BC]">
            <Terminal className="w-3.5 h-3.5 text-[#39FF14]" />
            <span>SHELLSTACK // OFFENSIVE_INTEL_HUB</span>
          </div>

          <div className="text-xs font-mono text-[#A7B0BC]">
            © 2026 ShellStack.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
