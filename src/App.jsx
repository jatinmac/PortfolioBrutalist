import { useCallback, useEffect, useRef, useState } from 'react';
import { Footer, Navbar, SkipLink, CustomCursor, DotShaderBackground, ProjectModal } from './ds';
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

function getStoredTheme() {
  return localStorage.getItem('theme') || 'light';
}

function getStoredFontScale() {
  const saved = Number.parseInt(localStorage.getItem('fontScale'), 10);
  if (!Number.isFinite(saved)) return FONT_SCALE_DEFAULT;
  return Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, saved));
}

export default function App() {
  const [activeTab, setActiveTab] = useState('HOME');
  const [theme, setTheme] = useState(getStoredTheme);
  const [fontScale, setFontScale] = useState(getStoredFontScale);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const activeTabRef = useRef('HOME');
  const isProgrammaticScroll = useRef(false);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale / 100);
    localStorage.setItem('fontScale', String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
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
    setActiveProjectId(projectCard.id);
  }, []);

  const activeProjectDetails = activeProjectId ? PROJECTS.find((p) => p.id === activeProjectId) : null;
  const activeProjectCard = activeProjectId ? PROJECT_GROUPS.work.projects.find((p) => p.id === activeProjectId) : null;

  return (
    <>
      <CustomCursor />
      <div className="app-layout">
        <DotShaderBackground />
        <SkipLink />

        <Navbar tabs={NAV_TABS} activeTab={activeTab} onTabChange={handleTabChange} />

        <main id="main-content" className="app-main">
          <HomeSection onNavigate={handleTabChange} />
          <AboutSection />
          <ProjectsSection type="work" onProjectClick={handleProjectClick} />
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
            onClose={() => setActiveProjectId(null)}
          />
        )}
      </div>
    </>
  );
}
