import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Copy, Check, ArrowRight, Terminal, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface CommandExample {
  id: string;
  command: string;
  description: string;
  output: string[];
}

const commandExamples: CommandExample[] = [
  {
    id: 'nmap-basic',
    command: 'nmap -sV -sC -O 192.168.1.1',
    description: 'Version detection, default scripts, and OS fingerprinting',
    output: [
      'Starting Nmap 7.94 ( https://nmap.org )',
      'Nmap scan report for 192.168.1.1',
      'Host is up (0.0023s latency).',
      'Not shown: 997 closed ports',
      'PORT   STATE SERVICE VERSION',
      '22/tcp open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.1',
      '| ssh-hostkey:',
      '|   256 12:34:56:78:9a:bc:de:f0:12:34:56:78:9a:bc:de:f0 (ECDSA)',
      '80/tcp open  http    Apache httpd 2.4.52',
      '|_http-title: Welcome to Example',
      'Device type: general purpose',
      'Running: Linux 5.X',
      'OS CPE: cpe:/o:linux:linux_kernel:5.15',
      'OS details: Linux 5.15',
      '',
      'OS and Service detection performed.',
      'Nmap done: 1 IP address (1 host up) scanned in 12.34 seconds',
    ],
  },
  {
    id: 'gobuster',
    command: 'gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt',
    description: 'Directory brute-forcing with common wordlist',
    output: [
      '===============================================================',
      'Gobuster v3.5',
      'by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)',
      '===============================================================',
      '[+] Url:                     http://target.com',
      '[+] Method:                  GET',
      '[+] Threads:                 10',
      '[+] Wordlist:                /usr/share/wordlists/dirb/common.txt',
      '[+] Negative Status codes:   404',
      '[+] User Agent:              gobuster/3.5',
      '[+] Timeout:                 10s',
      '===============================================================',
      'Starting gobuster in directory enumeration mode',
      '===============================================================',
      '/admin                (Status: 301) [Size: 312]',
      '/assets               (Status: 301) [Size: 313]',
      '/backup               (Status: 301) [Size: 313]',
      '/config               (Status: 403) [Size: 276]',
      '/css                  (Status: 301) [Size: 310]',
      '/images               (Status: 301) [Size: 313]',
      '/js                   (Status: 301) [Size: 309]',
      '/login                (Status: 200) [Size: 1523]',
      '/api                  (Status: 301) [Size: 310]',
      '/uploads              (Status: 301) [Size: 314]',
      '',
      '===============================================================',
      'Finished',
      '===============================================================',
    ],
  },
  {
    id: 'sqlmap',
    command: 'sqlmap -u "http://target.com/page.php?id=1" --dbs',
    description: 'Automated SQL injection detection and database enumeration',
    output: [
      '        ___',
      '       __H__',
      ' ___ ___[,]_____ ___ ___  {1.7.2#stable}',
      '|_ -| . ["]     | .\'| . |',
      '|___|_  [,]_|_|_|__,|  _|',
      '      |_|V...       |_|   https://sqlmap.org',
      '',
      '[!] legal disclaimer: Usage of sqlmap for attacking targets...',
      '',
      '[*] starting @ 14:32:01 /2024-01-15/',
      '',
      '[14:32:01] [INFO] testing connection to the target URL',
      '[14:32:02] [INFO] checking if the target is protected...',
      '[14:32:03] [INFO] testing if the target URL content is stable',
      '[14:32:04] [INFO] target URL content is stable',
      '[14:32:05] [INFO] testing GET parameter \'id\' for SQL injection',
      '[14:32:06] [INFO] testing \'MySQL >= 5.0 AND error-based...',
      '[14:32:07] [INFO] GET parameter \'id\' is \'MySQL >= 5.0...',
      '[14:32:08] [INFO] the back-end DBMS is MySQL',
      'web application technology: Apache 2.4.52, PHP 8.1',
      'back-end DBMS: MySQL >= 5.0',
      '[14:32:09] [INFO] fetching database names',
      'available databases [5]:',
      '[*] information_schema',
      '[*] mysql',
      '[*] performance_schema',
      '[*] sys',
      '[*] target_db',
      '',
      '[14:32:10] [INFO] fetched data logged to: /home/kali/.local/share/sqlmap/output/target.com',
      '',
      '[*] ending @ 14:32:10 /2024-01-15/',
      '[*] cleanup complete, exiting',
    ],
  },
];

