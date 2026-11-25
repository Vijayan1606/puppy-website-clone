import { type CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EnquiryForm } from '../components/EnquiryForm';
import { CheckIcon, PawIcon } from '../components/icons';
import { MediaImage } from '../components/MediaImage';
import { PuppyGallery } from '../components/PuppyGallery';
import { StoryRibbon } from '../components/StoryRibbon';
import { PupBuddy } from '../components/TeddyBuddy';
import { ALL_PUPPIES, AVAILABLE_PUPPIES, type Puppy } from '../data/puppies';
import { SITE } from '../data/site';
import { NotFoundPage } from './NotFoundPage';

const STATUS_BADGE: Record<string, { label: string; isGone?: boolean }> = {
  available: { label: 'Available' },
  reserved: { label: 'Reserved' },
  rehomed: { label: 'Gone home ♥', isGone: true },
};

const IMPORTED_STEPS = [
  {
    title: 'Reserve your puppy',
    text: 'Tell us which puppy has captured your heart.',
  },
  {
    title: 'Personalized consultation',
    text: "We finalize details with you and share updates on your puppy's journey.",
  },
  {
    title: 'Import and arrival',
    text: 'We manage health checks, travel arrangements, and documentation.',
  },
  {
    title: 'Welcome home',
    text: 'We help your new puppy settle in and ensure a smooth transition into your home.',
  },
];

const LOCAL_STEPS = [
  {
    title: 'Explore our puppies',
    text: 'Browse our website to view available photos, breed details, age, and health information.',
  },
  {
    title: 'Choose your puppy',
    text: 'Reach out directly to learn more or schedule a private viewing in Downtown Dubai.',
  },
  {
    title: 'Meet before you choose',
    text: 'Spend time bonding before making your decision.',
  },
  {
    title: 'Pick-up or delivery',
    text: 'Take your puppy home the same day or arrange safe delivery across the UAE.',
  },
];

const INCLUDED_CHECKLIST = [
  'Vaccinated',
  'Dewormed',
  'Verified health certificate from licensed vets',
  'Thoroughly checked before joining your family',
];

function MorePuppyLink({ pup, label }: { pup: Puppy; label: string }) {
  return (
    <Link
      to={`/puppies/${pup.slug}`}
      className="group flex items-center gap-5 rounded-[2rem] border-[3px] border-cocoa bg-milk p-4 transition-transform duration-500 hover:-rotate-1 sm:last:flex-row-reverse sm:last:text-right"
    >
      <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[999px_999px_0.6rem_0.6rem] border-[3px] border-cocoa bg-honey-soft">
        {pup.cover && <MediaImage media={pup.cover} sizes="80px" />}
      </span>
      <span>
        <span className="font-scrawl block text-sm text-cocoa-soft">{label}</span>
        <span className="font-plush text-[1.6rem]">{pup.displayName}</span>
      </span>
    </Link>
  );
}

