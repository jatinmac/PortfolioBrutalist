import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { Navbar, Footer, SkipLink } from './ds';
import CustomCursor from './components/CustomCursor';
import HomeHero from './components/HomeHero';
import CalmSeaBackground from './components/CalmSeaBackground';
import { MOBILE_PERFORMANCE_QUERY } from './utils/mediaQueries';
import { playTabChangeSound, playThemeToggleSound, getSoundEnabled, setSoundEnabled } from './utils/sound';
import './App.css';

const preloadAboutPage = () => import('./components/AboutPage');
const preloadWorkPage = () => import('./components/WorkPage');
const preloadBuildsPage = () => import('./components/BuildsPage');
const preloadContactPage = () => import('./components/ContactPage');

const PAGE_PRELOADERS = {
  About: preloadAboutPage,
  Work: preloadWorkPage,
  Builds: preloadBuildsPage,
  Contact: preloadContactPage,
};

const AboutPage = lazy(preloadAboutPage);
const WorkPage = lazy(preloadWorkPage);
const BuildsPage = lazy(preloadBuildsPage);
const ContactPage = lazy(preloadContactPage);

const TABS = ['Home', 'About', 'Work', 'Builds', 'Contact'];
const FONT_SCALE_MIN = 90;
const FONT_SCALE_MAX = 110;
const FONT_SCALE_STEP = 5;
const FONT_SCALE_DEFAULT = 100;

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const [soundEnabled, setSoundEnabledState] = useState(() => getSoundEnabled());

  const [fontScale, setFontScale] = useState(() => {
    const saved = parseInt(localStorage.getItem('fontScale'), 10);
    return Number.isFinite(saved) ? Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, saved)) : FONT_SCALE_DEFAULT;
  });



  const headingLines = useMemo(() => {
    return [
      'Product Designer & Builder.',
      'Using AI for design workflows, creating shippable prototypes & solving Problems.',
      'Prev. at Maruti Suzuki.',
    ];
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale / 100);
    localStorage.setItem('fontScale', String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const root = document.documentElement;
    if (savedTheme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, []);

  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const effectiveType = connection?.effectiveType || '';
    if (connection?.saveData || effectiveType.includes('2g')) {
      return undefined;
    }

    const preloadLazyPages = () => {
      preloadWorkPage();

      if (!window.matchMedia(MOBILE_PERFORMANCE_QUERY).matches) {
        preloadAboutPage();
        preloadBuildsPage();
        preloadContactPage();
      }
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(preloadLazyPages, { timeout: 2500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const preloadTimer = window.setTimeout(preloadLazyPages, 1600);
    return () => window.clearTimeout(preloadTimer);
  }, []);

  const handleToggleSound = useCallback(() => {
    const nextVal = !soundEnabled;
    setSoundEnabledState(nextVal);
    setSoundEnabled(nextVal);
  }, [soundEnabled]);

  const handleFontDecrease = useCallback(() => {
    setFontScale((prev) => Math.max(FONT_SCALE_MIN, prev - FONT_SCALE_STEP));
  }, []);

  const handleFontIncrease = useCallback(() => {
    setFontScale((prev) => Math.min(FONT_SCALE_MAX, prev + FONT_SCALE_STEP));
  }, []);

  const handleFontReset = useCallback(() => {
    setFontScale(FONT_SCALE_DEFAULT);
  }, []);

  const handleTabPreload = useCallback((tabName) => {
    PAGE_PRELOADERS[tabName]?.();
  }, []);

  const toggleTheme = useCallback((newTheme) => {
    if (theme === newTheme) return;
    playThemeToggleSound();

    setTheme(newTheme);
    const root = document.documentElement;
    if (newTheme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('theme', newTheme);
  }, [theme]);

  const handleTabChange = useCallback((tabName) => {
    playTabChangeSound();
    setActiveTab(tabName);
    const id = tabName.toLowerCase();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const sections = ['home', 'about', 'work', 'builds', 'contact'];
          const middleOfViewport = window.innerHeight / 2;

          for (const id of sections) {
            const el = document.getElementById(id);
            if (el) {
              const rect = el.getBoundingClientRect();
              // Check if middle of viewport is inside the section's bounding rectangle
              if (rect.top <= middleOfViewport && rect.bottom > middleOfViewport) {
                const tabName = id.charAt(0).toUpperCase() + id.slice(1);
                setActiveTab(tabName);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once to set the initial active tab
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <div className={`app-layout tab-${activeTab.toLowerCase()}`}>
        <CalmSeaBackground theme={theme} />
        <SkipLink />
        <div className="bg-glow" aria-hidden="true" />
        <div className="ds-navbar-blur-bg" aria-hidden="true" />

        <Navbar
          tabs={TABS}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onTabPreload={handleTabPreload}
        />

        <main id="main-content" className="content-container">
          <Suspense fallback={null}>
            <section id="home" className="viewport-section" aria-label="Home">
              <HomeHero
                headingLines={headingLines}
                onViewWork={() => handleTabChange('Work')}
                onScrollDown={() => handleTabChange('About')}
              />
            </section>
            <section id="about" className="viewport-section" aria-label="About">
              <AboutPage />
            </section>
            <section id="work" className="viewport-section" aria-label="Work">
              <WorkPage onNavigate={handleTabChange} />
            </section>
            <section id="builds" className="viewport-section" aria-label="Builds">
              <BuildsPage />
            </section>
            <section id="contact" className="viewport-section" aria-label="Contact">
              <ContactPage />
            </section>
          </Suspense>
        </main>

        <Footer
          fontScale={fontScale}
          fontScaleMin={FONT_SCALE_MIN}
          fontScaleMax={FONT_SCALE_MAX}
          fontScaleDefault={FONT_SCALE_DEFAULT}
          onFontDecrease={handleFontDecrease}
          onFontIncrease={handleFontIncrease}
          onFontReset={handleFontReset}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>
    </>
  );
}
