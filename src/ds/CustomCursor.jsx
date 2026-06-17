import { useEffect, useRef, useState } from 'react';

const BASE_CURSOR = { width: 10, height: 10, radius: 0 };
const TEXT_CURSOR = { width: 2, height: 22, radius: 999 };
const INTERACTIVE_SELECTOR = [
  'button',
  'a',
  'input',
  'textarea',
  'select',
  'summary',
  '[role="button"]',
  '[role="link"]',
  '[contenteditable="true"]',
  '.ds-nav-tab',
  '.ds-control-btn',
  '.ds-project-card',
].join(', ');
const TEXT_SELECTOR = 'h1, h2, h3, h4, h5, h6, p, span, label, li';
const HOVER_PADDING = 6;
const POSITION_EASE = 0.32;
const TRAIL_EASE = 0.16;
const SHAPE_EASE = 0.24;
const SNAP_THRESHOLD = 0.08;

function canUseCustomCursor() {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Custom cursor that glides behind pointer movement and morphs into target states.
 */
export default function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorInnerRef = useRef(null);
  const cursorTrailRef = useRef(null);
  const [enabled, setEnabled] = useState(canUseCustomCursor);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMediaChange = () => {
      setEnabled(pointerQuery.matches && !motionQuery.matches);
    };

    pointerQuery.addEventListener('change', handleMediaChange);
    motionQuery.addEventListener('change', handleMediaChange);
    return () => {
      pointerQuery.removeEventListener('change', handleMediaChange);
      motionQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('has-custom-cursor', enabled);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const cursor = cursorRef.current;
    const cursorInner = cursorInnerRef.current;
    const cursorTrail = cursorTrailRef.current;
    if (!cursor || !cursorInner || !cursorTrail) return;

    let hasMoved = false;
    let hoveredEl = null;
    let animationFrame = 0;
    let lastX = 0;
    let lastY = 0;
    const targetPosition = { x: 0, y: 0 };
    const cursorPosition = { x: 0, y: 0 };
    const trailPosition = { x: 0, y: 0 };
    const targetShape = { ...BASE_CURSOR };
    const cursorShape = { ...BASE_CURSOR };

    const lerp = (current, target, ease) => {
      const next = current + (target - current) * ease;
      return Math.abs(next - target) < SNAP_THRESHOLD ? target : next;
    };

    const setTargetPosition = (x, y) => {
      targetPosition.x = x;
      targetPosition.y = y;
    };

    const setTargetShape = ({ width, height, radius }) => {
      targetShape.width = width;
      targetShape.height = height;
      targetShape.radius = radius;
    };

    const setHidden = (isHidden) => {
      cursor.classList.toggle('is-hidden', isHidden);
      cursorTrail.classList.toggle('is-hidden', isHidden);
    };

    const setMode = (mode) => {
      const isButton = mode === 'button';
      const isText = mode === 'text';

      cursor.classList.toggle('is-button', isButton);
      cursor.classList.toggle('is-text', isText);
      cursorTrail.classList.toggle('is-button', isButton);
      cursorTrail.classList.toggle('is-text', isText);
    };

    const renderFrame = () => {
      cursorPosition.x = lerp(cursorPosition.x, targetPosition.x, POSITION_EASE);
      cursorPosition.y = lerp(cursorPosition.y, targetPosition.y, POSITION_EASE);
      trailPosition.x = lerp(trailPosition.x, targetPosition.x, TRAIL_EASE);
      trailPosition.y = lerp(trailPosition.y, targetPosition.y, TRAIL_EASE);
      cursorShape.width = lerp(cursorShape.width, targetShape.width, SHAPE_EASE);
      cursorShape.height = lerp(cursorShape.height, targetShape.height, SHAPE_EASE);
      cursorShape.radius = lerp(cursorShape.radius, targetShape.radius, SHAPE_EASE);

      const trailInset = hoveredEl ? 16 : 10;

      cursor.style.transform = `translate3d(${cursorPosition.x}px, ${cursorPosition.y}px, 0)`;
      cursorTrail.style.transform = `translate3d(${trailPosition.x}px, ${trailPosition.y}px, 0) translate(-50%, -50%)`;
      cursorInner.style.width = `${cursorShape.width}px`;
      cursorInner.style.height = `${cursorShape.height}px`;
      cursorInner.style.borderRadius = `${cursorShape.radius}px`;
      cursorTrail.style.width = `${Math.max(18, cursorShape.width + trailInset)}px`;
      cursorTrail.style.height = `${Math.max(18, cursorShape.height + trailInset)}px`;
      cursorTrail.style.borderRadius = `${Math.max(0, cursorShape.radius + 3)}px`;

      animationFrame = window.requestAnimationFrame(renderFrame);
    };

    const setHoveredTarget = (target) => {
      hoveredEl = target;
      const rect = target.getBoundingClientRect();
      const style = window.getComputedStyle(target);

      setTargetPosition(rect.left + rect.width / 2, rect.top + rect.height / 2);
      setTargetShape({
        width: rect.width + HOVER_PADDING * 2,
        height: rect.height + HOVER_PADDING * 2,
        radius: (parseFloat(style.borderRadius) || 0) + 2,
      });
      setMode('button');
    };

    const resetToPointer = () => {
      hoveredEl = null;
      setTargetPosition(lastX, lastY);
      setTargetShape(BASE_CURSOR);
      setMode('default');
    };

    const syncHoveredTarget = () => {
      if (!hoveredEl) return;

      if (!document.documentElement.contains(hoveredEl)) {
        resetToPointer();
        return;
      }

      setHoveredTarget(hoveredEl);
    };

    const handlePointerMove = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;

      if (!hoveredEl) {
        setTargetPosition(lastX, lastY);
      }

      if (!hasMoved) {
        hasMoved = true;
        cursorPosition.x = lastX;
        cursorPosition.y = lastY;
        trailPosition.x = lastX;
        trailPosition.y = lastY;
        setHidden(false);
      }
    };

    const handlePointerOver = (e) => {
      const target = e.target;
      if (!target) return;

      // Check for button-like elements or project cards to absorb shape
      const buttonEl = target.closest(INTERACTIVE_SELECTOR);
      if (buttonEl) {
        if (hoveredEl !== buttonEl) {
          setHoveredTarget(buttonEl);
        }
        return;
      }

      // Check for text elements to morph into a vertical line
      const textEl = target.closest(TEXT_SELECTOR);
      if (textEl) {
        hoveredEl = null;
        setTargetPosition(lastX, lastY);
        setTargetShape(TEXT_CURSOR);
        setMode('text');
        return;
      }

      // Default state
      resetToPointer();
    };

    const handlePointerDown = () => {
      cursor.classList.add('is-active');
      cursorTrail.classList.add('is-active');
    };

    const handlePointerUp = () => {
      cursor.classList.remove('is-active');
      cursorTrail.classList.remove('is-active');
    };

    const handlePointerLeave = () => {
      setHidden(true);
    };

    const handlePointerEnter = () => {
      if (hasMoved) {
        setHidden(false);
      }
    };

    animationFrame = window.requestAnimationFrame(renderFrame);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerover', handlePointerOver, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerUp, { passive: true });
    window.addEventListener('scroll', syncHoveredTarget, { passive: true });
    window.addEventListener('resize', syncHoveredTarget);
    document.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    document.addEventListener('pointerenter', handlePointerEnter, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('scroll', syncHoveredTarget);
      window.removeEventListener('resize', syncHoveredTarget);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={cursorTrailRef} className="custom-cursor-trail is-hidden" aria-hidden="true" />
      <div ref={cursorRef} className="custom-square-cursor is-hidden" aria-hidden="true">
        <div ref={cursorInnerRef} className="cursor-inner" />
      </div>
    </>
  );
}
