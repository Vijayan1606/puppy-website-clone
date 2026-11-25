import Lenis from 'lenis';
import { useEffect } from 'react';
import { prefersReducedMotion, useReducedMotion } from './RevealScope';

let activeLenis: Lenis | null = null;

export function SmoothScroll() {
  const reduced = useReducedMotion();

  useEffect(() => {
    const onHashClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.detail === 0 || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const link = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!link || (link.target && link.target !== '_self')) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search || url.hash.length < 2) {
        return;
      }
      const id = decodeURIComponent(url.hash.slice(1));
      const target = [...document.querySelectorAll(`[id="${CSS.escape(id)}"]`)].find((el) => el.getClientRects().length);
      if (target) {
        e.preventDefault();
        if (activeLenis) {
          activeLenis.scrollTo(target as HTMLElement);
        } else {
          target.scrollIntoView({ behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
        }
        history.pushState(null, '', url.hash);
      }
    };
    addEventListener('click', onHashClick);
    return () => removeEventListener('click', onHashClick);
  }, []);

  useEffect(() => {
    if (reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const docEl = document.documentElement;
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      wheelMultiplier: 0.85,
      prevent: (node) => Boolean(node.closest?.('dialog, [data-lenis-prevent]')),
      virtualScroll: () => getComputedStyle(docEl).overflowY !== 'hidden',
    });
    activeLenis = lenis;
    const syncTop = () => lenis.scrollTo(lenis.actualScroll, { immediate: true });
    addEventListener('tp:navigate', syncTop);
    addEventListener('popstate', syncTop);

    let rafId = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      removeEventListener('tp:navigate', syncTop);
      removeEventListener('popstate', syncTop);
      lenis.destroy();
      activeLenis = null;
    };
  }, [reduced]);

  return null;
}
