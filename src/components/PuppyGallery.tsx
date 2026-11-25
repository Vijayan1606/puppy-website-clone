import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type PuppyMedia } from '../data/puppies';
import { MediaImage } from './MediaImage';
import { prefersReducedMotion } from './RevealScope';

export function PuppyGallery({ media, name }: { media: PuppyMedia[]; name: string }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [viewerOpen, setViewerOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const count = media.length;

  const step = useCallback(
    (delta: number) => {
      if (!count) return;
      setDir(delta >= 0 ? 1 : -1);
      setIdx((i) => (i + delta + count) % count);
    },
    [count],
  );

  const goTo = (nextIdx: number) => {
    setDir(nextIdx >= idx ? 1 : -1);
    setIdx((nextIdx + count) % count);
  };

  useEffect(() => {
    setIdx(0);
    setViewerOpen(false);
  }, [name]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (viewerOpen && !dlg.open) dlg.showModal();
    if (!viewerOpen && dlg.open) dlg.close();
  }, [viewerOpen]);

  useEffect(() => {
    if (!viewerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewerOpen, step]);

  if (!count) return null;
  const active = media[idx] ?? media[0];
  const reduced = prefersReducedMotion();

  return (
    <div>
      <div className="tp-storypage relative aspect-[4/5] md:aspect-[5/6]">
        <AnimatePresence initial={false} mode="popLayout">
          {active.kind === 'video' ? (
            <motion.div
              key={active.id}
              className="absolute inset-0 size-full bg-cocoa"
              initial={reduced ? undefined : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
            >
              <video
                src={active.url}
                poster={active.poster?.url}
                controls
                playsInline
                preload="metadata"
                className="size-full object-cover"
                aria-label={`${name}, video ${idx + 1} of ${count}`}
              />
            </motion.div>
          ) : (
            <motion.button
              key={active.id}
              type="button"
              onClick={() => setViewerOpen(true)}
              className="absolute inset-0 block size-full"
              aria-label={`Open ${name}, photo ${idx + 1} of ${count} full screen`}
              style={{ transformOrigin: dir > 0 ? '0% 50%' : '100% 50%' }}
              initial={reduced ? undefined : { clipPath: dir > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)', opacity: 0.7 }}
              animate={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <MediaImage media={active} sizes="(min-width: 1024px) 55vw, 92vw" preload />
            </motion.button>
          )}
        </AnimatePresence>

        {count > 1 && (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex justify-between">
            <button
              type="button"
              onClick={() => step(-1)}
              className="pointer-events-auto grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold"
              aria-label="Previous photo"
            >
              ‹
            </button>
            <span className="self-center rounded-full bg-cocoa/80 px-3 py-1 text-sm font-semibold text-milk">
              {idx + 1} / {count}
            </span>
            <button
              type="button"
              onClick={() => step(1)}
              className="pointer-events-auto grid size-12 place-items-center rounded-full border-2 border-cocoa bg-milk/95 text-xl font-bold"
              aria-label="Next photo"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {count > 1 && (
        <ul
          className="mt-3 flex gap-3 overflow-x-auto px-1 pb-2 pt-2 [scrollbar-width:thin]"
          aria-label={`All photos of ${name}`}
        >
          {media.map((item, i) => {
            const thumb = item.kind === 'video' ? item.poster : item;
            const current = i === idx;
            return (
              <li key={item.id} className="shrink-0">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`${name}, ${item.kind === 'video' ? 'video' : 'photo'} ${i + 1} of ${count}`}
                  aria-current={current}
                  className={`relative block h-24 w-20 overflow-hidden rounded-[0.9rem] border-[3px] transition-transform duration-300 md:h-28 md:w-24 ${
                    current
                      ? '-rotate-3 -translate-y-1 border-toffee-deep'
                      : 'border-cocoa/30 hover:-rotate-2 hover:border-cocoa'
                  }`}
                >
                  {thumb && <MediaImage media={thumb} sizes="96px" alt="" />}
                  {item.kind === 'video' && (
                    <span className="absolute inset-0 grid place-items-center bg-cocoa/30 text-lg text-milk">▶</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        aria-label={`${name} photos`}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
        onClose={() => setViewerOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        data-lenis-prevent="true"
      >
        {viewerOpen && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <p className="font-scrawl text-lg">
                {name} · {idx + 1} of {count}
              </p>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa"
              >
                Close
              </button>
            </div>
            <div className="relative flex-1 touch-pan-y">
              <motion.div
                key={active.id}
                className="absolute inset-0"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) step(1);
                  else if (info.offset.x > 80) step(-1);
                }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {active.kind === 'video' ? (
                  <video
                    src={active.url}
                    poster={active.poster?.url}
                    controls
                    autoPlay
                    playsInline
                    className="size-full object-contain"
                  />
                ) : (
                  <MediaImage media={active} sizes="100vw" className="!object-contain" preload />
                )}
              </motion.div>
            </div>
            {count > 1 && (
              <div className="flex justify-center gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="h-12 rounded-full border-2 border-milk px-6 font-semibold"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="h-12 rounded-full bg-honey px-6 font-semibold text-cocoa"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}
