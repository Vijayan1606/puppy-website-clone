import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE } from '../data/site';
import { PawIcon } from './icons';
import { prefersReducedMotion } from './RevealScope';

const NAV_ITEMS = [
  { href: '/puppies', label: 'Puppies' },
  { href: '/happy-families', label: 'Happy families' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Visit & contact' },
];

function NavLink({
  href,
  label,
  className,
  onNavigate,
}: {
  href: string;
  label: string;
  className: string;
  onNavigate?: () => void;
}) {
  const { pathname } = useLocation();
  const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      to={href}
      aria-current={active ? 'page' : undefined}
      data-active={active}
      className={className}
      onClick={onNavigate}
    >
      <span>{label}</span>
      <PawIcon className="tp-nav-link__paw" />
    </Link>
  );
}

export function Header() {
  const { pathname } = useLocation();
  const headerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const isHome = pathname === '/';

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let lastY = scrollY;
    let queued = false;

    const update = () => {
      const y = scrollY;
      el.dataset.scrolled = y > 8 ? 'true' : 'false';
      if (Math.abs(y - lastY) > 6) {
        el.dataset.hidden = y > lastY && y > 220 ? 'true' : 'false';
        lastY = y;
      }
      queued = false;
    };

    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    const onFocusIn = () => {
      el.dataset.hidden = 'false';
    };

    update();
    addEventListener('scroll', onScroll, { passive: true });
    el.addEventListener('focusin', onFocusIn);
    return () => {
      removeEventListener('scroll', onScroll);
      el.removeEventListener('focusin', onFocusIn);
    };
  }, []);

  const closeMenu = () => {
    const dlg = dialogRef.current;
    if (!dlg?.open || dlg.dataset.closing) return;
    if (prefersReducedMotion()) {
      dlg.close();
      return;
    }
    dlg.dataset.closing = 'true';
    const done = () => {
      clearTimeout(timer);
      dlg.removeEventListener('animationend', onEnd);
      if (dlg.dataset.closing) dlg.close();
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.target === dlg) done();
    };
    const timer = setTimeout(done, 600);
    dlg.addEventListener('animationend', onEnd);
  };

  useEffect(() => {
    const onNav = () => {
      const dlg = dialogRef.current;
      if (dlg?.open) dlg.close();
    };
    addEventListener('tp:navigate', onNav);
    return () => removeEventListener('tp:navigate', onNav);
  }, []);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (dlg?.open) dlg.close();
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      id="site-header"
      data-scrolled="false"
      data-hidden="false"
      data-home={isHome || undefined}
      className="tp-header fixed inset-x-0 top-0 z-50"
    >
      <div className="tp-header__bar gutter">
        <Link className="tp-header__brand" aria-label="TeddyPups U.A.E. — home" to="/">
          <img
            alt=""
            width={56}
            height={56}
            decoding="async"
            className="tp-header__logo"
            src="/brand/logo.png"
          />
          <span className="font-plush tp-header__name">TeddyPups</span>
        </Link>

        <nav aria-label="Main" className="tp-header__nav">
          <ul>
            <li>
              <NavLink href="/" label="Home" className="tp-nav-link" />
            </li>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} label={item.label} className="tp-nav-link" />
              </li>
            ))}
          </ul>
        </nav>

        <div className="tp-header__end">
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp tp-header__wa"
          >
            WhatsApp us
          </a>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-cocoa bg-milk px-4 text-[0.95rem] font-semibold lg:hidden"
            aria-haspopup="dialog"
            onClick={() => {
              const dlg = dialogRef.current;
              if (!dlg) return;
              delete dlg.dataset.closing;
              dlg.showModal();
            }}
          >
            <PawIcon className="size-4" />
            Menu
          </button>

          <dialog
            ref={dialogRef}
            aria-label="Site menu"
            className="tp-menu m-0 h-dvh max-h-none w-screen max-w-none bg-honey p-0 text-cocoa backdrop:bg-cocoa/40"
            onClose={() => {
              if (dialogRef.current) delete dialogRef.current.dataset.closing;
            }}
            onClick={(e) => {
              if (e.target === dialogRef.current) closeMenu();
            }}
          >
            <div className="flex h-full flex-col gutter pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-5">
              <div className="flex items-center justify-between">
                <span className="font-scrawl text-lg">where to, friend?</span>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="h-11 rounded-full bg-cocoa px-5 font-semibold text-milk"
                >
                  Close
                </button>
              </div>
              <nav aria-label="Mobile" className="mt-10 flex-1">
                <ul className="space-y-1">
                  <li>
                    <NavLink
                      href="/"
                      label="Home"
                      onNavigate={closeMenu}
                      className="tp-menu-link font-plush block py-2 text-[clamp(2.4rem,11vw,3.4rem)]"
                    />
                  </li>
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href}>
                      <NavLink
                        href={item.href}
                        label={item.label}
                        onNavigate={closeMenu}
                        className="tp-menu-link font-plush block py-2 text-[clamp(2.4rem,11vw,3.4rem)]"
                      />
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="space-y-3">
                <a
                  href={SITE.whatsappHref}
                  className="btn btn-whatsapp w-full"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp us
                </a>
                <p className="text-center text-sm font-medium">{SITE.phoneDisplay}</p>
              </div>
            </div>
          </dialog>
        </div>
      </div>
      <svg aria-hidden="true" className="tp-header__hem" width="100%" height="14" preserveAspectRatio="none">
        <defs>
          <pattern id="tp-hem" width="44" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 0H44V2A22 11 0 0 1 0 2Z" className="tp-header__hem-fill" />
            <path d="M0 2A22 11 0 0 0 44 2" className="tp-header__hem-line" />
          </pattern>
        </defs>
        <rect width="100%" height="14" fill="url(#tp-hem)" />
      </svg>
    </header>
  );
}
