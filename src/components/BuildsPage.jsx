import { ArrowUpRight } from 'lucide-react';
import { playClickSound } from '../utils/sound';
import './bento.css';
import './BuildsPage.css';

const BUILDS_DATA = [
  {
    id: 1,
    title: 'My AI Twin',
    tag: 'BUILD 01',
    colSpan: 'col-span-2',
    link: 'https://jatindavistwin.vercel.app/',
    image: '/aitwin.png',
    imageWebp: '/aitwin.webp',
  },
  {
    id: 2,
    title: 'Coming Soon',
    tag: 'BUILD 02',
    colSpan: 'col-span-1',
  },
  {
    id: 3,
    title: 'Coming Soon',
    tag: 'BUILD 03',
    colSpan: 'col-span-1',
  },
  {
    id: 4,
    title: 'Coming Soon',
    tag: 'BUILD 04',
    colSpan: 'col-span-1',
  },
  {
    id: 5,
    title: 'Coming Soon',
    tag: 'BUILD 05',
    colSpan: 'col-span-1',
  },
];

const getBuildBackgroundImage = (build) => {
  if (!build.imageWebp) {
    return `url(${build.image})`;
  }

  return `image-set(url("${build.imageWebp}") type("image/webp"), url("${build.image}") type("image/png"))`;
};

export default function BuildsPage() {
  const handleItemClick = (build) => {
    playClickSound();
    if (build.link) {
      window.open(build.link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (e, build) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playClickSound();
      if (build.link) {
        window.open(build.link, '_blank', 'noopener,noreferrer');
      }
    }
  };

  return (
    <div className="builds-bento-container">
      <h2 className="sr-only">My Builds</h2>
      <div className="builds-bento-grid">
        {BUILDS_DATA.map((build) => {
          const isInteractive = !!build.link;

          return (
            <div
              key={build.id}
              className={`builds-bento-item ${build.colSpan} ${isInteractive ? 'is-interactive' : ''} ${build.image ? 'has-image' : ''}`}
              onClick={() => handleItemClick(build)}
              onKeyDown={(e) => handleKeyDown(e, build)}
              tabIndex={0}
              role="button"
              aria-label={isInteractive ? `${build.tag}: ${build.title} (Opens in new tab)` : `${build.tag}: ${build.title}`}
            >
              {/* Background image & gradient overlay if available */}
              {build.image && (
                <>
                  <div className="build-image-bg" style={{ backgroundImage: getBuildBackgroundImage(build) }} />
                  <div className="build-overlay" />
                </>
              )}

              {/* Tag on Top Left */}
              <span className="bento-tag">{build.tag}</span>

              {/* Corner Button */}
              {isInteractive ? (
                <a
                  href={build.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="corner-link-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent duplicate navigation trigger from card click
                    playClickSound();
                  }}
                  aria-label={`Open ${build.title} build in a new tab`}
                >
                  <ArrowUpRight size={14} />
                </a>
              ) : (
                <div className="corner-link-btn placeholder-btn" aria-hidden="true">
                  <ArrowUpRight size={14} />
                </div>
              )}

              {/* Centered Placeholder Text */}
              <span className="bento-placeholder">{build.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
