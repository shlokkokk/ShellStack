import React, { useEffect, useState, useCallback } from 'react';
import { BsStarFill, BsTerminalFill } from 'react-icons/bs';
import { BiGitPullRequest } from 'react-icons/bi';
import { FiGithub, FiX, FiCheckSquare, FiSquare } from 'react-icons/fi';

// In-memory flag for temporary session dismissal (resets on page refresh / new tab)
let inMemoryDismissed = false;

const PERMANENT_STORAGE_KEY = 'shellstack_github_toast_permanent_dismissed';
const TRIGGER_DELAY_MS = 15000; // 15 seconds for responsive testing & UX
const SCROLL_THRESHOLD_RATIO = 0.25; // 25% scroll depth

const GITHUB_REPO_URL = 'https://github.com/shlokkokk/ShellStack';

export const GithubEngagementToast: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isRendered, setIsRendered] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  // Safe Storage Checkers
  const isPermanentlyDismissed = useCallback(() => {
    try {
      return localStorage.getItem(PERMANENT_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  }, []);

  const handleDismiss = useCallback(() => {
    // Start exit animation
    setIsVisible(false);

    if (dontShowAgain) {
      try {
        localStorage.setItem(PERMANENT_STORAGE_KEY, 'true');
      } catch (err) {
        console.warn('Unable to save permanent dismissal state to storage', err);
      }
    } else {
      // Temporary dismissal for current page view only (resets on refresh / new tab)
      inMemoryDismissed = true;
    }

    // Unmount from DOM after animation completes
    setTimeout(() => {
      setIsRendered(false);
    }, 300);
  }, [dontShowAgain]);

  useEffect(() => {
    // Edge case check: If user permanently dismissed or closed in current memory session
    if (isPermanentlyDismissed() || inMemoryDismissed) {
      return;
    }

    let timerId: ReturnType<typeof setTimeout> | null = null;
    let hasTriggered = false;

    const triggerToast = () => {
      if (hasTriggered) return;
      hasTriggered = true;
      setIsRendered(true);
      // Small tick for CSS transition to animate in cleanly
      setTimeout(() => setIsVisible(true), 50);

      // Clean up event listeners once triggered
      if (timerId) clearTimeout(timerId);
      window.removeEventListener('scroll', handleScroll);
    };

    // 1. Time-based trigger (15 seconds)
    timerId = setTimeout(triggerToast, TRIGGER_DELAY_MS);

    // 2. Scroll-based trigger (25% scroll depth)
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const scrollRatio = window.scrollY / scrollHeight;
        if (scrollRatio >= SCROLL_THRESHOLD_RATIO) {
          triggerToast();
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (timerId) clearTimeout(timerId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isPermanentlyDismissed]);

  const handleStarClick = () => {
    window.open(GITHUB_REPO_URL, '_blank', 'noopener,noreferrer');
    handleDismiss();
  };

  const handleContributeClick = () => {
    window.open(`${GITHUB_REPO_URL}/issues`, '_blank', 'noopener,noreferrer');
    handleDismiss();
  };

  if (!isRendered) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[90] max-w-sm sm:max-w-md w-[calc(100vw-2rem)] transition-all duration-300 ease-out transform ${
        isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
      }`}
      aria-label="Community Engagement Notification"
    >
      <div className="cyber-panel relative p-4 sm:p-5 bg-[rgba(5,6,11,0.96)] border border-[rgba(0,240,255,0.35)] shadow-[0_0_25px_rgba(0,240,255,0.15)] rounded-xl backdrop-blur-md overflow-hidden">
        {/* Decorative Top Glowing Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent" />

        {/* Header Bar */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[rgba(243,245,249,0.1)]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[rgba(0,240,255,0.1)] text-[#00F0FF] font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider border border-[rgba(0,240,255,0.2)]">
              <BsTerminalFill className="w-3 h-3 text-[#39FF14]" />
              COMMUNITY_OPS
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse" />
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-md text-[#A7B0BC] hover:text-[#FFFFFF] hover:bg-[rgba(243,245,249,0.1)] transition-colors"
            title="Close prompt"
            aria-label="Close prompt"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content */}
        <div className="space-y-2.5 mb-4 text-left">
          <h4 className="text-xs sm:text-sm font-semibold font-mono text-[#F3F5F9] tracking-wide flex items-center gap-2">
            Building ShellStack Open Source
          </h4>
          <p className="text-xs text-[#A7B0BC] font-mono leading-relaxed">
            Finding this toolkit useful for your workflows? Join the initiative — star the repo, suggest missing Kali tools, or submit cheat sheet commands.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={handleStarClick}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[rgba(57,255,20,0.12)] hover:bg-[rgba(57,255,20,0.22)] border border-[rgba(57,255,20,0.35)] text-[#39FF14] font-mono text-xs font-semibold transition-all shadow-[0_0_10px_rgba(57,255,20,0.1)] hover:shadow-[0_0_15px_rgba(57,255,20,0.25)]"
          >
            <BsStarFill className="w-3.5 h-3.5" />
            <span>Star Repo</span>
          </button>

          <button
            onClick={handleContributeClick}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[rgba(0,240,255,0.1)] hover:bg-[rgba(0,240,255,0.2)] border border-[rgba(0,240,255,0.3)] text-[#00F0FF] font-mono text-xs font-semibold transition-all shadow-[0_0_10px_rgba(0,240,255,0.1)] hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            <BiGitPullRequest className="w-3.5 h-3.5" />
            <span>Contribute</span>
          </button>
        </div>

        {/* Checkbox: Don't show again option */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#A7B0BC] pt-1">
          <label
            onClick={() => setDontShowAgain(!dontShowAgain)}
            className="flex items-center gap-1.5 cursor-pointer hover:text-[#F3F5F9] transition-colors select-none"
          >
            {dontShowAgain ? (
              <FiCheckSquare className="w-3.5 h-3.5 text-[#00F0FF]" />
            ) : (
              <FiSquare className="w-3.5 h-3.5 text-[#A7B0BC]" />
            )}
            <span>Don&apos;t show again</span>
          </label>

          <button
            onClick={handleStarClick}
            className="flex items-center gap-1 text-[#A7B0BC] hover:text-[#00F0FF] transition-colors"
          >
            <FiGithub className="w-3 h-3" />
            <span>GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GithubEngagementToast;
