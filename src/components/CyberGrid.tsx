import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  connections: number[];
}

const CyberGrid = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let isActive = true;
    let nodes: Node[] = [];
    const maxConnections = 3;
    const connectionDistance = 150;
    const nodeCount = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 20000));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
          connections: [],
        });
      }
    };

    const drawHexagon = (x: number, y: number, radius: number, opacity: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const hx = x + radius * Math.cos(angle);
        const hy = y + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(57, 255, 20, ${opacity * 0.12})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    };

    const drawNode = (node: Node, index: number) => {
      // Draw node glow
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 4);
      gradient.addColorStop(0, 'rgba(57, 255, 20, 0.15)');
      gradient.addColorStop(1, 'rgba(57, 255, 20, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw node core
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#39FF14';
      ctx.fill();

      // Draw hexagon around some nodes
      if (index % 5 === 0) {
        drawHexagon(node.x, node.y, node.radius * 8, 0.2);
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].connections = [];
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance && nodes[i].connections.length < maxConnections) {
            nodes[i].connections.push(j);
            
            const opacity = 1 - distance / connectionDistance;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(57, 255, 20, ${opacity * 0.12})`;
            ctx.lineWidth = opacity * 0.6;
            ctx.stroke();

            // Draw data packet on connection
            if (Math.random() > 0.99) {
              const packetX = nodes[i].x + (nodes[j].x - nodes[i].x) * Math.random();
              const packetY = nodes[i].y + (nodes[j].y - nodes[i].y) * Math.random();
              ctx.beginPath();
              ctx.arc(packetX, packetY, 2, 0, Math.PI * 2);
              ctx.fillStyle = '#00F0FF';
              ctx.fill();
            }
          }
        }
      }
    };

    const drawGrid = () => {
      const gridSize = 50;
      ctx.strokeStyle = 'rgba(57, 255, 20, 0.015)';
      ctx.lineWidth = 0.5;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawRadar = () => {
      const centerX = canvas.width * 0.9;
      const centerY = (canvas.height * 0.1) + 80;
      const radius = 60;

      // Radar circles
      for (let r = 20; r <= radius; r += 20) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(57, 255, 20, 0.08)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Radar sweep
      const time = Date.now() / 1000;
      const sweepAngle = (time * 2) % (Math.PI * 2);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, sweepAngle, sweepAngle + 0.3);
      ctx.closePath();
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(57, 255, 20, 0.15)');
      gradient.addColorStop(1, 'rgba(57, 255, 20, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();

      // Random blips
      if (Math.random() > 0.95) {
        const blipAngle = Math.random() * Math.PI * 2;
        const blipRadius = Math.random() * radius;
        const blipX = centerX + Math.cos(blipAngle) * blipRadius;
        const blipY = centerY + Math.sin(blipAngle) * blipRadius;
        ctx.beginPath();
        ctx.arc(blipX, blipY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#FF2D2D';
        ctx.fill();
      }
    };

    const updateNodes = () => {
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });
    };

    const draw = () => {
      if (!isActive) return;

      ctx.fillStyle = 'rgba(5, 6, 11, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid();
      drawConnections();
      nodes.forEach((node, index) => drawNode(node, index));
      drawRadar();
      updateNodes();

      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActive = false;
        cancelAnimationFrame(animationId);
      } else {
        isActive = true;
        draw();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isActive = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
};

export default CyberGrid;
