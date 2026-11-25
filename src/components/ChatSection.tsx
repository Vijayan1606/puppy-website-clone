import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { type ChatStepItem, type MediaItem } from '../data/site';
import { PAW_PATH } from './icons';
import { MediaImage } from './MediaImage';
import { useMediaQuery, useReducedMotion } from './RevealScope';
import { SceneSection, type SkyTone } from './SceneSection';
import { cuePup, PupStop } from './TeddyBuddy';

function ChatVideoClip({ media }: { media: MediaItem }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="tp-msg tp-msg--them tp-msg--media">
      <div className="tp-clip">
        <video
          ref={videoRef}
          src={media.url}
          poster={media.poster?.url}
          muted
          loop
          playsInline
          preload="none"
          aria-label={media.alt || 'A puppy video'}
          onEnded={() => setPlaying(false)}
        />
        <button
          type="button"
          className="tp-clip__play"
          onClick={() => {
            const v = videoRef.current;
            if (!v) return;
            if (v.paused) {
              v.play().then(() => setPlaying(true)).catch(() => {});
            } else {
              v.pause();
              setPlaying(false);
            }
          }}
          aria-pressed={playing}
          aria-label={playing ? 'Pause video' : 'Play video'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {playing ? <path d="M7 5h3v14H7zM14 5h3v14h-3z" /> : <path d="M8 5v14l11-7z" />}
          </svg>
        </button>
      </div>
    </div>
  );
}

