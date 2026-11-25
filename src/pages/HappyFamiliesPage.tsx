import { HeartOutlineIcon } from '../components/icons';
import { usePhotoViewer } from '../components/PhotoViewer';
import { Polaroid } from '../components/Polaroid';
import { RevealScope } from '../components/RevealScope';
import { PupBuddy } from '../components/TeddyBuddy';
import { FAMILY_PHOTOS, FAMILY_TESTIMONIALS } from '../data/families';

const WALL_SIZES = '(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw';

export function HappyFamiliesPage() {
  const { open, viewer } = usePhotoViewer(FAMILY_PHOTOS, WALL_SIZES);
  const leadQuote = FAMILY_TESTIMONIALS[0];

  return (
    <div data-page="families" className="tp-page">
      <section aria-labelledby="families-title" className="tp-memories">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <div className="tp-memories__head">
            <div>
              <p className="font-scrawl text-lg text-toffee-ink" data-reveal="true">
                our wall of happy endings
              </p>
              <h1
                id="families-title"
                className="font-plush text-giant tp-memories__title"
                data-reveal="true"
              >
                Happy families
                <HeartOutlineIcon className="tp-memories__heart" />
              </h1>
              <p className="text-lede mt-6 max-w-[50ch] text-cocoa-soft" data-reveal="true">
                Nothing makes us happier than seeing our puppies in loving homes! Here are some
                beautiful moments shared by our amazing clients after welcoming their furry friends.
              </p>
              <p className="font-scrawl mt-5 text-lg text-toffee-ink" data-reveal="true">
                {FAMILY_PHOTOS.length} moments and counting
              </p>
            </div>

            {leadQuote && (
              <figure className="tp-memories__note" data-reveal="true">
                <span
                  aria-hidden="true"
                  className="tp-tape tp-tape--center"
                  style={{ '--tape': '#cfe5f6' } as React.CSSProperties}
                />
                <blockquote className="font-plush-text">“{leadQuote.quote}”</blockquote>
                <figcaption className="font-scrawl">
                  {leadQuote.author}, {leadQuote.location}
                </figcaption>
              </figure>
            )}
          </div>

          <RevealScope>
            <ul className="tp-wall mt-16">
              {FAMILY_PHOTOS.map((photo, idx) => (
                <li key={photo.id} className="tp-wall__item" data-reveal="true">
                  <button
                    type="button"
                    onClick={() => open(idx)}
                    aria-label={photo.alt || `Open family photo ${idx + 1} full screen`}
                    className="block w-full text-left"
                  >
                    <Polaroid
                      media={photo}
                      order={idx}
                      sizes={WALL_SIZES}
                      priority={idx < 4}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </RevealScope>

          {viewer}

          <div className="mt-20 flex flex-col items-center gap-3 text-center">
            <PupBuddy pose="sit" facing="left" className="w-40" />
            <p className="font-scrawl text-lg text-cocoa-soft">
              every one of them was a Teddy Pup once
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