export function PuppyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const pup = ALL_PUPPIES.find((p) => p.slug === slug);

  if (!pup) {
    return <NotFoundPage />;
  }

  const isRehomed = pup.status === 'rehomed';
  const badge = STATUS_BADGE[pup.status] ?? STATUS_BADGE.available;
  const coverColor = pup.cover?.color || '#f2be6b';
  const galleryMedia = pup.media.length ? pup.media : pup.cover ? [pup.cover] : [];
  const enquiryId = `enquire-${pup.slug}`;
  const enquiryTitleId = `enquire-title-${pup.slug}`;
  const stepsId = `home-steps-${pup.slug}`;
  const steps = pup.origin.slug === 'local' ? LOCAL_STEPS : IMPORTED_STEPS;
  const prevPup = pup.prevSlug ? ALL_PUPPIES.find((p) => p.slug === pup.prevSlug) : undefined;
  const nextPup = pup.nextSlug ? ALL_PUPPIES.find((p) => p.slug === pup.nextSlug) : undefined;
  const allOptions = AVAILABLE_PUPPIES.map((p) => ({
    id: p.id,
    label: `${p.displayName}${p.name ? ` (${p.breed}, ${p.genderLabel.toLowerCase()})` : ''}`,
  }));

  return (
    <article
      className="relative"
      style={
        {
          background: `linear-gradient(180deg, color-mix(in oklab, ${coverColor} 24%, var(--color-milk)) 0, var(--color-milk) 85%)`,
        } as CSSProperties
      }
    >
      <StoryRibbon />

      <div className="gutter mx-auto max-w-[110rem] pb-20 pt-8 md:pt-12">
        <nav aria-label="Breadcrumb" className="text-[0.95rem] font-semibold text-cocoa-soft">
          <Link to={isRehomed ? '/gone-home' : '/puppies'} className="link-ink">
            {isRehomed ? 'Gone home' : 'Available puppies'}
          </Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">{pup.displayName}</span>
        </nav>

        <p className="tp-chapter">
          <span aria-hidden="true" className="tp-chapter__n font-plush">
            1
          </span>
          <span className="font-scrawl">
            {isRehomed ? 'the day they went home' : `meet ${pup.displayName}`}
          </span>
        </p>

        <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="min-w-0 lg:col-span-7">
            <PuppyGallery media={galleryMedia} name={pup.displayName} />
          </div>

          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+5.5rem)]">
              <div
                className="tp-tag tp-board mt-16 !rounded-[2.2rem_2.2rem_2.2rem_0.6rem] !p-7 md:!p-9 lg:mt-20"
                data-reveal="true"
              >
                <span aria-hidden="true" className="tp-tag__ring" />
                <PupBuddy
                  pose="peek"
                  facing="right"
                  className="absolute -top-[4.8rem] right-6 w-[9.5rem]"
                />

                {badge.isGone ? (
                  <span className="inline-grid -rotate-6 place-items-center rounded-full border-[3px] border-current px-3 py-1 font-scrawl text-sm uppercase tracking-wide text-toffee-deep">
                    {badge.label}
                  </span>
                ) : (
                  <span className="chip">
                    <PawIcon className="size-4 text-toffee" />
                    {badge.label}
                  </span>
                )}

                <h1 className="font-plush mt-4 text-[clamp(2.6rem,5vw,4.6rem)]">
                  {pup.displayName}
                </h1>
                {pup.name && (
                  <p className="mt-2 text-lg font-semibold text-cocoa-soft">{pup.breed}</p>
                )}

                <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <dt className="font-scrawl text-sm text-cocoa-soft">Breed</dt>
                    <dd className="mt-0.5 text-[1.05rem] font-semibold">{pup.breed}</dd>
                  </div>
                  <div>
                    <dt className="font-scrawl text-sm text-cocoa-soft">Boy or girl</dt>
                    <dd className="mt-0.5 text-[1.05rem] font-semibold">{pup.genderLabel}</dd>
                  </div>
                  {pup.age && (
                    <div>
                      <dt className="font-scrawl text-sm text-cocoa-soft">Age</dt>
                      <dd className="mt-0.5 text-[1.05rem] font-semibold">{pup.age}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="font-scrawl text-sm text-cocoa-soft">Where</dt>
                    <dd className="mt-0.5 text-[1.05rem] font-semibold">
                      {pup.whereLabel ??
                        (pup.origin.slug === 'local' ? 'In Dubai' : 'Imported for you')}
                    </dd>
                  </div>
                </dl>

                {pup.description && (
                  <p className="mt-6 text-[var(--ink-soft)]">{pup.description}</p>
                )}

                <div className="mt-8 flex flex-col gap-3">
                  <a
                    href={SITE.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp"
                  >
                    {isRehomed ? 'Ask about a puppy like this' : `Enquire about ${pup.displayName}`}
                  </a>
                  <a href={`#${enquiryId}`} className="btn btn-ghost">
                    Send an enquiry
                  </a>
                </div>
              </div>

              <div className="tp-paper mt-8 -rotate-1">
                <p className="tp-chapter">
                  <span aria-hidden="true" className="tp-chapter__n font-plush">
                    2
                  </span>
                  <span className="font-scrawl">what comes with {pup.displayName}</span>
                </p>
                <h2 className="font-plush mt-1 text-[1.9rem]">Every Teddy Pup comes</h2>
                <ul className="mt-4 space-y-2.5">
                  {INCLUDED_CHECKLIST.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-semibold">
                      <CheckIcon className="mt-0.5 size-6 shrink-0 text-toffee-deep" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {!isRehomed && (
          <section aria-labelledby={stepsId} className="mt-20">
            <p className="tp-chapter">
              <span aria-hidden="true" className="tp-chapter__n font-plush">
                3
              </span>
              <span className="font-scrawl">the way home</span>
            </p>
            <h2 id={stepsId} className="font-plush text-big mt-3">
              {pup.origin.slug === 'local'
                ? 'Coming home from our showroom'
                : 'Coming home from abroad'}
            </h2>
            <ol className="tp-trail tp-trail--row tp-trail--paws mt-10">
              {steps.map((step, idx) => (
                <li key={step.title}>
                  <span aria-hidden="true" className="tp-trail__num font-plush">
                    {idx + 1}
                  </span>
                  <h3 className="font-plush-text text-xl font-bold leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[38ch] text-cocoa-soft">{step.text}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section
          id={enquiryId}
          aria-labelledby={enquiryTitleId}
          className="tp-letter mt-20 grid gap-10 lg:grid-cols-12"
        >
          <span aria-hidden="true" className="tp-letter__stamp">
            <PawIcon className="size-9" />
          </span>
          <div className="lg:col-span-4">
            <p className="tp-chapter">
              <span aria-hidden="true" className="tp-chapter__n font-plush">
                {isRehomed ? 3 : 4}
              </span>
              <span className="font-scrawl">dear TeddyPups…</span>
            </p>
            <h2 id={enquiryTitleId} className="font-plush text-big mt-2">
              {isRehomed ? 'Looking for a puppy like this?' : `Ask about ${pup.displayName}`}
            </h2>
            <p className="mt-4 text-cocoa-soft">
              Leave your details and our team will get back to you promptly — or message us on
              WhatsApp for the quickest reply.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <EnquiryForm
              puppy={{ id: pup.id, label: pup.displayName }}
              puppies={allOptions}
            />
          </div>
        </section>

        {(prevPup || nextPup) && (
          <nav aria-label="More puppies" className="mt-16 grid gap-4 sm:grid-cols-2">
            {prevPup && <MorePuppyLink pup={prevPup} label="Previous pup" />}
            {nextPup && <MorePuppyLink pup={nextPup} label="Next pup" />}
          </nav>
        )}
      </div>
    </article>
  );
}
