import { useRef } from 'react';
import { Button, Section, HeroDotShader } from '../ds';
import { HERO } from '../data/siteContent';

export default function HomeSection({ onNavigate }) {
  const headingRef = useRef(null);

  return (
    <Section
      id="home"
      label="Home"
      tone="home"
      className="home-section"
      background={<HeroDotShader headingRef={headingRef} />}
    >
      <div className="hero-stack">
        <h1 ref={headingRef} className="ds-text--display hero-title">{HERO.title}</h1>
        <p className="hero-summary">{HERO.summary}</p>

        <div className="hero-actions" aria-label="Primary navigation">
          {HERO.actions.map((action) => {
            const handleActionClick = () => {
              if (action.downloadUrl) {
                const link = document.createElement('a');
                link.href = action.downloadUrl;
                link.download = action.downloadName || 'Resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
              if (!action.href) {
                onNavigate(action.target);
              }
            };

            return (
              <Button
                key={action.label}
                variant={action.variant}
                href={action.href}
                external={action.external}
                onClick={handleActionClick}
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
