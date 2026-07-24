// Terminal Event Bus & Command Dispatcher for ShellStack

type CommandListener = (command: string) => void;

class TerminalStore {
  private listeners: Set<CommandListener> = new Set();
  private pendingCommand: string | null = null;

  /**
   * Dispatch a command to be executed in the Live Terminal.
   * If a listener is active, it receives the command immediately.
   * Otherwise, the command is stored as pending for the next subscriber.
   */
  dispatch(command: string) {
    if (!command || typeof command !== 'string') return;
    
    const trimmed = command.trim();
    if (!trimmed) return;

    this.pendingCommand = trimmed;

    // Notify all active subscribers
    this.listeners.forEach((listener) => {
      try {
        listener(trimmed);
      } catch (err) {
        console.error('Error in terminal command listener:', err);
      }
    });
  }

  /**
   * Subscribe to incoming terminal commands.
   * If there is a pending command, fires immediately.
   */
  subscribe(listener: CommandListener): () => void {
    this.listeners.add(listener);

    // If a command was dispatched before subscriber mounted, consume it
    if (this.pendingCommand) {
      const cmd = this.pendingCommand;
      this.pendingCommand = null;
      setTimeout(() => listener(cmd), 50);
    }

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Check and consume any pending command
   */
  consumePending(): string | null {
    const cmd = this.pendingCommand;
    this.pendingCommand = null;
    return cmd;
  }
}

export const terminalStore = new TerminalStore();
