import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { type FamilyPhoto, type FamilyTestimonial } from '../data/families';
import { usePhotoViewer } from './PhotoViewer';
import { Polaroid } from './Polaroid';
import { RevealScope } from './RevealScope';
import { SceneSection, type SkyTone } from './SceneSection';
import { PupStop } from './TeddyBuddy';

const PHOTO_SIZES = '(min-width: 1024px) 18vw, (min-width: 640px) 28vw, 42vw';
const REVEAL_ORDER = [3, 0, 5, 1, 6, 2, 7, 4];

export function DuskSection({
  heading,
  body,
  ctaLabel,
  ctaHref,
  photos,
  testimonial,
  tone,
}: {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  photos: FamilyPhoto[];
  testimonial?: FamilyTestimonial;
  tone: SkyTone;
}) {
  const preview = photos.slice(0, 8);
  const { open, viewer } = usePhotoViewer(photos, PHOTO_SIZES);

  if (!photos.length) return null;

  return (
    <SceneSection tone={tone} aria-labelledby="dusk-title" className="tp-dusk">
      <div className="tp-dusk__sky gutter">
        <div className="tp-dusk__head">
          <h2 id="dusk-title" className="font-plush text-huge">
            {heading}
          </h2>
          {body && <p className="text-lede mt-5 max-w-[50ch] text-[var(--ink-soft)]">{body}</p>}
        </div>

        {testimonial && (
          <figure className="tp-dusk__note">
            <blockquote className="font-plush-text">“{testimonial.quote}”</blockquote>
            <figcaption className="font-scrawl">
              {testimonial.author}
              {testimonial.location ? `, ${testimonial.location}` : ''}
            </figcaption>
          </figure>
        )}
      </div>

      <div className="tp-photowall">
        <RevealScope className="tp-photowall__wall">
          <ul className="tp-photowall__prints" aria-label="Photos from TeddyPups families">
            {preview.map((photo, idx) => (
              <li
                key={photo.id}
                data-reveal="true"
                data-pup-look={idx === 1 || idx === 4 ? '' : undefined}
                style={{ '--d': `${110 * REVEAL_ORDER[idx]}ms` } as CSSProperties}
              >
                <button
                  type="button"
                  className="tp-photowall__print"
                  onClick={() => open(idx)}
                  aria-label={`Open photo ${idx + 1} of ${photos.length}${photo.caption ? `: ${photo.caption}` : ''}`}
                >
                  <Polaroid media={photo} order={idx} sizes={PHOTO_SIZES} />
                </button>
              </li>
            ))}
          </ul>

          <div className="tp-facade__ground">
            <span aria-hidden="true" className="tp-facade__door" />
            <span aria-hidden="true" className="tp-lamp">
              <span className="tp-lamp__light" />
            </span>
            {ctaLabel && (
              <Link to={ctaHref || '/happy-families'} className="btn btn-primary tp-facade__cta">
                {ctaLabel}
              </Link>
            )}
            <PupStop pose="sit" facing="right" className="tp-dusk__teddy" />
          </div>
        </RevealScope>
        <div aria-hidden="true" className="tp-street__pavement" />
      </div>
      {viewer}
    </SceneSection>
  );
}
