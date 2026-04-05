import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [mode, setMode] = useState<'scan' | 'action' | 'text'>('scan');
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouch();

    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const outer = outerRef.current;
    if (!cursor || !outer) return;

    document.body.classList.add('custom-cursor-enabled');

    const corePos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const outerPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const xCoreSet = gsap.quickSetter(cursor, 'x', 'px');
    const yCoreSet = gsap.quickSetter(cursor, 'y', 'px');
    const xOuterSet = gsap.quickSetter(outer, 'x', 'px');
    const yOuterSet = gsap.quickSetter(outer, 'y', 'px');

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const tick = () => {
      // Core is nearly instant (0.8) for precise feedback
      corePos.x += (mouse.x - corePos.x) * 0.8;
      corePos.y += (mouse.y - corePos.y) * 0.8;
      xCoreSet(corePos.x);
      yCoreSet(corePos.y);

      // Outer reticle has slight snappy delay (0.35)
      outerPos.x += (mouse.x - outerPos.x) * 0.35;
      outerPos.y += (mouse.y - outerPos.y) * 0.35;
      xOuterSet(outerPos.x);
      yOuterSet(outerPos.y);
    };

    gsap.ticker.add(tick);

    const interactiveSelector = 'a, button, [role="button"], .category-card, .module-card, .cyber-panel';
    const textSelector = 'input, textarea, select, [contenteditable="true"]';

    const handleMouseOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(textSelector)) { setMode('text'); return; }
      if (target.closest(interactiveSelector)) { setMode('action'); return; }
      setMode('scan');
    };

    const handleMouseOut = () => setMode('scan');

    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseout', handleMouseOut, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.classList.remove('custom-cursor-enabled');
      gsap.ticker.remove(tick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Core Dot */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[10001]"
        style={{ willChange: 'transform', transform: 'translate(-50%, -50%)' }}
      >
        <div 
          className={`w-1 h-1 rounded-full bg-white transition-transform duration-200 ${
            isClicking ? 'scale-150' : 'scale-100'
          }`}
          style={{ boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)' }}
        />
      </div>

      {/* Cyber Reticle */}
      <div
        ref={outerRef}
        className="fixed pointer-events-none z-[10000]"
        style={{ willChange: 'transform', transform: 'translate(-50%, -50%)' }}
      >
        <div className={`relative transition-all duration-300 ${
          mode === 'action' ? 'scale-75' : mode === 'text' ? 'scale-x-[0.2] scale-y-125' : 'scale-100'
        }`}>
          {/* Top Left Bracket */}
          <div className={`absolute -top-4 -left-4 w-2 h-2 border-t-2 border-l-2 transition-colors duration-300 ${
            mode === 'action' ? 'border-[#00F0FF]' : 'border-[#39FF14]'
          }`} />
          {/* Top Right Bracket */}
          <div className={`absolute -top-4 -right-4 w-2 h-2 border-t-2 border-r-2 transition-colors duration-300 ${
            mode === 'action' ? 'border-[#00F0FF]' : 'border-[#39FF14]'
          }`} />
          {/* Bottom Left Bracket */}
          <div className={`absolute -bottom-4 -left-4 w-2 h-2 border-b-2 border-l-2 transition-colors duration-300 ${
            mode === 'action' ? 'border-[#00F0FF]' : 'border-[#39FF14]'
          }`} />
          {/* Bottom Right Bracket */}
          <div className={`absolute -bottom-4 -right-4 w-2 h-2 border-b-2 border-r-2 transition-colors duration-300 ${
            mode === 'action' ? 'border-[#00F0FF]' : 'border-[#39FF14]'
          }`} />

          {/* Optional: Subtle center crosshair lines in Action mode */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-[1px] bg-[#00F0FF] transition-opacity duration-300 ${
            mode === 'action' ? 'opacity-40' : 'opacity-0'
          }`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-[1px] bg-[#00F0FF] transition-opacity duration-300 ${
            mode === 'action' ? 'opacity-40' : 'opacity-0'
          }`} />
        </div>
      </div>
    </>
  );
};

export default CustomCursor;
