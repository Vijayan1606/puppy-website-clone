import React, { useEffect, useRef, useState } from 'react';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

export function isCurtainDown(): boolean {
  const state = document.querySelector<HTMLElement>('.tp-curtain')?.dataset.state;
  return state === 'covering' || state === 'covered' || state === 'snap';
}

interface RevealScopeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function RevealScope({ children, className, ...rest }: RevealScopeProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      const markAll = () =>
        el.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])').forEach((node) => {
          node.dataset.revealed = 'true';
        });
      markAll();
      const mo = new MutationObserver(markAll);
      mo.observe(el, { childList: true, subtree: true });
      return () => mo.disconnect();
    }

    const pending = new Set<HTMLElement>();
    let timer: ReturnType<typeof setTimeout> | undefined;

    const reveal = (node: HTMLElement) => {
      node.dataset.revealed = 'true';
      io.unobserve(node);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          if (isCurtainDown()) pending.add(target);
          else reveal(target);
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 }
    );

    const arm = (node: HTMLElement) => {
      if (node.dataset.armed) {
        io.observe(node);
        return;
      }
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0 && !isCurtainDown()) {
        node.dataset.revealed = 'true';
        return;
      }
      node.dataset.armed = 'true';
      io.observe(node);
    };

    el.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])').forEach(arm);

    const mo = new MutationObserver(() => {
      el.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])').forEach(arm);
    });
    mo.observe(el, { childList: true, subtree: true });

    const flush = () => {
      pending.forEach(reveal);
      pending.clear();
    };
    window.addEventListener('tp:arrived', flush);

    const poll = () => {
      if (isCurtainDown()) timer = setTimeout(poll, 400);
      else flush();
    };
    timer = setTimeout(poll, 1600);

    return () => {
      if (timer) clearTimeout(timer);
      io.disconnect();
      mo.disconnect();
      window.removeEventListener('tp:arrived', flush);
    };
  }, []);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
