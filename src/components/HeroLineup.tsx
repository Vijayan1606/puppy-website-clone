import { type CSSProperties, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { type Puppy } from '../data/puppies';
import { MediaImage } from './MediaImage';
import { prefersReducedMotion } from './RevealScope';

const SEATS: [number, number, number, number][] = [
  [9, 8.6, 0.62, -5],
  [22.5, 10.4, 0.8, 3],
  [35, 9.2, 0.7, -2],
  [65, 9.4, 0.74, 3],
  [77.5, 10.6, 0.82, -3],
  [91, 8.4, 0.6, 4],
];

const INTERVALS = [1900, 2500, 1700, 2300, 2000, 2800, 1800];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function HeroLineup({ friends }: { friends: Puppy[] }) {
  const count = Math.min(SEATS.length, friends.length);
  const [slots, setSlots] = useState<number[]>(() => friends.slice(0, count).map((_, idx) => idx));
  const [states, setStates] = useState<Record<number, 'duck' | 'pop' | undefined>>({});
  const [tagIdx, setTagIdx] = useState<number | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [wingIdx, setWingIdx] = useState<number | null>(friends.length > count ? count : null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const wingRef = useRef<HTMLSpanElement | null>(null);
  const slotsRef = useRef(slots);

  useEffect(() => {
    slotsRef.current = slots;
  }, [slots]);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !count || prefersReducedMotion()) return;
    const hasExtra = friends.length > count;
    const scene = list.closest('[data-pup-scene]') as HTMLElement | null;
    let visible = true;
    let pauseUntil = 0;
    let alive = true;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0.35 });
    io.observe(list);

    const hold = () => {
      pauseUntil = performance.now() + 1200;
    };
    addEventListener('scroll', hold, { passive: true });
    addEventListener('pointerdown', hold, { passive: true });
    list.addEventListener('pointerover', hold, { passive: true });

    const remaining = friends.map((_, i) => i).filter((i) => !slotsRef.current.includes(i));
    let reserve = remaining.includes(count) ? [count, ...shuffle(remaining.filter((i) => i !== count))] : shuffle(remaining);
    let bag: number[] = [];
    let lastSeat = -1;
    let turn = 0;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const schedule = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));
    let retries = 0;

    const step = () => {
      if (!(!document.hidden && visible && performance.now() > pauseUntil && scene?.dataset.here !== 'false')) {
        schedule(step, 900);
        return;
      }
      if (!hasExtra) {
        popNext();
        return;
      }
      if (!reserve.length) {
        reserve = shuffle(friends.map((_, i) => i).filter((i) => !slotsRef.current.includes(i)));
      }
      const img = wingRef.current?.dataset.for === String(reserve[0]) ? wingRef.current.querySelector('img') : null;
      if (!img || !img.complete || !img.naturalWidth) {
        if (++retries < 15) {
          schedule(step, 400);
        } else {
          reserve.push(reserve.shift()!);
          setWingIdx(reserve[0] ?? null);
          retries = 0;
          schedule(step, 800);
        }
        return;
      }
      retries = 0;
      img.decode().then(popNext, popNext);
    };

    const popNext = () => {
      if (!bag.length) {
        bag = shuffle(
          [...list.children].map((el, i) => ((el as HTMLElement).getClientRects().length ? i : -1)).filter((i) => i >= 0),
        ).filter((i, idx, arr) => !(idx === 0 && i === lastSeat && arr.length > 1));
      }
      const seat = bag.shift();
      if (seat === undefined) {
        schedule(step, 2000);
        return;
      }
      lastSeat = seat;
      const incoming = hasExtra ? reserve.shift()! : slotsRef.current[seat];
      setStates((prev) => ({ ...prev, [seat]: 'duck' }));
      schedule(() => {
        if (hasExtra) {
          const outgoing = slotsRef.current[seat];
          setSlots((prev) => prev.map((v, i) => (i === seat ? incoming : v)));
          reserve.push(outgoing);
          setWingIdx(reserve[0] ?? null);
        }
        setStates((prev) => ({ ...prev, [seat]: 'pop' }));
        setTagIdx(seat);
        schedule(() => setTagIdx((cur) => (cur === seat ? null : cur)), 1800);
        schedule(() => setStates((prev) => ({ ...prev, [seat]: undefined })), 700);
      }, 360);
      schedule(step, INTERVALS[turn++ % INTERVALS.length]);
    };

    if (hasExtra) setWingIdx(reserve[0] ?? null);
    const introAnims = [...list.querySelectorAll('.tp-lineup__pup')]
      .flatMap((el) => el.getAnimations())
      .filter((a): a is CSSAnimation => 'animationName' in a && a.animationName === 'tp-peek');
    const begin = () => {
      if (alive) schedule(step, 250);
    };
    Promise.all(introAnims.map((a) => a.finished)).then(begin, begin);

    return () => {
      alive = false;
      timers.forEach(clearTimeout);
      timers = [];
      io.disconnect();
      removeEventListener('scroll', hold);
      removeEventListener('pointerdown', hold);
      list.removeEventListener('pointerover', hold);
    };
  }, [friends, count]);

  if (!count) return null;

  const seatStyle = (idx: number): CSSProperties => {
    const [x, w, peek, tilt] = SEATS[idx];
    return {
      '--x': `${x}%`,
      '--w': `${w}rem`,
      '--peek': peek,
      '--tilt': `${tilt}deg`,
      '--i': idx,
    } as CSSProperties;
  };

  return (
    <>
      <ul ref={listRef} className="tp-lineup">
        {slots.map((friendIdx, seatIdx) => {
          const pup = friends[friendIdx];
          return (
            <li key={seatIdx} className="tp-lineup__seat" style={seatStyle(seatIdx)}>
              <Link
                to={`/puppies/${pup.slug}`}
                className="tp-lineup__pup"
                data-pup-friend="true"
                data-state={states[seatIdx]}
                aria-label={`Meet ${pup.displayName}, ${pup.breed}`}
                onPointerEnter={() => setHoveredIdx(seatIdx)}
                onPointerLeave={() => setHoveredIdx((c) => (c === seatIdx ? null : c))}
                onFocus={() => setHoveredIdx(seatIdx)}
                onBlur={() => setHoveredIdx((c) => (c === seatIdx ? null : c))}
              >
                <span className="tp-lineup__photo">
                  {pup.cover && <MediaImage key={pup.id} media={pup.cover} sizes="11rem" preload={seatIdx < 2} eager />}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <ul aria-hidden="true" className="tp-lineup tp-lineup--tags">
        {slots.map((friendIdx, seatIdx) => (
          <li key={seatIdx} className="tp-lineup__seat" style={seatStyle(seatIdx)}>
            <span
              className="tp-lineup__ghost"
              data-state={states[seatIdx]}
              data-tag={tagIdx === seatIdx || hoveredIdx === seatIdx ? 'show' : undefined}
            >
              <span className="tp-lineup__name font-scrawl">{friends[friendIdx].displayName}</span>
            </span>
          </li>
        ))}
      </ul>

      {wingIdx !== null && friends[wingIdx]?.cover && (
        <span ref={wingRef} aria-hidden="true" className="tp-lineup__wings" data-for={wingIdx}>
          <MediaImage media={friends[wingIdx].cover} sizes="11rem" alt="" eager />
        </span>
      )}
    </>
  );
}
