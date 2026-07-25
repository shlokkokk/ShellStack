import { useState, useEffect } from 'react';
import { X, Copy, Check, RefreshCw, Cpu, Activity, Zap, Server, AlertTriangle, Terminal, Shield } from 'lucide-react';
import { terminalStore, type DockerConnectionStatus } from '../lib/terminalStore';

interface DockerConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingCommand?: string;
}

const DOCKER_COMMAND = `docker rm -f shellstack-kali; docker run -d --name shellstack-kali -p 7681:7681 --restart unless-stopped kalilinux/kali-rolling sh -c "apt-get update && apt-get install -y ttyd && ttyd -p 7681 -W bash"`;
const BRIDGED_COMMAND = `npx shellstack-bridge --port 7681`;

export const DockerConnectModal = ({ isOpen, onClose, pendingCommand }: DockerConnectModalProps) => {
  const [copiedDocker, setCopiedDocker] = useState(false);
  const [copiedBridge, setCopiedBridge] = useState(false);
  const [activeTab, setActiveTab] = useState<'docker' | 'bridge'>('docker');
  const [dockerStatus, setDockerStatus] = useState<DockerConnectionStatus>(terminalStore.getDockerStatus());
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const unsubscribe = terminalStore.subscribeEngine((_, status) => setDockerStatus(status));
    return unsubscribe;
  }, []);

  const handleTestConnection = async () => {
    setIsChecking(true);
    await terminalStore.checkDockerConnection();
    setIsChecking(false);
  };

  const copy = (text: string, cb: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    cb(true);
    setTimeout(() => cb(false), 2200);
  };

  const handleSwitchToSimulated = () => {
    terminalStore.setEngineMode('simulated');
    onClose();
    if (pendingCommand) terminalStore.dispatch(pendingCommand, 'execute');
  };

  if (!isOpen) return null;

  const isConnected = dockerStatus === 'connected';
  const isConnecting = dockerStatus === 'connecting';

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4 py-6 pt-20 bg-[#05060B]/90 backdrop-blur-xl">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-[680px] flex flex-col rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(57,255,20,0.12),0_0_0_1px_rgba(57,255,20,0.2)] bg-[#080C12]"
        style={{ maxHeight: 'calc(100vh - 100px)' }}
      >
        {/* ── Animated top glow bar ──────────────────────────────── */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#39FF14] to-transparent opacity-80" />
        {/* Scan-line background texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(57,255,20,1) 2px,rgba(57,255,20,1) 3px)', backgroundSize: '100% 4px' }}
        />

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div className="relative shrink-0 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[rgba(57,255,20,0.07)] via-transparent to-transparent border-b border-[rgba(57,255,20,0.12)]">
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.3)] flex items-center justify-center text-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.2)]">
                <Server className="w-5 h-5" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#080C12]"
                style={{ background: isConnected ? '#39FF14' : isConnecting ? '#FFE600' : '#FF2D2D',
                  boxShadow: isConnected ? '0 0 8px #39FF14' : isConnecting ? '0 0 8px #FFE600' : '0 0 8px #FF2D2D' }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-sm font-black font-mono tracking-tight text-[#F2F5F9]">
                  REAL KALI DOCKER ENGINE
                </h2>
                <span className="px-2 py-0.5 text-[9px] font-black font-mono uppercase tracking-widest rounded-md bg-[rgba(0,240,255,0.12)] text-[#00F0FF] border border-[rgba(0,240,255,0.3)]">
                  LOCAL_BRIDGE
                </span>
              </div>
              <p className="text-[11px] text-[#7A8494] font-mono mt-0.5">Run real offensive security commands on your PC</p>
            </div>
          </div>

          <button onClick={onClose}
            className="p-1.5 rounded-lg text-[#4A5568] hover:text-[#FF2D2D] hover:bg-[rgba(255,45,45,0.1)] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── STATUS BAR ─────────────────────────────────────────── */}
        <div className={`shrink-0 flex items-center justify-between gap-3 px-6 py-2.5 border-b border-[rgba(243,245,249,0.06)] ${
          isConnected ? 'bg-[rgba(57,255,20,0.04)]' : isConnecting ? 'bg-[rgba(255,230,0,0.04)]' : 'bg-[rgba(255,45,45,0.04)]'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`relative flex w-2.5 h-2.5`}>
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? 'animate-ping bg-[#39FF14]' : isConnecting ? 'animate-ping bg-[#FFE600]' : ''}`} />
              <span className={`relative inline-flex rounded-full w-2.5 h-2.5 ${isConnected ? 'bg-[#39FF14]' : isConnecting ? 'bg-[#FFE600]' : 'bg-[#FF2D2D]'}`}
                style={{ boxShadow: isConnected ? '0 0 8px #39FF14' : isConnecting ? '0 0 6px #FFE600' : '0 0 8px #FF2D2D' }}
              />
            </span>
            <span className={`text-[11px] font-black font-mono uppercase tracking-wider ${
              isConnected ? 'text-[#39FF14]' : isConnecting ? 'text-[#FFE600]' : 'text-[#FF2D2D]'
            }`}>
              {isConnected ? '● CONNECTED — ws://localhost:7681' : isConnecting ? '◌ PROBING LOCALHOST...' : '○ NOT CONNECTED'}
            </span>
          </div>

          <button onClick={handleTestConnection} disabled={isChecking}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold text-[#00F0FF] bg-[rgba(0,240,255,0.08)] border border-[rgba(0,240,255,0.25)] rounded-lg hover:bg-[rgba(0,240,255,0.15)] hover:border-[rgba(0,240,255,0.4)] transition-all cursor-pointer disabled:opacity-40"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'PINGING...' : 'PING TEST'}</span>
          </button>
        </div>

        {/* ── SCROLLABLE BODY ────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 min-h-0">

          {/* Pending command callout */}
          {pendingCommand && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(255,230,0,0.06)] border border-[rgba(255,230,0,0.2)]">
              <Zap className="w-4 h-4 text-[#FFE600] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-black font-mono uppercase tracking-widest text-[#FFE600] mb-1.5">
                  WAITING TO RUN
                </p>
                <code className="block text-xs text-[#F2F5F9] font-mono bg-[#05060B] px-3 py-2 rounded-lg border border-[rgba(255,230,0,0.15)] select-all">
                  {pendingCommand}
                </code>
              </div>
            </div>
          )}

          {/* Prerequisite notice */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[rgba(0,240,255,0.04)] border border-[rgba(0,240,255,0.15)]">
            <AlertTriangle className="w-4 h-4 text-[#00F0FF] shrink-0 mt-0.5" />
            <div className="text-[11px] font-mono leading-relaxed">
              <span className="text-[#F2F5F9] font-bold block mb-1">Prerequisite: Docker Desktop must be running</span>
              <span className="text-[#7A8494]">
                If you get <code className="text-[#FF2D2D] bg-[rgba(255,45,45,0.1)] px-1 rounded">failed to connect to docker API</code> in PowerShell, open <strong className="text-[#F2F5F9]">Docker Desktop</strong> first.
              </span>
            </div>
          </div>

          {/* Setup guide */}
          <div className="space-y-4">
            {/* Section header + tab switcher */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#39FF14]" />
                <span className="text-[10px] font-black font-mono uppercase tracking-[0.2em] text-[#39FF14]">
                  1-CLICK SETUP
                </span>
              </div>

              <div className="flex items-center p-0.5 bg-[#05060B] border border-[rgba(243,245,249,0.08)] rounded-lg">
                <button onClick={() => setActiveTab('docker')}
                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded transition-all cursor-pointer ${
                    activeTab === 'docker'
                      ? 'bg-[rgba(57,255,20,0.2)] text-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.2)]'
                      : 'text-[#4A5568] hover:text-[#A7B0BC]'
                  }`}
                >
                  🐋 Docker
                </button>
                <button onClick={() => setActiveTab('bridge')}
                  className={`px-3 py-1 text-[10px] font-mono font-bold rounded transition-all cursor-pointer ${
                    activeTab === 'bridge'
                      ? 'bg-[rgba(0,240,255,0.2)] text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                      : 'text-[#4A5568] hover:text-[#A7B0BC]'
                  }`}
                >
                  ⚡ NPX Bridge
                </button>
              </div>
            </div>

            {activeTab === 'docker' ? (
              <div className="space-y-3">
                {/* Steps */}
                {[
                  { n: '01', label: 'Install Docker Desktop', sub: 'download at docker.com/products/docker-desktop', color: 'text-[#00F0FF]' },
                  { n: '02', label: 'Start Docker Desktop', sub: 'open the app and wait for the whale icon to turn green', color: 'text-[#FFE600]' },
                  { n: '03', label: 'Run this command in PowerShell', sub: 'one paste — it downloads Kali Linux automatically', color: 'text-[#39FF14]' },
                ].map(({ n, label, sub, color }) => (
                  <div key={n} className="flex items-start gap-3">
                    <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black font-mono ${color} bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)]`}>
                      {n}
                    </span>
                    <div className="pt-0.5">
                      <p className="text-xs font-bold text-[#E2E8F0] font-mono">{label}</p>
                      <p className="text-[10px] text-[#4A5568] font-mono">{sub}</p>
                    </div>
                  </div>
                ))}

                {/* Command block */}
                <div className="relative mt-2 rounded-xl overflow-hidden border border-[rgba(57,255,20,0.25)] bg-[#050810]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[rgba(57,255,20,0.06)] border-b border-[rgba(57,255,20,0.12)]">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-[#39FF14]" />
                      <span className="text-[9px] font-mono font-bold text-[#39FF14] uppercase tracking-widest">Docker Command</span>
                    </div>
                    <button onClick={() => copy(DOCKER_COMMAND, setCopiedDocker)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        copiedDocker ? 'bg-[#39FF14] text-[#050A05]' : 'bg-[rgba(57,255,20,0.1)] border border-[rgba(57,255,20,0.3)] text-[#39FF14] hover:bg-[rgba(57,255,20,0.2)]'
                      }`}
                    >
                      {copiedDocker ? <><Check className="w-3 h-3" /><span>Copied!</span></> : <><Copy className="w-3 h-3" /><span>Copy</span></>}
                    </button>
                  </div>
                  <div className="px-4 py-3 font-mono text-[11px] text-[#39FF14] leading-relaxed break-all select-all">
                    <span className="text-[#3D4A3D] select-none">$ </span>{DOCKER_COMMAND}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-[#4A5568]">
                  <Shield className="w-3 h-3 text-[#39FF14] shrink-0" />
                  <span>100% local — no data leaves your machine. Install any tool: <code className="text-[#39FF14]">apt install -y nmap</code></span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[11px] text-[#7A8494] font-mono leading-relaxed">
                  No Docker? If you have <strong className="text-[#F2F5F9]">Node.js ≥ 18</strong> installed, run this to start a lightweight local bridge:
                </p>

                <div className="relative rounded-xl overflow-hidden border border-[rgba(0,240,255,0.25)] bg-[#050810]">
                  <div className="flex items-center justify-between px-4 py-2 bg-[rgba(0,240,255,0.06)] border-b border-[rgba(0,240,255,0.12)]">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-3 h-3 text-[#00F0FF]" />
                      <span className="text-[9px] font-mono font-bold text-[#00F0FF] uppercase tracking-widest">NPX Bridge</span>
                    </div>
                    <button onClick={() => copy(BRIDGED_COMMAND, setCopiedBridge)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                        copiedBridge ? 'bg-[#00F0FF] text-[#050A10]' : 'bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.3)] text-[#00F0FF] hover:bg-[rgba(0,240,255,0.2)]'
                      }`}
                    >
                      {copiedBridge ? <><Check className="w-3 h-3" /><span>Copied!</span></> : <><Copy className="w-3 h-3" /><span>Copy</span></>}
                    </button>
                  </div>
                  <div className="px-4 py-3 font-mono text-[11px] text-[#00F0FF] break-all select-all">
                    <span className="text-[#2A3A3A] select-none">$ </span>{BRIDGED_COMMAND}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── FOOTER ─────────────────────────────────────────────── */}
        <div className="shrink-0 px-6 py-4 border-t border-[rgba(243,245,249,0.06)] bg-[#060910] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button onClick={handleSwitchToSimulated}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-[#39FF14] bg-[rgba(57,255,20,0.08)] border border-[rgba(57,255,20,0.25)] hover:bg-[rgba(57,255,20,0.15)] hover:border-[rgba(57,255,20,0.4)] hover:shadow-[0_0_20px_rgba(57,255,20,0.2)] transition-all cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5" />
            Switch to Simulated Mode
          </button>

          <button onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-[#4A5568] bg-transparent border border-[rgba(243,245,249,0.08)] hover:text-[#A7B0BC] hover:border-[rgba(243,245,249,0.15)] transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
