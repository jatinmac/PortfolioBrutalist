import { Section } from '../ds';
import { ABOUT } from '../data/siteContent';

import runningImg from '../images/about/I love running.avif';
import carEnthusiastImg from '../images/about/I am a car enthusiast.avif';
import f1NerdImg from '../images/about/Formula 1 nerd.webp';
import musicImg from '../images/about/Like 80s music.webp';
import bikeLoverImg from '../images/about/bike lover.webp';
import dragonballZImg from '../images/about/dargonballZ fan.webp';
import marvelDcImg from '../images/about/marvel and dc fan.webp';
import motoGpImg from '../images/about/moto gp fan.webp';
import watchLoverImg from '../images/about/watch lover.webp';
import wweFanImg from '../images/about/wwe fan.webp';

const TILES = [
  { label: 'I love running', image: runningImg },
  { label: 'I am a car enthusiast', image: carEnthusiastImg },
  { label: 'Formula 1 nerd', image: f1NerdImg },
  { label: 'Like 80s music', image: musicImg },
  { label: 'bike lover', image: bikeLoverImg },
  { label: 'dargonballZ fan', image: dragonballZImg },
  { label: 'marvel and dc fan', image: marvelDcImg },
  { label: 'moto gp fan', image: motoGpImg },
  { label: 'watch lover', image: watchLoverImg },
  { label: 'wwe fan', image: wweFanImg },
];

export default function AboutSection() {
  return (
    <Section id="about" label="About" tone="about">
      <div className="section-heading">
        <h2 className="ds-text--display section-title">{ABOUT.title}</h2>
        {Array.isArray(ABOUT.body) ? (
          <ul className="about-list">
            {ABOUT.body.map((item, index) => (
              <li key={index} className="about-list-item">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="section-summary">{ABOUT.body}</p>
        )}
      </div>

      <h3 className="about-visual-heading">interests and hobbies</h3>

      <div className="about-visual-grid" aria-label="Personal interests">
        {TILES.map((tile) => (
          <div key={tile.label} className="about-visual-item">
            <div className="about-visual-tile">
              <span className="about-visual-tile__image-container">
                <img src={tile.image} alt={tile.label} className="about-visual-tile__image" loading="lazy" />
                <span className="about-visual-tile__overlay" />
              </span>
            </div>
            <span className="about-visual-caption">{tile.label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}
