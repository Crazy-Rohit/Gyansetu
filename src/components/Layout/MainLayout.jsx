import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import WelcomeModal from '../WelcomeModal';
import ChatBot from '../ChatBot/ChatBot';
import FunFactsFloater from '../FunFactsFloater';

export default function MainLayout({ children }) {
  const location = useLocation();

  // Tells index.html's inline splash script the app has mounted, so it can
  // start its exit transition (subject to its own minimum display time).
  // Empty deps: this must fire exactly once per full page load, never again
  // on a route change.
  useEffect(() => {
    window.dispatchEvent(new Event('gs:app-ready'));
  }, []);

  // Without this, following a link from halfway down one page drops you
  // halfway down the next one. `instant` on purpose: smooth-scrolling a route
  // change fights the page's own entrance animation.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <Header />
      <main key={location.pathname} className="gs-page-transition">{children}</main>
      <Footer />
      <WelcomeModal />
      <ChatBot />
      <FunFactsFloater />
    </>
  );
}
