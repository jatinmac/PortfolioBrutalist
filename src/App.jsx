import { useCallback, useEffect, useRef, useState } from 'react';
import { Footer, Navbar, SkipLink, CustomCursor, DotShaderBackground, GrainShaderBackground, ProjectModal, FaviconAnimator, AntiScrape } from './ds';
import { SECTIONS, PROJECT_GROUPS } from './data/siteContent';
import { PROJECTS } from './data/projects';
import { AboutSection, ContactSection, HomeSection, ProjectsSection } from './sections';
import './App.css';

const SECTION_IDS = SECTIONS.map((section) => section.id);
const NAV_TABS = SECTIONS.map((section) => section.navLabel);

const FONT_SCALE_MIN = 90;
const FONT_SCALE_MAX = 110;
const FONT_SCALE_STEP = 5;
const FONT_SCALE_DEFAULT = 100;
const SCROLL_OFFSET = -72;

function getStorageItem(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setStorageItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be disabled or unavailable in private browsing modes.
  }
}

function getStoredTheme() {
  return getStorageItem('theme') === 'dark' ? 'dark' : 'light';
}

function getStoredFontScale() {
  const saved = Number.parseInt(getStorageItem('fontScale'), 10);
  if (!Number.isFinite(saved)) return FONT_SCALE_DEFAULT;
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, saved));
}

export default function App() {
  const [activeTab, setActiveTab] = useState('HOME');
  const [theme, setTheme] = useState(getStoredTheme);
  const [fontScale, setFontScale] = useState(getStoredFontScale);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [isProjectClosing, setIsProjectClosing] = useState(false);
  const [isScrapeBlocked, setIsScrapeBlocked] = useState(false);
  const activeTabRef = useRef('HOME');
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef(null);
  const closeTimeout = useRef(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale / 100);
    setStorageItem('fontScale', String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.dataset.theme = theme;
    setStorageItem('theme', theme);
  }, [theme]);

  const setActiveTabIfChanged = useCallback((tabName) => {
    if (activeTabRef.current === tabName) return;

    activeTabRef.current = tabName;
    setActiveTab(tabName);
  }, []);

  const handleFontDecrease = useCallback(() => {
    setFontScale((prev) => Math.max(FONT_SCALE_MIN, prev - FONT_SCALE_STEP));
  }, []);

  const handleFontIncrease = useCallback(() => {
    setFontScale((prev) => Math.min(FONT_SCALE_MAX, prev + FONT_SCALE_STEP));
  }, []);

  const handleFontReset = useCallback(() => {
    setFontScale(FONT_SCALE_DEFAULT);
  }, []);

  const handleScrapeBlocked = useCallback(() => {
    setIsScrapeBlocked(true);
  }, []);

  const handleTabChange = useCallback((tabName) => {
    setActiveTabIfChanged(tabName);
    isProgrammaticScroll.current = true;

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    const targetSection = document.getElementById(tabName.toLowerCase());
    if (targetSection) {
      const top = targetSection.getBoundingClientRect().top + window.scrollY + SCROLL_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    }

    scrollTimeout.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 800);
  }, [setActiveTabIfChanged]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (isProgrammaticScroll.current) {
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 120);
        return;
      }

      if (ticking) return;

      window.requestAnimationFrame(() => {
        const marker = window.innerHeight / 3 + Math.abs(SCROLL_OFFSET);

        for (const id of SECTION_IDS) {
          const section = document.getElementById(id);
          if (!section) continue;

          const rect = section.getBoundingClientRect();
          if (rect.top <= marker && rect.bottom > marker) {
            setActiveTabIfChanged(id.toUpperCase());
            break;
          }
        }

        ticking = false;
      });

      ticking = true;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [setActiveTabIfChanged]);

  const handleProjectClick = useCallback((projectCard) => {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setActiveProjectId(projectCard.id);
    setIsProjectClosing(false);
  }, []);

  const handleCloseProject = useCallback(() => {
    setIsProjectClosing(true);
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    closeTimeout.current = setTimeout(() => {
      setActiveProjectId(null);
      setIsProjectClosing(false);
      closeTimeout.current = null;
    }, 400);
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  const activeProjectDetails = activeProjectId ? PROJECTS.find((p) => p.id === activeProjectId) : null;
  const activeProjectCard = activeProjectId ? PROJECT_GROUPS.work.projects.find((p) => p.id === activeProjectId) : null;

  return (
    <>
      <AntiScrape isBlocked={isScrapeBlocked} onBlocked={handleScrapeBlocked} />
      {!isScrapeBlocked && (
        <>
          <CustomCursor />
          <FaviconAnimator theme={theme} />
          <div className="app-layout">
            <DotShaderBackground />
            <GrainShaderBackground theme={theme} />
            <SkipLink />

            <Navbar tabs={NAV_TABS} activeTab={activeTab} onTabChange={handleTabChange} />

            <main id="main-content" className="app-main">
              <HomeSection onNavigate={handleTabChange} />
              <ProjectsSection type="work" onProjectClick={handleProjectClick} />
              <AboutSection />
              <ProjectsSection type="builds" />
              <ContactSection onNavigate={handleTabChange} />
            </main>

            <Footer
              fontScale={fontScale}
              fontScaleMin={FONT_SCALE_MIN}
              fontScaleMax={FONT_SCALE_MAX}
              fontScaleDefault={FONT_SCALE_DEFAULT}
              onFontDecrease={handleFontDecrease}
              onFontIncrease={handleFontIncrease}
              onFontReset={handleFontReset}
              theme={theme}
              onToggleTheme={setTheme}
            />

            {activeProjectDetails && (
              <ProjectModal
                project={activeProjectDetails}
                cardImage={activeProjectCard?.image}
                isClosing={isProjectClosing}
                onClose={handleCloseProject}
              />
            )}
          </div>
        </>
      )}
    </>
  );
}
