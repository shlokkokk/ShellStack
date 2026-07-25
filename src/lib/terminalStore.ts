// Terminal Event Bus, Engine Mode & Command Dispatcher for ShellStack

export type TerminalCommandMode = 'execute' | 'paste';
export type EngineMode = 'simulated' | 'real-docker';
export type DockerConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export interface TerminalCommandPayload {
  command: string;
  mode: TerminalCommandMode;
  timestamp: number;
}

type CommandListener = (payload: TerminalCommandPayload) => void;
type EngineModeListener = (mode: EngineMode, status: DockerConnectionStatus) => void;
type ModalOpenListener = (commandToRun?: string) => void;

const STORAGE_KEY_ENGINE = 'shellstack_engine_mode';

class TerminalStore {
  private commandListeners: Set<CommandListener> = new Set();
  private engineListeners: Set<EngineModeListener> = new Set();
  private modalListeners: Set<ModalOpenListener> = new Set();

  private pendingPayload: TerminalCommandPayload | null = null;
  // Persistent store-level command for real-docker mode — survives component remounts
  private dockerReadyCommand: string | null = null;
  private engineMode: EngineMode = 'simulated';
  private dockerStatus: DockerConnectionStatus = 'disconnected';
  private pingInterval: number | null = null;

  constructor() {
    // Load persisted engine mode preference from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ENGINE);
      if (saved === 'real-docker' || saved === 'simulated') {
        this.engineMode = saved;
      }
    } catch {
      this.engineMode = 'simulated';
    }

    // Auto-probe docker connection if real-docker mode is saved
    if (this.engineMode === 'real-docker') {
      this.checkDockerConnection();
    }
  }

  // ── Engine Mode & Status Getters/Setters ─────────────────────────

  getEngineMode(): EngineMode {
    return this.engineMode;
  }

  getDockerStatus(): DockerConnectionStatus {
    return this.dockerStatus;
  }

  setEngineMode(mode: EngineMode) {
    this.engineMode = mode;
    try {
      localStorage.setItem(STORAGE_KEY_ENGINE, mode);
    } catch {
      // Ignore storage errors
    }

    if (mode === 'real-docker') {
      this.checkDockerConnection();
    }

    this.notifyEngineListeners();
  }

  setDockerStatus(status: DockerConnectionStatus) {
    if (this.dockerStatus === status) return;
    this.dockerStatus = status;
    this.notifyEngineListeners();
  }

  // ── Docker WebSocket / HTTP Connection Probe ─────────────────────

  async checkDockerConnection(): Promise<boolean> {
    if (this.dockerStatus !== 'connected') {
      this.setDockerStatus('connecting');
    }

    try {
      // Attempt quick fetch to localhost ttyd / bridge port 7681
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);

      const response = await fetch('http://localhost:7681/', {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeoutId);

      // If no-cors fetch returned or reached endpoint
      if (response !== null) {
        this.setDockerStatus('connected');
        return true;
      } else {
        // Try WebSocket ping fallback
        return new Promise((resolve) => {
          try {
            const ws = new WebSocket('ws://localhost:7681/ws');
            const timer = setTimeout(() => {
              ws.close();
              this.setDockerStatus('disconnected');
              resolve(false);
            }, 1000);

            ws.onopen = () => {
              clearTimeout(timer);
              ws.close();
              this.setDockerStatus('connected');
              resolve(true);
            };

            ws.onerror = () => {
              clearTimeout(timer);
              ws.close();
              this.setDockerStatus('disconnected');
              resolve(false);
            };
          } catch {
            this.setDockerStatus('disconnected');
            resolve(false);
          }
        });
      }
    } catch {
      this.setDockerStatus('disconnected');
      return false;
    }
  }

  startConnectionPolling(intervalMs = 15000) {
    this.stopConnectionPolling();
    this.checkDockerConnection();
    this.pingInterval = window.setInterval(() => {
      if (this.engineMode === 'real-docker') {
        this.checkDockerConnection();
      }
    }, intervalMs);
  }

  stopConnectionPolling() {
    if (this.pingInterval !== null) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  // ── Modal Triggers ─────────────────────────────────────────────

  openDockerModal(commandToRun?: string) {
    this.modalListeners.forEach((listener) => {
      try {
        listener(commandToRun);
      } catch (err) {
        console.error('Error opening Docker modal:', err);
      }
    });
  }

  subscribeModal(listener: ModalOpenListener): () => void {
    this.modalListeners.add(listener);
    return () => {
      this.modalListeners.delete(listener);
    };
  }

  subscribeEngine(listener: EngineModeListener): () => void {
    this.engineListeners.add(listener);
    listener(this.engineMode, this.dockerStatus);
    return () => {
      this.engineListeners.delete(listener);
    };
  }

  private notifyEngineListeners() {
    this.engineListeners.forEach((listener) => {
      try {
        listener(this.engineMode, this.dockerStatus);
      } catch (err) {
        console.error('Error notifying engine listener:', err);
      }
    });
  }

  // ── Command Dispatcher ──────────────────────────────────────────

  dispatch(command: string, mode: TerminalCommandMode = 'execute') {
    if (!command || typeof command !== 'string') return;
    
    const trimmed = command.trim();
    if (!trimmed) return;

    // Check if user is in Real Docker mode but disconnected
    if (this.engineMode === 'real-docker' && this.dockerStatus !== 'connected') {
      // Trigger Docker modal with actionable command warning
      this.openDockerModal(trimmed);
      return;
    }

    // Persist at store level so LiveTerminal can read it even after a remount
    if (this.engineMode === 'real-docker') {
      this.dockerReadyCommand = trimmed;
    }

    const payload: TerminalCommandPayload = {
      command: trimmed,
      mode,
      timestamp: Date.now(),
    };

    this.pendingPayload = payload;

    if (this.commandListeners.size > 0) {
      this.commandListeners.forEach((listener) => {
        try {
          listener(payload);
        } catch (err) {
          console.error('Error in terminal command listener:', err);
        }
      });
      this.pendingPayload = null;
    }
  }

  subscribe(listener: CommandListener): () => void {
    this.commandListeners.add(listener);

    if (this.pendingPayload) {
      const payload = this.pendingPayload;
      this.pendingPayload = null;

      // Deliver SYNCHRONOUSLY — not via rAF. Reason: React runs child effects before
      // parent effects. If we used rAF here, the parent (AppShell) effect could set
      // isRouteLoading=true before rAF fires, unmounting this component and dropping
      // the state update silently. Synchronous delivery means the state setter runs
      // immediately as part of this effect, safely batched by React.
      try {
        listener(payload);
      } catch (err) {
        console.error('Error delivering pending terminal payload:', err);
      }
    }

    return () => {
      this.commandListeners.delete(listener);
    };
  }

  getDockerReadyCommand(): string | null {
    return this.dockerReadyCommand;
  }

  clearDockerReadyCommand() {
    this.dockerReadyCommand = null;
  }
}

export const terminalStore = new TerminalStore();
