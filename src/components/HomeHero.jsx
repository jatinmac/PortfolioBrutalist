import { Fragment, useEffect, useMemo, useState } from 'react';
import { Button, Text } from '../ds';

const HEADING_LINE_REVEAL_MS = 1450;
const HEADING_LINE_STAGGER_MS = 220;
const BASE_DELAY_MS = 500;

export default function HomeHero({ headingLines, onViewWork }) {
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHighlighted(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const lineWords = useMemo(() => {
    let globalIndex = 0;
    return headingLines.map((line, lineIndex) =>
      line.split(' ').map((word, wordIndex) => ({
        globalIndex: globalIndex++,
        key: `${lineIndex}-${wordIndex}`,
        word,
      }))
    );
  }, [headingLines]);

  const headingRevealTotalMs = (
    (headingLines.length - 1) * HEADING_LINE_STAGGER_MS
    + HEADING_LINE_REVEAL_MS
    + BASE_DELAY_MS
  );

  return (
    <div className="home-container">
      <div className="home-hero-text">
        <Text variant="overline" className="home-overheading">Hi, I'm Jatin Davis.</Text>
        <Text
          variant="display"
          as="h1"
          className="home-heading"
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
                      className={`word-reveal ${isHighlighted && globalIndex % 2 === 0 ? 'word-is-highlighted' : ''}`}
                    >
                      {word}
                    </span>
                    {wordIndex < words.length - 1 && ' '}
                  </Fragment>
                ))}
              </span>
            </span>
          ))}
        </Text>
        <Text
          variant="body-sm"
          as="p"
          className="home-subheading"
          style={{ '--sub-delay': `${headingRevealTotalMs + 100}ms` }}
        >
          Product designer@ Cardtree ai. Launched Quilo chrome ext. and youtube channel with 1mn+ views.
        </Text>
        <Button
          variant="ghost"
          onClick={onViewWork}
          className="home-cta-btn"
          style={{ '--cta-delay': `${headingRevealTotalMs + 400}ms` }}
        >
          View Work
        </Button>
      </div>
    </div>
  );
}
