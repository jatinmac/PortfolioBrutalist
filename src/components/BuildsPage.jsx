import { ArrowUpRight } from 'lucide-react';
import { playClickSound } from '../utils/sound';
import { VisuallyHidden, Card, Tag, IconButton, Icon } from '../ds';
import './BuildsPage.css';

const BUILDS_DATA = [
  {
    id: 1,
    title: 'My AI Twin',
    tag: 'BUILD 01',
    image: '/aitwin.webp',
    link: 'https://jatindavistwin.vercel.app/',
  },
  {
    id: 2,
    title: 'Website Hero',
    tag: 'BUILD 02',
    image: '/aiwebsite.webp',
    link: 'https://websitedesign-ten.vercel.app/',
  },
  {
    id: 3,
    title: 'AI UI',
    tag: 'BUILD 03',
    image: '/AIui.webp',
    link: 'https://agenticui.netlify.app/',
  },
  {
    id: 4,
    title: 'Skills.md',
    tag: 'BUILD 04',
    image: '/skillsmd.webp',
    link: 'https://aiskillsmd.netlify.app/',
  },
];

export default function BuildsPage() {
  return (
    <div className="builds-page-container">
      <VisuallyHidden as="h2">My Builds</VisuallyHidden>
      <div className="builds-grid">
        {BUILDS_DATA.map((build) => {
          const titleId = `build-title-${build.id}`;
          const isInteractive = Boolean(build.link);

          const cardContent = (
            <div className="build-card-content">
              {/* Image container */}
              <div className="build-image-container">
                <div
                  className="build-image-black-box"
                  style={{ backgroundImage: `url(${build.image})` }}
                  role="img"
                  aria-label={`${build.title} build screenshot`}
                />
                {/* Corner link indicator */}
                {isInteractive && (
                  <IconButton
                    size="overlay"
                    placement="corner"
                    className="build-link-corner-btn"
                    round
                    as="span"
                    aria-hidden="true"
                  >
                    <Icon icon={ArrowUpRight} size="md" />
                  </IconButton>
                )}
              </div>
              {/* Build details */}
              <div className="build-card-footer">
                <h3 id={titleId} className="build-name-active">{build.title}</h3>
                {build.tag && (
                  <div className="build-card-tags">
                    <Tag variant="card">{build.tag}</Tag>
                  </div>
                )}
              </div>
            </div>
          );

          return isInteractive ? (
            <Card
              key={build.id}
              as="a"
              interactive
              className="build-card"
              href={build.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClickSound()}
              aria-labelledby={titleId}
              aria-label={`Open ${build.title} build (Opens in new tab)`}
            >
              {cardContent}
            </Card>
          ) : (
            <Card
              key={build.id}
              className="build-card"
              aria-labelledby={titleId}
            >
              {cardContent}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
