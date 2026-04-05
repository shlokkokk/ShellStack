import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const cursorTrailRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
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
    const cursorRing = cursorRingRef.current;
    const cursorTrail = cursorTrailRef.current;
    if (!cursor || !cursorRing || !cursorTrail) return;

    const pos = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0 };

    const xSet = gsap.quickSetter(cursor, 'x', 'px');
    const ySet = gsap.quickSetter(cursor, 'y', 'px');
    const xRingSet = gsap.quickSetter(cursorRing, 'x', 'px');
    const yRingSet = gsap.quickSetter(cursorRing, 'y', 'px');
    const xTrailSet = gsap.quickSetter(cursorTrail, 'x', 'px');
    const yTrailSet = gsap.quickSetter(cursorTrail, 'y', 'px');

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Smooth follow animation
    gsap.ticker.add(() => {
      // Main cursor - instant follow
      pos.x += (mouse.x - pos.x) * 0.2;
      pos.y += (mouse.y - pos.y) * 0.2;
      xSet(pos.x);
      ySet(pos.y);

      // Ring - delayed follow
      ringPos.x += (mouse.x - ringPos.x) * 0.1;
      ringPos.y += (mouse.y - ringPos.y) * 0.1;
      xRingSet(ringPos.x);
      yRingSet(ringPos.y);

      // Trail - very delayed follow
      xTrailSet(ringPos.x);
      yTrailSet(ringPos.y);
    });

    // Hover effects
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add hover listeners to interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, [role="button"], .category-card, .module-card, .resource-card'
    );

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Main cursor - crosshair */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[10000] transition-transform duration-100 ${
          isClicking ? 'scale-75' : ''
        }`}
        style={{
          willChange: 'transform',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="relative">
          {/* Horizontal line */}
          <div 
            className={`absolute top-1/2 left-1/2 -translate-y-1/2 h-[1px] transition-all duration-200 ${
              isHovering ? 'w-8 bg-[#00F0FF]' : 'w-4 bg-[#39FF14]'
            }`}
            style={{ transform: 'translateX(-50%)' }}
          />
          {/* Vertical line */}
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 w-[1px] transition-all duration-200 ${
              isHovering ? 'h-8 bg-[#00F0FF]' : 'h-4 bg-[#39FF14]'
            }`}
            style={{ transform: 'translateY(-50%)' }}
          />
          {/* Center dot */}
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-200 ${
              isHovering ? 'w-2 h-2 bg-[#00F0FF]' : 'w-1 h-1 bg-[#39FF14]'
            }`}
          />
        </div>
      </div>

      {/* Outer ring */}
      <div
        ref={cursorRingRef}
        className={`fixed pointer-events-none z-[9999] transition-all duration-300 ${
          isHovering ? 'opacity-100' : 'opacity-50'
        } ${isClicking ? 'scale-90' : ''}`}
        style={{
          willChange: 'transform',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div 
          className={`rounded-full border transition-all duration-300 ${
            isHovering 
              ? 'w-12 h-12 border-[#00F0FF] border-2' 
              : 'w-8 h-8 border-[#39FF14] border'
          }`}
          style={{
            boxShadow: isHovering 
              ? '0 0 20px rgba(0, 240, 255, 0.4), inset 0 0 10px rgba(0, 240, 255, 0.2)' 
              : '0 0 10px rgba(57, 255, 20, 0.3)',
          }}
        />
      </div>

      {/* Trail effect */}
      <div
        ref={cursorTrailRef}
        className="fixed pointer-events-none z-[9998] opacity-20"
        style={{
          willChange: 'transform',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="w-16 h-16 rounded-full border border-[#39FF14]" />
      </div>
    </>
  );
};

export default CustomCursor;
