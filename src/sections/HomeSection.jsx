import { useRef, useMemo } from 'react';
import { Button, Section, HeroCrossShader } from '../ds';
import { HERO } from '../data/siteContent';

export default function HomeSection({ onNavigate }) {
  const headingRef = useRef(null);

  const pixelPulse = useMemo(() => {
    const s = 3, g = 1, n = 4, cx = 1.5;
    const maxDist = Math.sqrt(2) * cx;
    const rects = [];
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const dist = Math.sqrt((r - cx) ** 2 + (c - cx) ** 2);
        const delay = (dist / maxDist * 0.6).toFixed(2);
        rects.push(
          <rect
            key={`${r}${c}`}
            x={c * (s + g)}
            y={r * (s + g)}
            width={s}
            height={s}
            fill="currentColor"
            opacity="0.15"
          >
            <animate
              attributeName="opacity"
              values="0.15;1;0.15"
              dur="2s"
              begin={`${delay}s`}
              repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
              keyTimes="0;0.4;1"
            />
          </rect>
        );
      }
    }
    return rects;
  }, []);

  return (
    <Section
      id="home"
      label="Home"
      tone="home"
      className="home-section"
      background={<HeroCrossShader headingRef={headingRef} />}
    >
      <div className="hero-stack">
        <div className="hero-sigil-row">
          <svg
            className="hero-sigil"
            width="16"
            height="16"
            viewBox="0 0 15 15"
            fill="none"
            aria-hidden="true"
          >
            {pixelPulse}
          </svg>
          <span className="hero-sigil-text" aria-hidden="true">
            <span className="hero-sigil-word hero-sigil-word--0">Analyse</span>
            <span className="hero-sigil-word hero-sigil-word--1">Find pain points</span>
            <span className="hero-sigil-word hero-sigil-word--2">Design, build &amp; solve problems</span>
            <span className="hero-sigil-word hero-sigil-word--3">Ship</span>
          </span>
        </div>
        <h1 ref={headingRef} className="ds-text--display hero-title">{HERO.title}</h1>
        <p className="hero-summary">{HERO.summary}</p>

        <div className="hero-actions" aria-label="Primary navigation">
          {HERO.actions.map((action) => {
            return (
              <Button
                key={action.label}
                variant={action.variant}
                href={action.href}
                external={action.external}
                onClick={action.href ? undefined : () => onNavigate(action.target)}
              >
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
