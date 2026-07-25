import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { BsCheckCircleFill, BsArrowRepeat, BsLightningChargeFill, BsWifi, BsChevronRight } from 'react-icons/bs';
import { RiLoader4Line, RiTerminalBoxLine, RiRadarLine } from 'react-icons/ri';
import { MdOutlineSkipNext, MdGpsFixed, MdWifiTethering, MdLan } from 'react-icons/md';
import { GiCrownedSkull, GiPadlock } from 'react-icons/gi';
import { TbClockHour4, TbShieldCheck } from 'react-icons/tb';
import { SiWordpress } from 'react-icons/si';
import { Server, Cpu, Copy, Check, X } from 'lucide-react';
import {
  filesystem, toolSimulations, missions, easterEggs,
  helpOutput, welcomeBanner, neofetchOutput, ifconfigOutput, unameOutput,
  type FSNode, type OutputLine, type Mission,
} from '../data/terminalData';
import { terminalStore, type EngineMode, type DockerConnectionStatus } from '../lib/terminalStore';
import { DockerConnectModal } from '../components/DockerConnectModal';

//  Filesystem helpers 

const resolvePath = (currentPath: string, target: string): string => {
  if (target === '~' || target === '') return '/home/kali';
  if (target.startsWith('/')) {
    // absolute
    const parts = target.split('/').filter(Boolean);
    return '/' + parts.join('/');
  }
  // relative
  const parts = currentPath.split('/').filter(Boolean);
  for (const seg of target.split('/')) {
    if (seg === '..') parts.pop();
    else if (seg !== '.' && seg !== '') parts.push(seg);
  }
  return '/' + parts.join('/');
};

const getNode = (path: string): FSNode | null => {
  const parts = path.split('/').filter(Boolean);
  let node: FSNode = { type: 'dir', children: filesystem };
  for (const part of parts) {
    if (node.type !== 'dir' || !node.children?.[part]) return null;
    node = node.children[part];
  }
  return node;
};

const getPathDisplay = (path: string): string => {
  if (path === '/home/kali') return '~';
  if (path.startsWith('/home/kali/')) return '~/' + path.slice('/home/kali/'.length);
  return path;
};

//  Color map 

const colorMap: Record<string, string> = {
  green: 'text-[#39FF14]',
  cyan: 'text-[#00F0FF]',
  yellow: 'text-[#FFE600]',
  red: 'text-[#FF2D2D]',
  white: 'text-[#F2F5F9]',
  dim: 'text-[#606878]',
  blue: 'text-[#3B82F6]',
  magenta: 'text-[#C084FC]',
};

const missionIconMeta: Record<string, { color: string; glow: string; bg: string; border: string }> = {
  'web-recon':        { color: 'text-[#00F0FF]', glow: 'drop-shadow-[0_0_6px_rgba(0,240,255,0.9)]',    bg: 'bg-[rgba(0,240,255,0.12)]',    border: 'border-[rgba(0,240,255,0.35)]' },
  'wifi-crack':       { color: 'text-[#FFE600]', glow: 'drop-shadow-[0_0_6px_rgba(255,230,0,0.9)]',    bg: 'bg-[rgba(255,230,0,0.12)]',    border: 'border-[rgba(255,230,0,0.35)]' },
  'network-pentest':  { color: 'text-[#39FF14]', glow: 'drop-shadow-[0_0_6px_rgba(57,255,20,0.9)]',    bg: 'bg-[rgba(57,255,20,0.12)]',    border: 'border-[rgba(57,255,20,0.35)]'  },
  'wordpress-audit':  { color: 'text-[#FFE600]', glow: 'drop-shadow-[0_0_6px_rgba(255,230,0,0.9)]',    bg: 'bg-[rgba(255,230,0,0.12)]',    border: 'border-[rgba(255,230,0,0.35)]' },
  'password-crack':   { color: 'text-[#FF2D2D]', glow: 'drop-shadow-[0_0_6px_rgba(255,45,45,0.9)]',    bg: 'bg-[rgba(255,45,45,0.12)]',    border: 'border-[rgba(255,45,45,0.35)]'  },
  'active-directory': { color: 'text-[#C084FC]', glow: 'drop-shadow-[0_0_6px_rgba(192,132,252,0.9)]',  bg: 'bg-[rgba(192,132,252,0.12)]',  border: 'border-[rgba(192,132,252,0.35)]'},
};

const getMissionIconBadge = (id: string, isActive = false, size: 'sm' | 'md' = 'md') => {
  const meta = missionIconMeta[id] || { color: 'text-[#A7B0BC]', glow: '', bg: 'bg-[rgba(255,255,255,0.06)]', border: 'border-[rgba(255,255,255,0.12)]' };
  const iconClass = `${meta.color} ${meta.glow} ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${isActive ? 'animate-pulse' : ''} shrink-0`;
  const containerClass = `${size === 'sm' ? 'w-7 h-7' : 'w-8 h-8'} rounded-lg border ${meta.bg} ${meta.border} flex items-center justify-center shrink-0 ${isActive ? 'shadow-[0_0_10px_rgba(57,255,20,0.25)]' : ''}`;

  const iconEl = (() => {
    switch (id) {
      case 'web-recon':        return <RiRadarLine className={iconClass} />;
      case 'wifi-crack':       return <MdWifiTethering className={iconClass} />;
      case 'network-pentest':  return <MdLan className={iconClass} />;
      case 'wordpress-audit':  return <SiWordpress className={iconClass} />;
      case 'password-crack':   return <GiPadlock className={iconClass} />;
      case 'active-directory': return <GiCrownedSkull className={iconClass} />;
      default:                 return <TbShieldCheck className={iconClass} />;
    }
  })();

  return <div className={containerClass}>{iconEl}</div>;
};



//  Main Component 

