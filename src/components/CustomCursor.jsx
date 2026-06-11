import { useEffect, useRef, useState, useCallback } from 'react';
import './CustomCursor.css';

/* ── Text-node detection ───────────────────────────────── */
const TEXT_TAGS = new Set([
  'P', 'SPAN', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'LI', 'TD', 'TH', 'LABEL', 'BLOCKQUOTE', 'FIGCAPTION',
  'STRONG', 'EM', 'B', 'I', 'U', 'S', 'SMALL', 'MARK',
  'CODE', 'PRE', 'DT', 'DD',
]);

const CLICKABLE_TAGS = new Set(['A', 'BUTTON', 'SUMMARY']);

function isTextElement(el) {
  if (!el) return false;
  if (TEXT_TAGS.has(el.tagName)) return true;
  /* If the element only has text-node children, treat it as text */
  if (el.childNodes.length > 0 && Array.from(el.childNodes).every(
    (n) => n.nodeType === Node.TEXT_NODE,
  )) {
    return true;
  }
  return false;
}

function isClickableElement(el) {
  if (!el) return false;
  if (CLICKABLE_TAGS.has(el.tagName)) return true;
  if (el.getAttribute('role') === 'button') return true;
  if (el.getAttribute('tabindex') != null && el.getAttribute('tabindex') !== '-1') return true;
  if (el.closest('a, button, [role="button"]')) return true;
  return false;
}

/* ── Component ─────────────────────────────────────────── */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const position = useRef({ x: -100, y: -100 });
  const rafId = useRef(null);
  const modeRef = useRef('default');
  const visibleRef = useRef(false);
  const [mode, setMode] = useState('default'); // 'default' | 'text' | 'clickable'
  const [visible, setVisible] = useState(false);

  /* Only enable on fine-pointer desktops */
  const [enabled, setEnabled] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(max-width: 768px)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const mobileMq = window.matchMedia('(max-width: 768px)');
    const update = () => setEnabled(mq.matches && !mobileMq.matches);
    mq.addEventListener?.('change', update);
    mobileMq.addEventListener?.('change', update);
    return () => {
      mq.removeEventListener?.('change', update);
      mobileMq.removeEventListener?.('change', update);
    };
  }, []);

  /* Add / remove the global cursor-hiding class */
  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add('custom-cursor');
    } else {
      document.documentElement.classList.remove('custom-cursor');
    }
    return () => document.documentElement.classList.remove('custom-cursor');
  }, [enabled]);

  const schedulePositionWrite = useCallback(() => {
    if (rafId.current) return;

    rafId.current = requestAnimationFrame(() => {
      rafId.current = null;
      if (dotRef.current) {
        const { x, y } = position.current;
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }
    });
  }, []);

  const setVisibleState = useCallback((nextVisible) => {
    if (visibleRef.current === nextVisible) return;
    visibleRef.current = nextVisible;
    setVisible(nextVisible);
  }, []);

  /* Track mouse and determine what we're hovering */
  const handleMouseMove = useCallback((e) => {
    position.current.x = e.clientX;
    position.current.y = e.clientY;
    schedulePositionWrite();

    setVisibleState(true);

    /* Determine cursor mode from hovered element */
    const el = document.elementFromPoint(e.clientX, e.clientY);
    let nextMode = 'default';
    if (isClickableElement(el)) {
      nextMode = 'clickable';
    } else if (isTextElement(el)) {
      nextMode = 'text';
    }

    if (modeRef.current !== nextMode) {
      modeRef.current = nextMode;
      setMode(nextMode);
    }
  }, [schedulePositionWrite, setVisibleState]);

  const handleMouseLeave = useCallback(() => {
    setVisibleState(false);
  }, [setVisibleState]);

  const handleMouseEnter = useCallback(() => {
    setVisibleState(true);
  }, [setVisibleState]);

  /* Position writes are batched into animation frames after pointer movement. */
  useEffect(() => {
    if (!enabled) return undefined;

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [enabled, handleMouseMove, handleMouseLeave, handleMouseEnter]);

  if (!enabled) return null;

  const modeClass = mode === 'text' ? 'is-text' : mode === 'clickable' ? 'is-clickable' : '';

  return (
    <div
      ref={dotRef}
      className={`custom-cursor-dot ${modeClass}`}
      style={{ opacity: visible ? undefined : 0 }}
      aria-hidden="true"
    />
  );
}
