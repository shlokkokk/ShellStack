import { useNavigate, useLocation } from 'react-router-dom';
import { terminalStore } from '../lib/terminalStore';

export const useRunInTerminal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const runInTerminal = (command: string, options?: { onCloseModal?: () => void }) => {
    if (!command) return;

    const trimmed = command.trim();
    if (!trimmed) return;

    // 1. Close any open modal if callback provided
    if (options?.onCloseModal) {
      options.onCloseModal();
    }

    // 2. Dispatch command to terminal store
    terminalStore.dispatch(trimmed);

    // 3. Handle navigation to Terminal
    if (location.pathname === '/terminal') {
      // Already on terminal page, scroll to input/top
      const termEl = document.getElementById('live-terminal-window') || document.getElementById('terminal');
      if (termEl) {
        termEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (location.pathname === '/') {
      // On homepage, terminal section exists on the page
      const termSection = document.getElementById('terminal');
      if (termSection) {
        termSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        navigate('/terminal');
      }
    } else {
      // On another route (/tools, /cheatsheet, /ceh, etc.), navigate to /terminal
      navigate('/terminal');
    }
  };

  return { runInTerminal };
};