const LiveTerminal = () => {
  // State
  const [outputLines, setOutputLines] = useState<OutputLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentPath, setCurrentPath] = useState('/home/kali');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeMission, setActiveMissionState] = useState<Mission | null>(null);
  const activeMissionRef = useRef<Mission | null>(null);
  const setActiveMission = useCallback((mission: Mission | null) => {
    activeMissionRef.current = mission;
    setActiveMissionState(mission);
  }, []);

  const [missionStep, setMissionStepState] = useState(0);
  const missionStepRef = useRef(0);
  const setMissionStep = useCallback((step: number) => {
    missionStepRef.current = step;
    setMissionStepState(step);
  }, []);

  const [completedMissions, setCompletedMissionsState] = useState<string[]>([]);
  const completedMissionsRef = useRef<string[]>([]);
  const setCompletedMissions = useCallback((val: string[] | ((prev: string[]) => string[])) => {
    if (typeof val === 'function') {
      setCompletedMissionsState(prev => {
        const next = val(prev);
        completedMissionsRef.current = next;
        return next;
      });
    } else {
      completedMissionsRef.current = val;
      setCompletedMissionsState(val);
    }
  }, []);
  const [isMissionPanelOpen, setIsMissionPanelOpen] = useState(false);
  const [uptime, setUptime] = useState(0);
  const [commandCount, setCommandCount] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  // Docker Engine Mode State & Subscription
  const [engineMode, setEngineMode] = useState<EngineMode>(terminalStore.getEngineMode());
  const [dockerStatus, setDockerStatus] = useState<DockerConnectionStatus>(terminalStore.getDockerStatus());
  const [isDockerModalOpen, setIsDockerModalOpen] = useState(false);
  const [pendingModalCmd, setPendingModalCmd] = useState<string | undefined>(undefined);

  const [dispatchedDockerCmds, setDispatchedDockerCmds] = useState<string[]>([]);
  // Holds the most recently dispatched command — shown as a persistent banner above the real-docker iframe
  const [dockerQueuedCmd, setDockerQueuedCmd] = useState<string | null>(null);
  const [dockerCmdCopied, setDockerCmdCopied] = useState(false);
  const [clickedDispatchedCmd, setClickedDispatchedCmd] = useState<string | null>(null);

  // ── On-mount: read any cross-navigation command from sessionStorage ────────
  // This is the most reliable approach: sessionStorage is written BEFORE navigate()
  // so it's always available when this effect fires, regardless of React render timing.
  useEffect(() => {
    try {
      const cmd = sessionStorage.getItem('shellstack_pending_cmd');
      const mode = sessionStorage.getItem('shellstack_pending_mode') as 'execute' | 'paste' | null;
      if (cmd && cmd.trim()) {
        sessionStorage.removeItem('shellstack_pending_cmd');
        sessionStorage.removeItem('shellstack_pending_mode');
        const trimmed = cmd.trim();
        if (terminalStore.getEngineMode() === 'real-docker') {
          setDockerQueuedCmd(trimmed);
          setDockerCmdCopied(false);
          setDispatchedDockerCmds(prev => [trimmed, ...prev.filter(c => c !== trimmed).slice(0, 19)]);
        } else {
          // Simulated mode — execute or paste
          if (mode === 'paste') {
            setInputValue(trimmed);
            setTimeout(() => { inputRef.current?.focus(); }, 80);
          } else {
            // Use a tiny delay so the terminal is fully initialised
            setTimeout(() => executeCommandRef.current(trimmed), 80);
          }
        }
      }
    } catch {
      // sessionStorage blocked in this context, ignore
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const unsubEngine = terminalStore.subscribeEngine((mode, status) => {
      setEngineMode(mode);
      setDockerStatus(status);
    });

    const unsubModal = terminalStore.subscribeModal((commandToRun) => {
      setPendingModalCmd(commandToRun);
      setIsDockerModalOpen(true);
    });

    terminalStore.startConnectionPolling(5000);

    return () => {
      unsubEngine();
      unsubModal();
      terminalStore.stopConnectionPolling();
    };
  }, []);

  // Memoize Docker Terminal iframe ONLY on engineMode+dockerStatus changes.
  // NEVER include transient state (toast, etc.) here — that would reload the iframe!
  const dockerIframeMemo = useMemo(() => {
    if (engineMode !== 'real-docker' || dockerStatus !== 'connected') return null;
    return (
      <iframe
        src="http://localhost:7681"
        className="w-full h-full border-none outline-none flex-1"
        title="Real Kali Linux Live Terminal"
        style={{ minHeight: '420px' }}
      />
    );
  }, [engineMode, dockerStatus]);

  //  Auto-suggest matching 
  useEffect(() => {
    if (!inputValue) {
      setSuggestion('');
      return;
    }
    const query = inputValue.toLowerCase();

    // 1. Check history first (most recent)
    const historyMatch = [...commandHistory].reverse().find(c =>
      c.toLowerCase().startsWith(query) && c.toLowerCase() !== query
    );
    if (historyMatch) {
      setSuggestion(historyMatch);
      return;
    }

    // 2. Check system commands and tools registry
    const allCmds = [
      'help', 'clear', 'cls', 'ls', 'cd', 'pwd', 'cat', 'echo', 'whoami',
      'hostname', 'id', 'date', 'uname', 'neofetch', 'ifconfig', 'history',
      'mission', 'man', 'ping',
      ...toolSimulations.map(t => t.name),
      ...toolSimulations.flatMap(t => t.aliases || []),
    ];
    const registryMatch = allCmds.find(c =>
      c.toLowerCase().startsWith(query) && c.toLowerCase() !== query
    );
    if (registryMatch) {
      setSuggestion(registryMatch);
      return;
    }

    setSuggestion('');
  }, [inputValue, commandHistory]);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const animCancelRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);

  //  Uptime counter 
  useEffect(() => {
    const timer = setInterval(() => setUptime(u => u + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  //  Welcome banner on mount 
  useEffect(() => {
    setOutputLines([...welcomeBanner]);
  }, []);

  //  Auto-scroll & Resize tracking 
  useEffect(() => {
    if (outputRef.current) {
      requestAnimationFrame(() => {
        if (outputRef.current) {
          outputRef.current.scrollTo({ top: outputRef.current.scrollHeight, behavior: 'smooth' });
        }
      });
    }
  }, [outputLines]);

  useEffect(() => {
    const handleResize = () => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  //  Screen Glitch effect trigger 
  const triggerGlitch = useCallback(() => {
    setIsGlitching(true);
    const timer = setTimeout(() => setIsGlitching(false), 150);
    return () => clearTimeout(timer);
  }, []);

  //  Focus input on click anywhere 
  const focusInput = useCallback(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  //  Animation cleanup 
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  //  Animated output 
  const animateOutput = useCallback((lines: OutputLine[], onComplete?: () => void) => {
    setIsAnimating(true);
    animCancelRef.current = false;
    timeoutsRef.current = [];
    let totalDelay = 0;
    const baseDelay = 35;

    lines.forEach((line) => {
      const lineDelay = (line.delay || 0) + baseDelay;
      totalDelay += lineDelay;

      const t = window.setTimeout(() => {
        if (animCancelRef.current) return;
        setOutputLines(prev => [...prev, line]);
        if (line.color === 'red') {
          triggerGlitch();
        }
      }, totalDelay);
      timeoutsRef.current.push(t);
    });

    const endT = window.setTimeout(() => {
      setIsAnimating(false);
      onComplete?.();
    }, totalDelay + 50);
    timeoutsRef.current.push(endT);
  }, [triggerGlitch]);

  const skipAnimation = useCallback(() => {
    animCancelRef.current = true;
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
    setIsAnimating(false);
  }, []);

  //  Instant output (no animation) 
  const pushLines = useCallback((lines: OutputLine[]) => {
    setOutputLines(prev => [...prev, ...lines]);
    if (lines.some(l => l.color === 'red')) {
      triggerGlitch();
    }
  }, [triggerGlitch]);

  //  Filesystem commands 
  const handleLs = useCallback((args: string) => {
    const target = args.trim() || currentPath;
    const resolvedPath = args.trim() ? resolvePath(currentPath, args.trim()) : currentPath;
    const node = getNode(resolvedPath);

    if (!node || node.type !== 'dir') {
      pushLines([{ text: `ls: cannot access '${target}': No such file or directory`, color: 'red' }]);
      return;
    }

    const children = node.children || {};
    const entries = Object.entries(children).sort(([, a], [, b]) => {
      if (a.type === 'dir' && b.type !== 'dir') return -1;
      if (a.type !== 'dir' && b.type === 'dir') return 1;
      return 0;
    });

    if (entries.length === 0) {
      pushLines([{ text: '(empty directory)', color: 'dim' }]);
      return;
    }

    const lines: OutputLine[] = entries.map(([name, fsNode]) => ({
      text: fsNode.type === 'dir'
        ? `drwxr-xr-x  ${name}/`
        : `${fsNode.permissions || '-rw-r--r--'}  ${fsNode.size?.padStart(6) || '   0'}  ${name}`,
      color: fsNode.type === 'dir' ? 'blue' : (fsNode.permissions?.includes('x') ? 'green' : 'white'),
    }));

    pushLines(lines);
  }, [currentPath, pushLines]);

  const handleCd = useCallback((args: string) => {
    const target = args.trim() || '~';
    const resolvedPath = resolvePath(currentPath, target);
    const node = getNode(resolvedPath);

    if (!node) {
      pushLines([{ text: `bash: cd: ${target}: No such file or directory`, color: 'red' }]);
      return;
    }
    if (node.type !== 'dir') {
      pushLines([{ text: `bash: cd: ${target}: Not a directory`, color: 'red' }]);
      return;
    }

    setCurrentPath(resolvedPath);
  }, [currentPath, pushLines]);

  const handleCat = useCallback((args: string) => {
    const target = args.trim();
    if (!target) {
      pushLines([{ text: 'cat: missing file operand', color: 'red' }]);
      return;
    }

    const resolvedPath = resolvePath(currentPath, target);
    const node = getNode(resolvedPath);

    if (!node) {
      pushLines([{ text: `cat: ${target}: No such file or directory`, color: 'red' }]);
      return;
    }
    if (node.type === 'dir') {
      pushLines([{ text: `cat: ${target}: Is a directory`, color: 'red' }]);
      return;
    }

    const content = node.content || '';
    const lines: OutputLine[] = content.split('\n').map(line => {
      let color: OutputLine['color'] = 'white';
      if (line.startsWith('#')) color = 'cyan';
      else if (line.startsWith('[') || line.startsWith('!')) color = 'yellow';
      else if (line.includes('password') || line.includes('Permission denied')) color = 'red';
      return { text: line, color };
    });

    pushLines(lines);
  }, [currentPath, pushLines]);

  //  Mission commands 
  const handleMission = useCallback((args: string) => {
    const parts = args.trim().split(/\s+/);
    const subCmd = parts[0]?.toLowerCase();

    if (!subCmd || subCmd === 'list') {
      const lines: OutputLine[] = [
        { text: '', color: 'dim' },
        { text: '╔═══════════════════════════════════════════════╗', color: 'cyan' },
        { text: '║          AVAILABLE MISSIONS                    ║', color: 'cyan' },
        { text: '╚═══════════════════════════════════════════════╝', color: 'cyan' },
        { text: '', color: 'dim' },
      ];

      missions.forEach(m => {
        const isComplete = completedMissionsRef.current.includes(m.id);
        const isActive = activeMissionRef.current?.id === m.id;
        const status = isComplete ? '[✓] COMPLETED' : isActive ? '[~] IN PROGRESS' : '[ ] AVAILABLE';
        const diffColor: OutputLine['color'] =
          m.difficulty === 'beginner' ? 'green' :
          m.difficulty === 'intermediate' ? 'yellow' : 'red';

        lines.push(
          { text: `  ${m.icon}  ${m.title}`, color: isComplete ? 'dim' : 'white' },
          { text: `     ID: ${m.id}  •  Difficulty: ${m.difficulty.toUpperCase()}  •  ${status}`, color: diffColor },
          { text: `     ${m.description}`, color: 'dim' },
          { text: '', color: 'dim' },
        );
      });

      lines.push(
        { text: '  Usage: mission start <id>  |  mission abort', color: 'dim' },
        { text: '', color: 'dim' },
      );
      pushLines(lines);
      return;
    }

    if (subCmd === 'start') {
      const missionId = parts[1];
      const currentActive = activeMissionRef.current;
      if (currentActive) {
        pushLines([{ text: `[!] Mission "${currentActive.title}" already in progress. Use "mission abort" first.`, color: 'yellow' }]);
        return;
      }
      const mission = missions.find(m => m.id === missionId);
      if (!mission) {
        pushLines([{ text: `[!] Unknown mission: ${missionId}. Use "mission list" to see available missions.`, color: 'red' }]);
        return;
      }
      setActiveMission(mission);
      setMissionStep(0);
      const lines: OutputLine[] = [
        { text: '', color: 'dim' },
        { text: `══════════════════════════════════════`, color: 'cyan' },
        { text: `  ${mission.icon}  MISSION: ${mission.title.toUpperCase()}`, color: 'cyan' },
        { text: `  Difficulty: ${mission.difficulty.toUpperCase()}`, color: mission.difficulty === 'beginner' ? 'green' : mission.difficulty === 'intermediate' ? 'yellow' : 'red' },
        { text: `══════════════════════════════════════`, color: 'cyan' },
        { text: '', color: 'dim' },
        { text: `  ${mission.description}`, color: 'white' },
        { text: '', color: 'dim' },
        { text: `  STEP 1/${mission.steps.length}: ${mission.steps[0].instruction}`, color: 'yellow' },
        { text: `  [hint] Try using "${mission.steps[0].hint}"`, color: 'dim' },
        { text: '', color: 'dim' },
      ];
      pushLines(lines);
      return;
    }

    if (subCmd === 'abort') {
      const currentActive = activeMissionRef.current;
      if (!currentActive) {
        pushLines([{ text: '[!] No mission is currently active.', color: 'yellow' }]);
        return;
      }
      const name = currentActive.title;
      setActiveMission(null);
      setMissionStep(0);
      pushLines([
        { text: '', color: 'dim' },
        { text: `[✗] Mission "${name}" aborted.`, color: 'red' },
        { text: '', color: 'dim' },
      ]);
      return;
    }

    pushLines([{ text: `Unknown mission subcommand: ${subCmd}`, color: 'red' }]);
  }, [pushLines]);

  //  Check mission progress after command 
  const checkMissionProgress = useCallback((cmd: string) => {
    const currentMission = activeMissionRef.current;
    if (!currentMission) return;
    const currentStepIndex = missionStepRef.current;
    const step = currentMission.steps[currentStepIndex];
    if (!step) return;

    const cmdBase = cmd.trim().split(/\s+/)[0]?.toLowerCase();
    const matched = step.acceptedCommands.some(ac => cmdBase === ac.toLowerCase());

    if (matched) {
      const nextStep = currentStepIndex + 1;
      const missionLines: OutputLine[] = [
        { text: '', color: 'dim' },
        { text: `  ${step.successMessage}`, color: 'green' },
        { text: '', color: 'dim' },
      ];

      if (nextStep >= currentMission.steps.length) {
        // Mission complete!
        const completionLines: OutputLine[] = currentMission.completionArt.map(line => ({
          text: line, color: 'green' as const,
        }));
        missionLines.push(...completionLines);
        setCompletedMissions(prev => [...prev, currentMission.id]);
        setActiveMission(null);
        setMissionStep(0);
      } else {
        const next = currentMission.steps[nextStep];
        missionLines.push(
          { text: `  STEP ${nextStep + 1}/${currentMission.steps.length}: ${next.instruction}`, color: 'yellow' },
          { text: `  [hint] Try using "${next.hint}"`, color: 'dim' },
          { text: '', color: 'dim' },
        );
        setMissionStep(nextStep);
      }

      // Small delay so it appears after the tool output
      setTimeout(() => pushLines(missionLines), 100);
    }
  }, [pushLines]);

  //  Tab completion 
  const handleTab = useCallback((value: string) => {
    const parts = value.split(/\s+/);
    const isFirstWord = parts.length <= 1;

    if (isFirstWord) {
      // Complete command names
      const partial = parts[0]?.toLowerCase() || '';
      const allCmds = [
        'help', 'clear', 'cls', 'ls', 'cd', 'pwd', 'cat', 'echo', 'whoami',
        'hostname', 'id', 'date', 'uname', 'neofetch', 'ifconfig', 'history',
        'mission', 'man', 'ping',
        ...toolSimulations.map(t => t.name),
        ...toolSimulations.flatMap(t => t.aliases || []),
      ];
      const matches = allCmds.filter(c => c.startsWith(partial));
      if (matches.length === 1) {
        setInputValue(matches[0] + ' ');
      } else if (matches.length > 1) {
        pushLines([
          { text: `kali@shellstack:${getPathDisplay(currentPath)}$ ${value}`, color: 'dim' },
          { text: matches.join('  '), color: 'cyan' },
        ]);
      }
    } else {
      // Complete paths
      const partial = parts[parts.length - 1] || '';
      const dirPath = partial.includes('/')
        ? resolvePath(currentPath, partial.substring(0, partial.lastIndexOf('/') + 1))
        : currentPath;
      const baseName = partial.includes('/') ? partial.substring(partial.lastIndexOf('/') + 1) : partial;
      const node = getNode(dirPath);

      if (node?.type === 'dir' && node.children) {
        const matches = Object.keys(node.children).filter(k => k.startsWith(baseName));
        if (matches.length === 1) {
          const match = matches[0];
          const prefix = partial.includes('/')
            ? partial.substring(0, partial.lastIndexOf('/') + 1)
            : '';
          const child = node.children[match];
          const suffix = child.type === 'dir' ? '/' : ' ';
          parts[parts.length - 1] = prefix + match + suffix;
          setInputValue(parts.join(' '));
        } else if (matches.length > 1) {
          pushLines([
            { text: `kali@shellstack:${getPathDisplay(currentPath)}$ ${value}`, color: 'dim' },
            { text: matches.join('  '), color: 'cyan' },
          ]);
        }
      }
    }
  }, [currentPath, pushLines]);

  // Stable ref so the [] subscribe effect can always call the latest executeCommand
  const executeCommandRef = useRef<(cmd: string) => void>(() => {});

  //  Command executor 
  const executeCommand = useCallback((rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    // Add prompt line to output
    pushLines([{
      text: `kali@shellstack:${getPathDisplay(currentPath)}$ ${cmd}`,
      color: 'green',
    }]);

    // Update history
    setCommandHistory(prev => {
      const filtered = prev.filter(c => c !== cmd);
      return [...filtered, cmd];
    });
    setHistoryIndex(-1);
    setCommandCount(c => c + 1);

    // Parse command
    const parts = cmd.split(/\s+/);
    const base = parts[0].toLowerCase();
    const args = cmd.substring(parts[0].length).trim();

    // Check easter eggs first (exact match)
    const easterEggKey = Object.keys(easterEggs).find(k => cmd.toLowerCase() === k.toLowerCase());
    if (easterEggKey) {
      animateOutput(easterEggs[easterEggKey]);
      return;
    }

    // Built-in commands
    switch (base) {
      case 'help':
        pushLines(helpOutput);
        return;

      case 'clear':
      case 'cls':
        setOutputLines([]);
        return;

      case 'ls':
        handleLs(args);
        return;

      case 'cd':
        handleCd(args);
        return;

      case 'pwd':
        pushLines([{ text: currentPath, color: 'white' }]);
        return;

      case 'cat':
        handleCat(args);
        checkMissionProgress(cmd);
        return;

      case 'echo':
        pushLines([{ text: args, color: 'white' }]);
        return;

      case 'whoami':
        pushLines([{ text: 'kali', color: 'green' }]);
        return;

      case 'hostname':
        pushLines([{ text: 'shellstack', color: 'white' }]);
        return;

      case 'id':
        pushLines([{ text: 'uid=1000(kali) gid=1000(kali) groups=1000(kali),4(adm),20(dialout),24(cdrom),25(floppy),27(sudo),29(audio),30(dip),44(video),46(plugdev),100(users),107(netdev),113(bluetooth),117(scanner)', color: 'white' }]);
        return;

      case 'uname':
        pushLines([{ text: unameOutput, color: 'white' }]);
        return;

      case 'date':
        pushLines([{ text: new Date().toString(), color: 'white' }]);
        return;

      case 'neofetch':
        pushLines(neofetchOutput);
        return;

      case 'ifconfig':
      case 'ip':
        pushLines(ifconfigOutput);
        return;

      case 'history':
        pushLines(commandHistory.map((c, i) => ({
          text: `  ${String(i + 1).padStart(4)}  ${c}`,
          color: 'white' as const,
        })));
        return;

      case 'man':
        if (!args) {
          pushLines([{ text: 'What manual page do you want?', color: 'yellow' }]);
        } else {
          const tool = toolSimulations.find(t => t.name === args || t.aliases?.includes(args));
          if (tool) {
            pushLines([
              { text: `${tool.name.toUpperCase()}(1)`, color: 'cyan' },
              { text: '', color: 'dim' },
              { text: 'NAME', color: 'yellow' },
              { text: `    ${tool.name} — ${tool.description}`, color: 'white' },
              { text: '', color: 'dim' },
              { text: 'CATEGORY', color: 'yellow' },
              { text: `    ${tool.category}`, color: 'white' },
              { text: '', color: 'dim' },
              { text: 'DESCRIPTION', color: 'yellow' },
              { text: `    ${tool.description}. This is a simulated output in ShellStack.`, color: 'white' },
              { text: `    Type "${tool.name}" with arguments to see a realistic simulation.`, color: 'dim' },
              { text: '', color: 'dim' },
            ]);
          } else {
            pushLines([{ text: `No manual entry for ${args}`, color: 'red' }]);
          }
        }
        return;

      case 'mission':
        handleMission(args);
        return;

      case 'touch':
      case 'mkdir':
        pushLines([{ text: `${base}: operation simulated (changes not persisted)`, color: 'dim' }]);
        return;

      case 'sudo':
        if (cmd.toLowerCase().startsWith('sudo rm')) {
          animateOutput(easterEggs['sudo rm -rf /'] || [{ text: 'Permission denied.', color: 'red' }]);
          return;
        }
        if (cmd.toLowerCase() === 'sudo make me a sandwich') {
          pushLines(easterEggs['sudo make me a sandwich']);
          return;
        }
        pushLines([
          { text: '[sudo] password for kali: ********', color: 'white' },
          { text: 'Sorry, try again.', color: 'red' },
        ]);
        return;

      case 'grep':
      case 'find':
      case 'awk':
      case 'sed':
      case 'chmod':
      case 'chown':
        pushLines([{ text: `${base}: command recognized but not simulated in this terminal.`, color: 'dim' }]);
        return;

      default:
        break;
    }

    // Tool simulations
    const tool = toolSimulations.find(t =>
      t.name === base || t.aliases?.includes(base)
    );
    if (tool) {
      const output = tool.getOutput(args);
      animateOutput(output, () => {
        checkMissionProgress(cmd);
      });
      return;
    }

    // Dynamic Intelligent Command Simulation for any tool in the catalog
    const targetMatch = cmd.match(/(?:https?:\/\/|[\w-]+\.[\w.-]+|\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b)/i);
    const target = targetMatch ? targetMatch[0] : 'target.local';

    const dynamicOutput: OutputLine[] = [
      { text: `[+] Initializing ${base} security module (v4.2.0-kali)...`, color: 'cyan', delay: 80 },
      { text: `[*] Command string: "${cmd}"`, color: 'dim', delay: 140 },
      { text: `[*] Target host: ${target}`, color: 'white', delay: 200 },
      { text: `[*] Establishing secure sockets & analyzing payload signatures...`, color: 'dim', delay: 350 },
      { text: `[+] [THREAD 01] Scanning ports and protocols on ${target}`, color: 'green', delay: 500 },
      { text: `[+] [THREAD 02] Task completed successfully. 0 critical errors.`, color: 'yellow', delay: 700 },
      { text: `[+] Execution finished. Output logged to /var/log/shellstack/${base}.log`, color: 'green', delay: 900 },
    ];

    animateOutput(dynamicOutput, () => {
      checkMissionProgress(cmd);
    });
  }, [currentPath, commandHistory, animateOutput, pushLines, handleLs, handleCd, handleCat, handleMission, checkMissionProgress]);

  // Keep executeCommandRef in sync with latest closure
  useEffect(() => {
    executeCommandRef.current = executeCommand;
  }, [executeCommand]);

  // Subscribe to global terminalStore command dispatches
  // IMPORTANT: dep array is [] so this never re-subscribes — avoids race where pendingPayload
  // gets consumed by the first subscription then lost when executeCommand ref changes.
  useEffect(() => {
    const unsubscribe = terminalStore.subscribe((payload) => {
      if (!payload || !payload.command) return;

      if (terminalStore.getEngineMode() === 'real-docker') {
        const cmd = payload.command;
        // Store in dispatch log
        setDispatchedDockerCmds(prev => [cmd, ...prev.filter(c => c !== cmd).slice(0, 19)]);
        // Surface as a persistent banner (clipboard write happens via user-gesture in the banner button)
        setDockerQueuedCmd(cmd);
        setDockerCmdCopied(false);
      } else {
        // executeCommand ref captured at mount — safe to call directly since simulated mode
        // doesn't need fresh closures for Docker handling
        if (payload.mode === 'paste') {
          setInputValue(payload.command);
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
              const len = payload.command.length;
              inputRef.current.setSelectionRange(len, len);
            }
          }, 50);
        } else {
          // Use the ref pattern to always call the latest executeCommand
          executeCommandRef.current(payload.command);
        }
      }
    });
    return unsubscribe;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  //  Key handlers 
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (isAnimating) {
        skipAnimation();
        return;
      }
      const val = inputValue;
      setInputValue('');
      executeCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInputValue(commandHistory[newIndex] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInputValue('');
      } else {
        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex] || '');
      }
    } else if (e.key === 'ArrowRight') {
      if (inputRef.current && inputRef.current.selectionStart === inputValue.length && suggestion) {
        e.preventDefault();
        setInputValue(suggestion);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestion) {
        setInputValue(suggestion);
      } else {
        handleTab(inputValue);
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setOutputLines([]);
    }
  }, [inputValue, isAnimating, commandHistory, historyIndex, executeCommand, skipAnimation, handleTab, suggestion]);

  //  Format uptime 
  const formatUptime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  //  Render 
  return (
    <section
      id="terminal"
      data-terminal-section="true"
      className="relative w-full min-h-[calc(100dvh-4rem)] pt-20 md:pt-24 pb-6 md:pb-10 px-3 md:px-6 lg:px-12 flex items-start justify-center"
    >
      <div className="relative w-full max-w-screen-2xl flex flex-col lg:flex-row gap-4 h-[calc(100dvh-7rem)] md:h-[calc(100dvh-9rem)]">

        {/* Desktop Sidebar (Swaps between Missions in Simulated mode and Container Telemetry in Real Kali mode) */}
        <aside className="hidden lg:flex flex-col w-72 shrink-0 cyber-panel overflow-hidden">
          {engineMode === 'real-docker' ? (
            <>
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(243,245,249,0.08)] bg-[rgba(57,255,20,0.04)]">
                <Server className="w-4 h-4 text-[#39FF14]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#39FF14] font-bold">Kali Telemetry</span>
                <span className={`ml-auto w-2 h-2 rounded-full ${dockerStatus === 'connected' ? 'bg-[#39FF14] shadow-[0_0_8px_#39FF14]' : 'bg-[#FF2D2D]'}`} />
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs scrollbar-hide">
                <div className="p-3 bg-[#05060B] border border-[rgba(57,255,20,0.2)] rounded-xl space-y-2">
                  <div className="text-[10px] text-[#A7B0BC] uppercase tracking-widest font-bold">CONTAINER ENGINE</div>
                  <div className="text-[#39FF14] font-bold truncate">shellstack-kali</div>
                  <div className="text-[10px] text-[#A7B0BC]">ws://localhost:7681</div>
                  <div className="text-[10px] text-[#00F0FF] uppercase">kalilinux/kali-rolling</div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] text-[#A7B0BC] uppercase tracking-widest font-bold flex items-center justify-between">
                    <span>COMMAND DISPATCHES</span>
                    <span className="text-[#00F0FF]">{dispatchedDockerCmds.length}</span>
                  </div>
                  {dispatchedDockerCmds.length === 0 ? (
                    <p className="text-[11px] text-[#606878] italic leading-relaxed">
                      Click "Run" or "Paste" on any tool or builder page to dispatch commands directly to your live Kali shell.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {dispatchedDockerCmds.map((cmd, i) => {
                        const isCopied = clickedDispatchedCmd === cmd;
                        return (
                          <button
                            key={i}
                            onClick={() => {
                              try {
                                navigator.clipboard.writeText(cmd);
                              } catch {}
                              if (engineMode === 'real-docker') {
                                setDockerQueuedCmd(cmd);
                                setDockerCmdCopied(true);
                                setTimeout(() => setDockerCmdCopied(false), 3000);
                              } else {
                                executeCommandRef.current(cmd);
                              }
                              setClickedDispatchedCmd(cmd);
                              setTimeout(() => setClickedDispatchedCmd(null), 2500);
                            }}
                            className={`w-full text-left p-2.5 rounded-lg text-[11px] font-mono group cursor-pointer transition-all flex items-center justify-between gap-2 border ${
                              isCopied
                                ? 'bg-[rgba(57,255,20,0.15)] border-[#39FF14] text-[#39FF14]'
                                : 'bg-[#05060B] border-[rgba(243,245,249,0.08)] hover:border-[rgba(57,255,20,0.4)] text-[#00F0FF]'
                            }`}
                            title="Click to copy & activate command in terminal"
                          >
                            <span className="truncate flex-1">
                              <span className="text-[#39FF14] mr-1">$</span>
                              {cmd}
                            </span>
                            {isCopied && (
                              <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#39FF14] text-[#050A05]">
                                {engineMode === 'real-docker' ? 'COPIED & QUEUED!' : 'EXECUTED!'}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Sidebar Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[rgba(243,245,249,0.08)] bg-[rgba(57,255,20,0.03)]">
                <TbShieldCheck className="w-4 h-4 text-[#39FF14]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#39FF14] font-bold">Missions</span>
                <span className="ml-auto text-[10px] font-mono text-[#A7B0BC]">{completedMissions.length}/{missions.length}</span>
              </div>

              {/* Mission List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide">
                {missions.map(m => {
                  const isComplete = completedMissions.includes(m.id);
                  const isActive = activeMission?.id === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        if (isActive) return;
                        if (activeMission) {
                          executeCommand(`mission abort`);
                          executeCommand(`mission start ${m.id}`);
                        } else {
                          executeCommand(`mission start ${m.id}`);
                        }
                      }}
                      disabled={isComplete}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-300 group ${
                        isActive
                          ? 'bg-[rgba(57,255,20,0.1)] border-[rgba(57,255,20,0.3)] shadow-[0_0_15px_rgba(57,255,20,0.1)]'
                          : isComplete
                            ? 'bg-[rgba(255,255,255,0.02)] border-[rgba(243,245,249,0.05)] opacity-60'
                            : 'bg-[rgba(255,255,255,0.02)] border-[rgba(243,245,249,0.08)] hover:border-[rgba(57,255,20,0.2)] hover:bg-[rgba(57,255,20,0.04)]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 mb-2">
                        {getMissionIconBadge(m.id, isActive, 'md')}
                        <span className={`text-xs font-bold font-mono leading-tight mt-1 ${isActive ? 'text-[#39FF14]' : isComplete ? 'text-[#606878]' : 'text-[#F2F5F9]'}`}>
                          {m.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A7B0BC] line-clamp-2 leading-relaxed mb-2">
                        {m.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 text-[9px] font-mono rounded uppercase border ${
                          m.difficulty === 'beginner'
                            ? 'text-[#39FF14] border-[rgba(57,255,20,0.3)] bg-[rgba(57,255,20,0.05)]'
                            : m.difficulty === 'intermediate'
                              ? 'text-[#FFE600] border-[rgba(255,230,0,0.3)] bg-[rgba(255,230,0,0.05)]'
                              : 'text-[#FF2D2D] border-[rgba(255,45,45,0.3)] bg-[rgba(255,45,45,0.05)]'
                        }`}>
                          {m.difficulty}
                        </span>
                        {isComplete && <BsCheckCircleFill className="w-3.5 h-3.5 text-[#39FF14]" />}
                      </div>
                      {isActive && (
                        <div className="mt-2 w-full h-1 bg-[rgba(243,245,249,0.1)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#39FF14] rounded-full transition-all duration-500"
                            style={{ width: `${(missionStep / m.steps.length) * 100}%` }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </aside>

        {/*  Mobile Mission Toggle  */}
        <button
          onClick={() => setIsMissionPanelOpen(!isMissionPanelOpen)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 cyber-panel text-xs font-mono text-[#39FF14] uppercase tracking-wider shrink-0"
        >
          <TbShieldCheck className="w-3.5 h-3.5" />
          Missions ({completedMissions.length}/{missions.length})
          {activeMission && (
            <span className="ml-auto text-[#FFE600] animate-pulse text-[10px]">
              • {activeMission.title} — Step {missionStep + 1}/{activeMission.steps.length}
            </span>
          )}
          <BsChevronRight className={`w-3.5 h-3.5 ml-auto transition-transform ${isMissionPanelOpen ? 'rotate-90' : ''}`} />
        </button>

        {/*  Mobile Mission Panel  */}
        {isMissionPanelOpen && (
          <div className="lg:hidden cyber-panel p-3 space-y-2 shrink-0 max-h-[40vh] overflow-y-auto scrollbar-hide">
            {missions.map(m => {
              const isComplete = completedMissions.includes(m.id);
              const isActive = activeMission?.id === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    if (isActive) return;
                    if (activeMission) {
                      executeCommand(`mission abort`);
                      executeCommand(`mission start ${m.id}`);
                    } else {
                      executeCommand(`mission start ${m.id}`);
                    }
                    setIsMissionPanelOpen(false);
                  }}
                  disabled={isComplete}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isActive ? 'bg-[rgba(57,255,20,0.1)] border-[rgba(57,255,20,0.3)]'
                    : isComplete ? 'opacity-50 border-[rgba(243,245,249,0.05)]'
                    : 'border-[rgba(243,245,249,0.08)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {getMissionIconBadge(m.id, isActive, 'sm')}
                    <span className={`text-xs font-bold ${isActive ? 'text-[#39FF14]' : 'text-[#F2F5F9]'}`}>{m.title}</span>
                    {isComplete && <BsCheckCircleFill className="ml-auto w-3.5 h-3.5 text-[#39FF14]" />}
                    {isActive && <span className="ml-auto text-[10px] text-[#FFE600] animate-pulse">Step {missionStep + 1}/{m.steps.length}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/*  Main Terminal Panel  */}
        <div className={`flex-1 cyber-panel flex flex-col overflow-hidden min-h-0 terminal-container ${isGlitching ? 'terminal-flicker' : ''}`} onClick={focusInput}>

          {/* Terminal Engine Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3 md:px-4 py-2 border-b border-[rgba(243,245,249,0.08)] bg-[rgba(5,6,11,0.95)] shrink-0 select-none">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#A7B0BC] uppercase tracking-wider font-bold hidden sm:inline">ENGINE:</span>
              <div className="flex items-center p-0.5 bg-[#0B0E16] border border-[rgba(243,245,249,0.1)] rounded-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    terminalStore.setEngineMode('simulated');
                  }}
                  className={`px-2.5 py-1 rounded text-[10px] md:text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    engineMode === 'simulated'
                      ? 'bg-[rgba(57,255,20,0.2)] text-[#39FF14] border border-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                      : 'text-[#A7B0BC] hover:text-[#F2F5F9]'
                  }`}
                  title="Browser simulated terminal (Instant & free)"
                >
                  <Cpu className="w-3 h-3 text-[#39FF14]" />
                  <span>Simulated</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    terminalStore.setEngineMode('real-docker');
                    if (dockerStatus !== 'connected') {
                      setIsDockerModalOpen(true);
                    }
                  }}
                  className={`px-2.5 py-1 rounded text-[10px] md:text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    engineMode === 'real-docker'
                      ? dockerStatus === 'connected'
                        ? 'bg-[rgba(57,255,20,0.2)] text-[#39FF14] border border-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.3)]'
                        : 'bg-[rgba(255,45,45,0.2)] text-[#FF2D2D] border border-[#FF2D2D] shadow-[0_0_10px_rgba(255,45,45,0.3)]'
                      : 'text-[#A7B0BC] hover:text-[#F2F5F9]'
                  }`}
                  title="Real Kali Linux in local Docker container"
                >
                  <Server className="w-3 h-3 text-[#00F0FF]" />
                  <span>Real Kali Docker</span>
                  <span className={`w-2 h-2 rounded-full ${dockerStatus === 'connected' ? 'bg-[#39FF14] shadow-[0_0_6px_#39FF14]' : 'bg-[#FF2D2D]'}`} />
                </button>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDockerModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] md:text-xs font-mono text-[#00F0FF] bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.3)] rounded-lg hover:bg-[rgba(0,240,255,0.2)] transition-all cursor-pointer"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Connect Docker</span>
            </button>
          </div>

          {/* Terminal Top Bar */}
          <div className="flex items-center justify-between h-10 md:h-11 px-3 md:px-4 border-b border-[rgba(243,245,249,0.08)] bg-[rgba(255,255,255,0.02)] shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF2D2D] hover:brightness-125 transition-all" />
              <div className="w-3 h-3 rounded-full bg-[#FFE600] hover:brightness-125 transition-all" />
              <div className="w-3 h-3 rounded-full bg-[#39FF14] hover:brightness-125 transition-all" />
            </div>

            <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-[#A7B0BC]">
              <RiTerminalBoxLine className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#39FF14]" />
              <span className="hidden sm:inline">kali@shellstack</span>
              <span className="sm:hidden">shellstack</span>
              <span className="text-[#39FF14]">—</span>
              <span className="hidden md:inline">{engineMode === 'real-docker' ? 'docker (ws://localhost:7681)' : 'bash'}</span>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-[#606878]">
              <span className="hidden md:flex items-center gap-1">
                <TbClockHour4 className="w-3 h-3" />
                {formatUptime(uptime)}
              </span>
              <span className="hidden sm:flex items-center gap-1 text-[#39FF14]">
                <BsWifi className="w-3 h-3" />
                <span className="hidden md:inline">SECURE</span>
              </span>
              {/* Refresh / Reset button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  skipAnimation();
                  setOutputLines([...welcomeBanner]);
                  setInputValue('');
                  setCurrentPath('/home/kali');
                  setActiveMission(null);
                  setMissionStep(0);
                }}
                title="Reset terminal"
                className="group flex items-center justify-center w-6 h-6 rounded border border-[rgba(57,255,20,0.35)] bg-[rgba(57,255,20,0.08)] hover:border-[rgba(57,255,20,0.7)] hover:bg-[rgba(57,255,20,0.18)] text-[#39FF14] shadow-[0_0_6px_rgba(57,255,20,0.2)] hover:shadow-[0_0_10px_rgba(57,255,20,0.4)] transition-all duration-200 ml-1"
              >
                <BsArrowRepeat className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 drop-shadow-[0_0_3px_rgba(57,255,20,0.8)]" />
              </button>
            </div>
          </div>

          {/* Main Terminal Engine View */}
          {engineMode === 'real-docker' ? (
            dockerStatus === 'connected' ? (
              // Banner sits ABOVE the iframe as a flex child — no absolute overlay, no clipping
              <div className="flex-1 flex flex-col min-h-0">
                {/* ── Command Ready Notification Bar ─────────────────────── */}
                {dockerQueuedCmd && (
                  <div className="shrink-0 relative overflow-hidden">
                    {/* Animated top edge glow */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#39FF14] to-transparent animate-pulse" />
                    {/* Subtle bottom separator */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(57,255,20,0.4)] to-transparent" />

                    <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-[#060A0F] via-[#071209] to-[#060A0F]">

                      {/* Status indicator */}
                      <div className="relative shrink-0">
                        <div className="w-2 h-2 rounded-full bg-[#39FF14] shadow-[0_0_8px_#39FF14]" />
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#39FF14] animate-ping opacity-60" />
                      </div>

                      {/* Label */}
                      <span className="shrink-0 text-[9px] font-mono font-black text-[#39FF14] uppercase tracking-[0.25em] hidden sm:block">
                        CMD READY
                      </span>

                      {/* Separator */}
                      <span className="shrink-0 text-[rgba(57,255,20,0.25)] text-lg hidden sm:block">│</span>

                      {/* Command display */}
                      <div className="flex-1 min-w-0 flex items-center gap-2 bg-[rgba(0,0,0,0.4)] border border-[rgba(57,255,20,0.2)] rounded-lg px-3 py-1.5 font-mono text-xs overflow-hidden">
                        <span className="text-[#39FF14] shrink-0 font-bold">$</span>
                        <code className="text-[#E8F5E9] truncate">{dockerQueuedCmd}</code>
                      </div>

                      {/* Copy + paste hint button */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(dockerQueuedCmd!).then(() => {
                            setDockerCmdCopied(true);
                            setTimeout(() => setDockerCmdCopied(false), 3000);
                          }).catch(() => {
                            setDockerCmdCopied(true);
                            setTimeout(() => setDockerCmdCopied(false), 3000);
                          });
                        }}
                        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                          dockerCmdCopied
                            ? 'bg-[#39FF14] text-[#050A05] shadow-[0_0_16px_rgba(57,255,20,0.6)]'
                            : 'bg-[rgba(57,255,20,0.12)] border border-[rgba(57,255,20,0.45)] text-[#39FF14] hover:bg-[rgba(57,255,20,0.22)] hover:shadow-[0_0_12px_rgba(57,255,20,0.3)] hover:border-[rgba(57,255,20,0.7)]'
                        }`}
                      >
                        {dockerCmdCopied ? (
                          <><Check className="w-3 h-3" /><span>Copied! → Ctrl+V</span></>
                        ) : (
                          <><Copy className="w-3 h-3" /><span className="hidden sm:inline">Copy &amp; Paste</span><span className="sm:hidden">Copy</span></>
                        )}
                      </button>

                      {/* Dismiss */}
                      <button
                        onClick={() => { setDockerQueuedCmd(null); terminalStore.clearDockerReadyCommand(); }}
                        className="shrink-0 flex items-center justify-center w-6 h-6 rounded text-[rgba(243,245,249,0.25)] hover:text-[#FF2D2D] hover:bg-[rgba(255,45,45,0.1)] transition-all cursor-pointer"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Iframe fills remaining space */}
                {dockerIframeMemo}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#05060B] min-h-[400px]">
                <div className="p-3 bg-[rgba(255,45,45,0.1)] border border-[rgba(255,45,45,0.3)] rounded-2xl text-[#FF2D2D] mb-4">
                  <Server className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#F2F5F9] font-mono mb-2">
                  Real Kali Docker Container Disconnected
                </h3>
                <p className="text-xs text-[#A7B0BC] max-w-md mb-6 leading-relaxed font-mono">
                  Start your local Docker container on port <code className="text-[#39FF14]">7681</code> to connect your real PC terminal environment directly into ShellStack.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setIsDockerModalOpen(true)}
                    className="px-4 py-2 text-xs font-mono font-bold text-[#00F0FF] bg-[rgba(0,240,255,0.15)] border border-[rgba(0,240,255,0.4)] rounded-xl hover:bg-[rgba(0,240,255,0.25)] transition-all cursor-pointer"
                  >
                    View Docker Setup Command
                  </button>
                  <button
                    onClick={() => terminalStore.setEngineMode('simulated')}
                    className="px-4 py-2 text-xs font-mono font-bold text-[#39FF14] bg-[rgba(57,255,20,0.15)] border border-[rgba(57,255,20,0.4)] rounded-xl hover:bg-[rgba(57,255,20,0.25)] transition-all cursor-pointer"
                  >
                    Switch to Simulated Mode
                  </button>
                </div>
              </div>
            )
          ) : (
            <>
              {/* Terminal Output */}
              <div
                ref={outputRef}
                data-lenis-prevent
                className="flex-1 overflow-y-auto px-3 md:px-5 py-3 font-mono text-[11px] md:text-[13px] leading-[1.65] terminal-output scrollbar-hide min-h-0 overscroll-contain"
              >
                {/* Scanline overlay */}
                <div className="terminal-scanline pointer-events-none" />

                {outputLines.map((line, i) => (
                  <div
                    key={i}
                    className={`${colorMap[line.color || 'white']} whitespace-pre-wrap break-all terminal-glow-text`}
                  >
                    {line.text || '\u00A0'}
                  </div>
                ))}

                {isAnimating && (
                  <div className="flex items-center gap-2 text-[#39FF14] animate-pulse">
                    <RiLoader4Line className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); skipAnimation(); }}
                      className="flex items-center gap-1 ml-1 text-[#606878] hover:text-[#A7B0BC] text-[10px] underline transition-colors"
                    >
                      <MdOutlineSkipNext className="w-3.5 h-3.5" />
                      skip
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Toolbar (only visible on mobile/tablet) */}
              <div className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border-t border-[rgba(243,245,249,0.05)] bg-[rgba(5,6,11,0.9)] overflow-x-auto scrollbar-hide shrink-0 select-none">
                <button
                  onClick={() => {
                    if (suggestion) {
                      setInputValue(suggestion);
                    } else {
                      handleTab(inputValue);
                    }
                  }}
                  onMouseDown={e => e.preventDefault()}
                  onTouchStart={e => e.preventDefault()}
                  className="px-2.5 py-1 rounded bg-[rgba(255,255,255,0.05)] active:bg-[rgba(57,255,20,0.15)] text-[#A7B0BC] active:text-[#39FF14] border border-[rgba(243,245,249,0.08)] font-mono text-[10px] transition-colors"
                >
                  TAB
                </button>
                <button
                  onClick={() => {
                    if (commandHistory.length === 0) return;
                    const newIndex = historyIndex === -1
                      ? commandHistory.length - 1
                      : Math.max(0, historyIndex - 1);
                    setHistoryIndex(newIndex);
                    setInputValue(commandHistory[newIndex] || '');
                  }}
                  onMouseDown={e => e.preventDefault()}
                  onTouchStart={e => e.preventDefault()}
                  className="px-2.5 py-1 rounded bg-[rgba(255,255,255,0.05)] active:bg-[rgba(57,255,20,0.15)] text-[#A7B0BC] active:text-[#39FF14] border border-[rgba(243,245,249,0.08)] font-mono text-[10px] transition-colors"
                >
                  ▲
                </button>
                <button
                  onClick={() => {
                    if (historyIndex === -1) return;
                    const newIndex = historyIndex + 1;
                    if (newIndex >= commandHistory.length) {
                      setHistoryIndex(-1);
                      setInputValue('');
                    } else {
                      setHistoryIndex(newIndex);
                      setInputValue(commandHistory[newIndex] || '');
                    }
                  }}
                  onMouseDown={e => e.preventDefault()}
                  onTouchStart={e => e.preventDefault()}
                  className="px-2.5 py-1 rounded bg-[rgba(255,255,255,0.05)] active:bg-[rgba(57,255,20,0.15)] text-[#A7B0BC] active:text-[#39FF14] border border-[rgba(243,245,249,0.08)] font-mono text-[10px] transition-colors"
                >
                  ▼
                </button>
                <button
                  onClick={() => setOutputLines([])}
                  onMouseDown={e => e.preventDefault()}
                  onTouchStart={e => e.preventDefault()}
                  className="px-2.5 py-1 rounded bg-[rgba(255,255,255,0.05)] active:bg-[rgba(57,255,20,0.15)] text-[#A7B0BC] active:text-[#39FF14] border border-[rgba(243,245,249,0.08)] font-mono text-[10px] transition-colors"
                >
                  CTRL+L
                </button>
                <div className="w-[1px] h-3 bg-[rgba(243,245,249,0.15)] mx-1 shrink-0" />
                <button
                  onClick={() => setInputValue(prev => prev + (prev.endsWith(' ') || prev === '' ? 'ls' : ' ls'))}
                  onMouseDown={e => e.preventDefault()}
                  onTouchStart={e => e.preventDefault()}
                  className="px-2.5 py-1 rounded bg-[rgba(255,255,255,0.05)] active:bg-[rgba(57,255,20,0.15)] text-[#A7B0BC] active:text-[#39FF14] border border-[rgba(243,245,249,0.08)] font-mono text-[10px] transition-colors"
                >
                  ls
                </button>
                <button
                  onClick={() => setInputValue(prev => prev + (prev.endsWith(' ') || prev === '' ? 'cd ..' : ' cd ..'))}
                  onMouseDown={e => e.preventDefault()}
                  onTouchStart={e => e.preventDefault()}
                  className="px-2.5 py-1 rounded bg-[rgba(255,255,255,0.05)] active:bg-[rgba(57,255,20,0.15)] text-[#A7B0BC] active:text-[#39FF14] border border-[rgba(243,245,249,0.08)] font-mono text-[10px] transition-colors"
                >
                  cd ..
                </button>
                <button
                  onClick={() => setInputValue(prev => prev + (prev.endsWith(' ') || prev === '' ? 'cat ' : ' cat '))}
                  onMouseDown={e => e.preventDefault()}
                  onTouchStart={e => e.preventDefault()}
                  className="px-2.5 py-1 rounded bg-[rgba(255,255,255,0.05)] active:bg-[rgba(57,255,20,0.15)] text-[#A7B0BC] active:text-[#39FF14] border border-[rgba(243,245,249,0.08)] font-mono text-[10px] transition-colors"
                >
                  cat
                </button>
                <button
                  onClick={() => setInputValue(prev => prev.endsWith(' ') || prev === '' ? 'help' : prev + ' help')}
                  onMouseDown={e => e.preventDefault()}
                  onTouchStart={e => e.preventDefault()}
                  className="px-2.5 py-1 rounded bg-[rgba(255,255,255,0.05)] active:bg-[rgba(57,255,20,0.15)] text-[#A7B0BC] active:text-[#39FF14] border border-[rgba(243,245,249,0.08)] font-mono text-[10px] transition-colors"
                >
                  help
                </button>
                <button
                  onClick={() => setInputValue(prev => prev.endsWith(' ') || prev === '' ? 'mission list' : prev + ' mission list')}
                  onMouseDown={e => e.preventDefault()}
                  onTouchStart={e => e.preventDefault()}
                  className="px-2.5 py-1 rounded bg-[rgba(255,255,255,0.05)] active:bg-[rgba(57,255,20,0.15)] text-[#A7B0BC] active:text-[#39FF14] border border-[rgba(243,245,249,0.08)] font-mono text-[10px] transition-colors"
                >
                  mission
                </button>
              </div>

              {/* Command Input */}
              <div className="flex items-center gap-1 md:gap-2 px-3 md:px-5 py-2.5 md:py-3 border-t border-[rgba(243,245,249,0.08)] bg-[rgba(5,6,11,0.8)] shrink-0">
                <span className="text-[#39FF14] font-mono text-[11px] md:text-[13px] shrink-0 select-none">
                  kali@shellstack:<span className="text-[#00F0FF]">{getPathDisplay(currentPath)}</span>$
                </span>
                <div className="relative flex items-center flex-1 min-w-0">
                  {suggestion && suggestion.toLowerCase().startsWith(inputValue.toLowerCase()) && (
                    <div className="absolute left-0 pointer-events-none select-none font-mono text-[11px] md:text-[13px] whitespace-pre text-[rgba(57,255,20,0.22)] leading-normal">
                      <span className="text-transparent">{inputValue}</span>
                      <span>{suggestion.slice(inputValue.length)}</span>
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent outline-none font-mono text-[11px] md:text-[13px] text-[#F2F5F9] caret-[#39FF14] min-w-0 placeholder:text-[rgba(57,255,20,0.25)] relative z-10 leading-normal terminal-input"
                    placeholder={isAnimating ? 'Press Enter to skip...' : activeMission ? `Hint: ${activeMission.steps[missionStep]?.hint || ''}` : 'Type a command...'}
                    autoFocus
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Bottom Status Bar */}
              <div className="flex items-center justify-between px-3 md:px-5 py-1.5 border-t border-[rgba(243,245,249,0.08)] bg-[rgba(5,6,11,0.85)] text-[9px] md:text-[10px] font-mono text-[#A7B0BC] shrink-0">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[#39FF14] font-semibold">
                    <BsLightningChargeFill className="w-2.5 h-2.5" />
                    {commandCount} cmds
                  </span>
                  <span className="hidden sm:inline text-[#C5CDD8]">bash 5.2</span>
                  <span className="hidden md:inline text-[#C5CDD8]">UTF-8</span>
                </div>
                <div className="flex items-center gap-3">
                  {activeMission && (
                    <span className="flex items-center gap-1 text-[#FFE600] font-semibold">
                      <MdGpsFixed className="w-3 h-3" />
                      {activeMission.title} [{missionStep + 1}/{activeMission.steps.length}]
                    </span>
                  )}
                  <span className="hidden sm:inline text-[#00F0FF]">{currentPath}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <DockerConnectModal
        isOpen={isDockerModalOpen}
        onClose={() => {
          setIsDockerModalOpen(false);
          setPendingModalCmd(undefined);
        }}
        pendingCommand={pendingModalCmd}
      />
    </section>
  );
};

export default LiveTerminal;
