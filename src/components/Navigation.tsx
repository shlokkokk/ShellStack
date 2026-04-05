import { useState, useEffect } from 'react';
import { Search, Menu, X, Terminal } from 'lucide-react';
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

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Tools', path: '/tools' },
    { label: 'CEH', path: '/ceh' },
    { label: 'Terminal', path: '/terminal' },
    { label: 'Study', path: '/study' },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
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
            <Link
              to="/"
              className="flex items-center gap-2 group"
            >
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

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <button
                className="p-2 text-[#A7B0BC] hover:text-[#39FF14] transition-colors duration-300"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:block cyber-btn text-xs"
              >
                Contribute
              </a>

              {/* Mobile Menu Button */}
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

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-[#05060B]/95 backdrop-blur-lg"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div className="relative flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.label}
                to={link.path}
                onClick={handleNavClick}
                className={`font-mono text-2xl transition-colors duration-300 uppercase tracking-wider ${
                  isActive ? 'text-[#39FF14]' : 'text-[#F2F5F9] hover:text-[#39FF14]'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {link.label}
              </Link>
            );
          })}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 cyber-btn-primary"
          >
            Contribute
          </a>
        </div>
      </div>
    </>
  );
};

export default Navigation;
