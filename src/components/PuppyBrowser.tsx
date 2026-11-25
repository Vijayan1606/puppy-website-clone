import { AnimatePresence, motion } from 'motion/react';
import { type ReactNode, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { type BreedFilterOption, type Puppy } from '../data/puppies';
import { PupSketchCard } from './PupSketchCard';
import { RevealScope } from './RevealScope';
import { PupBuddy } from './TeddyBuddy';

const CARD_SIZES = '(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw';
const FILTER_KEYS = ['origin', 'breed', 'gender', 'collection'] as const;

function StickerChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="tp-sticker-chip"
    >
      {children}
    </button>
  );
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-scrawl mr-1 w-full shrink-0 text-cocoa-soft sm:w-28">{label}</span>
      {children}
    </div>
  );
}

export function PuppyBrowser({
  puppies,
  breeds,
  whatsappHref,
}: {
  puppies: Puppy[];
  breeds: BreedFilterOption[];
  whatsappHref: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();

  const filters = {
    origin: searchParams.get('origin') ?? '',
    breed: searchParams.get('breed') ?? '',
    gender: searchParams.get('gender') ?? '',
    collection: searchParams.get('collection') ?? '',
  };

  const toggleFilter = (key: (typeof FILTER_KEYS)[number], value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value && filters[key] !== value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
    if (typeof window !== 'undefined' && window.location.search) {
      window.history.replaceState(null, '', pathname);
    }
  };

  const filtered = useMemo(
    () =>
      puppies.filter(
        (p) =>
          (!filters.origin || p.origin?.slug === filters.origin) &&
          (!filters.breed || p.breeds.some((b) => b.slug === filters.breed)) &&
          (!filters.gender || p.gender === filters.gender || p.gender === 'male-female') &&
          (!filters.collection || p.collections.some((c) => c.slug === filters.collection)),
      ),
    [puppies, filters.origin, filters.breed, filters.gender, filters.collection],
  );

  const hasFilters = FILTER_KEYS.some((k) => Boolean(filters[k]));
  const availableBreeds = useMemo(
    () => breeds.filter((b) => puppies.some((p) => p.breeds.some((pb) => pb.slug === b.slug))),
    [breeds, puppies],
  );
  const hasKoreanTeacup = useMemo(
    () => puppies.some((p) => p.collections.some((c) => c.slug === 'korean-teacup')),
    [puppies],
  );
  const hasLocal = useMemo(
    () => puppies.some((p) => p.origin?.slug === 'local'),
    [puppies],
  );

  return (
    <div>
      <div role="group" aria-label="Filter puppies" className="tp-sketchpad flex flex-col gap-4">
        <FilterRow label="where">
          <StickerChip active={!filters.origin && !filters.collection} onClick={clearFilters}>
            Everywhere
          </StickerChip>
          {hasLocal && (
            <StickerChip
              active={filters.origin === 'local'}
              onClick={() => toggleFilter('origin', 'local')}
            >
              In Dubai
            </StickerChip>
          )}
          <StickerChip
            active={filters.origin === 'imported'}
            onClick={() => toggleFilter('origin', 'imported')}
          >
            Imported
          </StickerChip>
          {hasKoreanTeacup && (
            <StickerChip
              active={filters.collection === 'korean-teacup'}
              onClick={() => toggleFilter('collection', 'korean-teacup')}
            >
              Korean Teacup
            </StickerChip>
          )}
        </FilterRow>

        <FilterRow label="breed">
          {availableBreeds.map((b) => (
            <StickerChip
              key={b.slug}
              active={filters.breed === b.slug}
              onClick={() => toggleFilter('breed', b.slug)}
            >
              {b.name}
            </StickerChip>
          ))}
        </FilterRow>

        <FilterRow label="boy or girl">
          <StickerChip
            active={filters.gender === 'male'}
            onClick={() => toggleFilter('gender', 'male')}
          >
            Boys
          </StickerChip>
          <StickerChip
            active={filters.gender === 'female'}
            onClick={() => toggleFilter('gender', 'female')}
          >
            Girls
          </StickerChip>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="link-ink ml-auto text-[0.95rem] font-semibold"
            >
              Clear filters
            </button>
          )}
        </FilterRow>
      </div>

      <p className="font-scrawl mt-10 text-lg text-[var(--ink-soft)]" aria-live="polite">
        {filtered.length === 1 ? '1 puppy' : `${filtered.length} puppies`}{' '}
        {hasFilters ? 'match' : 'looking for a home'}
      </p>

      {filtered.length ? (
        <RevealScope>
          <motion.ul layout className="tp-sketches mt-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((pup, index) => (
                <motion.li
                  key={pup.id}
                  layout
                  initial={{ opacity: 0, scale: 0.86 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.86, transition: { duration: 0.2 } }}
                  transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                >
                  <PupSketchCard pup={pup} index={index} sizes={CARD_SIZES} preload={index < 3} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        </RevealScope>
      ) : (
        <div className="tp-sketchpad mt-10 grid items-center gap-6 md:grid-cols-[auto_1fr] md:gap-10">
          <PupBuddy
            pose="sit"
            act="tilt"
            className="mx-auto w-44 md:w-52"
            label="Teddy, tilting his head"
          />
          <div>
            <p className="font-plush text-big">No puppies match just now.</p>
            <p className="mt-3 max-w-[48ch] text-cocoa-soft">
              Tell us what you&apos;re hoping for and we&apos;ll let you know what&apos;s in our
              showroom or what we can bring in for you.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                Ask on WhatsApp
              </a>
              <button type="button" onClick={clearFilters} className="btn btn-ghost">
                Show all puppies
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
