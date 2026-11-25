import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { type Puppy } from '../data/puppies';
import { PAW_PATH } from './icons';
import { MediaImage } from './MediaImage';

const fmt = (n: number) => n.toFixed(2);

function makePrng(seedStr: string) {
  let h = 0x811c9dc5;
  for (const ch of seedStr) {
    h = Math.imul(h ^ ch.charCodeAt(0), 0x1000193);
  }
  let s = h >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

function organicPoints(
  rng: () => number,
  radius: number,
  amp: number,
  steps = 40,
  start = 0,
  span = 2 * Math.PI,
): Array<[number, number]> {
  const ph = [6.28 * rng(), 6.28 * rng(), 6.28 * rng()];
  const ratio = 1 + (rng() - 0.5) * 0.05;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < steps; i++) {
    const a = start + (i / (span >= 2 * Math.PI ? steps : steps - 1)) * span;
    const r = radius + amp * (0.55 * Math.sin(2 * a + ph[0]) + 0.3 * Math.sin(3 * a + ph[1]) + 0.15 * Math.sin(5 * a + ph[2]));
    pts.push([50 + Math.cos(a) * r * ratio, 50 + Math.sin(a) * (r / ratio)]);
  }
  return pts;
}

function smoothPath(pts: Array<[number, number]>, closed: boolean): string {
  const n = pts.length;
  const get = (i: number) => pts[closed ? ((i % n) + n) % n : Math.min(n - 1, Math.max(0, i))];
  let d = `M${fmt(pts[0][0])} ${fmt(pts[0][1])}`;
  const count = closed ? n : n - 1;
  for (let i = 0; i < count; i++) {
    const p0 = get(i - 1);
    const p1 = get(i);
    const p2 = get(i + 1);
    const p3 = get(i + 2);
    const c1: [number, number] = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: [number, number] = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${fmt(c1[0])} ${fmt(c1[1])} ${fmt(c2[0])} ${fmt(c2[1])} ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return closed ? `${d}Z` : d;
}

const WASH_COLORS = ['#f2be6b', '#f9cdbf', '#bfddf5', '#fbe3b4', '#e8c39a'];
const INK_COLORS = ['#c2622b', '#a24a1a', '#2a170e', '#d4893f'];
const DOODLE_KINDS = ['sparkle', 'heart', 'dashes', 'swirl', 'dots', 'paw'] as const;
const STATUS_TEXT: Record<string, string> = {
  available: 'Available',
  reserved: 'Reserved',
  rehomed: 'Gone home',
};

function maskDataUri(d: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${d}" fill="#000"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

interface DoodleSpec {
  kind: (typeof DOODLE_KINDS)[number];
  x: number;
  y: number;
  rot: number;
  size: number;
  ink: string;
}

function DoodleSvg({ d }: { d: DoodleSpec }) {
  const tf = `translate(${d.x.toFixed(1)} ${d.y.toFixed(1)}) rotate(${d.rot.toFixed(0)}) scale(${d.size.toFixed(2)})`;
  const strokeProps = {
    fill: 'none',
    stroke: d.ink,
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  return (
    <g transform={tf}>
      <g className="tp-sketch__doodle">
        {d.kind === 'sparkle' && (
          <path d="M0 -6c.6 3.6 2.4 5.4 6 6-3.6.6-5.4 2.4-6 6-.6-3.6-2.4-5.4-6-6 3.6-.6 5.4-2.4 6-6z" fill={d.ink} />
        )}
        {d.kind === 'heart' && (
          <path d="M0 5C-4.6 1.8-6.4-.8-6.4-3.2c0-1.9 1.5-3.3 3.3-3.3 1.3 0 2.4.7 3.1 1.9.7-1.2 1.8-1.9 3.1-1.9 1.8 0 3.3 1.4 3.3 3.3C6.4-.8 4.6 1.8 0 5z" {...strokeProps} />
        )}
        {d.kind === 'dashes' && <path d="M-5 -5l4 2M-6 0h5M-5 5l4 -2" {...strokeProps} />}
        {d.kind === 'swirl' && (
          <path d="M0 0c1.6-.6 2.4 1.4.8 2.6-2 1.4-4.6-.4-4-3 .7-3 4.8-3.8 6.8-1.2 2.4 3-0.2 7.4-3.8 7.2" {...strokeProps} />
        )}
        {d.kind === 'dots' && (
          <g fill={d.ink}>
            <circle cx="-4" cy="1" r="1.2" />
            <circle cx="0" cy="-2" r="1.2" />
            <circle cx="4" cy="1" r="1.2" />
          </g>
        )}
        {d.kind === 'paw' && <path d={PAW_PATH} transform="scale(.17) translate(-32 -34)" fill={d.ink} opacity={0.85} />}
      </g>
    </g>
  );
}

const DEFAULT_SIZES = '(min-width: 1536px) 17rem, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw';

export function PupSketchCard({
  pup,
  index = 0,
  sizes = DEFAULT_SIZES,
  preload = false,
  small = false,
}: {
  pup: Puppy;
  index?: number;
  sizes?: string;
  preload?: boolean;
  small?: boolean;
}) {
  const rng = makePrng(pup.slug);
  const mask = smoothPath(organicPoints(rng, 45.5, 2.6), true);
  const outline = smoothPath(organicPoints(rng, 47.8, 3.1), true);
  const startA = rng() * Math.PI * 2;
  const retrace = smoothPath(organicPoints(rng, 49, 3.4, 30, startA, Math.PI * (1.15 + 0.5 * rng())), false);
  const wash = {
    d: smoothPath(organicPoints(rng, 46.5, 3.6), true),
    dx: (rng() - 0.5) * 9,
    dy: 3 + 4 * rng(),
    color: WASH_COLORS[Math.floor(rng() * WASH_COLORS.length)],
  };
  const tilt = (rng() - 0.5) * 5;
  const zones = [
    [0.86, 1.08],
    [1.16, 1.42],
    [-0.08, 0.16],
  ]
    .map((z) => ({ z, k: rng() }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.z);
  const count = 2 + Math.floor(2 * rng());
  const used = new Set<(typeof DOODLE_KINDS)[number]>();
  const doodles: DoodleSpec[] = [];
  for (let i = 0; i < count; i++) {
    let kind = DOODLE_KINDS[Math.floor(rng() * DOODLE_KINDS.length)];
    if (used.has(kind)) kind = DOODLE_KINDS.find((k) => !used.has(k))!;
    used.add(kind);
    const [z0, z1] = zones[i];
    const angle = Math.PI * (z0 + rng() * (z1 - z0));
    const r = 55 + 4 * rng();
    doodles.push({
      kind,
      x: 50 + Math.cos(angle) * r,
      y: 50 + Math.sin(angle) * r,
      rot: (rng() - 0.5) * 50,
      size: 0.85 + 0.35 * rng(),
      ink: INK_COLORS[Math.floor(rng() * INK_COLORS.length)],
    });
  }

  const hasVideo = pup.media.some((m) => m.kind === 'video');
  const maskUrl = maskDataUri(mask);

  return (
    <Link
      to={`/puppies/${pup.slug}`}
      className={`tp-sketch${small ? ' tp-sketch--small' : ''}`}
      data-reveal="true"
      style={{
        '--tilt': `${tilt.toFixed(2)}deg`,
        '--d': `${(index % 8) * 70}ms`,
        '--wash': wash.color,
      } as CSSProperties}
      aria-label={`${pup.displayName}${pup.name ? `, ${pup.breed}` : ''}, ${pup.genderLabel.toLowerCase()}${pup.age ? `, ${pup.age}` : ''}, ${(STATUS_TEXT[pup.status] ?? 'Available').toLowerCase()}`}
    >
      <span className="tp-sketch__frame">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="tp-sketch__wash"
          style={{ translate: `${wash.dx.toFixed(1)}% ${wash.dy.toFixed(1)}%` }}
        >
          <path d={wash.d} />
        </svg>
        <span className="tp-sketch__photo" style={{ maskImage: maskUrl, WebkitMaskImage: maskUrl }}>
          {pup.cover && <MediaImage media={pup.cover} sizes={sizes} preload={preload} alt="" />}
        </span>
        <svg aria-hidden="true" viewBox="0 0 100 100" className="tp-sketch__ink">
          <path d={outline} pathLength={1} className="tp-sketch__line" />
          <path d={retrace} pathLength={1} className="tp-sketch__line tp-sketch__line--retrace" />
          {doodles.map((d, i) => (
            <DoodleSvg key={i} d={d} />
          ))}
        </svg>
        {!small && <span className="tp-sketch__sticker font-scrawl">{STATUS_TEXT[pup.status] ?? 'Available'}</span>}
        {hasVideo && !small && <span className="tp-sketch__video">▶ video</span>}
        {small && <span className="tp-sketch__sticker tp-sketch__sticker--home font-scrawl">gone home ♥</span>}
      </span>
      <span className="tp-sketch__name font-plush">{pup.displayName}</span>
      {!small && (
        <span className="tp-sketch__meta">
          {pup.name ? `${pup.breed} · ` : ''}
          {pup.genderLabel.toLowerCase()}
          {pup.age ? ` · ${pup.age}` : ''}
        </span>
      )}
    </Link>
  );
}
