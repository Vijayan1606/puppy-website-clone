import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { HeartOutlineIcon } from '../components/icons';
import { MediaImage } from '../components/MediaImage';
import { RevealScope } from '../components/RevealScope';
import { PupStop } from '../components/TeddyBuddy';
import { GONE_HOME_PUPPIES } from '../data/puppies';

const TICKET_TILTS = [-1.4, 1.1, -0.8, 1.5, -1.1, 0.9];

export function GoneHomePage() {
  return (
    <div data-page="gone" className="tp-page">
      <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
        <header className="tp-boothhead">
          <div className="max-w-3xl">
            <h1 className="font-plush text-giant">
              Gone home
              <HeartOutlineIcon className="ml-3 inline-block w-[0.45em] -translate-y-[0.15em] text-toffee" />
            </h1>
            <p className="text-lede mt-6 text-cocoa-soft">
              Every puppy here has already joined a loving family. Looking for one just like them?
              Tell us — we&apos;ll help you find your match.
            </p>
            <Link to="/puppies" className="btn btn-primary mt-8">
              See available puppies
            </Link>
          </div>
          <div aria-hidden="true" className="tp-booth">
            <PupStop pose="sit" facing="right" act="wave" className="tp-booth__teddy" />
          </div>
        </header>

        <RevealScope>
          <ul className="tp-tickets" aria-label="Puppies who have gone home">
            {GONE_HOME_PUPPIES.map((pup, idx) => (
              <li
                key={pup.id}
                className="tp-ticket"
                data-reveal="true"
                style={
                  {
                    '--tilt': `${TICKET_TILTS[idx % TICKET_TILTS.length]}deg`,
                    '--i': idx % 6,
                  } as CSSProperties
                }
              >
                <Link to={`/puppies/${pup.slug}`} className="tp-ticket__link">
                  <span className="tp-ticket__main">
                    <span className="tp-ticket__photo">
                      {pup.cover && (
                        <MediaImage media={pup.cover} sizes="7rem" preload={idx < 4} />
                      )}
                    </span>
                    <span className="tp-ticket__body">
                      <span className="font-scrawl tp-ticket__kicker">
                        {pup.name ? pup.breed : 'Teddy Pup'}
                      </span>
                      <span className="font-plush tp-ticket__name">{pup.displayName}</span>
                      <span className="tp-ticket__meta">
                        {pup.genderLabel}
                        {pup.age ? ` · ${pup.age}` : ''}
                      </span>
                      <span className="tp-ticket__route">
                        <span>
                          {pup.origin.slug === 'imported' ? 'Seoul → Dubai' : 'Dubai showroom'}
                        </span>
                        <svg viewBox="0 0 60 12" aria-hidden="true">
                          <path d="M2 6h46" />
                          <path d="M44 2l6 4-6 4" />
                        </svg>
                        <span>home ♥</span>
                      </span>
                    </span>
                  </span>
                  <span aria-hidden="true" className="tp-ticket__stub">
                    <span className="font-plush">admit one</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </RevealScope>
      </div>
    </div>
  );
}
