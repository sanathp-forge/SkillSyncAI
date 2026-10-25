// ============================================
// SKILLSYNC AI — OBSIDIAN CONSTELLATION BACKGROUND
// Black × RGB Yellow subtle constellation network with delicate connecting lines,
// luminous yellow/lime/cyan star nodes, and soft ambient cosmic depth
// ============================================
import { useEffect, useRef } from 'react';

interface ConstellationNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  color: string;
  glowColor: string;
  pulseSpeed: number;
  pulsePhase: number;
  isSpecial: boolean;
}

const STAR_PALETTE = [
  { color: '#DFFF00', glow: 'rgba(223, 255, 0, 0.45)', weight: 0.35 },   // Electric RGB Yellow
  { color: '#F7F7F5', glow: 'rgba(247, 247, 245, 0.3)', weight: 0.35 },    // Muted White
  { color: '#B8FF57', glow: 'rgba(184, 255, 87, 0.35)', weight: 0.15 },   // Lime Accent
  { color: '#42E8E0', glow: 'rgba(66, 232, 224, 0.35)', weight: 0.15 },   // Restrained Cyan
];

export default function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Subtle parallax tracking
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = mouseX;
    let targetMouseY = mouseY;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let nodes: ConstellationNode[] = [];

    // Sparse, elegant node density: ~1 node per 12000px^2, capped at 90 for silky 60fps & non-distracting reading
    const nodeCount = Math.min(Math.max(Math.floor((width * height) / 12000), 45), 90);
    const connectionMaxDist = 125;

    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        const rand = Math.random();
        let chosen = STAR_PALETTE[0];
        let acc = 0;
        for (const item of STAR_PALETTE) {
          acc += item.weight;
          if (rand <= acc) {
            chosen = item;
            break;
          }
        }

        const isSpecial = Math.random() < 0.2;
        const radius = isSpecial ? Math.random() * 1.4 + 1.6 : Math.random() * 0.9 + 0.8;

        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          radius,
          baseAlpha: isSpecial ? 0.75 : Math.random() * 0.4 + 0.3,
          alpha: 0.5,
          color: chosen.color,
          glowColor: chosen.glow,
          pulseSpeed: Math.random() * 0.015 + 0.008,
          pulsePhase: Math.random() * Math.PI * 2,
          isSpecial,
        });
      }
    };

    initNodes();

    let tick = 0;

    const render = () => {
      tick++;

      // Smooth mouse lerp for gentle 3D depth
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const parallaxX = (mouseX / width - 0.5) * 16;
      const parallaxY = (mouseY / height - 0.5) * 16;

      ctx.clearRect(0, 0, width, height);

      // 1. Deep Obsidian Base (#050505)
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // 2. Soft Yellow Ambient Lighting Gradients (sparse, atmospheric, non-distracting)
      const ambient1 = ctx.createRadialGradient(
        width * 0.2 - parallaxX * 0.5,
        height * 0.25 - parallaxY * 0.5,
        0,
        width * 0.2,
        height * 0.25,
        width * 0.45
      );
      ambient1.addColorStop(0, 'rgba(223, 255, 0, 0.028)');
      ambient1.addColorStop(0.6, 'rgba(184, 255, 87, 0.01)');
      ambient1.addColorStop(1, 'transparent');
      ctx.fillStyle = ambient1;
      ctx.fillRect(0, 0, width, height);

      const ambient2 = ctx.createRadialGradient(
        width * 0.85 + parallaxX * 0.6,
        height * 0.75 + parallaxY * 0.6,
        0,
        width * 0.85,
        height * 0.75,
        width * 0.4
      );
      ambient2.addColorStop(0, 'rgba(66, 232, 224, 0.02)');
      ambient2.addColorStop(0.7, 'rgba(223, 255, 0, 0.008)');
      ambient2.addColorStop(1, 'transparent');
      ctx.fillStyle = ambient2;
      ctx.fillRect(0, 0, width, height);

      // 3. Update & render constellation lines
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        // Drift slowly and naturally
        a.x += a.vx;
        a.y += a.vy;

        // Boundary wrap
        if (a.x < -10) a.x = width + 10;
        if (a.x > width + 10) a.x = -10;
        if (a.y < -10) a.y = height + 10;
        if (a.y > height + 10) a.y = -10;

        const pulse = Math.sin(tick * a.pulseSpeed + a.pulsePhase);
        a.alpha = Math.max(0.15, Math.min(0.95, a.baseAlpha + pulse * 0.25));

        const drawAX = a.x - parallaxX * (a.radius * 0.35);
        const drawAY = a.y - parallaxY * (a.radius * 0.35);

        // Connect to nearby stars
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionMaxDist) {
            const lineAlpha = (1 - dist / connectionMaxDist) * 0.14 * Math.min(a.alpha, b.alpha);
            const drawBX = b.x - parallaxX * (b.radius * 0.35);
            const drawBY = b.y - parallaxY * (b.radius * 0.35);

            ctx.strokeStyle = a.color === '#DFFF00' || b.color === '#DFFF00'
              ? `rgba(223, 255, 0, ${lineAlpha * 1.2})`
              : `rgba(247, 247, 245, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(drawAX, drawAY);
            ctx.lineTo(drawBX, drawBY);
            ctx.stroke();
          }
        }
      }

      // 4. Render stars & luminous glow
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        const drawX = a.x - parallaxX * (a.radius * 0.35);
        const drawY = a.y - parallaxY * (a.radius * 0.35);

        // Soft halo on special or yellow stars
        if (a.isSpecial || a.color === '#DFFF00') {
          ctx.fillStyle = a.glowColor;
          ctx.beginPath();
          ctx.arc(drawX, drawY, a.radius * 3.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core star
        ctx.fillStyle = a.color;
        ctx.globalAlpha = a.alpha;
        ctx.beginPath();
        ctx.arc(drawX, drawY, a.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(render);
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion) {
      render();
    } else {
      render();
      cancelAnimationFrame(animId);
    }

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        background: '#050505',
      }}
      aria-hidden="true"
    />
  );
}
