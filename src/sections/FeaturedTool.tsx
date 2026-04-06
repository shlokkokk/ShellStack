import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
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

  // removed scrollToToolsHub since we will use Link

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
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      // ENTRANCE 
      scrollTl
        .fromTo(
          leftPanel,
          { opacity: 0, x: -100, rotateY: 15 },
          { opacity: 1, x: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' },
          0
        )
        .fromTo(
          rightPanel,
          { opacity: 0, x: 100, rotateY: -15 },
          { opacity: 1, x: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' },
          0
        )
        .fromTo(
          centerPanel,
          { opacity: 0, scale: 0.9, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          0.2
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
      className="relative w-full py-24 flex items-center justify-center overflow-hidden"
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
                <div className="text-[#39FF14]">msf6 exploit(...) &gt; set RHOSTS 10.10.10.40</div>
                <div className="text-[#F2F5F9]">RHOSTS =&gt; 10.10.10.40</div>
                <div className="text-[#39FF14]">msf6 exploit(...) &gt; set LHOST 10.10.14.5</div>
                <div className="text-[#F2F5F9]">LHOST =&gt; 10.10.14.5</div>
                <div className="text-[#39FF14]">msf6 exploit(...) &gt; run</div>
                <div className="text-[#00F0FF]">[*] Started reverse TCP handler on 10.10.14.5:4444</div>
                <div className="text-[#00F0FF]">[*] 10.10.10.40:445 - Connecting to target...</div>
                <div className="text-[#39FF14]">[+] 10.10.10.40:445 - Connection established</div>
                <div className="text-[#39FF14]">[+] 10.10.10.40:445 - ETERNALBLUE overwrite completed</div>
                <div className="text-[#00F0FF]">[*] Meterpreter session 1 opened</div>
                <div className="text-[#F2F5F9]">Microsoft Windows [Version 6.1.7601]</div>
                <div className="text-[#F2F5F9]">C:\Windows\system32&gt; whoami</div>
                <div className="text-[#39FF14]">nt authority\system</div>
                <div className="text-[#F2F5F9]">C:\Windows\system32&gt; <span className="animate-pulse">_</span></div>
              </div>

              {/* Left Panel Bottom - Target Profiler */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0B0E16] via-[#0B0E16]/95 to-transparent border-t border-[rgba(0,240,255,0.1)]">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
                  <span className="text-[10px] font-mono text-[#00F0FF] uppercase tracking-widest">Target_Profiler_v2.1</span>
                </div>
                
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {[
                    { label: 'RHOSTS', val: '10.10.10.40', color: '#00F0FF' },
                    { label: 'OS_VER', val: 'Win7 SP1 (x64)', color: '#A7B0BC' },
                    { label: 'STATUS', val: 'VULNERABLE', color: '#FF2D2D' },
                    { label: 'CVSS_SC', val: '9.8 CRITICAL', color: '#FF6B00' },
                  ].map((stat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="text-[9px] font-mono text-[#A7B0BC]/50 uppercase">{stat.label}</div>
                      <div className="text-[11px] font-mono font-bold" style={{ color: stat.color }}>{stat.val}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-[rgba(243,245,249,0.05)]">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#A7B0BC]">SCN_PROGRESS</span>
                    <span className="text-[#39FF14]">COMPLETED</span>
                  </div>
                  <div className="mt-1 h-0.5 w-full bg-[rgba(243,245,249,0.05)] overflow-hidden">
                    <div className="h-full w-full bg-[#39FF14] animate-pulse" />
                  </div>
                </div>
              </div>
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
              The "Swiss Army knife" for ethical hackers. A comprehensive framework 
              for discovery, exploitation, and post-exploitation. Includes over 
              2,000 pre-built exploit modules and hundreds of versatile payloads.
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
              <Link
                to="/tools"
                className="cyber-btn flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Browse All Tools
              </Link>

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
                2000+ exploits
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

              <div className="mt-8 pt-6 border-t border-[rgba(243,245,249,0.08)]">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-mono text-[#A7B0BC] uppercase tracking-widest">Intelligence_Matrix</span>
                </div>
                
                <div className="space-y-2 h-48 overflow-hidden relative">
                  <div className="space-y-2 animate-scroll-vertical">
                    {[
                      { type: 'INFO', msg: 'MSF_UPDATE: Verifying persistence modules...', color: '#39FF14' },
                      { type: 'SYNC', msg: 'CVE_DB: Synchronized 14 new exploits.', color: '#00F0FF' },
                      { type: 'CRIT', msg: 'TARGET_SCAN: Exposed SMB/445 detected.', color: '#FF2D2D' },
                      { type: 'WARN', msg: 'PAYLOAD_GEN: Signature evasion enabled.', color: '#FFE600' },
                      { type: 'INFO', msg: 'DATABASE: PostgreSQL connection active.', color: '#A7B0BC' },
                      { type: 'NET', msg: 'ESTABLISHED: Session 1 opened via reverse_tcp.', color: '#39FF14' },
                      { type: 'SVR', msg: 'LISTENING: Payload handler on 10.10.14.5.', color: '#00F0FF' },
                    ].map((log, i) => (
                      <div key={i} className="text-[10px] font-mono whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity flex gap-2">
                        <span className="shrink-0" style={{ color: log.color }}>[{log.type}]</span>
                        <span className="text-[#A7B0BC]">{log.msg}</span>
                      </div>
                    ))}
                    {/* Repeat for seamless scroll */}
                    {[
                      { type: 'INFO', msg: 'MSF_UPDATE: Verifying persistence modules...', color: '#39FF14' },
                      { type: 'SYNC', msg: 'CVE_DB: Synchronized 14 new exploits.', color: '#00F0FF' },
                    ].map((log, i) => (
                      <div key={`dup-${i}`} className="text-[10px] font-mono whitespace-nowrap opacity-60 flex gap-2">
                        <span className="shrink-0" style={{ color: log.color }}>[{log.type}]</span>
                        <span className="text-[#A7B0BC]">{log.msg}</span>
                      </div>
                    ))}
                  </div>
                  {/* Fader */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#11141D] to-transparent pointer-events-none" />
                </div>
              </div>

              {/* [NEW] Strategic Vulnerability Index Chart */}
              <div className="mt-8 pt-6 border-t border-[rgba(243,245,249,0.08)]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-[#A7B0BC] uppercase tracking-widest">Network_Volatility_Index</span>
                  <span className="text-[10px] font-mono text-[#FF6B00] animate-pulse">LIVE_SYNC</span>
                </div>
                
                <div className="h-32 w-full relative group">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    {[0, 25, 50, 75, 100].map((y) => (
                      <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(243,245,249,0.03)" strokeWidth="0.5" />
                    ))}
                    
                    {/* The Chart Path */}
                    <path
                      d="M 0 80 Q 50 20 100 60 T 200 40 T 300 70 T 400 30"
                      fill="none"
                      stroke="url(#chartGradient)"
                      strokeWidth="2"
                      className="animate-draw-path"
                    />
                    
                    {/* Area fill */}
                    <path
                      d="M 0 80 Q 50 20 100 60 T 200 40 T 300 70 T 400 30 V 100 H 0 Z"
                      fill="url(#areaGradient)"
                      className="opacity-20"
                    />

                    {/* Gradients */}
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#39FF14" />
                        <stop offset="100%" stopColor="#00F0FF" />
                      </linearGradient>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#39FF14" />
                        <stop offset="100%" stopColor="transparent" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Floating Data Points */}
                  <div className="absolute top-2 left-1/4 flex items-center gap-1.5 px-2 py-1 bg-[#05060B] border border-[rgba(57,255,20,0.3)] rounded text-[9px] font-mono text-[#39FF14] animate-bounce-subtle">
                    <span className="w-1 h-1 rounded-full bg-[#39FF14]" />
                    MSF_ACTIVE_EXP: 2.4k
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-[9px] font-mono text-[#A7B0BC]/40 uppercase">
                  <div>Load: 42%</div>
                  <div className="text-center italic underline">Recon_active</div>
                  <div className="text-right">Buff: 128mb</div>
                </div>
              </div>

              {/* Final Footer Decor */}
              <div className="mt-auto pt-6 flex items-center justify-between border-t border-[rgba(0,240,255,0.1)]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#39FF14] animate-pulse" />
                    <span className="text-[8px] font-mono text-[#A7B0BC]">UPLINK_STABLE</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#00F0FF]" />
                    <span className="text-[8px] font-mono text-[#A7B0BC]">THREADS_42</span>
                  </div>
                </div>
                <div className="text-[8px] font-mono text-[#A7B0BC]/30">
                  REF_ID: MSF_99X_12
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
