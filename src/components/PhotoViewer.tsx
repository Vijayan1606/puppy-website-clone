import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { PuppyMediaItem } from '../data/puppies';
import { MediaImage } from './MediaImage';

const slideVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: 70 * dir,
    rotate: 5 * dir,
    scale: 0.92,
  }),
  center: {
    opacity: 1,
    x: 0,
    rotate: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 26 },
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: -70 * dir,
    rotate: -5 * dir,
    scale: 0.92,
    transition: { duration: 0.22 },
  }),
};

export function ViewerSlide({ media }: { media: PuppyMediaItem }) {
  const [sharp, setSharp] = useState(false);

  return (
    <>
      <MediaImage
        media={media}
        alt=""
        eager
        className={sharp ? 'tp-viewer__first tp-viewer__first--done' : 'tp-viewer__first'}
        style={{ objectFit: 'contain', objectPosition: '50% 50%', backgroundColor: 'transparent' }}
      />
      <img
        src={media.url}
        alt={media.alt}
        loading="eager"
        referrerPolicy="no-referrer"
        className="tp-viewer__sharp absolute inset-0 size-full object-contain"
        data-sharp={sharp || undefined}
        onLoad={(e) => {
          const img = e.currentTarget;
          if ('decode' in img) {
            img.decode().catch(() => {}).then(() => setSharp(true));
          } else {
            setSharp(true);
          }
        }}
      />
    </>
  );
}

export function usePhotoViewer(photos: PuppyMediaItem[], _sizes?: string) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [dir, setDir] = useState(1);

  const count = photos.length;
  const wrap = useCallback((i: number) => ((i % count) + count) % count, [count]);

  const go = useCallback(
    (nextIdx: number, nextDir: number) => {
      setDir(nextDir);
      setIndex(wrap(nextIdx));
    },
    [wrap]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(index + 1, 1);
      if (e.key === 'ArrowLeft') go(index - 1, -1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go]);

  const current = index === null ? null : photos[index];

  const open = useCallback((i: number) => {
    setDir(1);
    setIndex(i);
    dialogRef.current?.showModal();
  }, []);

  const viewer = (
    <dialog
      ref={dialogRef}
      aria-label="Photo viewer"
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70"
      onClose={() => setIndex(null)}
      onClick={(e) => {
        if (e.target === dialogRef.current) dialogRef.current?.close();
      }}
      data-lenis-prevent
    >
      {current && index !== null && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <p className="font-scrawl text-lg">
              {index + 1} / {count}
              {current.caption ? ` — ${current.caption}` : ''}
            </p>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="h-11 rounded-full bg-milk px-5 font-semibold text-cocoa"
            >
              Close
            </button>
          </div>
          <div className="relative flex-1 overflow-hidden">
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={current.id}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 touch-pan-y"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) go(index + 1, 1);
                  else if (info.offset.x > 80) go(index - 1, -1);
                }}
              >
                <ViewerSlide media={current} />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex justify-center gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3">
            <button
              type="button"
              onClick={() => go(index - 1, -1)}
              className="h-12 rounded-full border-2 border-milk px-6 font-semibold"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => go(index + 1, 1)}
              className="h-12 rounded-full bg-honey px-6 font-semibold text-cocoa"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </dialog>
  );

  return { open, viewer };
}
