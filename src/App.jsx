import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AppFooter from './components/AppFooter';
import CustomCursor from './components/CustomCursor';
import DesktopPreviewCarousel from './components/DesktopPreviewCarousel';
import HomeHero from './components/HomeHero';
import Navbar from './components/Navbar';
import { DESKTOP_PREVIEW_QUERY, MOBILE_PERFORMANCE_QUERY } from './utils/mediaQueries';
import { playTabChangeSound, playThemeToggleSound, getSoundEnabled, setSoundEnabled } from './utils/sound';
import './App.css';

const preloadAboutPage = () => import('./components/AboutPage');
const preloadWorkPage = () => import('./components/WorkPage');
const preloadBuildsPage = () => import('./components/BuildsPage');
const preloadContactPage = () => import('./components/ContactPage');

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
  const [displayTab, setDisplayTab] = useState('Home');
  const [prevTab, setPrevTab] = useState(null);
  const timerRef = useRef(null);
  const [previewTransition, setPreviewTransition] = useState(null);
  const [previewEntering, setPreviewEntering] = useState(false);
  const previewTransitionTimerRef = useRef(null);
  const [flyingPreview, setFlyingPreview] = useState(null);
  const [introCompleted, setIntroCompleted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia(DESKTOP_PREVIEW_QUERY).matches);

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
      'Using AI to create prototypes that feel real & solve Pain Points.',
      'Prev. at Maruti Suzuki.',
    ];
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroCompleted(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_PREVIEW_QUERY);

    const listener = (e) => {
      setIsDesktop(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      mediaQuery.addListener(listener);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
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
      preloadAboutPage();
      preloadBuildsPage();
      preloadContactPage();
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(preloadLazyPages, { timeout: 2500 });
      return () => window.cancelIdleCallback(idleId);
    }

    const preloadTimer = window.setTimeout(preloadLazyPages, 1600);
    return () => window.clearTimeout(preloadTimer);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (previewTransitionTimerRef.current) {
        clearTimeout(previewTransitionTimerRef.current);
      }
    };
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

  const toggleTheme = useCallback((e, newTheme) => {
    if (theme === newTheme) return;
    playThemeToggleSound();

    const changeThemeDOM = () => {
      setTheme(newTheme);
      const root = document.documentElement;
      if (newTheme === 'light') {
        root.classList.add('light');
      } else {
        root.classList.remove('light');
      }
      localStorage.setItem('theme', newTheme);
    };

    const isAppearanceTransition = document.startViewTransition
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      && !window.matchMedia(MOBILE_PERFORMANCE_QUERY).matches;

    if (!isAppearanceTransition) {
      changeThemeDOM();
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      changeThemeDOM();
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 1000,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }, [theme]);

  const handleTabChange = useCallback((tabName) => {
    if (tabName !== activeTab) {
      if (previewTransitionTimerRef.current) {
        clearTimeout(previewTransitionTimerRef.current);
        previewTransitionTimerRef.current = null;
        setPreviewTransition(null);
        setPreviewEntering(false);
        setFlyingPreview(null);
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      playTabChangeSound();
      setPrevTab(activeTab);
      setActiveTab(tabName);
      setDisplayTab(tabName);
      timerRef.current = setTimeout(() => {
        setPrevTab(null);
        timerRef.current = null;
      }, 500);
    }
  }, [activeTab]);

  const handlePreviewClick = useCallback((side, tabName) => {
    if (previewTransition || flyingPreview || tabName === activeTab) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      handleTabChange(tabName);
      return;
    }

    playTabChangeSound();
    setPreviewEntering(false);
    setPreviewTransition(side);
    setFlyingPreview({ side, tabName });

    previewTransitionTimerRef.current = setTimeout(() => {
      setPreviewTransition(null);
      setPreviewEntering(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      setActiveTab(tabName);
      setDisplayTab(tabName);

      previewTransitionTimerRef.current = setTimeout(() => {
        setFlyingPreview(null);
        setPreviewEntering(false);
        previewTransitionTimerRef.current = null;
      }, 500);
    }, 650);
  }, [previewTransition, flyingPreview, activeTab, handleTabChange]);

  const renderTabContent = useCallback((tabName) => {
    switch (tabName) {
      case 'Home':
        return <HomeHero headingLines={headingLines} onViewWork={() => handleTabChange('Work')} />;
      case 'About':
        return <AboutPage />;
      case 'Work':
        return <WorkPage onNavigate={handleTabChange} />;
      case 'Builds':
        return <BuildsPage />;
      case 'Contact':
        return <ContactPage />;
      default:
        return null;
    }
  }, [headingLines, handleTabChange]);

  const renderContent = () => {
    if (prevTab) {
      return (
        <div className="tab-transition-container">
          <div
            key={`exit-${prevTab}`}
            className="tab-pane exit-up"
            role="tabpanel"
            id={`tabpanel-${prevTab.toLowerCase()}`}
            aria-labelledby={`tab-${prevTab.toLowerCase()}`}
            aria-hidden="true"
          >
            {renderTabContent(prevTab)}
          </div>
          <div
            key={`enter-${displayTab}`}
            className="tab-pane enter-down"
            role="tabpanel"
            id={`tabpanel-${displayTab.toLowerCase()}`}
            aria-labelledby={`tab-${displayTab.toLowerCase()}`}
          >
            {renderTabContent(displayTab)}
          </div>
        </div>
      );
    }

    return (
      <div
        key={`active-${displayTab}`}
        className="tab-pane active"
        role="tabpanel"
        id={`tabpanel-${displayTab.toLowerCase()}`}
        aria-labelledby={`tab-${displayTab.toLowerCase()}`}
      >
        {renderTabContent(displayTab)}
      </div>
    );
  };

  const currentIdx = TABS.indexOf(displayTab);
  const leftTab = currentIdx !== -1 ? TABS[(currentIdx - 1 + TABS.length) % TABS.length] : null;
  const rightTab = currentIdx !== -1 ? TABS[(currentIdx + 1) % TABS.length] : null;

  return (
    <>
      <CustomCursor />
      <div className={`app-layout tab-${displayTab.toLowerCase()}`}>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <div className="bg-glow" aria-hidden="true" />

        <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

        <DesktopPreviewCarousel
          isDesktop={isDesktop}
          prevTab={prevTab}
          leftTab={leftTab}
          rightTab={rightTab}
          flyingPreview={flyingPreview}
          previewTransition={previewTransition}
          displayTab={displayTab}
          introCompleted={introCompleted}
          onPreviewClick={handlePreviewClick}
        />

        <main id="main-content" className={`content-container${previewTransition ? ' content-flying-out' : ''}${previewEntering ? ' content-entering-from-preview' : ''}`}>
          <Suspense fallback={null}>
            {renderContent()}
          </Suspense>
        </main>

        <AppFooter
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
