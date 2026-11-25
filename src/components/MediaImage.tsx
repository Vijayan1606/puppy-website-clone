import React, { useState } from 'react';
import type { PuppyMediaItem } from '../data/puppies';

interface MediaImageProps {
  media: PuppyMediaItem;
  alt?: string;
  className?: string;
  sizes?: string;
  preload?: boolean;
  eager?: boolean;
  layout?: 'fill' | 'natural';
  style?: React.CSSProperties;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
}

export function MediaImage({
  media,
  alt,
  className = '',
  eager = false,
  layout = 'fill',
  style,
  onLoad,
}: MediaImageProps) {
  const [failed, setFailed] = useState(false);

  const pos = `${((media.focalX ?? 0.5) * 100).toFixed(1)}% ${((media.focalY ?? 0.5) * 100).toFixed(1)}%`;

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-honey-soft text-cocoa-soft ${
          layout === 'fill' ? 'absolute inset-0' : 'aspect-[4/5] w-full'
        } ${className}`}
        style={{ backgroundColor: media.color || '#fbe3b4', ...style }}
        role="img"
        aria-label={alt ?? media.alt}
      >
        <span className="font-scrawl px-3 text-center text-sm">{media.caption || media.alt || 'TeddyPups'}</span>
      </div>
    );
  }

  const baseStyle: React.CSSProperties =
    layout === 'natural'
      ? {
          width: '100%',
          height: 'auto',
          display: 'block',
          objectFit: 'cover',
          objectPosition: pos,
          backgroundColor: media.color || '#f2be6b',
          ...style,
        }
      : {
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: pos,
          backgroundColor: media.color || '#f2be6b',
          ...style,
        };

  if (media.blurDataUrl) {
    baseStyle.backgroundImage = `url("${media.blurDataUrl}")`;
    baseStyle.backgroundSize = 'cover';
    baseStyle.backgroundPosition = pos;
    baseStyle.backgroundRepeat = 'no-repeat';
  }

  return (
    <img
      src={media.url}
      alt={alt !== undefined ? alt : media.alt}
      width={layout === 'natural' ? media.width : undefined}
      height={layout === 'natural' ? media.height : undefined}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      style={baseStyle}
      onLoad={onLoad}
      onError={() => setFailed(true)}
    />
  );
}
