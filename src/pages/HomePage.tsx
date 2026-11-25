import { type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { ChatSection } from '../components/ChatSection';
import { DuskSection } from '../components/DuskSection';
import { FlightSvg } from '../components/FlightSvg';
import { HeroLineup } from '../components/HeroLineup';
import { DubaiSkylineSvg, StarIcon } from '../components/icons';
import { MediaImage } from '../components/MediaImage';
import { MeetSection } from '../components/MeetSection';
import { SceneSection } from '../components/SceneSection';
import { PupStop } from '../components/TeddyBuddy';
import { FAMILY_PHOTOS, FAMILY_TESTIMONIALS } from '../data/families';
import { ALL_PUPPIES, AVAILABLE_PUPPIES, BREEDS } from '../data/puppies';
import { CHAT_SHOWCASE_MEDIA, FAQS, HOME_CHAT_STEPS, SITE } from '../data/site';

const PASSPORT_STAMPS = [
  {
    shape: 'round',
    ink: '#a24a1a',
    tilt: '-8deg',
    title: 'Vet-checked & healthy',
    text: 'Every puppy comes vaccinated, dewormed, and with a verified health certificate.',
    icon: (
      <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">
        <path
          d="M32 54C16 43 8 34 8 24c0-7 5.4-12 12-12 5 0 9 3 12 7 3-4 7-7 12-7 6.6 0 12 5 12 12 0 10-8 19-24 30z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 30h7l3-7 4 13 3-6h7"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    shape: 'ticket',
    ink: '#1f6b45',
    tilt: '5deg',
    title: 'Korea to Dubai, safely',
    text: 'Trusted breeders, safe travel, and premium care from start to finish.',
    icon: (
      <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">
        <path
          d="M6 36l22-3 12-17h6l-6 17 12-1 6-7h3l-2 10 2 10h-3l-6-7-12-1 6 17h-6L28 37 6 36z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 50c10 4 20 4 30 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2 7"
        />
      </svg>
    ),
  },
  {
    shape: 'oval',
    ink: '#5a3a28',
    tilt: '-4deg',
    title: 'Support 24/7',
    text: 'Always here to help, from choosing your puppy to post-delivery support.',
    icon: (
      <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">
        <path
          d="M10 14h44v28H30l-12 10v-10h-8z"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 28h0M32 28h0M42 28h0"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    shape: 'scallop',
    ink: '#c2622b',
    tilt: '7deg',
    title: 'Trusted by families worldwide',
    text: 'Puppies delivered to loving homes all around the world.',
    icon: (
      <svg viewBox="0 0 64 64" className="tp-stamp__icon" aria-hidden="true">
        <circle
          cx="32"
          cy="32"
          r="22"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 32h44M32 10c-8 8-8 36 0 44M32 10c8 8 8 36 0 44"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const NIGHT_STARS = [
  { left: '8%', top: '12%', width: '16.2px', delay: '0.00s' },
  { left: '22%', top: '30%', width: '9px', delay: '0.40s' },
  { left: '41%', top: '8%', width: '12.6px', delay: '0.80s' },
  { left: '57%', top: '22%', width: '8.1px', delay: '1.20s' },
  { left: '72%', top: '6%', width: '14.4px', delay: '1.60s' },
  { left: '88%', top: '18%', width: '10.8px', delay: '2.00s' },
  { left: '95%', top: '42%', width: '9px', delay: '2.40s' },
  { left: '4%', top: '58%', width: '10.8px', delay: '2.80s' },
  { left: '34%', top: '70%', width: '7.2px', delay: '3.20s' },
  { left: '63%', top: '84%', width: '9.9px', delay: '3.60s' },
  { left: '83%', top: '66%', width: '12.6px', delay: '4.00s' },
];

export function HomePage() {
  const heroFriends = AVAILABLE_PUPPIES.slice(0, 7);
  const meetPuppies = AVAILABLE_PUPPIES;
  const importedPup =
    AVAILABLE_PUPPIES.find((p) => p.slug === 'korean-teacup-maltipoo-female') ??
    AVAILABLE_PUPPIES[1] ??
    AVAILABLE_PUPPIES[0];
  const showroomPhoto = CHAT_SHOWCASE_MEDIA[0];
  const doorPuppy = ALL_PUPPIES.find((p) => p.slug === 'maltipoo-max-male') ?? AVAILABLE_PUPPIES[0];
  const nightFaqs = FAQS.slice(0, 3);

  return (
    <div data-page="home" className="tp-page">
      <div data-section="hero">
        <SceneSection
          tone={{ top: '#fffdf8', bottom: '#fff1d8' }}
          style={{ '--quilt': '#fff1d8' } as CSSProperties}
          aria-labelledby="hero-title"
          className="tp-hero"
        >
          <span aria-hidden="true" className="tp-hero__sun" />

          <div className="tp-hero__copy gutter">
            <p className="tp-hero__note font-scrawl">
              {SITE.tagline}
              <svg
                viewBox="0 0 220 24"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 h-3 w-full text-toffee"
                aria-hidden="true"
              >
                <path
                  d="M4 14c18-10 30 8 48-1s28-9 46 0 30 8 48-1 30-9 48 0 18 2 22 0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </p>

            <h1 id="hero-title" className="tp-hero__title font-plush">
              <span className="tp-hero__line">Premium teacup</span>
              <span className="tp-hero__line tp-hero__line--2">puppies in Dubai</span>
            </h1>

            <p className="tp-hero__lede">
              Meet your new best friend in our Dubai showroom, or order a rare miniature breed from
              trusted breeders worldwide.
            </p>

            <div className="tp-hero__actions">
              <Link to="/puppies" className="btn btn-primary">
                View available puppies
              </Link>
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                Ask us on WhatsApp
              </a>
            </div>
          </div>

          <div className="tp-hero__stage">
            <HeroLineup friends={heroFriends} />
            <PupStop
              pose="peek"
              facing="right"
              act="peekaboo"
              behind
              lane
              className="tp-hero__teddy"
            />
            <div aria-hidden="true" className="tp-quilt">
              <svg className="tp-quilt__edge" width="100%" height="40" preserveAspectRatio="none">
                <defs>
                  <pattern id="tp-scallop" width="76" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0 40V27A38 25 0 0 1 76 27V40Z" style={{ fill: 'var(--quilt)' }} />
                    <path d="M0 27A38 25 0 0 1 76 27" fill="none" stroke="#2a170e" strokeWidth="3" />
                    <path
                      d="M11 33A27 19 0 0 1 65 33"
                      fill="none"
                      stroke="#2a170e"
                      strokeWidth="1.6"
                      strokeDasharray="3.5 5.5"
                      strokeLinecap="round"
                      opacity=".42"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="40" fill="url(#tp-scallop)" />
              </svg>
            </div>
          </div>
        </SceneSection>
      </div>

      <div data-section="meet">
        <MeetSection
          heading="Meet the pups"
          body="Real puppies, real photos, looking for their families right now."
          ctaLabel="See all available puppies"
          ctaHref="/puppies"
          puppies={meetPuppies}
          tone={{ top: '#fff1d8', bottom: '#fbe3b4' }}
        />
      </div>

      <SceneSection
        tone={{ top: '#fbe3b4', bottom: '#f7d18d' }}
        aria-labelledby="paths-title"
        className="tp-paths"
      >
        <div className="gutter mx-auto max-w-[110rem]">
          <h2 id="paths-title" className="tp-paths__title font-plush text-huge">
            Two ways to meet your puppy
          </h2>
          <div className="tp-fork">
            <div aria-hidden="true" className="tp-fork__post" />

            <article className="tp-way tp-way--left" aria-labelledby="way-local">
              <h3 id="way-local" className="tp-sign tp-sign--left font-plush">
                Puppies in Dubai
              </h3>
              <div className="tp-way__scene" data-pup-look="true">
                <DubaiSkylineSvg className="tp-way__skyline" />
                <figure className="tp-window">
                  <span className="tp-window__glass">
                    <MediaImage
                      media={showroomPhoto}
                      sizes="(min-width: 1024px) 16rem, 60vw"
                    />
                  </span>
                  <figcaption className="font-scrawl">In our showroom</figcaption>
                </figure>
              </div>
              <p className="tp-way__text">
                See them, love them, take them home. Come meet our locally available puppies before
                you decide.
              </p>
              <Link to="/puppies?origin=local" className="btn btn-primary">
                Meet local puppies
              </Link>
            </article>

            <article className="tp-way tp-way--right" aria-labelledby="way-imported">
              <h3 id="way-imported" className="tp-sign tp-sign--right font-plush">
                Imported for you
              </h3>
              <div className="tp-way__scene" data-pup-look="true">
                <FlightSvg
                  photo={importedPup?.cover?.url}
                  label={`A plane bringing a ${importedPup?.displayName ?? 'Korean Teacup Maltipoo'} puppy from Korea to Dubai`}
                />
              </div>
              <p className="tp-way__text">
                Choose your favourite breed, get real photos, and we&apos;ll handle everything from
                Korea to Dubai.
              </p>
              <Link to="/puppies?origin=imported" className="btn btn-primary">
                Order upon request
              </Link>
            </article>

            <PupStop pose="sit" className="tp-fork__teddy" />
          </div>
        </div>
      </SceneSection>

      <div data-section="chat">
        <ChatSection
          heading="Choose your breed. We'll do the rest."
          body="Our easy 3-step process ensures a stress-free adoption."
          ctaLabel="How it works"
          ctaHref="/how-it-works"
          steps={HOME_CHAT_STEPS}
          media={CHAT_SHOWCASE_MEDIA}
          business={SITE.name}
          greeting="Hi TeddyPups! I'd love to know more about your puppies."
          whatsappHref={SITE.whatsappHref}
          breeds={BREEDS.slice(0, 5)}
          tone={{ top: '#f7d18d', bottom: '#f0b866' }}
        />
      </div>

      <SceneSection
        tone={{ top: '#f0b866', bottom: '#a65a30', sunset: true }}
        aria-labelledby="trust-title"
        className="tp-passport"
      >
        <div className="gutter mx-auto max-w-[110rem]">
          <div className="tp-book">
            <div className="tp-book__page tp-book__page--left">
              <p className="font-scrawl tp-book__kicker">puppy passport</p>
              <h2 id="trust-title" className="font-plush text-huge tp-book__title">
                Why families trust TeddyPups
              </h2>
              <div className="tp-book__footer">
                <PupStop pose="sit" className="tp-book__teddy" />
              </div>
            </div>

            <ul className="tp-book__page tp-book__page--right">
              {PASSPORT_STAMPS.map((stamp, idx) => (
                <li
                  key={stamp.title}
                  className="tp-entry"
                  style={
                    {
                      '--ink-stamp': stamp.ink,
                      '--tilt': stamp.tilt,
                      '--i': idx,
                    } as CSSProperties
                  }
                >
                  <span className={`tp-stamp tp-stamp--${stamp.shape}`}>
                    {stamp.icon}
                    <span className="tp-stamp__title font-plush">{stamp.title}</span>
                  </span>
                  <p className="tp-entry__text">{stamp.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SceneSection>

      <DuskSection
        heading="Loved by families worldwide"
        body="See the happy homes our puppies have already joined across the UAE and beyond."
        ctaLabel="View happy families"
        ctaHref="/happy-families"
        photos={FAMILY_PHOTOS}
        testimonial={FAMILY_TESTIMONIALS[0]}
        tone={{ top: '#a65a30', bottom: '#4d2b19', dark: true }}
      />

      <SceneSection
        tone={{ top: '#4d2b19', bottom: '#2f1a10', dark: true }}
        aria-labelledby="questions-title"
        className="tp-night"
      >
        <div aria-hidden="true" className="pointer-events-none tp-night__stars">
          {NIGHT_STARS.map((s, idx) => (
            <StarIcon
              key={idx}
              className="tp-twinkle absolute text-honey"
              style={{ left: s.left, top: s.top, width: s.width, animationDelay: s.delay }}
            />
          ))}
        </div>

        <div className="tp-night__grid gutter">
          <div className="tp-night__intro">
            <h2 id="questions-title" className="font-plush text-huge">
              Questions, answered
            </h2>
            <Link to="/faq" className="btn btn-ghost tp-night__cta">
              Read all questions
            </Link>
            <div className="tp-night__pup">
              <span aria-hidden="true" className="tp-night__wonder font-plush">
                ?
              </span>
              <PupStop pose="sit" facing="right" act="tilt" className="tp-night__teddy" />
            </div>
          </div>

          <dl className="tp-night__list">
            {nightFaqs.map((faq, idx) => (
              <div
                key={faq.id}
                className="tp-qa"
                {...(idx < 2 ? { 'data-pup-look': '' } : {})}
              >
                <dt className="font-plush tp-qa__q">
                  <StarIcon className="tp-qa__star" />
                  {faq.question}
                </dt>
                <dd className="tp-qa__a">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </SceneSection>

      <SceneSection
        tone={{ top: '#2f1a10', bottom: '#24130b', dark: true }}
        aria-labelledby="cta-title"
        className="tp-home"
      >
        <div className="tp-home__copy gutter">
          <h2 id="cta-title" className="font-plush text-huge">
            Ready to meet your new best friend?
          </h2>
          <p className="tp-home__lede">
            Bring home a healthy, happy teacup or designer puppy with expert guidance every step of
            the way. We help you find the right match and ensure a smooth, safe delivery across the
            UAE.
          </p>
        </div>

        <div className="tp-house">
          <span aria-hidden="true" className="tp-house__plant tp-house__plant--left" />
          <span aria-hidden="true" className="tp-house__lamp" />
          <div className="tp-house__doorway">
            <span className="tp-house__inside">
              {doorPuppy?.cover && (
                <MediaImage
                  media={doorPuppy.cover}
                  alt={`${doorPuppy.displayName}, waiting inside`}
                  sizes="16rem"
                />
              )}
            </span>
            <span aria-hidden="true" className="tp-house__door">
              <span className="tp-house__peep" />
              <span className="tp-house__knob" />
            </span>
          </div>
          <span aria-hidden="true" className="tp-house__plant tp-house__plant--right" />
          <span aria-hidden="true" className="tp-house__mat font-scrawl">
            welcome home
          </span>
          <PupStop pose="bow" facing="right" className="tp-house__teddy" />
        </div>

        <div className="tp-home__actions gutter">
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
          >
            Enquire on WhatsApp
          </a>
          <Link to="/contact" className="btn btn-ghost tp-home__ghost">
            Visit &amp; contact
          </Link>
        </div>
      </SceneSection>
    </div>
  );
}
