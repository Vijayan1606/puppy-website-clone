import { Link } from 'react-router-dom';
import { PuppyBrowser } from '../components/PuppyBrowser';
import { PupSketchCard } from '../components/PupSketchCard';
import { RevealScope } from '../components/RevealScope';
import { PupBuddy } from '../components/TeddyBuddy';
import { AVAILABLE_PUPPIES, BREEDS, GONE_HOME_PUPPIES } from '../data/puppies';
import { SITE } from '../data/site';

export function PuppiesPage() {
  const gonePreview = GONE_HOME_PUPPIES.slice(0, 5);

  return (
    <div data-page="puppies" className="tp-page">
      <section aria-labelledby="pups-title" className="tp-sketchbook">
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <div className="tp-sketchbook__head">
            <div className="tp-sketchbook__words">
              <p className="font-scrawl text-lg text-toffee-ink" data-reveal="true">
                from Teddy&apos;s sketchbook
              </p>
              <h1
                id="pups-title"
                className="font-plush text-giant tp-sketchbook__title"
                data-reveal="true"
              >
                Available puppies
                <svg
                  aria-hidden="true"
                  viewBox="0 0 400 24"
                  preserveAspectRatio="none"
                  className="tp-sketchbook__underline"
                >
                  <path
                    d="M4 15c40-9 70 5 112-2s70-9 112 0 74 8 116-1 38-4 52 1"
                    pathLength="1"
                  />
                </svg>
              </h1>
              <p
                className="tp-sketchbook__lede text-lede mt-6 max-w-[46ch] text-cocoa-soft"
                data-reveal="true"
              >
                Every listing shows real photos of the actual puppy. Open a profile to see them
                all, then ask us about them on WhatsApp.
              </p>
            </div>

            <div className="tp-sketchbook__self" data-reveal="true">
              <PupBuddy pose="sit" facing="left" />
              <span className="font-scrawl tp-sketchbook__caption">self-portrait</span>
            </div>
          </div>

          <div className="mt-12">
            <PuppyBrowser
              puppies={AVAILABLE_PUPPIES}
              breeds={BREEDS}
              whatsappHref={SITE.whatsappHref}
            />
          </div>
        </div>
      </section>

      {gonePreview.length > 0 && (
        <section aria-labelledby="gone-title" className="tp-gone-strip">
          <div className="gutter mx-auto flex max-w-[110rem] flex-col gap-10 md:flex-row md:items-center">
            <div className="md:w-1/3" data-reveal="true">
              <h2 id="gone-title" className="font-plush text-big">
                Already gone home
              </h2>
              <p className="mt-3 text-cocoa-soft">These puppies have found their families.</p>
              <Link to="/gone-home" className="btn btn-primary mt-6">
                See the puppies who&apos;ve gone home
              </Link>
            </div>

            <RevealScope>
              <ul className="tp-gone-strip__row" aria-label="Some puppies who have gone home">
                {gonePreview.map((pup, idx) => (
                  <li key={pup.id}>
                    <PupSketchCard
                      pup={pup}
                      index={idx}
                      sizes="8rem"
                      small
                    />
                  </li>
                ))}
              </ul>
            </RevealScope>
          </div>
        </section>
      )}
    </div>
  );
}
