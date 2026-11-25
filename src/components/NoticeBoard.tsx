import { type CSSProperties, Fragment, useId, useMemo, useState } from 'react';
import { type FaqItem } from '../data/site';
import { RevealScope } from './RevealScope';
import { PupBuddy } from './TeddyBuddy';

const TILTS = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.7, -1.9, 1.4];
const PINS = ['var(--color-toffee)', 'var(--color-sky-deep)', '#d9a13c', '#c45a6a'];

function Highlight({ text, query }: { text: string; query: string }) {
  const clean = query.trim();
  if (!clean) return <>{text}</>;
  const regex = new RegExp(`(${clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, idx) =>
        idx % 2 ? <mark key={idx}>{part}</mark> : <Fragment key={idx}>{part}</Fragment>,
      )}
    </>
  );
}

export function NoticeBoard({ faqs, askHref }: { faqs: FaqItem[]; askHref: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const inputId = useId();

  const norm = query.trim().toLowerCase();
  const filtered = useMemo(
    () => (norm ? faqs.filter((f) => `${f.question} ${f.answer}`.toLowerCase().includes(norm)) : faqs),
    [faqs, norm],
  );

  return (
    <div className="tp-notes" data-open={openId || norm ? '' : undefined}>
      <aside className="tp-notes__side" aria-label="Find a question">
        <label htmlFor={inputId} className="font-scrawl tp-notes__label">
          sniff out a question
        </label>
        <div className="tp-notes__search">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="tp-notes__lens">
            <circle cx={10.5} cy={10.5} r={6.5} />
            <path d="m15.5 15.5 5 5" />
          </svg>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="delivery, Korea, vaccinated…"
            autoComplete="off"
          />
        </div>
        <p className="tp-notes__count" aria-live="polite">
          {query.trim()
            ? `${filtered.length} ${filtered.length === 1 ? 'note' : 'notes'} found`
            : `${faqs.length} notes on the board`}
        </p>
        <div className="tp-notes__teddy">
          <span aria-hidden="true" className="tp-notes__bubble font-plush">
            <span className="tp-notes__q">?</span>
            <span className="tp-notes__a">!</span>
          </span>
          <PupBuddy pose="sit" act="tilt" label="Teddy, reading the notes" />
        </div>
        <a href={askHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp tp-notes__ask">
          Ask your own question
        </a>
      </aside>

      <RevealScope className="tp-notes__board">
        <ul className="tp-notes__list">
          {filtered.map((faq, idx) => {
            const unfolded = openId === faq.id || (Boolean(norm) && faq.answer.toLowerCase().includes(norm));
            return (
              <li
                key={faq.id}
                className="tp-note"
                data-reveal="true"
                data-unfolded={unfolded || undefined}
                style={{
                  '--tilt': `${TILTS[idx % TILTS.length]}deg`,
                  '--pin': PINS[idx % PINS.length],
                  '--i': idx,
                } as CSSProperties}
              >
                <span aria-hidden="true" className="tp-note__pin" />
                <h2 className="tp-note__q">
                  <button
                    type="button"
                    id={`q-${faq.id}`}
                    aria-expanded={unfolded}
                    aria-controls={`a-${faq.id}`}
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  >
                    <span className="font-plush-text">
                      <Highlight text={faq.question} query={query} />
                    </span>
                    <span aria-hidden="true" className="tp-note__chevron" />
                  </button>
                </h2>
                <div
                  id={`a-${faq.id}`}
                  role="region"
                  aria-labelledby={`q-${faq.id}`}
                  className="tp-note__answer"
                  inert={!unfolded || undefined}
                >
                  <div className="tp-note__flap">
                    <p>
                      <Highlight text={faq.answer} query={query} />
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {!filtered.length && (
          <div className="tp-note tp-note--empty">
            <span aria-hidden="true" className="tp-note__pin" />
            <p className="font-plush-text text-[1.2rem] font-bold">No note about “{query.trim()}” yet.</p>
            <p className="mt-2">
              <a href={askHref} target="_blank" rel="noopener noreferrer" className="link-ink">
                Ask us on WhatsApp
              </a>{' '}
              and we&apos;ll answer.
            </p>
          </div>
        )}
      </RevealScope>
    </div>
  );
}
