import React from 'react';
import type { PuppyMediaItem } from '../data/puppies';
import { MediaImage } from './MediaImage';

const TILTS = [-2.2, 1.6, -0.9, 2.4, -1.5, 0.8, -2.6, 1.2];
const TAPES = ['center', 'left', 'right', 'corners', 'center', 'right', 'left', 'center'] as const;
const TAPE_COLORS = ['#f6d79a', '#f9cdbf', '#cfe5f6', '#f6d79a', '#e9dcc4'];

interface PolaroidProps {
  media: PuppyMediaItem;
  order: number;
  sizes: string;
  caption?: string;
  priority?: boolean;
}

export function Polaroid({ media, order, sizes, caption, priority = false }: PolaroidProps) {
  const tape = TAPES[order % TAPES.length];
  const color = TAPE_COLORS[order % TAPE_COLORS.length];

  return (
    <span
      className="tp-polaroid"
      style={
        {
          '--tilt': `${TILTS[order % TILTS.length]}deg`,
          '--tape': color,
          '--i': order,
        } as React.CSSProperties
      }
    >
      {tape === 'corners' ? (
        <>
          <span aria-hidden="true" className="tp-tape tp-tape--tl" />
          <span aria-hidden="true" className="tp-tape tp-tape--tr" />
        </>
      ) : (
        <span aria-hidden="true" className={`tp-tape tp-tape--${tape}`} />
      )}
      <span className="tp-polaroid__photo">
        <MediaImage media={media} layout="natural" sizes={sizes} eager={priority} />
      </span>
      <span className="tp-polaroid__caption font-scrawl">{caption ?? media.caption}</span>
    </span>
  );
}