const LiveTerminal = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const codeBlockRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const typingRunIdRef = useRef(0);
  const [selectedCommand, setSelectedCommand] = useState<CommandExample>(
    commandExamples[0]
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedOutput, setDisplayedOutput] = useState<string[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const terminal = terminalRef.current;
    const textBlock = textBlockRef.current;
    const codeBlock = codeBlockRef.current;

    if (!section || !terminal || !textBlock || !codeBlock) return;

    const ctx = gsap.context(() => {
      const animTl = gsap.timeline();

      // ENTRANCE 
      animTl
        .fromTo(
          terminal,
          { opacity: 0, scale: 0.94, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          0
        )
        .fromTo(
          textBlock,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
          0.1
        )
        .fromTo(
          codeBlock,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
          0.1
        );
    }, section);

    return () => ctx.revert();
  }, []);

  // Typing animation for output
  useEffect(() => {
    // Cancel any in-flight animation before starting a new one.
    if (typingTimeoutRef.current !== null) {
      window.clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    typingRunIdRef.current += 1;
    const runId = typingRunIdRef.current;

    setDisplayedOutput([]);
    setIsTyping(true);

    let lineIndex = 0;
    const typeLine = () => {
      if (runId !== typingRunIdRef.current) {
        return;
      }

      if (lineIndex < selectedCommand.output.length) {
        const nextLine = selectedCommand.output[lineIndex];

        setDisplayedOutput((prev) => [
          ...prev,
          typeof nextLine === 'string' ? nextLine : '',
        ]);
        lineIndex++;
        typingTimeoutRef.current = window.setTimeout(
          typeLine,
          Math.random() * 100 + 50
        );
      } else {
        setIsTyping(false);
        typingTimeoutRef.current = null;
      }
    };

    typingTimeoutRef.current = window.setTimeout(typeLine, 250);

    return () => {
      if (typingTimeoutRef.current !== null) {
        window.clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    };
  }, [selectedCommand]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section
      ref={sectionRef}
      id="live-terminal"
      className="relative w-full py-28 flex items-center justify-center overflow-hidden"
    >
      {/* Terminal Panel */}
      <div
        ref={terminalRef}
        className="relative w-[min(92vw,1200px)] h-[min(80vh,700px)] cyber-panel flex flex-col"
        style={{ willChange: 'transform, opacity' }}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between h-11 px-4 border-b border-[rgba(243,245,249,0.08)]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF2D2D]" />
            <div className="w-3 h-3 rounded-full bg-[#FFE600]" />
            <div className="w-3 h-3 rounded-full bg-[#39FF14]" />
          </div>

          <span className="text-xs font-mono text-[#A7B0BC]">
            shellstack — live-demo
          </span>

          <button
            onClick={() => copyToClipboard(selectedCommand.command, 'header')}
            className="p-1.5 text-[#A7B0BC] hover:text-[#39FF14] transition-colors"
            title="Copy command"
          >
            {copiedId === 'header' ? (
              <Check className="w-4 h-4 text-[#39FF14]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left: Text Content */}
          <div
            ref={textBlockRef}
            className="flex-1 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-[rgba(243,245,249,0.08)] overflow-y-auto"
            style={{ willChange: 'transform, opacity' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-[#39FF14]" />
              <span className="text-xs font-mono text-[#39FF14] uppercase tracking-wider">
                Try It Live
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-bold text-[#F2F5F9] mb-4">
              COPY. <span className="text-[#39FF14]">PASTE.</span> EXPLOIT.
            </h2>

            <p className="text-base text-[#A7B0BC] mb-8">
              Run real commands in context. See outputs, flags, and use cases—then
              copy them straight into your terminal.
            </p>

            {/* Command Selector */}
            <div className="space-y-3 mb-8">
              <p className="text-xs font-mono text-[#A7B0BC] uppercase tracking-wider mb-3">
                Select a command
              </p>
              {commandExamples.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => setSelectedCommand(cmd)}
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-300 ${
                    selectedCommand.id === cmd.id
                      ? 'bg-[rgba(57,255,20,0.08)] border-[rgba(57,255,20,0.3)]'
                      : 'bg-transparent border-[rgba(243,245,249,0.08)] hover:border-[rgba(57,255,20,0.2)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <code
                      className={`text-xs font-mono ${
                        selectedCommand.id === cmd.id
                          ? 'text-[#39FF14]'
                          : 'text-[#F2F5F9]'
                      }`}
                    >
                      {cmd.command.length > 45
                        ? cmd.command.slice(0, 45) + '...'
                        : cmd.command}
                    </code>
                    {selectedCommand.id === cmd.id && (
                      <Play className="w-3.5 h-3.5 text-[#39FF14] flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-[#A7B0BC] mt-1">{cmd.description}</p>
                </button>
              ))}
            </div>

            <Link to="/cheatsheet" className="cyber-btn-primary flex items-center gap-2">
              Open Full Cheat Sheet
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: Terminal Output */}
          <div
            ref={codeBlockRef}
            className="flex-1 p-4 lg:p-6 bg-[#05060B] font-mono text-sm overflow-hidden flex flex-col"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Command Display */}
            <div className="mb-4 pb-4 border-b border-[rgba(243,245,249,0.08)]">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <span className="text-[#39FF14]">root@shellstack:~#</span>{' '}
                  <span className="text-[#F2F5F9]">{selectedCommand.command}</span>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(selectedCommand.command, selectedCommand.id)
                  }
                  className="p-1.5 text-[#A7B0BC] hover:text-[#39FF14] transition-colors flex-shrink-0"
                  title="Copy command"
                >
                  {copiedId === selectedCommand.id ? (
                    <Check className="w-4 h-4 text-[#39FF14]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Output Display */}
            <div className="flex-1 overflow-y-auto space-y-0.5">
              {displayedOutput.map((line, index) => (
                <div
                  key={index}
                  className={`${
                    line.startsWith('[') && line.includes('INFO')
                      ? 'text-[#00F0FF]'
                      : line.startsWith('[') &&
                        (line.includes('OK') || line.includes('+'))
                      ? 'text-[#39FF14]'
                      : line.startsWith('[') && line.includes('!')
                      ? 'text-[#FF2D2D]'
                      : line.startsWith('|') || line.startsWith('>')
                      ? 'text-[#A7B0BC]'
                      : line.startsWith('PORT') ||
                        line.startsWith('___') ||
                        line.startsWith('Starting') ||
                        line.startsWith('Finished')
                      ? 'text-[#FFE600]'
                      : 'text-[#F2F5F9]'
                  }`}
                >
                  {line || '\u00A0'}
                </div>
              ))}
              {isTyping && (
                <div className="text-[#39FF14] animate-pulse">_</div>
              )}
            </div>

            {/* Prompt */}
            <div className="mt-4 pt-2 border-t border-[rgba(243,245,249,0.08)]">
              <span className="text-[#39FF14]">root@shellstack:~#</span>{' '}
              <span className="terminal-cursor" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveTerminal;
