import { useState, useEffect, useCallback } from 'react';
import { Menu, X, Terminal, Github, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock / unlock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Save scroll position, freeze body
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Home', path: '/', index: 0 },
    { label: 'Tools', path: '/tools', index: 1 },
    { label: 'CEH', path: '/ceh', index: 2 },
    { label: 'Terminal', path: '/terminal', index: 3 },
    { label: 'Study', path: '/study', index: 4 },
  ];

  const handleNavClick = useCallback(() => setIsMobileMenuOpen(false), []);
  const closeMobileMenu = handleNavClick;

  return (
    <>
      {/* ── Top Nav Bar ─────────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || location.pathname !== '/'
            ? 'bg-[#05060B]/90 backdrop-blur-md border-b border-[rgba(243,245,249,0.08)]'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <Terminal className="w-5 h-5 text-[#39FF14] group-hover:animate-pulse" />
              <span className="font-mono text-lg font-bold tracking-wider text-[#F2F5F9]">
                SHELL<span className="text-[#39FF14]">STACK</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`font-mono text-sm transition-colors duration-300 uppercase tracking-wider ${
                      isActive ? 'text-[#39FF14]' : 'text-[#A7B0BC] hover:text-[#39FF14]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/shlokkokk/ShellStack"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 cyber-btn text-xs"
              >
                <Github className="w-4 h-4" />
                GITHUB
              </a>

              {/* Mobile Menu Button — identical to original render logic */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-[#A7B0BC] hover:text-[#39FF14] transition-colors duration-300"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ────────────────────────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={closeMobileMenu}
        aria-hidden="true"
        className={`md:hidden fixed inset-0 z-[55] bg-[#020408]/70 backdrop-blur-sm transition-opacity duration-400 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer panel — slides in from right */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 z-[56] w-[min(88vw,320px)] flex flex-col
          bg-[#05060B] border-l border-[rgba(57,255,20,0.12)]
          shadow-[-8px_0_40px_rgba(0,0,0,0.7)]
          transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#39FF14]/60 to-transparent" />

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-[rgba(243,245,249,0.06)] shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#39FF14]" />
            <span className="font-mono text-sm font-bold tracking-wider text-[#F2F5F9]">
              SHELL<span className="text-[#39FF14]">STACK</span>
            </span>
          </div>
          <button
            onClick={closeMobileMenu}
            className="p-2 text-[#A7B0BC] hover:text-[#FF2D2D] transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav data-lenis-prevent className="flex-1 overflow-y-auto px-4 py-6 space-y-1 overscroll-contain">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                onClick={closeMobileMenu}
                className={`group relative flex items-center justify-between px-4 py-3.5 rounded-lg font-mono text-sm uppercase tracking-[0.15em] transition-all duration-200
                  ${isActive
                    ? 'bg-[rgba(57,255,20,0.08)] text-[#39FF14] border border-[rgba(57,255,20,0.25)]'
                    : 'text-[#A7B0BC] hover:text-[#F2F5F9] hover:bg-[rgba(255,255,255,0.03)] border border-transparent'
                  }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${link.index * 40}ms` : '0ms',
                  transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(24px)',
                  opacity: isMobileMenuOpen ? 1 : 0,
                  transition: `transform 300ms cubic-bezier(0.32,0.72,0,1) ${link.index * 40}ms, opacity 250ms ease ${link.index * 40}ms, background-color 200ms ease, color 200ms ease, border-color 200ms ease`,
                }}
              >
                <span className="flex items-center gap-3">
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] shadow-[0_0_6px_rgba(57,255,20,0.8)] shrink-0" />
                  )}
                  {!isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[rgba(167,176,188,0.3)] shrink-0" />
                  )}
                  {link.label}
                </span>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-all duration-200 ${
                    isActive ? 'text-[#39FF14] opacity-100' : 'opacity-0 group-hover:opacity-50'
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="shrink-0 px-4 py-5 border-t border-[rgba(243,245,249,0.06)] space-y-3">
          <a
            href="https://github.com/shlokkokk/ShellStack"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full cyber-btn text-xs py-2.5"
            onClick={closeMobileMenu}
          >
            <Github className="w-4 h-4" />
            GITHUB
          </a>
          <p className="text-center font-mono text-[9px] text-[#A7B0BC]/40 tracking-wider uppercase">
            ShellStack · v2.0
          </p>
        </div>

        {/* Corner pixel decorations */}
        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#39FF14]/40 pointer-events-none" />
        <div className="absolute top-[4.1rem] left-0 w-2 h-2 border-l border-t border-[#39FF14]/40 pointer-events-none" />
      </div>
    </>
  );
};

export default Navigation;
