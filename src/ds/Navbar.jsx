import { useCallback, useState, useEffect, useRef } from 'react';
import { playClickSound } from '../utils/sound';
import NavTab from './NavTab';
import Button from './Button';

const RESUME_PDF_PATH = '/Jatin%20Davis%20Resume%20JDR%20.pdf';
const RESUME_DRIVE_URL = 'https://drive.google.com/file/d/1-zqfQ3X3NTgxAEKJag8ebzWExW7-ngC0/view?usp=sharing';
const DEFAULT_TABS = ['Home', 'About', 'Work', 'Builds', 'Contact'];

/**
 * Full navbar with sliding pill, 3D rotation, roving tabindex.
 *
 * @param {Object} props
 * @param {string[]} [props.tabs]
 * @param {string} props.activeTab
 * @param {Function} props.onTabChange
 * @param {Function} [props.onTabPreload]
 */
export default function Navbar({
  tabs = DEFAULT_TABS,
  activeTab,
  onTabChange,
  onTabPreload,
}) {
  const [pillStyle, setPillStyle] = useState({});
  const [isMoving, setIsMoving] = useState(false);
  const [rotation, setRotation] = useState(0);

  const tabRefs = useRef({});
  const prevTabRef = useRef(activeTab);

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

  // Scroll active tab into view on mobile
  useEffect(() => {
    const activeEl = tabRefs.current[activeTab];
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [activeTab]);

  // 3D rotation animation
  useEffect(() => {
    const prevIndex = tabs.indexOf(prevTabRef.current);
    const nextIndex = tabs.indexOf(activeTab);

    if (prevIndex !== nextIndex && prevIndex !== -1 && nextIndex !== -1) {
      const diff = nextIndex - prevIndex;
      const angleChange = diff * 180;

      setRotation(prev => prev + angleChange);
      setIsMoving(true);

      const timer = setTimeout(() => {
        setIsMoving(false);
      }, 420);

      prevTabRef.current = activeTab;
      return () => clearTimeout(timer);
    } else {
      prevTabRef.current = activeTab;
    }
  }, [activeTab, tabs]);

  // Arrow key navigation (roving tabindex)
  const handleKeyDown = (e) => {
    const currentIndex = tabs.indexOf(activeTab);
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
      onTabPreload?.(nextTab);
      onTabChange(nextTab);
      tabRefs.current[nextTab]?.focus();
    }
  };

  const handleResumeClick = () => {
    playClickSound();
    window.open(RESUME_DRIVE_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="ds-navbar-header">
      <div className="ds-navbar-wrapper">
        <nav className="ds-navbar-container" aria-label="Main Navigation">
          {/* Sliding Pill Highlight */}
          <div
            className={`ds-navbar-pill ${isMoving ? 'is-moving' : ''}`}
            style={{
              ...pillStyle,
              transform: `rotateY(${rotation}deg) translateZ(${isMoving ? '12px' : '0px'})`,
            }}
            aria-hidden="true"
          />

          {/* Tab buttons */}
          <div role="tablist" aria-label="Site sections" onKeyDown={handleKeyDown}>
            {tabs.map((tab) => (
              <NavTab
                key={tab}
                ref={(el) => (tabRefs.current[tab] = el)}
                label={tab}
                isActive={activeTab === tab}
                tabId={`tab-${tab.toLowerCase()}`}
                panelId={`tabpanel-${tab.toLowerCase()}`}
                onClick={() => onTabChange(tab)}
                onFocus={() => onTabPreload?.(tab)}
                onPointerEnter={() => onTabPreload?.(tab)}
              />
            ))}
          </div>
        </nav>

        {/* Actions */}
        <div className="ds-navbar-actions">
          <Button
            variant="primary"
            href={RESUME_PDF_PATH}
            download="Jatin Davis Resume.pdf"
            playSound={() => playClickSound()}
            onClick={handleResumeClick}
          >
            Resume
          </Button>
        </div>
      </div>
    </header>
  );
}
