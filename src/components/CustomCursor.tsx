import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
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
    const aura = auraRef.current;
    const orbit = orbitRef.current;
    if (!cursor || !aura || !orbit) return;

    document.body.classList.add('custom-cursor-enabled');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const orbitPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const auraPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const xSet = gsap.quickSetter(cursor, 'x', 'px');
    const ySet = gsap.quickSetter(cursor, 'y', 'px');
    const xAuraSet = gsap.quickSetter(aura, 'x', 'px');
    const yAuraSet = gsap.quickSetter(aura, 'y', 'px');
    const xOrbitSet = gsap.quickSetter(orbit, 'x', 'px');
    const yOrbitSet = gsap.quickSetter(orbit, 'y', 'px');

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const tick = () => {
      // Core reticle follows quickly.
      pos.x += (mouse.x - pos.x) * 0.36;
      pos.y += (mouse.y - pos.y) * 0.36;
      xSet(pos.x);
      ySet(pos.y);

      // Rotating orbit has medium lag.
      orbitPos.x += (mouse.x - orbitPos.x) * 0.2;
      orbitPos.y += (mouse.y - orbitPos.y) * 0.2;
      xOrbitSet(orbitPos.x);
      yOrbitSet(orbitPos.y);

      // Aura lags most for a smooth parallax effect.
      auraPos.x += (mouse.x - auraPos.x) * 0.12;
      auraPos.y += (mouse.y - auraPos.y) * 0.12;
      xAuraSet(auraPos.x);
      yAuraSet(auraPos.y);
    };

    gsap.ticker.add(tick);

    const interactiveSelector =
      'a, button, [role="button"], .category-card, .module-card, .resource-card';
    const textSelector = 'input, textarea, select, [contenteditable="true"]';

    const handleMouseOver = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest(textSelector)) {
        setMode('text');
        return;
      }

      if (target.closest(interactiveSelector)) {
        setMode('action');
        return;
      }

      setMode('scan');
    };

    const handleMouseOut = (e: Event) => {
      const next = (e as MouseEvent).relatedTarget as HTMLElement | null;
      if (!next) {
        setMode('scan');
      }
    };

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
      {/* Core cursor */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[10000] transition-transform duration-100 ${
          isClicking ? 'scale-90' : 'scale-100'
        }`}
        style={{
          willChange: 'transform',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {mode === 'text' ? (
          <div className="relative">
            <div
              className="w-[2px] h-6 rounded-full bg-[#00F0FF]"
              style={{
                boxShadow: '0 0 16px rgba(0, 240, 255, 0.85)',
              }}
            />
          </div>
        ) : (
          <div className="relative">
            <div
              className={`w-3 h-3 rotate-45 border-[1.5px] transition-all duration-200 ${
                mode === 'action' ? 'border-[#00F0FF]' : 'border-[#F2F5F9]'
              }`}
              style={{
                background:
                  mode === 'action'
                    ? 'rgba(0, 240, 255, 0.2)'
                    : 'rgba(57, 255, 20, 0.18)',
                boxShadow:
                  mode === 'action'
                    ? '0 0 16px rgba(0, 240, 255, 0.7)'
                    : '0 0 14px rgba(57, 255, 20, 0.55)',
              }}
            />
            <div className="absolute inset-[3px] rotate-45 bg-[#F2F5F9]/85" />
          </div>
        )}
      </div>

      {/* Back aura */}
      <div
        ref={auraRef}
        className={`fixed pointer-events-none z-[9998] transition-all duration-300 ${
          mode === 'text' ? 'opacity-0 scale-75' : 'opacity-100'
        } ${isClicking ? 'scale-90' : 'scale-100'}`}
        style={{
          willChange: 'transform',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`rounded-full transition-all duration-300 ${
            mode === 'action' ? 'w-12 h-12' : 'w-10 h-10'
          }`}
          style={{
            background:
              mode === 'action'
                ? 'radial-gradient(circle, rgba(0,240,255,0.22) 0%, rgba(0,240,255,0.06) 45%, rgba(0,0,0,0) 80%)'
                : 'radial-gradient(circle, rgba(57,255,20,0.2) 0%, rgba(57,255,20,0.06) 45%, rgba(0,0,0,0) 80%)',
          }}
        />
      </div>

      {/* Rotating orbit + mode label */}
      <div
        ref={orbitRef}
        className={`fixed pointer-events-none z-[9999] transition-all duration-200 ${
          mode === 'text' ? 'opacity-0' : 'opacity-100'
        } ${isClicking ? 'scale-95' : 'scale-100'}`}
        style={{
          willChange: 'transform',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative">
          <div
            className={`rounded-full border border-dashed animate-[spin_2.4s_linear_infinite] transition-all duration-300 ${
              mode === 'action' ? 'w-11 h-11' : 'w-9 h-9'
            }`}
            style={{
              borderColor:
                mode === 'action'
                  ? 'rgba(0,240,255,0.75)'
                  : 'rgba(242,245,249,0.65)',
              boxShadow:
                mode === 'action'
                  ? '0 0 12px rgba(0,240,255,0.35)'
                  : '0 0 10px rgba(57,255,20,0.28)',
            }}
          />

          <div
            className="absolute -top-7 left-4 px-1.5 py-[2px] text-[10px] font-mono tracking-wider rounded border"
            style={{
              color:
                mode === 'action'
                  ? 'rgba(0,240,255,0.95)'
                  : mode === 'text'
                  ? 'rgba(255,230,0,0.95)'
                  : 'rgba(57,255,20,0.95)',
              borderColor:
                mode === 'action'
                  ? 'rgba(0,240,255,0.45)'
                  : mode === 'text'
                  ? 'rgba(255,230,0,0.45)'
                  : 'rgba(57,255,20,0.45)',
              backgroundColor: 'rgba(5, 6, 11, 0.75)',
              textShadow: '0 0 8px rgba(0,0,0,0.75)',
            }}
          >
            {mode === 'action' ? 'OPEN' : mode === 'text' ? 'TYPE' : 'SCAN'}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomCursor;
