import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { MOBILE_PERFORMANCE_QUERY } from '../utils/mediaQueries';

const HEADING_LINE_REVEAL_MS = 1450;
const HEADING_LINE_STAGGER_MS = 220;
const REDUCED_HEADING_LINE_REVEAL_MS = 260;
const REDUCED_HEADING_LINE_STAGGER_MS = 45;
const PONG_START_BUFFER_MS = 600;
const BALL_INITIAL_SIZE = 18;
const BALL_MIN_SIZE = 2.5;
const BALL_SHRINK_FACTOR = 0.88;
const WALL_MIN_OPACITY = 0.08;

export default function HomeHero({ headingLines, onViewWork }) {
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
  const collisionLayoutRef = useRef({
    width: 0,
    height: 0,
    headingBox: null,
    wordBoxes: [],
  });
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
    let resizeObserver;

    const measureCollisionLayout = () => {
      const container = containerRef.current;
      const heading = headingRef.current;
      if (!container || !heading) return;

      const containerRect = container.getBoundingClientRect();
      const headingRect = heading.getBoundingClientRect();
      const wordNodes = heading.querySelectorAll('.word-reveal');

      collisionLayoutRef.current = {
        width: containerRect.width,
        height: containerRect.height,
        headingBox: {
          left: headingRect.left - containerRect.left,
          right: headingRect.right - containerRect.left,
          top: headingRect.top - containerRect.top,
          bottom: headingRect.bottom - containerRect.top,
        },
        wordBoxes: Array.from(wordNodes).map((wordNode) => {
          const wordRect = wordNode.getBoundingClientRect();
          return {
            left: wordRect.left - containerRect.left,
            right: wordRect.right - containerRect.left,
            top: wordRect.top - containerRect.top,
            bottom: wordRect.bottom - containerRect.top,
          };
        }),
      };
    };

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

    const fadeHitWord = (ballBox) => {
      const { wordBoxes } = collisionLayoutRef.current;
      if (!wordBoxes.length) return;

      const ballCenter = {
        x: ballBox.left + ballState.size / 2,
        y: ballBox.top + ballState.size / 2,
      };

      const hitIndex = wordBoxes.findIndex((wordBox) => {
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
      let collisionLayout = collisionLayoutRef.current;

      if (!collisionLayout.headingBox || !collisionLayout.width || !collisionLayout.height) {
        measureCollisionLayout();
        collisionLayout = collisionLayoutRef.current;
      }

      if (!collisionLayout.headingBox || !collisionLayout.width || !collisionLayout.height) {
        animationFrame = window.requestAnimationFrame(tick);
        return;
      }

      const ball = ballState;
      if (!ball.visible) return;

      const currentBallSize = ball.size;
      const delta = ball.lastTime ? Math.min((time - ball.lastTime) / 1000, 0.04) : 0;
      ball.lastTime = time;

      const { width, height, headingBox } = collisionLayout;

      let nextX = ball.x + ball.vx * delta;
      let nextY = ball.y + ball.vy * delta;
      let hitThisFrame = false;

      if (nextX <= 0 || nextX + currentBallSize >= width) {
        ball.vx *= -1;
        nextX = Math.max(0, Math.min(nextX, width - currentBallSize));
        hitThisFrame = true;
      }

      if (nextY <= 0 || nextY + currentBallSize >= height) {
        ball.vy *= -1;
        nextY = Math.max(0, Math.min(nextY, height - currentBallSize));
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
        fadeHitWord(ballBox);
      }

      if (hitThisFrame) {
        registerBallHit();
      }

      const nextBallSize = ball.size;
      ball.x = Math.max(0, Math.min(nextX, width - nextBallSize));
      ball.y = Math.max(0, Math.min(nextY, height - nextBallSize));
      if (ballElementRef.current) {
        ballElementRef.current.style.setProperty('--ball-size', `${nextBallSize}px`);
        ballElementRef.current.style.transform = `translate3d(${ball.x}px, ${ball.y}px, 0)`;
      }
      animationFrame = window.requestAnimationFrame(tick);
    };

    measureCollisionLayout();
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(measureCollisionLayout);
      if (containerRef.current) resizeObserver.observe(containerRef.current);
      if (headingRef.current) resizeObserver.observe(headingRef.current);
    }
    window.addEventListener('resize', measureCollisionLayout);
    animationFrame = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measureCollisionLayout);
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
      collisionLayoutRef.current = {
        width: 0,
        height: 0,
        headingBox: null,
        wordBoxes: [],
      };
    };
  }, [pongActive]);

  return (
    <div
      className={`home-container ${pongActive ? 'pong-is-active' : ''}`}
      ref={containerRef}
      style={{ '--pong-wall-opacity': wallOpacity }}
    >
      {pongActive && ballVisible && (
        <span
          ref={ballElementRef}
          className={`pong-ball ${ballVanishing ? 'is-vanishing' : ''}`}
          aria-hidden="true"
          style={{
            '--ball-size': `${ballSize}px`,
          }}
        />
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
