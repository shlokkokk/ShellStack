import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Terminal, Shield, Cpu } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TerminalHero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState('');

  const fullText = 'A living reference for Kali Linux tools & CEH prep.';

  // Typing animation
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  // GSAP entrance animation
  useEffect(() => {
    const section = sectionRef.current;
    const panel = panelRef.current;
    const headline = headlineRef.current;
    const subheadline = subheadlineRef.current;
    const cta = ctaRef.current;
    const image = imageRef.current;
    const status = statusRef.current;

    if (!section || !panel || !headline || !subheadline || !cta || !image || !status) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(panel, { opacity: 0, scale: 0.96, y: '12vh' });
      gsap.set(headline, { opacity: 0, y: 40 });
      gsap.set(subheadline, { opacity: 0, y: 24 });
      gsap.set(cta.children, { opacity: 0, y: 24 });
      gsap.set(image, { opacity: 0, x: '10vw', scale: 1.04 });
      gsap.set(status.children, { opacity: 0, y: -10 });

      // Entrance timeline
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(panel, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
        .to(
          headline,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.4'
        )
        .to(
          subheadline,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.3'
        )
        .to(
          cta.children,
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power3.out',
          },
          '-=0.3'
        )
        .to(
          image,
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.6'
        )
        .to(
          status.children,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power3.out',
          },
          '-=0.4'
        );

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            // Reset all elements when scrolling back to top
            gsap.to([panel, headline, subheadline, ...cta.children, image, ...status.children], {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              duration: 0.3,
            });
          },
        },
      });

      // Exit phase (70% - 100%)
      scrollTl
        .fromTo(
          panel,
          { opacity: 1, scale: 1, y: 0 },
          { opacity: 0.25, scale: 0.98, y: '-10vh', ease: 'power2.in' },
          0.7
        )
        .fromTo(
          image,
          { opacity: 1, x: 0 },
          { opacity: 0.2, x: '-6vw', ease: 'power2.in' },
          0.7
        )
        .fromTo(
          [headline, subheadline, ...cta.children],
          { opacity: 1, x: 0 },
          { opacity: 0.2, x: '6vw', ease: 'power2.in' },
          0.7
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Main Panel */}
      <div
        ref={panelRef}
        className="relative w-[min(86vw,1100px)] h-[min(72vh,560px)] cyber-panel flex flex-col"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between h-11 px-4 border-b border-[rgba(243,245,249,0.08)]">
          {/* Window Controls */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF2D2D]" />
            <div className="w-3 h-3 rounded-full bg-[#FFE600]" />
            <div className="w-3 h-3 rounded-full bg-[#39FF14]" />
          </div>

          {/* Status Pills */}
          <div ref={statusRef} className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono text-[#39FF14] bg-[rgba(57,255,20,0.1)] rounded border border-[rgba(57,255,20,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
              ONLINE
            </span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono text-[#00F0FF] bg-[rgba(0,240,255,0.1)] rounded border border-[rgba(0,240,255,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
              SYNCED
            </span>
          </div>

          <div className="w-16" /> {/* Spacer for balance */}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row p-6 lg:p-8 gap-6 lg:gap-8">
          {/* Left: Text Content */}
          <div className="flex-1 flex flex-col justify-center">
            <h1
              ref={headlineRef}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
              style={{ willChange: 'transform, opacity' }}
            >
              <span className="text-[#F2F5F9]">SHELL</span>
              <span className="text-[#39FF14]">STACK</span>
            </h1>

            <p
              ref={subheadlineRef}
              className="text-lg sm:text-xl text-[#A7B0BC] mb-8 font-mono min-h-[1.5em]"
              style={{ willChange: 'transform, opacity' }}
            >
              {typedText}
              <span className="terminal-cursor" />
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={() => scrollToSection('#kali-hub')}
                className="cyber-btn-primary flex items-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                Explore Tools
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollToSection('#ceh-modules')}
                className="cyber-btn flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                View CEH Modules
              </button>
            </div>

            <p className="text-xs font-mono text-[#A7B0BC]/60 flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                v2.4
              </span>
              <span>200+ tools</span>
              <span>offline-ready</span>
            </p>
          </div>

          {/* Right: Visual */}
          <div
            ref={imageRef}
            className="hidden lg:flex flex-1 items-center justify-center"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="relative w-full h-full max-h-[400px] rounded-lg overflow-hidden border border-[rgba(243,245,249,0.1)]">
              {/* Animated Terminal Content */}
              <div className="absolute inset-0 bg-[#0B0E16] p-4 font-mono text-sm overflow-hidden">
                <div className="text-[#39FF14] mb-2">root@shellstack:~# ./init.sh</div>
                <div className="text-[#A7B0BC] space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00F0FF]">[INFO]</span>
                    <span>Loading Kali Linux tool database...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00F0FF]">[INFO]</span>
                    <span>Loading CEH v13 modules...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#39FF14]">[OK]</span>
                    <span>230 tools indexed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#39FF14]">[OK]</span>
                    <span>20 CEH modules loaded</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#FFE600]">[WARN]</span>
                    <span>Some tools require root privileges</span>
                  </div>
                  <div className="mt-4 text-[#39FF14]">
                    root@shellstack:~# <span className="animate-pulse">_</span>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute bottom-4 right-4 flex flex-col items-end gap-1">
                  <div className="text-xs text-[#A7B0BC]/40">CPU: 12%</div>
                  <div className="text-xs text-[#A7B0BC]/40">MEM: 456MB</div>
                  <div className="text-xs text-[#A7B0BC]/40">NET: SECURE</div>
                </div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(57,255,20,0.1)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TerminalHero;
