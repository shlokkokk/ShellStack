import { useEffect, useRef } from 'react';

const CyberBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frame = 0;
    const currentMouse = { x: 0, y: 0 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const getWaveHeight = (x: number, z: number, time: number) => {
      // Multiple octaves of waves for organic data feel
      const w1 = Math.sin(x * 0.04 + time) * Math.cos(z * 0.08 + time * 0.5) * 15;
      const w2 = Math.sin(x * 0.08 - time * 0.7) * 8;
      const dist = Math.sqrt(x * x + z * z * 100);
      const ripple = Math.sin(dist * 0.01 - time * 2) * 5;
      
      // Peaks at the edges
      const edge = Math.pow(Math.abs(x) / 300, 3) * 80;
      return w1 + w2 + ripple - edge - 40;
    };

    const drawGrid = (time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + (currentMouse.y * 100);
      const fov = 450;
      const gridSize = 70;
      const xCount = 20;
      const zCount = 25;

      ctx.lineWidth = 1.2;

      // Vertical (Longitudinal) lines
      for (let i = -xCount; i <= xCount; i++) {
        const xBase = i * gridSize;
        ctx.beginPath();
        for (let j = 0; j < zCount; j++) {
          const z1 = j * 0.6 + (time % 0.6);
          const z2 = (j + 1) * 0.6 + (time % 0.6);
          
          const x1 = centerX + ((xBase + (currentMouse.x * 200)) / z1);
          const y1 = centerY + (fov / z1) + getWaveHeight(xBase, z1 * 10, time);
          
          const x2 = centerX + ((xBase + (currentMouse.x * 200)) / z2);
          const y2 = centerY + (fov / z2) + getWaveHeight(xBase, z2 * 10, time);

          if (j === 0) ctx.moveTo(x1, y1);
          else ctx.lineTo(x2, y2);
        }
        const opacity = Math.max(0, 1 - Math.abs(i) / xCount) * 0.15;
        ctx.strokeStyle = `rgba(74, 222, 128, ${opacity})`;
        ctx.stroke();
      }

      // Horizontal (Transverse) lines
      for (let i = 0; i < zCount; i++) {
        const z = i * 0.6 + (time % 0.6);
        if (z <= 0) continue;

        ctx.beginPath();
        for (let j = -xCount; j <= xCount; j++) {
          const xBase = j * gridSize;
          const x = centerX + ((xBase + (currentMouse.x * 200)) / z);
          const y = centerY + (fov / z) + getWaveHeight(xBase, z * 10, time);
          
          if (j === -xCount) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const opacity = Math.min(0.25, (z / 10)) * (1 - (i / zCount));
        ctx.strokeStyle = `rgba(74, 222, 128, ${opacity})`;
        ctx.stroke();
      }
    };

    const drawDataNodes = (time: number) => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + (currentMouse.y * 100);
      
      for (let i = 0; i < 8; i++) {
        const t = time * 0.2 + i;
        const xBase = Math.sin(t * 1.5) * 800;
        const zBase = (Math.cos(t) * 10 + 12);
        
        const x = centerX + ((xBase + (currentMouse.x * 200)) / zBase);
        const y = centerY + (450 / zBase) + getWaveHeight(xBase, zBase * 10, time);
        
        if (y < canvas.height && y > 0) {
          const size = 30 / zBase;
          const pulse = Math.sin(time * 4 + i) * 0.5 + 0.5;
          
          // Glowing Core
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(34, 211, 238, ${0.4 + pulse * 0.3})`;
          ctx.shadowBlur = 15 * pulse;
          ctx.shadowColor = '#22d3ee';
          ctx.fill();
          ctx.shadowBlur = 0;

          // Orbiting Ring
          ctx.beginPath();
          ctx.ellipse(x, y, size * 2.5, size * 1, time + i, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(74, 222, 128, ${0.2 * pulse})`;
          ctx.stroke();

          // Connection Line to Ground
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 200 / zBase);
          ctx.strokeStyle = `rgba(34, 211, 238, 0.1)`;
          ctx.stroke();
        }
      }
    };

    const animate = () => {
      frame += 0.012;
      currentMouse.x += (mouse.current.x - currentMouse.x) * 0.04;
      currentMouse.y += (mouse.current.y - currentMouse.y) * 0.04;

      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Atmospheric Depth Gradient
      const g = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
      g.addColorStop(0, '#042f2e');
      g.addColorStop(0.4, '#020617');
      ctx.fillStyle = g;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      drawGrid(frame);
      drawDataNodes(frame);

      // System Log Sky (Very Subtle)
      ctx.font = '9px JetBrains Mono';
      ctx.fillStyle = '#4ade80';
      ctx.globalAlpha = 0.03;
      for (let i = 0; i < 15; i++) {
        const log = `0x${Math.random().toString(16).slice(2, 10).toUpperCase()} >> [SECURE_LINK_ACTIVE]`;
        ctx.fillText(log, 20, 30 + i * 20 + (frame * 10) % 20);
      }
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#020617]">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#020617] via-transparent to-[#020617]/60" />
      <div className="absolute inset-0 pointer-events-none scanlines opacity-[0.02]" />
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/10 blur-[1px]" />
    </div>
  );
};

export default CyberBackground;
