import { useCallback, useState, useEffect, useRef } from 'react';
import { playClickSound } from '../utils/sound';
import './Navbar.css';

const TABS = ['Home', 'About', 'Work', 'Builds', 'Contact'];
const RESUME_PDF_PATH = '/Jatin%20Davis%20Resume%20JDR%20.pdf';
const RESUME_DRIVE_URL = 'https://drive.google.com/file/d/1-zqfQ3X3NTgxAEKJag8ebzWExW7-ngC0/view?usp=sharing';

export default function Navbar({ activeTab, setActiveTab }) {
  const [pillStyle, setPillStyle] = useState({});
  const [isMoving, setIsMoving] = useState(false);
  const [rotation, setRotation] = useState(0);

  const tabRefs = useRef({});
  const prevTabRef = useRef('Home');

  const updatePill = useCallback(() => {
    const activeEl = tabRefs.current[activeTab];
    if (activeEl) {
      setPillStyle({
        left: `${activeEl.offsetLeft}px`,
        top: `${activeEl.offsetTop}px`,
        width: `${activeEl.offsetWidth}px`,
        height: `${activeEl.offsetHeight}px`,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    updatePill();
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [updatePill]);

  // Scroll active tab into view on mobile viewports
  useEffect(() => {
    const activeEl = tabRefs.current[activeTab];
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [activeTab]);

  useEffect(() => {
    // Calculate rotation delta cumulatively to prevent backwards-unwinding animation
    const prevIndex = TABS.indexOf(prevTabRef.current);
    const nextIndex = TABS.indexOf(activeTab);

    if (prevIndex !== nextIndex && prevIndex !== -1 && nextIndex !== -1) {
      const diff = nextIndex - prevIndex;
      const angleChange = diff * 180; // 180 degrees flip per tab step

      setRotation(prev => prev + angleChange);
      setIsMoving(true);

      const timer = setTimeout(() => {
        setIsMoving(false);
      }, 420); // Matches CSS transition duration

      prevTabRef.current = activeTab;
      return () => clearTimeout(timer);
    } else {
      prevTabRef.current = activeTab;
    }
  }, [activeTab]);

  // Arrow key navigation for roving tabindex pattern
  const handleKeyDown = (e) => {
    const currentIndex = TABS.indexOf(activeTab);
    let newIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      newIndex = (currentIndex + 1) % TABS.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      newIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = TABS.length - 1;
    }

    if (newIndex !== undefined) {
      setActiveTab(TABS[newIndex]);
      tabRefs.current[TABS[newIndex]]?.focus();
    }
  };

  const handleResumeClick = () => {
    playClickSound();
    window.open(RESUME_DRIVE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="navbar-header">
      <div className="navbar-wrapper">
        <nav className="navbar-container" aria-label="Main Navigation">
          {/* Sliding Pill Highlight with Cumulative 3D Pivot Rotation */}
          <div
            className={`navbar-pill-highlight ${isMoving ? 'is-moving' : ''}`}
            style={{
              ...pillStyle,
              transform: `rotateY(${rotation}deg) translateZ(${isMoving ? '12px' : '0px'})`
            }}
            aria-hidden="true"
          />

          {/* Navigation Items — tablist with roving tabindex */}
          <div role="tablist" aria-label="Site sections" onKeyDown={handleKeyDown}>
            {TABS.map((tab) => (
              <button
                key={tab}
                ref={(el) => (tabRefs.current[tab] = el)}
                onClick={() => setActiveTab(tab)}
                className={`navbar-tab-btn ${activeTab === tab ? 'is-active' : ''}`}
                aria-selected={activeTab === tab}
                aria-controls={`tabpanel-${tab.toLowerCase()}`}
                id={`tab-${tab.toLowerCase()}`}
                role="tab"
                tabIndex={activeTab === tab ? 0 : -1}
              >
                {tab}
              </button>
            ))}
          </div>
        </nav>

        {/* Actions (Resume Only) */}
        <div className="navbar-actions">
          {/* Resume Button */}
          <a
            href={RESUME_PDF_PATH}
            download="Jatin Davis Resume.pdf"
            className="navbar-resume-btn"
            onClick={handleResumeClick}
          >
            Resume
          </a>
        </div>
      </div>
    </header>
  );
}
