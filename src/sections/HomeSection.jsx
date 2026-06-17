import { Button, Section } from '../ds';
import { HERO } from '../data/siteContent';

export default function HomeSection({ onNavigate }) {
  return (
    <Section id="home" label="Home" tone="home" className="home-section">
      <div className="hero-stack">
        <h1 className="ds-text--display hero-title">{HERO.title}</h1>
        <p className="hero-summary">{HERO.summary}</p>

        <div className="hero-actions" aria-label="Primary navigation">
          {HERO.actions.map((action) => (
            <Button
              key={action.target}
              variant={action.variant}
              onClick={() => onNavigate(action.target)}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </Section>
  );
}
