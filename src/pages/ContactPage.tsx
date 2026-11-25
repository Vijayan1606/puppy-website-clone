import { DubaiSkylineSvg, PawIcon } from '../components/icons';
import { LetterForm } from '../components/LetterForm';
import { MediaImage } from '../components/MediaImage';
import { SceneSection } from '../components/SceneSection';
import { PupBuddy } from '../components/TeddyBuddy';
import { AVAILABLE_PUPPIES } from '../data/puppies';
import { CHAT_SHOWCASE_MEDIA, SITE } from '../data/site';

export function ContactPage() {
  const puppyOptions = AVAILABLE_PUPPIES.map((p) => ({
    id: p.id,
    label: `${p.displayName}${p.name ? ` (${p.breed}, ${p.genderLabel.toLowerCase()})` : ` (${p.genderLabel.toLowerCase()})`}`,
  }));

  const visitPhoto = CHAT_SHOWCASE_MEDIA[3] ?? CHAT_SHOWCASE_MEDIA[0];

  return (
    <div data-page="contact" className="tp-page">
      <SceneSection
        tone={{ top: '#fff9ee', bottom: '#f9dca4' }}
        aria-labelledby="contact-title"
      >
        <div className="gutter mx-auto max-w-[110rem] pb-24 pt-10 md:pt-16">
          <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h1 id="contact-title" className="font-plush text-giant max-w-[12ch] lg:col-span-7">
              Get in touch with us
            </h1>
            <p className="text-lede text-[var(--ink-soft)] lg:col-span-5 lg:pb-3">
              Have questions about our puppies or adoption process? Fill out the form, and our team
              will get back to you promptly. Whether ready to adopt or just seeking info, we&apos;d
              love to hear from you!
            </p>
          </header>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
              <LetterForm puppies={puppyOptions} />
              <PupBuddy
                pose="sit"
                facing="left"
                className="ml-auto mr-6 -mt-3 w-36 md:w-40"
                label="Teddy, waiting for your letter"
              />
            </div>

            <div className="lg:col-span-5 lg:row-start-1">
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp w-full sm:w-auto"
              >
                WhatsApp {SITE.phoneDisplay}
              </a>

              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">call us</dt>
                  <dd className="mt-1 text-lg font-semibold">
                    <a className="link-ink" href={SITE.phoneHref}>
                      {SITE.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-scrawl text-[var(--ink-soft)]">email</dt>
                  <dd className="mt-1 break-all text-lg font-semibold">
                    <a className="link-ink" href={`mailto:${SITE.email}`}>
                      {SITE.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <section aria-labelledby="visit-title" className="tp-shopfront mt-12">
                <DubaiSkylineSvg className="absolute -bottom-1 right-0 w-3/4 text-toffee/30" />
                <div className="tp-visit relative p-7 pt-6">
                  <div>
                    <h2 id="visit-title" className="font-plush text-[2rem] leading-tight">
                      Visit us in Downtown Dubai
                    </h2>
                    <p className="mt-3 max-w-[38ch] text-cocoa-soft">
                      Step into our Downtown Dubai showroom and experience the joy of choosing your
                      puppy face-to-face.
                    </p>
                    <p className="mt-4 flex items-center gap-2 font-semibold">
                      <PawIcon className="size-5 shrink-0 text-toffee-deep" />
                      {SITE.address}
                    </p>
                    <a
                      href={SITE.socialHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost mt-6 !bg-milk"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                  <figure className="tp-visit__photo">
                    <MediaImage
                      media={visitPhoto}
                      sizes="(min-width: 640px) 11rem, 90vw"
                    />
                  </figure>
                </div>
              </section>
            </div>
          </div>
        </div>
      </SceneSection>
    </div>
  );
}
