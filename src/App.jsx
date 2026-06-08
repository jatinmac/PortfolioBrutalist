import { Fragment, Suspense, lazy, useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { Sun, Moon, Volume2, VolumeX, AArrowUp, AArrowDown, RotateCcw } from 'lucide-react';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
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

const HEADING_LINE_REVEAL_MS = 1450;
const HEADING_LINE_STAGGER_MS = 220;
const REDUCED_HEADING_LINE_REVEAL_MS = 260;
const REDUCED_HEADING_LINE_STAGGER_MS = 45;
const PONG_START_BUFFER_MS = 600;
const BALL_INITIAL_SIZE = 18;
const BALL_MIN_SIZE = 2.5;
const BALL_SHRINK_FACTOR = 0.88;
const WALL_MIN_OPACITY = 0.08;
const MOBILE_PERFORMANCE_QUERY = '(max-width: 768px), (pointer: coarse)';
const DESKTOP_PREVIEW_QUERY = '(min-width: 1340px) and (pointer: fine)';
const TABS = ['Home', 'About', 'Work', 'Builds', 'Contact'];

function HomeHero({ headingLines, onViewWork }) {
  const [pongActive, setPongActive] = useState(false);
  const [ballSize, setBallSize] = useState(BALL_INITIAL_SIZE);
  const [ballVisible, setBallVisible] = useState(true);
  const [ballVanishing, setBallVanishing] = useState(false);
  const [wallOpacity, setWallOpacity] = useState(1);
  const [gameComplete, setGameComplete] = useState(false);
  const [headingHit, setHeadingHit] = useState(false);
  const [hitWordIndex, setHitWordIndex] = useState(null);
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const ballElementRef = useRef(null);
  const ballRef = useRef({
    x: 24,
    y: 24,
    vx: 178,
    vy: 132,
    size: BALL_INITIAL_SIZE,
    visible: true,
    lastTime: 0,
  });
  const headingHitTimerRef = useRef(null);
  const wordHitTimerRef = useRef(null);
  const ballVanishTimerRef = useRef(null);
  const lineWords = useMemo(() => {
    let globalIndex = 0;

    return headingLines.map((line, lineIndex) => (
      line.split(' ').map((word, wordIndex) => ({
        globalIndex: globalIndex++,
        key: `${lineIndex}-${wordIndex}`,
        word,
      }))
    ));
  }, [headingLines]);
  const headingRevealTotalMs = (
    (headingLines.length - 1) * HEADING_LINE_STAGGER_MS
    + HEADING_LINE_REVEAL_MS
  );

  useEffect(() => {
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobilePerformanceQuery = window.matchMedia(MOBILE_PERFORMANCE_QUERY);
    if (reduceMotionQuery.matches || mobilePerformanceQuery.matches) {
      return undefined;
    }

    const revealMs = reduceMotionQuery.matches ? REDUCED_HEADING_LINE_REVEAL_MS : HEADING_LINE_REVEAL_MS;
    const staggerMs = reduceMotionQuery.matches ? REDUCED_HEADING_LINE_STAGGER_MS : HEADING_LINE_STAGGER_MS;
    const totalRevealMs = (headingLines.length - 1) * staggerMs + revealMs + PONG_START_BUFFER_MS;
    const startTimer = window.setTimeout(() => setPongActive(true), totalRevealMs);

    return () => window.clearTimeout(startTimer);
  }, [headingLines.length]);

  useEffect(() => {
    if (!pongActive) return undefined;

    let animationFrame;
    const ballState = ballRef.current;

    const registerBallHit = () => {
      if (!ballState.visible) return;

      const nextSize = ballState.size * BALL_SHRINK_FACTOR;
      const nextWallOpacity = Math.max(
        WALL_MIN_OPACITY,
        nextSize / BALL_INITIAL_SIZE
      );

      if (nextSize <= BALL_MIN_SIZE) {
        ballState.visible = false;
        ballState.size = 0;
        setBallSize(0);
        setBallVanishing(true);
        setWallOpacity(0);
        if (ballVanishTimerRef.current) {
          window.clearTimeout(ballVanishTimerRef.current);
        }
        ballVanishTimerRef.current = window.setTimeout(() => {
          setBallVisible(false);
          setGameComplete(true);
        }, 320);
        return;
      }

      ballState.size = nextSize;
      setBallSize(nextSize);
      setWallOpacity(nextWallOpacity);
    };

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
        x: ballBox.left + ballState.size / 2,
        y: ballBox.top + ballState.size / 2,
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
      if (!ball.visible) return;

      const currentBallSize = ball.size;
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
      let hitThisFrame = false;

      if (nextX <= 0 || nextX + currentBallSize >= containerRect.width) {
        ball.vx *= -1;
        nextX = Math.max(0, Math.min(nextX, containerRect.width - currentBallSize));
        hitThisFrame = true;
      }

      if (nextY <= 0 || nextY + currentBallSize >= containerRect.height) {
        ball.vy *= -1;
        nextY = Math.max(0, Math.min(nextY, containerRect.height - currentBallSize));
        hitThisFrame = true;
      }

      const ballBox = {
        left: nextX,
        right: nextX + currentBallSize,
        top: nextY,
        bottom: nextY + currentBallSize,
      };
      const overlapsHeading = (
        ballBox.right >= headingBox.left
        && ballBox.left <= headingBox.right
        && ballBox.bottom >= headingBox.top
        && ballBox.top <= headingBox.bottom
      );

      if (overlapsHeading) {
        const previousBottom = ball.y + currentBallSize;
        const previousTop = ball.y;
        const hitFromAbove = previousBottom <= headingBox.top;
        const hitFromBelow = previousTop >= headingBox.bottom;

        if (hitFromAbove || hitFromBelow) {
          ball.vy *= -1;
          nextY = hitFromAbove ? headingBox.top - currentBallSize : headingBox.bottom;
        } else {
          ball.vx *= -1;
          nextX = ball.x < headingBox.left ? headingBox.left - currentBallSize : headingBox.right;
        }

        hitThisFrame = true;
        pulseHeading();
        fadeHitWord(ballBox, containerRect);
      }

      if (hitThisFrame) {
        registerBallHit();
      }

      const nextBallSize = ball.size;
      ball.x = Math.max(0, Math.min(nextX, containerRect.width - nextBallSize));
      ball.y = Math.max(0, Math.min(nextY, containerRect.height - nextBallSize));
      if (ballElementRef.current) {
        ballElementRef.current.style.setProperty('--ball-size', `${nextBallSize}px`);
        ballElementRef.current.style.transform = `translate3d(${ball.x}px, ${ball.y}px, 0)`;
      }
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
      if (ballVanishTimerRef.current) {
        window.clearTimeout(ballVanishTimerRef.current);
      }
      ballState.lastTime = 0;
    };
  }, [pongActive]);

  return (
    <div
      className={`home-container ${pongActive ? 'pong-is-active' : ''}`}
      ref={containerRef}
      style={{ '--pong-wall-opacity': wallOpacity }}
    >
      {pongActive && (
        <>
          <span className="pong-paddle pong-paddle-left" aria-hidden="true" />
          <span className="pong-paddle pong-paddle-right" aria-hidden="true" />
          {ballVisible && (
            <span
              ref={ballElementRef}
              className={`pong-ball ${ballVanishing ? 'is-vanishing' : ''}`}
              aria-hidden="true"
              style={{
                '--ball-size': `${ballSize}px`,
              }}
            />
          )}
        </>
      )}
      <div className="home-hero-text">
        <span className="home-overheading">Hi, I'm Jatin Davis.</span>
        <h1
          ref={headingRef}
          className={`home-heading ${headingHit ? 'is-hit' : ''}`}
        >
          {lineWords.map((words, lineIndex) => (
            <span
              className="heading-line"
              key={lineIndex}
            >
              <span
                className="heading-line-content"
                style={{ '--line-index': lineIndex }}
              >
                {words.map(({ globalIndex, key, word }, wordIndex) => (
                  <Fragment key={key}>
                    <span
                      className={`word-reveal ${hitWordIndex === globalIndex ? 'word-is-hit' : ''} ${gameComplete && globalIndex % 2 === 0 ? 'word-is-highlighted' : ''}`}
                    >
                      {word}
                    </span>
                    {wordIndex < words.length - 1 && ' '}
                  </Fragment>
                ))}
              </span>
            </span>
          ))}
        </h1>
        <p
          className="home-subheading"
          style={{ '--sub-delay': `${headingRevealTotalMs + 500}ms` }}
        >
          Product designer@ Cardtree ai. Launched Quilo chrome ext. and youtube channel with 1mn+ views.
        </p>
        <button
          onClick={onViewWork}
          className="home-cta-btn"
          style={{ '--cta-delay': `${headingRevealTotalMs + 800}ms` }}
        >
          <span>View Work</span>
        </button>
      </div>
    </div>
  );
}

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

  const lastScrollTimeRef = useRef(0);
  const lastWheelTimeRef = useRef(0);
  const scrollInertiaActiveRef = useRef(false);

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

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [soundEnabled, setSoundEnabledState] = useState(() => getSoundEnabled());

  const [fontScale, setFontScale] = useState(() => {
    const saved = parseInt(localStorage.getItem('fontScale'), 10);
    return Number.isFinite(saved) ? Math.min(FONT_SCALE_MAX, Math.max(FONT_SCALE_MIN, saved)) : FONT_SCALE_DEFAULT;
  });

  const headingLines = useMemo(() => {
    return [
      'Product Designer & Builder.',
      'Using AI to create prototypes that feel real & solve problems.',
      'Prev. at Maruti Suzuki.',
    ];
  }, []);

  const handleToggleSound = useCallback(() => {
    const nextVal = !soundEnabled;
    setSoundEnabledState(nextVal);
    setSoundEnabled(nextVal);
  }, [soundEnabled]);

  // Apply font scale to <html> element
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale / 100);
    localStorage.setItem('fontScale', String(fontScale));
  }, [fontScale]);

  const handleFontDecrease = useCallback(() => {
    setFontScale((prev) => Math.max(FONT_SCALE_MIN, prev - FONT_SCALE_STEP));
  }, []);

  const handleFontIncrease = useCallback(() => {
    setFontScale((prev) => Math.min(FONT_SCALE_MAX, prev + FONT_SCALE_STEP));
  }, []);

  const handleFontReset = useCallback(() => {
    setFontScale(FONT_SCALE_DEFAULT);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const root = document.documentElement;
    if (savedTheme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, []); // Run once on mount

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
      }, 500); // match transition duration in CSS (500ms)
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

  useEffect(() => {
    if (!isDesktop) return;

    const handleWheel = (e) => {
      const now = Date.now();
      const timeSinceLastWheel = now - lastWheelTimeRef.current;
      lastWheelTimeRef.current = now;

      // If there's been no scroll events for 150ms, the previous gesture (including inertia) has ended.
      if (timeSinceLastWheel > 150) {
        scrollInertiaActiveRef.current = false;
      }

      // If we've already handled a transition for this gesture and inertia is active, ignore.
      if (scrollInertiaActiveRef.current) {
        return;
      }

      // Ignore horizontal scroll attempts
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      // Ignore small scroll deltas (filters trackpad drift/accidental touch)
      if (Math.abs(e.deltaY) < 30) return;

      // Ignore if a modal is open
      if (document.querySelector('.modal-backdrop')) return;

      // Ignore if a transition is in progress
      if (previewTransition || flyingPreview || prevTab) return;

      // Cooldown between transitions (1200ms matches the total carousel fly animation duration)
      if (now - lastScrollTimeRef.current < 1200) return;

      if (e.deltaY > 0) {
        // Scroll down -> Go to next tab (right)
        if (rightTab) {
          scrollInertiaActiveRef.current = true;
          lastScrollTimeRef.current = now;
          handlePreviewClick('right', rightTab);
        }
      } else if (e.deltaY < 0) {
        // Scroll up -> Go to previous tab (left)
        if (leftTab) {
          scrollInertiaActiveRef.current = true;
          lastScrollTimeRef.current = now;
          handlePreviewClick('left', leftTab);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isDesktop, leftTab, rightTab, previewTransition, flyingPreview, prevTab, handlePreviewClick]);

  return (
    <>
      <CustomCursor />
      <div className="app-layout">
        {/* Skip to Content — visible only on keyboard focus */}
        <a href="#main-content" className="skip-link">Skip to content</a>

        {/* Premium background radial glow */}
        <div className="bg-glow" aria-hidden="true" />

        {/* Floating Capsule Navbar */}
        <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

        {/* Carousel page previews — desktop only, all tabs */}
        {isDesktop && !prevTab && leftTab && rightTab && (
          <>
            <div
              key={`left-${leftTab}`}
              className={`carousel-preview carousel-preview-left${flyingPreview?.side === 'left' ? ' carousel-fly-source' : ''}${previewTransition === 'right' ? ' carousel-fly-fade' : ''}`}
              onClick={() => handlePreviewClick('left', leftTab)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePreviewClick('left', leftTab);
                }
              }}
              role="button"
              tabIndex={previewTransition || flyingPreview ? -1 : 0}
              aria-label={`Preview ${leftTab} page`}
              style={{
                animationDelay: previewTransition ? '0s' : (displayTab === 'Home' && !introCompleted ? '3.5s' : '0.1s'),
              }}
            >
              <div className="carousel-preview-inner" aria-hidden="true">
                <Suspense fallback={null}>
                  {renderTabContent(leftTab)}
                </Suspense>
              </div>
              <div className="carousel-preview-overlay" aria-hidden="true">
                <span className="carousel-preview-label">{leftTab}</span>
              </div>
            </div>
            <div
              key={`right-${rightTab}`}
              className={`carousel-preview carousel-preview-right${flyingPreview?.side === 'right' ? ' carousel-fly-source' : ''}${previewTransition === 'left' ? ' carousel-fly-fade' : ''}`}
              onClick={() => handlePreviewClick('right', rightTab)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePreviewClick('right', rightTab);
                }
              }}
              role="button"
              tabIndex={previewTransition || flyingPreview ? -1 : 0}
              aria-label={`Preview ${rightTab} page`}
              style={{
                animationDelay: previewTransition ? '0s' : (displayTab === 'Home' && !introCompleted ? '3.8s' : '0.2s'),
              }}
            >
              <div className="carousel-preview-inner" aria-hidden="true">
                <Suspense fallback={null}>
                  {renderTabContent(rightTab)}
                </Suspense>
              </div>
              <div className="carousel-preview-overlay" aria-hidden="true">
                <span className="carousel-preview-label">{rightTab}</span>
              </div>
            </div>
          </>
        )}
        {isDesktop && flyingPreview && (
          <div
            key={`flying-${flyingPreview.tabName}`}
            className={`carousel-preview carousel-preview-${flyingPreview.side} carousel-fly-active`}
            aria-hidden="true"
            style={{ animationDelay: '0s' }}
          >
            <div className="carousel-preview-inner">
              <Suspense fallback={null}>
                {renderTabContent(flyingPreview.tabName)}
              </Suspense>
            </div>
            <div className="carousel-preview-overlay">
              <span className="carousel-preview-label">{flyingPreview.tabName}</span>
            </div>
          </div>
        )}

        {/* Main Content Showcase */}
        <main id="main-content" className={`content-container${previewTransition ? ' content-flying-out' : ''}${previewEntering ? ' content-entering-from-preview' : ''}`}>
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
              <div className="font-size-controls" role="group" aria-label="Font size controls">
                <button
                  onClick={handleFontDecrease}
                  className={`theme-btn ${fontScale <= FONT_SCALE_MIN ? 'is-disabled' : ''}`}
                  aria-label="Decrease font size"
                  disabled={fontScale <= FONT_SCALE_MIN}
                >
                  <AArrowDown size={14} strokeWidth={2.5} />
                </button>
                <button
                  onClick={handleFontReset}
                  className={`theme-btn ${fontScale === FONT_SCALE_DEFAULT ? 'is-active' : ''}`}
                  aria-label={`Reset font size (currently ${fontScale}%)`}
                  title={`${fontScale}%`}
                >
                  <RotateCcw size={12} strokeWidth={2.5} />
                </button>
                <button
                  onClick={handleFontIncrease}
                  className={`theme-btn ${fontScale >= FONT_SCALE_MAX ? 'is-disabled' : ''}`}
                  aria-label="Increase font size"
                  disabled={fontScale >= FONT_SCALE_MAX}
                >
                  <AArrowUp size={14} strokeWidth={2.5} />
                </button>
              </div>
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
    </>
  );
}
