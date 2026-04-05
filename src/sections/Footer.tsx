import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Github,
  Mail,
  Twitter,
  Terminal,
  Heart,
  ExternalLink,
} from 'lucide-react';

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
      { label: 'Nmap', href: '#' },
      { label: 'Metasploit', href: '#' },
      { label: 'Burp Suite', href: '#' },
      { label: 'Wireshark', href: '#' },
      { label: 'SQLMap', href: '#' },
    ],
    ceh: [
      { label: 'Module 01', href: '#' },
      { label: 'Module 05', href: '#' },
      { label: 'Module 10', href: '#' },
      { label: 'Module 15', href: '#' },
      { label: 'Module 20', href: '#' },
    ],
    resources: [
      { label: 'Cheat Sheets', href: '#' },
      { label: 'Lab Guides', href: '#' },
      { label: 'Exam Tips', href: '#' },
      { label: 'Tool Docs', href: '#' },
      { label: 'Community', href: '#' },
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
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-[#39FF14]" />
              <span className="font-mono text-lg font-bold tracking-wider text-[#F2F5F9]">
                HACK<span className="text-[#39FF14]">REF</span>
              </span>
            </div>
            <p className="text-sm text-[#A7B0BC] mb-6 max-w-xs">
              The ultimate field manual for ethical hackers. Master Kali Linux
              tools and CEH certification.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[#A7B0BC] hover:text-[#39FF14] transition-colors duration-300"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[#A7B0BC] hover:text-[#39FF14] transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@shellstack.dev"
                className="p-2 text-[#A7B0BC] hover:text-[#39FF14] transition-colors duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
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
                  <a
                    href={link.href}
                    className="text-sm text-[#A7B0BC] hover:text-[#39FF14] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
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
                  <a
                    href={link.href}
                    className="text-sm text-[#A7B0BC] hover:text-[#39FF14] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F2F5F9] mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[#A7B0BC] hover:text-[#39FF14] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contribute CTA */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#F2F5F9] mb-4">
              Contribute
            </h4>
            <p className="text-sm text-[#A7B0BC] mb-4">
              Found a broken command? Want to add a tool?
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 cyber-btn text-xs"
            >
              <Github className="w-4 h-4" />
              Open a PR
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[rgba(243,245,249,0.08)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-[#A7B0BC]">
            <a
              href="#"
              className="hover:text-[#39FF14] transition-colors duration-300"
            >
              Privacy
            </a>
            <span className="text-[rgba(243,245,249,0.2)]">|</span>
            <a
              href="#"
              className="hover:text-[#39FF14] transition-colors duration-300"
            >
              Terms
            </a>
            <span className="text-[rgba(243,245,249,0.2)]">|</span>
            <a
              href="#"
              className="hover:text-[#39FF14] transition-colors duration-300"
            >
              License
            </a>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#A7B0BC]">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-[#FF2D2D] fill-[#FF2D2D]" />
            <span>by the security community</span>
          </div>

          <div className="text-xs font-mono text-[#A7B0BC]">
            © 2026 ShellStack. All rights reserved.
          </div>
        </div>

        {/* Version Badge */}
        <div className="mt-6 flex justify-center">
          <span className="px-3 py-1 text-xs font-mono text-[#A7B0BC]/60 border border-[rgba(243,245,249,0.08)] rounded-full">
            v2.4.0 — build 2026.01.15
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
