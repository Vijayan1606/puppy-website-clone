import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PAW_PATH } from './icons';
import { prefersReducedMotion } from './RevealScope';
import { ANCHORS, COLORS, GROUND_Y, LEG_PATHS, PUP_H, PUP_PARTS, PUP_W, toePath } from './TeddyBuddy';

const STROKE = {
  stroke: COLORS.ink,
  strokeWidth: 3.4,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};
const STROKE_NONE = { ...STROKE, fill: 'none' as const };

function RunnerLeg({ cls, at, d, len, fill }: {
  cls: string;
  at: [number, number];
  d: string;
  len: number;
  fill: string;
}) {
  return (
    <g className={`tp-runner__leg ${cls}`} style={{ transformOrigin: `${at[0]}px ${at[1]}px` }}>
      <g transform={`translate(${at[0]} ${at[1]})`}>
        <path d={`${d}Z`} fill={fill} />
        <path d={d} {...STROKE_NONE} />
        <path d={toePath(len)} {...STROKE_NONE} strokeWidth={2.4} />
      </g>
    </g>
  );
}

function RunnerPup({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${PUP_W} ${PUP_H}`}
      className={`tp-runner ${className}`}
      aria-hidden="true"
      focusable="false"
      style={{ overflow: 'visible' }}
    >
      <ellipse cx={150} cy={GROUND_Y + 2} rx={86} ry={7} fill={COLORS.ink} opacity={0.12} className="tp-runner__shadow" />
      <g className="tp-runner__body">
        <RunnerLeg cls="tp-runner__leg--bf" at={ANCHORS.hipF} d={LEG_PATHS.backFar} len={GROUND_Y - 192} fill={COLORS.coatShade} />
        <RunnerLeg cls="tp-runner__leg--ff" at={ANCHORS.shoulderF} d={LEG_PATHS.frontFar} len={GROUND_Y - 192} fill={COLORS.coatShade} />
        <g className="tp-runner__tail" style={{ transformOrigin: `${ANCHORS.tailBase[0]}px ${ANCHORS.tailBase[1]}px` }}>
          <path d={PUP_PARTS.tailStem} {...STROKE_NONE} strokeWidth={9} />
          <path d={PUP_PARTS.tailStem} stroke={COLORS.coat} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d={PUP_PARTS.tail} fill={COLORS.coat} {...STROKE} />
        </g>
        <RunnerLeg cls="tp-runner__leg--bn" at={ANCHORS.hipN} d={LEG_PATHS.back} len={GROUND_Y - 194} fill={COLORS.coat} />
        <path d={PUP_PARTS.body} fill={COLORS.coat} {...STROKE} />
        <path d={PUP_PARTS.chest} fill={COLORS.coat} {...STROKE} />
        <RunnerLeg cls="tp-runner__leg--fn" at={ANCHORS.shoulderN} d={LEG_PATHS.front} len={GROUND_Y - 194} fill={COLORS.coat} />
        <g className="tp-runner__head">
          <path d={PUP_PARTS.collar} fill={COLORS.collar} {...STROKE} strokeWidth={3} />
          <path d={PUP_PARTS.tag} fill={COLORS.muzzle} {...STROKE} strokeWidth={2.4} />
          <path d={PUP_PARTS.earL} fill={COLORS.coatShade} {...STROKE} className="tp-runner__ear" style={{ transformOrigin: '174px 82px' }} />
          <path d={PUP_PARTS.earR} fill={COLORS.coatShade} {...STROKE} className="tp-runner__ear tp-runner__ear--r" style={{ transformOrigin: '250px 82px' }} />
          <path d={PUP_PARTS.head} fill={COLORS.coat} {...STROKE} />
          <path d={PUP_PARTS.topknot} fill={COLORS.coat} {...STROKE} strokeWidth={3} />
          <path d={PUP_PARTS.muzzle} fill={COLORS.muzzle} />
          <circle cx={181} cy={116} r={7} fill={COLORS.cheek} opacity={0.85} />
          <circle cx={243} cy={116} r={7} fill={COLORS.cheek} opacity={0.85} />
          <path d="M186.5 101 Q194 91.5 201.5 101 M222.5 101 Q230 91.5 237.5 101" {...STROKE_NONE} />
          <path d={PUP_PARTS.nose} fill={COLORS.ink} />
          <path d={PUP_PARTS.mouth} {...STROKE_NONE} strokeWidth={3} />
          <path d={PUP_PARTS.tongue} fill="#e98c8c" stroke={COLORS.ink} strokeWidth={2.2} strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}

function getIntroAnimTime(): number {
  const anim = document
    .querySelector('.tp-curtain')
    ?.getAnimations()
    .find((a): a is CSSAnimation => 'animationName' in a && a.animationName === 'tp-curtain-rest');
  return anim && anim.playState !== 'finished' && typeof anim.currentTime === 'number' ? anim.currentTime : Infinity;
}

const PRINTS: [number, number, number][] = [
  [18, 6, -76],
  [27, -4, -84],
  [36, 7, -72],
  [45, -3, -86],
  [54, 6, -74],
];

export function RouteCurtain() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const ref = useRef<HTMLDivElement | null>(null);
  const pendingUrlRef = useRef<string | null>(null);
  const coveredAtRef = useRef(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const prevPathRef = useRef(pathname);
  const focusMainRef = useRef(false);
  const liftRef = useRef<() => void>(() => {});

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const docEl = document.documentElement;
    const setState = (st: string) => {
      el.dataset.state = st;
      if (st === 'idle') delete docEl.dataset.curtain;
      else docEl.dataset.curtain = st;
    };
    const clearTimers = () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
    const after = (fn: () => void, ms: number) => timersRef.current.push(setTimeout(fn, ms));

    const lift = () => {
      if (el.dataset.state === 'idle' || el.dataset.state === 'lifting') return;
      clearTimers();
      pendingUrlRef.current = null;
      setState('lifting');
      dispatchEvent(new Event('tp:arrived'));
      if (focusMainRef.current) {
        focusMainRef.current = false;
        document.getElementById('main')?.focus({ preventScroll: true });
      }
      after(() => setState('idle'), 460);
    };

    const go = (href: string) => {
      const url = new URL(href, location.href);
      if (url.pathname === location.pathname && url.search === location.search) {
        pendingUrlRef.current = null;
        scrollTo({ top: 0, behavior: 'instant' });
        after(lift, 120);
        return;
      }
      navigate(url.pathname + url.search + url.hash);
      after(lift, 6000);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.detail === 0 || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link || (link.target && link.target !== '_self') || link.hasAttribute('download') || link.dataset.noCurtain !== undefined) {
        return;
      }
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || /^\/(admin|api|media|_next)(\/|$)/.test(url.pathname)) return;
      if (url.pathname === location.pathname && (url.hash || url.search !== location.search)) return;
      if (prefersReducedMotion()) return;

      e.preventDefault();
      e.stopPropagation();
      focusMainRef.current = false;
      dispatchEvent(new Event('tp:navigate'));
      pendingUrlRef.current = url.href;
      const curState = el.dataset.state;
      if (curState === 'covered' || curState === 'snap') {
        go(url.href);
      } else if (curState !== 'covering') {
        clearTimers();
        if (curState === 'intro' && getIntroAnimTime() < 1080) {
          setState('covered');
          coveredAtRef.current = performance.now();
          go(url.href);
        } else {
          setState('covering');
          after(() => {
            setState('covered');
            coveredAtRef.current = performance.now();
            if (pendingUrlRef.current) go(pendingUrlRef.current);
          }, 300);
        }
      }
    };

    const onPop = () => {
      if (!prefersReducedMotion() && location.pathname !== prevPathRef.current) {
        clearTimers();
        setState('snap');
        coveredAtRef.current = performance.now();
        after(lift, 1400);
      }
    };

    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        clearTimers();
        setState('idle');
      }
    };

    if (el.dataset.state === 'intro') {
      const t = getIntroAnimTime();
      after(() => dispatchEvent(new Event('tp:arrived')), Math.max(0, 560 - t));
      after(() => {
        if (el.dataset.state === 'intro') setState('idle');
      }, Math.max(0, 1080 - t));
    }
    if (prefersReducedMotion()) setState('idle');

    addEventListener('click', onClick, true);
    addEventListener('popstate', onPop);
    addEventListener('pageshow', onPageShow);
    liftRef.current = lift;

    return () => {
      clearTimers();
      delete docEl.dataset.curtain;
      removeEventListener('click', onClick, true);
      removeEventListener('popstate', onPop);
      removeEventListener('pageshow', onPageShow);
    };
  }, [navigate]);

  useEffect(() => {
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;
    const st = ref.current?.dataset.state;
    if (st !== 'covered' && st !== 'snap' && st !== 'covering') return;
    const delay = st === 'covering' ? 340 : Math.max(0, 140 - (performance.now() - coveredAtRef.current));
    const timer = setTimeout(() => requestAnimationFrame(() => liftRef.current()), delay);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div ref={ref} className="tp-curtain" data-state="intro" aria-hidden="true">
      <div className="tp-curtain__blanket">
        <svg className="tp-curtain__edge tp-curtain__edge--top" width="100%" height="40" preserveAspectRatio="none">
          <defs>
            <pattern id="tp-curtain-scallop" width="76" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V27A38 25 0 0 1 76 27V40Z" fill="#fbe3b4" />
              <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3" />
              <path
                d="M11 33A27 19 0 0 1 65 33"
                fill="none"
                stroke="#2a170e"
                strokeWidth="1.6"
                strokeDasharray="3.5 5.5"
                strokeLinecap="round"
                opacity=".42"
              />
            </pattern>
          </defs>
          <rect width="100%" height="40" fill="url(#tp-curtain-scallop)" />
        </svg>
        <div className="tp-curtain__stage">
          <div className="tp-curtain__prints">
            {PRINTS.map(([left, top, deg], i) => (
              <svg
                key={i}
                viewBox="0 0 64 64"
                className="tp-curtain__print"
                style={{ left: `${left}%`, top: `${top}px`, rotate: `${deg + 90}deg`, animationDelay: `${0.16 + 0.12 * i}s` }}
              >
                <path d={PAW_PATH} />
              </svg>
            ))}
          </div>
          <div className="tp-curtain__runner">
            <RunnerPup />
          </div>
          <p className="tp-curtain__note font-scrawl">every puppy is family</p>
        </div>
        <svg className="tp-curtain__edge tp-curtain__edge--bottom" width="100%" height="40" preserveAspectRatio="none">
          <rect width="100%" height="40" fill="url(#tp-curtain-scallop)" />
        </svg>
      </div>
    </div>
  );
}
