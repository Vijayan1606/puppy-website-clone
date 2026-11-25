import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { PawTrailCanvas } from './components/PawTrailCanvas';
import { RouteCurtain } from './components/RouteCurtain';
import { SmoothScroll } from './components/SmoothScroll';
import { PupJourney } from './components/TeddyBuddy';
import { ALL_PUPPIES } from './data/puppies';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { GoneHomePage } from './pages/GoneHomePage';
import { HappyFamiliesPage } from './pages/HappyFamiliesPage';
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PuppiesPage } from './pages/PuppiesPage';
import { PuppyDetailPage } from './pages/PuppyDetailPage';

const ROUTE_META: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'TeddyPups U.A.E. | Premium teacup & teddy bear puppies in Dubai',
    description:
      'Teddy bear and teacup puppies in Dubai. Meet local puppies in our Downtown Dubai showroom or bring home a rare breed imported from trusted breeders.',
  },
  '/puppies': {
    title: 'Available puppies | TeddyPups U.A.E.',
    description:
      'Browse available teacup and teddy bear puppies in Dubai — real photos, health checked, vaccinated, and ready to meet.',
  },
  '/gone-home': {
    title: 'Gone home | TeddyPups U.A.E.',
    description:
      'Puppies from TeddyPups who have already joined loving families across Dubai and around the world.',
  },
  '/happy-families': {
    title: 'Happy families | TeddyPups U.A.E.',
    description: 'Real photos shared by TeddyPups families after welcoming their new puppy home.',
  },
  '/how-it-works': {
    title: 'How it works | TeddyPups U.A.E.',
    description:
      'Meet your puppy in our Downtown Dubai showroom or order a rare teacup breed imported safely from Europe or Korea.',
  },
  '/faq': {
    title: 'Questions & answers | TeddyPups U.A.E.',
    description:
      'Answers about vaccinations, health certificates, showroom visits in Downtown Dubai, importing from Korea, and delivery.',
  },
  '/contact': {
    title: 'Visit & contact | TeddyPups U.A.E.',
    description:
      'Visit our Downtown Dubai showroom, message us on WhatsApp, or send us a letter about your next puppy.',
  },
};

function RouteEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const cleanPath = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
    let meta = ROUTE_META[cleanPath];
    if (!meta && cleanPath.startsWith('/puppies/')) {
      const slug = cleanPath.replace('/puppies/', '');
      const pup = ALL_PUPPIES.find((p) => p.slug === slug);
      meta = pup
        ? {
            title: `${pup.displayName} (${pup.breed}) | TeddyPups U.A.E.`,
            description: `${pup.displayName}, ${pup.genderLabel.toLowerCase()} ${pup.breed} puppy at TeddyPups U.A.E.`,
          }
        : {
            title: 'Page not found | TeddyPups U.A.E.',
            description: 'We could not find that page at TeddyPups U.A.E.',
          };
    }
    if (!meta) {
      meta = {
        title: 'Page not found | TeddyPups U.A.E.',
        description: 'We could not find that page at TeddyPups U.A.E.',
      };
    }

    document.title = meta.title;
    const descEl = document.querySelector('meta[name="description"]');
    if (descEl) descEl.setAttribute('content', meta.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', meta.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', meta.description);

    if (hash && hash.length > 1) {
      const id = decodeURIComponent(hash.slice(1));
      const scrollTarget = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      };
      requestAnimationFrame(scrollTarget);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function AppShell() {
  const { pathname } = useLocation();

  return (
    <>
      <PawTrailCanvas />
      <RouteEffects />
      <Header />
      <main id="main" tabIndex={-1} className="relative pt-[var(--header-h)] outline-none">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/puppies" element={<PuppiesPage />} />
          <Route path="/puppies/:slug" element={<PuppyDetailPage />} />
          <Route path="/gone-home" element={<GoneHomePage />} />
          <Route path="/happy-families" element={<HappyFamiliesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <PupJourney key={pathname} />
      <RouteCurtain />
      <SmoothScroll />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
