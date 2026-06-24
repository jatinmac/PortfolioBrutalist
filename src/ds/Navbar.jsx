import { useEffect, useRef, useState, useCallback } from 'react';
import NavTab from './NavTab';

const DEFAULT_TABS = ['HOME', 'WORK', 'ABOUT', 'BUILDS', 'CONTACTS'];

/**
 * Brutalist navbar with logo and section buttons.
 *
 * @param {Object} props
 * @param {string[]} [props.tabs]
 * @param {string} props.activeTab
 * @param {Function} props.onTabChange
 */
export default function Navbar({
  tabs = DEFAULT_TABS,
  activeTab,
  onTabChange,
}) {
  const tabRefs = useRef({});
  const progressBarRef = useRef(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, height: 0, top: 0, opacity: 0 });
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;

      progressBarRef.current?.style.setProperty('--scroll-progress', progress);
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;

      window.requestAnimationFrame(updateProgress);
      ticking = true;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const updatePillPosition = useCallback(() => {
    const activeEl = tabRefs.current[activeTab];
    if (activeEl) {
      setPillStyle({
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        height: activeEl.offsetHeight,
        top: activeEl.offsetTop,
        opacity: 1,
      });
    } else {
      setPillStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, [activeTab]);

  useEffect(() => {
    updatePillPosition();
    
    const timer = setTimeout(() => {
      setIsFirstRender(false);
    }, 50);

    window.addEventListener('resize', updatePillPosition);
    return () => {
      window.removeEventListener('resize', updatePillPosition);
      clearTimeout(timer);
    };
  }, [updatePillPosition]);

  // Scroll active tab into view on mobile
  useEffect(() => {
    const activeEl = tabRefs.current[activeTab];
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [activeTab]);

  // Arrow key navigation for the focused section button.
  const handleKeyDown = (e) => {
    const focusedTab = tabs.find((tab) => tabRefs.current[tab] === e.target);
    const currentIndex = tabs.indexOf(focusedTab || activeTab);
    let newIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = (currentIndex + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = tabs.length - 1;
    }

    if (newIndex !== undefined) {
      const nextTab = tabs[newIndex];
      onTabChange(nextTab);
      tabRefs.current[nextTab]?.focus();
    }
  };

  return (
    <header className="ds-navbar-header">
      <div className="ds-navbar-wrapper">
        <button
          type="button"
          className="ds-navbar-logo-area"
          onClick={() => onTabChange(tabs[0])}
          aria-label="Jatindavis home section"
        >
          <span className="ds-navbar-logo-text">Jatindavis</span>
        </button>

        <nav className="ds-navbar-container" aria-label="Main Navigation">
          <div className="ds-navbar-tabs-list" aria-label="Site sections" onKeyDown={handleKeyDown}>
            <div
              className="ds-navbar-pill"
              style={{
                left: `${pillStyle.left}px`,
                top: `${pillStyle.top}px`,
                width: `${pillStyle.width}px`,
                height: `${pillStyle.height}px`,
                opacity: pillStyle.opacity,
                transition: isFirstRender 
                  ? 'none' 
                  : 'left var(--motion-duration-normal) var(--motion-easing-smooth), top var(--motion-duration-normal) var(--motion-easing-smooth), width var(--motion-duration-normal) var(--motion-easing-smooth), height var(--motion-duration-normal) var(--motion-easing-smooth), opacity var(--motion-duration-normal) var(--motion-easing-smooth)',
              }}
            />
            {tabs.map((tab) => (
              <NavTab
                key={tab}
                ref={(el) => (tabRefs.current[tab] = el)}
                label={tab}
                isActive={activeTab === tab}
                onClick={() => onTabChange(tab)}
              />
            ))}
          </div>
        </nav>
      </div>

      <div className="ds-navbar-progress-container" aria-hidden="true">
        <div 
          ref={progressBarRef}
          className="ds-navbar-progress-bar" 
        />
      </div>
    </header>
  );
}
