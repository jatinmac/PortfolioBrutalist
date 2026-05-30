import { Fragment, Suspense, lazy, useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import Navbar from './components/Navbar';
import { playTabChangeSound, playThemeToggleSound, getSoundEnabled, setSoundEnabled } from './utils/sound';
import './App.css';

const AboutPage = lazy(() => import('./components/AboutPage'));
const WorkPage = lazy(() => import('./components/WorkPage'));
const ContactPage = lazy(() => import('./components/ContactPage'));

const WORD_REVEAL_MS = 2000;
const WORD_STAGGER_MS = 400;
const REDUCED_WORD_REVEAL_MS = 300;
const REDUCED_WORD_STAGGER_MS = 50;
const PONG_START_BUFFER_MS = 600;
const BALL_SIZE = 18;

function HomeHero({ headingWords, onViewWork }) {
  const [pongActive, setPongActive] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 24, y: 24 });
  const [headingHit, setHeadingHit] = useState(false);
  const [hitWordIndex, setHitWordIndex] = useState(null);
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const ballRef = useRef({
    x: 24,
    y: 24,
    vx: 178,
    vy: 132,
    lastTime: 0,
  });
  const headingHitTimerRef = useRef(null);
  const wordHitTimerRef = useRef(null);

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const revealMs = reduceMotionQuery.matches ? REDUCED_WORD_REVEAL_MS : WORD_REVEAL_MS;
    const staggerMs = reduceMotionQuery.matches ? REDUCED_WORD_STAGGER_MS : WORD_STAGGER_MS;
    const totalRevealMs = (headingWords.length - 1) * staggerMs + revealMs + PONG_START_BUFFER_MS;
    const startTimer = window.setTimeout(() => setPongActive(true), totalRevealMs);

    return () => window.clearTimeout(startTimer);
  }, [headingWords.length]);

  useEffect(() => {
    if (!pongActive) return undefined;

    let animationFrame;
    const ballState = ballRef.current;

    const pulseHeading = () => {
      setHeadingHit(true);
      if (headingHitTimerRef.current) {
        window.clearTimeout(headingHitTimerRef.current);
      }
      headingHitTimerRef.current = window.setTimeout(() => setHeadingHit(false), 160);
    };

    const fadeHitWord = (ballBox, containerRect) => {
      const wordNodes = headingRef.current?.querySelectorAll('.word-reveal');
      if (!wordNodes?.length) return;

      const ballCenter = {
        x: ballBox.left + BALL_SIZE / 2,
        y: ballBox.top + BALL_SIZE / 2,
      };

      const hitIndex = Array.from(wordNodes).findIndex((wordNode) => {
        const wordRect = wordNode.getBoundingClientRect();
        const wordBox = {
          left: wordRect.left - containerRect.left,
          right: wordRect.right - containerRect.left,
          top: wordRect.top - containerRect.top,
          bottom: wordRect.bottom - containerRect.top,
        };

        const centerInsideWord = (
          ballCenter.x >= wordBox.left
          && ballCenter.x <= wordBox.right
          && ballCenter.y >= wordBox.top
          && ballCenter.y <= wordBox.bottom
        );

        return centerInsideWord || (
          ballBox.right >= wordBox.left
          && ballBox.left <= wordBox.right
          && ballBox.bottom >= wordBox.top
          && ballBox.top <= wordBox.bottom
        );
      });

      if (hitIndex === -1) return;

      setHitWordIndex(hitIndex);
      if (wordHitTimerRef.current) {
        window.clearTimeout(wordHitTimerRef.current);
      }
      wordHitTimerRef.current = window.setTimeout(() => setHitWordIndex(null), 520);
    };

    const tick = (time) => {
      const container = containerRef.current;
      const heading = headingRef.current;

      if (!container || !heading) {
        animationFrame = window.requestAnimationFrame(tick);
        return;
      }

      const ball = ballState;
      const delta = ball.lastTime ? Math.min((time - ball.lastTime) / 1000, 0.04) : 0;
      ball.lastTime = time;

      const containerRect = container.getBoundingClientRect();
      const headingRect = heading.getBoundingClientRect();
      const headingBox = {
        left: headingRect.left - containerRect.left,
        right: headingRect.right - containerRect.left,
        top: headingRect.top - containerRect.top,
        bottom: headingRect.bottom - containerRect.top,
      };

      let nextX = ball.x + ball.vx * delta;
      let nextY = ball.y + ball.vy * delta;

      if (nextX <= 0 || nextX + BALL_SIZE >= containerRect.width) {
        ball.vx *= -1;
        nextX = Math.max(0, Math.min(nextX, containerRect.width - BALL_SIZE));
      }

      if (nextY <= 0 || nextY + BALL_SIZE >= containerRect.height) {
        ball.vy *= -1;
        nextY = Math.max(0, Math.min(nextY, containerRect.height - BALL_SIZE));
      }

      const ballBox = {
        left: nextX,
        right: nextX + BALL_SIZE,
        top: nextY,
        bottom: nextY + BALL_SIZE,
      };
      const overlapsHeading = (
        ballBox.right >= headingBox.left
        && ballBox.left <= headingBox.right
        && ballBox.bottom >= headingBox.top
        && ballBox.top <= headingBox.bottom
      );

      if (overlapsHeading) {
        const previousBottom = ball.y + BALL_SIZE;
        const previousTop = ball.y;
        const hitFromAbove = previousBottom <= headingBox.top;
        const hitFromBelow = previousTop >= headingBox.bottom;

        if (hitFromAbove || hitFromBelow) {
          ball.vy *= -1;
          nextY = hitFromAbove ? headingBox.top - BALL_SIZE : headingBox.bottom;
        } else {
          ball.vx *= -1;
          nextX = ball.x < headingBox.left ? headingBox.left - BALL_SIZE : headingBox.right;
        }

        pulseHeading();
        fadeHitWord(ballBox, containerRect);
      }

      ball.x = Math.max(0, Math.min(nextX, containerRect.width - BALL_SIZE));
      ball.y = Math.max(0, Math.min(nextY, containerRect.height - BALL_SIZE));
      setBallPosition({ x: ball.x, y: ball.y });
      animationFrame = window.requestAnimationFrame(tick);
    };

    animationFrame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      if (headingHitTimerRef.current) {
        window.clearTimeout(headingHitTimerRef.current);
      }
      if (wordHitTimerRef.current) {
        window.clearTimeout(wordHitTimerRef.current);
      }
      ballState.lastTime = 0;
    };
  }, [pongActive]);

  return (
    <div className={`home-container ${pongActive ? 'pong-is-active' : ''}`} ref={containerRef}>
      {pongActive && (
        <>
          <span className="pong-paddle pong-paddle-left" aria-hidden="true" />
          <span className="pong-paddle pong-paddle-right" aria-hidden="true" />
          <span
            className="pong-ball"
            aria-hidden="true"
            style={{
              transform: `translate3d(${ballPosition.x}px, ${ballPosition.y}px, 0)`,
            }}
          />
        </>
      )}
      <div className="home-hero-text">
        <span className="home-overheading">Hi, i'm Jatin Davis.</span>
        <h1
          ref={headingRef}
          className={`home-heading ${headingHit ? 'is-hit' : ''}`}
        >
          {headingWords.map((word, index) => (
            <Fragment key={index}>
              <span
                className={`word-reveal ${hitWordIndex === index ? 'word-is-hit' : ''}`}
                style={{ '--index': index }}
              >
                {word}
              </span>
              {index < headingWords.length - 1 && ' '}
            </Fragment>
          ))}
        </h1>
        <p
          className="home-subheading"
          style={{ '--sub-delay': `${headingWords.length * 400 + 800}ms` }}
        >
          Build and launched Quilo chrome ext with 600 users and youtube channel to 1mn+ views.
        </p>
        <button
          onClick={onViewWork}
          className="home-cta-btn"
          style={{ '--cta-delay': `${headingWords.length * 400 + 1100}ms` }}
        >
          <span>View Work</span>
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [displayTab, setDisplayTab] = useState('Home');
  const [prevTab, setPrevTab] = useState(null);
  const timerRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [soundEnabled, setSoundEnabledState] = useState(() => getSoundEnabled());

  const headingWords = useMemo(() => {
    return "Product design builder with 3+ yrs of experience, using agentic ai and workflows to build shippable deliverables and products. Worked in b2b and b2c. Prev. Maruti Suzuki.".split(" ");
  }, []);

  const handleToggleSound = useCallback(() => {
    const nextVal = !soundEnabled;
    setSoundEnabledState(nextVal);
    setSoundEnabled(nextVal);
  }, [soundEnabled]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const root = document.documentElement;
    if (savedTheme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, []); // Run once on mount

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
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
      }, 500); // match transition duration in CSS (500ms)
    }
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const renderTabContent = useCallback((tabName) => {
    switch (tabName) {
      case 'Home':
        return <HomeHero headingWords={headingWords} onViewWork={() => handleTabChange('Work')} />;
      case 'About':
        return <AboutPage />;
      case 'Work':
        return <WorkPage />;
      case 'Contact':
        return <ContactPage />;
      default:
        return null;
    }
  }, [headingWords, handleTabChange]);

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

  return (
    <div className="app-layout">
      {/* Skip to Content — visible only on keyboard focus */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {/* Premium background radial glow */}
      <div className="bg-glow" aria-hidden="true" />

      {/* Floating Capsule Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Content Showcase */}
      <main id="main-content" className="content-container">
        <Suspense fallback={null}>
          {renderContent()}
        </Suspense>
      </main>

      {/* Global Footer with Theme Switcher */}
      <footer className="app-footer" role="contentinfo">
        <div className="footer-content">
          <span className="footer-copyright">
            &copy; {new Date().getFullYear()} Jatin Davis &bull;
          </span>
          <div className="footer-controls">
            <div className="sound-toggle">
              <button
                onClick={handleToggleSound}
                className={`theme-btn ${soundEnabled ? 'is-active' : ''}`}
                aria-label={soundEnabled ? "Mute Sounds" : "Unmute Sounds"}
              >
                {soundEnabled ? (
                  <Volume2 size={14} strokeWidth={2.5} />
                ) : (
                  <VolumeX size={14} strokeWidth={2.5} />
                )}
              </button>
            </div>
            <div className="theme-switcher">
              <button
                onClick={(e) => toggleTheme(e, 'light')}
                className={`theme-btn ${theme === 'light' ? 'is-active' : ''}`}
                aria-label="Light Mode"
              >
                <Sun size={14} strokeWidth={2.5} />
              </button>
              <button
                onClick={(e) => toggleTheme(e, 'dark')}
                className={`theme-btn ${theme === 'dark' ? 'is-active' : ''}`}
                aria-label="Dark Mode"
              >
                <Moon size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
