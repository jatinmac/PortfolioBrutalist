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
  },
  {
    id: 4,
    title: 'Skills.md',
    tag: 'BUILD 04',
    colSpan: 'col-span-2',
    link: 'https://aiskillsmd.netlify.app/',
  },
];

const getBuildBackgroundImage = (build) => {
  if (!build.imageWebp) {
    return `url(${build.image})`;
  }

  return `image-set(url("${build.imageWebp}") type("image/webp"), url("${build.image}") type("image/png"))`;
};

export default function BuildsPage() {
  return (
    <div className="builds-page-wrapper">
      <div className="builds-bento-wrapper">
        <div className="builds-bento-container">
          <h2 className="sr-only">My Builds</h2>
          <div className="builds-bento-grid">
            {BUILDS_DATA.map((build) => {
              const isInteractive = Boolean(build.link);
              const cardClassName = `builds-bento-item ${build.colSpan} ${isInteractive ? 'is-interactive' : ''} ${build.image ? 'has-image' : ''}`;
              const cardContent = (
                <>
                  {/* Background image if available */}
                  {build.image && (
                    <div className="build-image-bg" style={{ backgroundImage: getBuildBackgroundImage(build) }} />
                  )}

                  {/* Tag on Bottom Left Corner (styled like project card tag) */}
                  <span className="project-card-tag">{build.title}</span>

                  {/* Corner Button */}
                  <span className={`corner-link-btn${isInteractive ? '' : ' placeholder-btn'}`} aria-hidden="true">
                    <ArrowUpRight size={14} />
                  </span>
                </>
              );

              return isInteractive ? (
                <a
                  key={build.id}
                  className={cardClassName}
                  href={build.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClickSound()}
                  aria-label={`${build.title} build (Opens in new tab)`}
                >
                  {cardContent}
                </a>
              ) : (
                <div key={build.id} className={cardClassName}>
                  {cardContent}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
