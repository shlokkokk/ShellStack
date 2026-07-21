import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

export const SmoothScroll: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    // 1. Accessibility & Touch Protection
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = 'ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches;
    const isSmallScreen = window.innerWidth < 768;

    if (prefersReducedMotion || isTouchDevice || isSmallScreen) {
      return;
    }

    // 2. Instantiate Lenis with tuned inertia parameters
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 0, // Disable touch hijacking to preserve native mobile feel
      prevent: (node) =>
        node.hasAttribute('data-lenis-prevent') ||
        Boolean(node.closest('[data-lenis-prevent]')) ||
        Boolean(node.closest('.no-scroll')) ||
        Boolean(node.closest('[role="dialog"]')) ||
        Boolean(node.closest('.cyber-scrollbar')),
    });

    lenisRef.current = lenis;

    // 3. Perfect Sync with GSAP ScrollTrigger
    lenis.on('scroll', () => {
      ScrollTrigger.update();
    });

    // 4. Connect Lenis animation frame loop to GSAP Ticker for 60fps frame timing
    const updateFn = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateFn);
    gsap.ticker.lagSmoothing(0);

    // 5. Modal & Overlay Lock Observer
    // Detects when modals/drawers open (e.g. Radix UI or body overflow hidden) and pauses Lenis
    const observer = new MutationObserver(() => {
      const isModalOpen =
        document.body.style.overflow === 'hidden' ||
        document.querySelector('[role="dialog"]') !== null ||
        document.querySelector('[data-state="open"]') !== null;

      if (isModalOpen) {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: true,
      subtree: true,
    });

    // 6. Handle Window Resize & Orientation Change
    const handleResize = () => {
      if (window.innerWidth < 768) {
        lenis.stop();
      } else {
        lenis.start();
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(updateFn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // 7. Route Change Synchronization: Reset scroll smoothly & refresh ScrollTrigger
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }
  }, [pathname]);

  return <>{children}</>;
};

export default SmoothScroll;
