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
    image: '/aitwin.webp',
  },
  {
    id: 2,
    title: 'Website Hero',
    tag: 'BUILD 02',
    colSpan: 'col-span-1',
    link: 'https://websitedesign-ten.vercel.app/',
    image: '/aiwebsite.webp',
  },
  {
    id: 3,
    title: 'AI UI',
    tag: 'BUILD 03',
    colSpan: 'col-span-1',
    link: 'https://agenticui.netlify.app/',
    image: '/AIui.webp',
  },
  {
    id: 4,
    title: 'Skills.md',
    tag: 'BUILD 04',
    colSpan: 'col-span-1',
    link: 'https://aiskillsmd.netlify.app/',
    image: '/skillsmd.webp',
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
              aria-label={isInteractive ? `${build.title} build (Opens in new tab)` : `${build.title}`}
            >
              {/* Background image if available */}
              {build.image && (
                <div className="build-image-bg" style={{ backgroundImage: getBuildBackgroundImage(build) }} />
              )}

              {/* Tag on Bottom Left Corner (styled like project card tag) */}
              <span className="project-card-tag">{build.title}</span>

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
            </div>
          );
        })}
      </div>
    </div>
  );
}
