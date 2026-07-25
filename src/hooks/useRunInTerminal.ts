import { useNavigate, useLocation } from 'react-router-dom';
import { terminalStore, type TerminalCommandMode } from '../lib/terminalStore';

// Key used to hand off a command to LiveTerminal across a navigation
export const PENDING_CMD_KEY = 'shellstack_pending_cmd';
export const PENDING_MODE_KEY = 'shellstack_pending_mode';

export const useRunInTerminal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const dispatchToTerminal = (
    command: string,
    mode: TerminalCommandMode = 'execute',
    options?: { onCloseModal?: () => void }
  ) => {
    if (!command) return;

    const trimmed = command.trim();
    if (!trimmed) return;

    // 1. Close modal first
    if (options?.onCloseModal) {
      options.onCloseModal();
    }

    // Safety: ensure body scroll is restored before any navigation
    // (modal cleanup effect may not have fired yet when navigate() is called)
    document.body.classList.remove('no-scroll');

    if (location.pathname === '/terminal') {
      // ── Already on terminal page: dispatch directly ──────────────
      terminalStore.dispatch(trimmed, mode);
    } else {
      // ── On another page: persist to sessionStorage so LiveTerminal
      //    picks it up on mount regardless of component lifecycle timing.
      try {
        sessionStorage.setItem(PENDING_CMD_KEY, trimmed);
        sessionStorage.setItem(PENDING_MODE_KEY, mode);
      } catch {
        // sessionStorage blocked: fall back to terminalStore pendingPayload
        terminalStore.dispatch(trimmed, mode);
      }
      navigate('/terminal');
    }
  };

  const runInTerminal = (command: string, options?: { onCloseModal?: () => void }) => {
    dispatchToTerminal(command, 'execute', options);
  };

  const pasteInTerminal = (command: string, options?: { onCloseModal?: () => void }) => {
    dispatchToTerminal(command, 'paste', options);
  };

  return { runInTerminal, pasteInTerminal };
};
