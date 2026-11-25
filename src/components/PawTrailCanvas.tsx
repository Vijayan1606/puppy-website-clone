import { useEffect, useRef } from 'react';
import { PAW_PATH } from './icons';
import { useReducedMotion } from './RevealScope';

interface PrintDrop {
  x: number;
  y: number;
  angle: number;
  born: number;
}

export function PawTrailCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const paw = new Path2D(PAW_PATH);
    const drops: PrintDrop[] = [];
    let dpr = 1;
    let rafId = 0;
    let active = false;
    let lastX = NaN;
    let lastY = NaN;
    let dist = 0;
    let side = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
    };
    resize();

    const draw = (now: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = drops.length - 1; i >= 0; i--) {
        const p = drops[i];
        const age = now - p.born;
        if (age > 1000) {
          drops.splice(i, 1);
          continue;
        }
        const alpha = age < 600 ? 1 : 1 - (age - 600) / 400;
        ctx.globalAlpha = 0.42 * alpha * alpha;
        ctx.setTransform(0.27 * dpr, 0, 0, 0.27 * dpr, p.x * dpr, p.y * dpr);
        ctx.rotate(p.angle);
        ctx.translate(-32, -34);
        ctx.fillStyle = '#c2622b';
        ctx.fill(paw);
      }
      if (drops.length) {
        rafId = requestAnimationFrame(draw);
      } else {
        active = false;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (Number.isNaN(lastX)) {
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      dist += Math.hypot(dx, dy);
      if (dist >= 46) {
        dist = 0;
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        side = -side;
        const off = 7 * side;
        drops.push({
          x: e.clientX + Math.cos(angle) * off + 14,
          y: e.clientY + Math.sin(angle) * off + 16,
          angle,
          born: performance.now(),
        });
        if (drops.length > 14) drops.shift();
        if (!active) {
          active = true;
          rafId = requestAnimationFrame(draw);
        }
      }
      lastX = e.clientX;
      lastY = e.clientY;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [reduced]);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] size-full" />;
}