export function ChatSection({
  heading,
  body,
  ctaLabel,
  ctaHref,
  steps,
  media,
  tone,
  business,
  greeting,
  whatsappHref,
  breeds,
}: {
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  steps: ChatStepItem[];
  media: MediaItem[];
  tone: SkyTone;
  business: string;
  greeting: string;
  whatsappHref: string;
  breeds: Array<{ slug: string; name: string }>;
}) {
  const photos = media.filter((m) => m.kind === 'image').slice(0, 4);
  const video = media.find((m) => m.kind === 'video') ?? null;
  const desktop = useMediaQuery('(min-width: 1024px)');
  const reduced = useReducedMotion();
  const staticAll = reduced || !desktop;

  const [stepIdx, setStepIdx] = useState(-1);
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLOListElement | null>(null);
  const screenRef = useRef<HTMLDivElement | null>(null);
  const prevStepRef = useRef(-1);

  const activeIdx = staticAll ? steps.length - 1 : stepIdx;

  useEffect(() => {
    if (staticAll || !listRef.current) return;
    const children = [...listRef.current.children];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setStepIdx(children.indexOf(e.target));
        }
      },
      { rootMargin: '-28% 0px -62% 0px' },
    );
    children.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [staticAll, steps.length]);

  useEffect(() => {
    if (staticAll) return;
    const forward = stepIdx > prevStepRef.current;
    prevStepRef.current = stepIdx;
    if (!forward || stepIdx < 0) return;
    setTyping(true);
    const timer = setTimeout(() => {
      setTyping(false);
      const target = screenRef.current?.querySelector(`[data-step="${stepIdx}"]`);
      if (target) {
        cuePup({
          look: target,
          secs: 1.4,
          say: stepIdx === 1 ? 'ooh, photos!' : stepIdx === 2 ? 'home soon!' : undefined,
        });
      }
    }, 750);
    return () => clearTimeout(timer);
  }, [stepIdx, staticAll]);

  return (
    <SceneSection tone={tone} aria-labelledby="journey-title" className="tp-chat">
      <div className="tp-chat__grid gutter" data-pin-range="true">
        <div className="tp-chat__story">
          <h2 id="journey-title" className="font-plush text-huge">
            {heading}
          </h2>
          {body && <p className="text-lede mt-5 max-w-[42ch] text-[var(--ink-soft)]">{body}</p>}

          <ol ref={listRef} className="tp-chat__steps">
            {steps.map((s, idx) => (
              <li
                key={s.title}
                className="tp-chat__step"
                data-active={idx === activeIdx || undefined}
                data-done={idx < activeIdx || undefined}
              >
                <span className="tp-chat__num font-plush" aria-hidden="true">
                  {idx + 1}
                </span>
                <h3 className="font-plush tp-chat__title">{s.title}</h3>
                <p className="tp-chat__text">{s.text}</p>
              </li>
            ))}
          </ol>

          {ctaLabel && (
            <Link to={ctaHref || '/how-it-works'} className="btn btn-ghost tp-chat__cta">
              {ctaLabel}
            </Link>
          )}
        </div>

        <div className="tp-chat__side">
          <div className="tp-phone" aria-label={`A WhatsApp conversation with ${business}`} role="group">
            <div className="tp-phone__bar">
              <img
                src="/brand/logo.png"
                alt=""
                width={40}
                height={40}
                loading="lazy"
                className="tp-phone__avatar"
              />
              <span>
                <span className="tp-phone__name">{business}</span>
                <span className="tp-phone__status">{typing ? 'typing…' : 'online'}</span>
              </span>
            </div>

            <div ref={screenRef} className="tp-phone__screen">
              <p className="tp-msg tp-msg--me">{greeting}</p>
              {steps.map((s, idx) => (
                <div
                  key={s.title}
                  className="tp-msg-group"
                  data-step={idx}
                  data-show={idx < activeIdx || (idx === activeIdx && !typing) ? 'true' : 'false'}
                >
                  {idx === 0 && breeds.length > 0 && (
                    <div className="tp-msg tp-msg--them">
                      <p>{s.text}</p>
                      <ul className="tp-chips" aria-label="Breeds we have now">
                        {breeds.slice(0, 6).map((b) => (
                          <li key={b.slug}>
                            <Link to={`/puppies?breed=${b.slug}`}>{b.name}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {idx === 1 && (
                    <>
                      {photos.length > 0 && (
                        <div className="tp-msg tp-msg--them tp-msg--media">
                          <div className="tp-snaps">
                            {photos.map((m) => (
                              <span key={m.id} className="tp-snaps__one">
                                <MediaImage media={m} sizes="9rem" />
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {video && <ChatVideoClip media={video} />}
                      <p className="tp-msg tp-msg--them">{s.text}</p>
                    </>
                  )}
                  {idx === 2 && (
                    <div className="tp-msg tp-msg--them">
                      <p>{s.text}</p>
                      <svg viewBox="0 0 220 70" className="tp-route" aria-hidden="true">
                        <path d="M14 52 C 60 6, 120 70, 170 28" className="tp-route__line" />
                        <circle cx="14" cy="52" r="5" className="tp-route__dot" />
                        <path d="M164 32 l12 -12 l12 12 v14 h-24 z" className="tp-route__home" />
                        <path d="M176 42 c-2-3-7-2-6 2c1 3 6 5 6 5s5-2 6-5c1-4-4-5-6-2z" className="tp-route__heart" />
                        <path d={PAW_PATH} transform="translate(70 22) scale(.3) rotate(70 32 32)" className="tp-route__paw" />
                        <path d={PAW_PATH} transform="translate(104 38) scale(.3) rotate(100 32 32)" className="tp-route__paw" />
                      </svg>
                    </div>
                  )}
                  {idx > 2 && <p className="tp-msg tp-msg--them">{s.text}</p>}
                  {idx === 0 && breeds.length === 0 && <p className="tp-msg tp-msg--them">{s.text}</p>}
                </div>
              ))}
              <p className="tp-typing" data-show={typing ? 'true' : 'false'} aria-hidden="true">
                <span />
                <span />
                <span />
              </p>
            </div>

            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="tp-phone__compose">
              <span>Say hello on WhatsApp</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 20l18-8L3 4v6l12 2-12 2z" />
              </svg>
            </a>
          </div>
          <PupStop pose="sit" facing="right" className="tp-chat__teddy" />
        </div>
      </div>
    </SceneSection>
  );
}
