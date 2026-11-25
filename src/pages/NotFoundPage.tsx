import { Link } from 'react-router-dom';
import { SceneSection } from '../components/SceneSection';
import { PupBuddy } from '../components/TeddyBuddy';

const POSTER_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/puppies', label: 'Available' },
  { to: '/gone-home', label: 'Gone home' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/contact', label: 'Contact' },
];

export function NotFoundPage() {
  return (
    <SceneSection
      tone={{ top: '#fffdf8', bottom: '#fbe3b4' }}
      className="flex min-h-[75vh] items-center justify-center py-16"
    >
      <div className="gutter flex justify-center">
        <div className="tp-poster">
          <p className="font-scrawl tp-poster__kicker">have you seen this page?</p>
          <h1 className="font-plush tp-poster__title">Lost</h1>
          <div className="tp-poster__photo">
            <PupBuddy pose="sniff" facing="right" act="tilt" label="Teddy, sniffing for the missing page" />
          </div>
          <p className="tp-poster__desc">
            We sniffed everywhere, even behind the cushions. That page may have wandered off to a
            new home.
          </p>
          <p className="font-scrawl tp-poster__reward">tear off a tab to find your way back</p>
          <ul className="tp-poster__tabs">
            {POSTER_LINKS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="tp-poster__tab">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SceneSection>
  );
}
