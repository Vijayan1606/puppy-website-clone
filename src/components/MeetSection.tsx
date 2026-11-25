import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { type CSSProperties, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { type Puppy } from '../data/puppies';
import { PawIcon } from './icons';
import { MediaImage } from './MediaImage';
import { useReducedMotion } from './RevealScope';
import { SceneSection, type SkyTone } from './SceneSection';
import { cuePup, PupStop } from './TeddyBuddy';

const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  reserved: 'Reserved',
  rehomed: 'Gone home',
};

const DOOR_COLORS = ['#a24a1a', '#5a3a28', '#d4893f', '#b8644a', '#7a4a2e'];

function PuppyDoor({ pup, index, sizes }: { pup: Puppy; index: number; sizes: string }) {
  const hasVideo = pup.media.some((m) => m.kind === 'video');
  return (
    <Link
      to={`/puppies/${pup.slug}`}
      className="tp-door__link"
      style={{ '--door': DOOR_COLORS[index % DOOR_COLORS.length] } as CSSProperties}
    >
      <span className="tp-door__plate">
        <span className="font-plush tp-door__name">{pup.displayName}</span>
        <span className="tp-door__meta">
          {pup.name ? `${pup.breed}, ` : ''}
          {pup.genderLabel.toLowerCase()}
          {pup.age ? `, ${pup.age}` : ''}
          {hasVideo ? ', with video' : ''}
        </span>
      </span>
      <span className="tp-door__frame">
        <span className="tp-door__room">
          {pup.cover && <MediaImage media={pup.cover} sizes={sizes} />}
        </span>
        <span aria-hidden="true" className="tp-door__way">
          <span className="tp-door__leaf">
            <PawIcon className="tp-door__peephole" />
            <span className="tp-door__knob" />
          </span>
        </span>
        <span className="tp-door__tag font-scrawl">{STATUS_LABELS[pup.status] ?? 'Available'}</span>
      </span>
    </Link>
  );
}

export function MeetSection({
  heading,
  body,
  ctaLabel,
  ctaHref,
  puppies,
  tone,
}: {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  puppies: Puppy[];
  tone: SkyTone;
}) {
  const rangeRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLOListElement | null>(null);
  const hallRef = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [scrollDist, setScrollDist] = useState(0);
  const [pinned, setPinned] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const desktop = matchMedia('(min-width: 1024px)').matches;
      const activePin = desktop && !reduced;
      setPinned(activePin);
      const track = trackRef.current;
      const hall = hallRef.current;
      if (hall && track && activePin) {
        const stage = hall.parentElement!;
        const head = stage.querySelector('.tp-meet__head') as HTMLElement | null;
        const maxPlate = Math.max(
          64,
          ...[...track.querySelectorAll('.tp-door__plate')].map((el) => (el as HTMLElement).offsetHeight),
        );
        const floorH = (hall.querySelector('.tp-meet__floor') as HTMLElement | null)?.offsetHeight ?? 0;
        const headBot = head ? head.offsetTop + head.offsetHeight : 0;
        const doorW = Math.max(
          128,
          Math.min(256, 0.15 * innerWidth, (stage.clientHeight - headBot - floorH - maxPlate - 40) / 1.3),
        );
        hall.style.setProperty('--door-w', `${doorW.toFixed(0)}px`);
      } else {
        hall?.style.removeProperty('--door-w');
      }
      setScrollDist(track ? Math.max(0, track.scrollWidth - innerWidth) : 0);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (hallRef.current?.parentElement) ro.observe(hallRef.current.parentElement);
    addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      removeEventListener('resize', measure);
    };
  }, [reduced]);

  const { scrollYProgress } = useScroll({ target: rangeRef, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 170, damping: 32, mass: 0.35 });
  const x = useTransform(smooth, [0, 1], [0, -scrollDist]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!pinned || !track) return;
    const syncDoors = (curX: number, cue: boolean) => {
      hallRef.current?.style.setProperty('--floor-x', `${curX.toFixed(1)}px`);
      const threshold = 0.36 * innerWidth;
      for (const child of Array.from(track.children) as HTMLElement[]) {
        const isOpen = child.offsetLeft + curX < threshold;
        const wasOpen = child.dataset.open === 'true';
        if (wasOpen !== isOpen) {
          child.dataset.open = String(isOpen);
          if (isOpen && cue) cuePup({ look: child, secs: 0.9 });
        }
      }
    };
    syncDoors(x.get(), false);
    return x.on('change', (val) => syncDoors(val, true));
  }, [pinned, x]);

  if (!puppies.length) return null;

  return (
    <SceneSection tone={tone} aria-labelledby="meet-title" className="tp-meet" data-pinned={pinned || undefined}>
      <div
        ref={rangeRef}
        data-pin-range="true"
        style={{ height: pinned ? `calc(100vh + ${Math.round(0.8 * scrollDist)}px)` : undefined, '--pinned': Number(pinned) } as CSSProperties}
      >
        <div className="tp-meet__stage">
          <header className="tp-meet__head gutter">
            <div>
              <h2 id="meet-title" className="font-plush text-huge">
                {heading}
              </h2>
              {body && <p className="text-lede mt-3 max-w-[44ch] text-[var(--ink-soft)]">{body}</p>}
            </div>
            {ctaLabel && (
              <Link to={ctaHref || '/puppies'} className="btn btn-primary shrink-0">
                {ctaLabel}
              </Link>
            )}
          </header>

          <div ref={hallRef} className="tp-meet__hall">
            <motion.ol
              ref={trackRef}
              style={pinned ? { x } : undefined}
              className="tp-meet__track"
              data-treadmill="true"
              aria-label="Puppies looking for a family"
            >
              {puppies.map((pup, idx) => (
                <li key={pup.id} className="tp-door" data-open={pinned ? 'false' : 'true'}>
                  <PuppyDoor pup={pup} index={idx} sizes="(min-width: 1024px) 15rem, 44vw" />
                </li>
              ))}
              <li className="tp-door tp-door--all" data-open="true">
                <Link to={ctaHref || '/puppies'} className="tp-door__link">
                  <span className="tp-door__frame tp-door__frame--all">
                    <span className="font-plush tp-door__all">Meet them all</span>
                  </span>
                </Link>
              </li>
            </motion.ol>
            <div aria-hidden="true" className="tp-meet__floor" />
            <PupStop pose={pinned ? 'walk' : 'sit'} act={pinned ? 'treadmill' : undefined} className="tp-meet__teddy" />
          </div>
        </div>
      </div>
    </SceneSection>
  );
}
