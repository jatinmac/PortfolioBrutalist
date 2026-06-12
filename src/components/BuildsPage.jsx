import { ArrowUpRight } from 'lucide-react';
import { playClickSound } from '../utils/sound';
import { VisuallyHidden, BentoGrid, Card, Tag, IconButton, Icon } from '../ds';
import './BuildsPage.css';

const BUILDS_DATA = [
  {
    id: 1,
    title: 'My AI Twin',
    tag: 'BUILD 01',
    colSpan: 2,
    link: 'https://jatindavistwin.vercel.app/',
  },
  {
    id: 2,
    title: 'Website Hero',
    tag: 'BUILD 02',
    colSpan: 1,
    link: 'https://websitedesign-ten.vercel.app/',
  },
  {
    id: 3,
    title: 'AI UI',
    tag: 'BUILD 03',
    colSpan: 1,
    link: 'https://agenticui.netlify.app/',
  },
  {
    id: 4,
    title: 'Skills.md',
    tag: 'BUILD 04',
    colSpan: 2,
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
          <VisuallyHidden as="h2">My Builds</VisuallyHidden>
          <BentoGrid columns="repeat(3, 1fr)" className="builds-bento-grid">
            {BUILDS_DATA.map((build) => {
              const isInteractive = Boolean(build.link);
              const cardClassName = `builds-bento-item ds-col-span-${build.colSpan} ${isInteractive ? 'is-interactive' : ''} ${build.image ? 'has-image' : ''}`;

              const cardContent = (
                <>
                  {/* Background image if available */}
                  {build.image && (
                    <div className="build-image-bg" style={{ backgroundImage: getBuildBackgroundImage(build) }} />
                  )}

                  {/* Tag on bottom-left corner over imagery */}
                  <Tag variant="card" className="build-card-tag">{build.title}</Tag>

                  {/* Corner Button */}
                  <IconButton
                    as="span"
                    size="sm"
                    round
                    placement="corner"
                    className={isInteractive ? '' : 'placeholder-btn'}
                    aria-hidden="true"
                  >
                    <Icon icon={ArrowUpRight} size="sm" />
                  </IconButton>
                </>
              );

              return isInteractive ? (
                <Card
                  key={build.id}
                  as="a"
                  interactive
                  className={cardClassName}
                  href={build.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClickSound()}
                  aria-label={`${build.title} build (Opens in new tab)`}
                >
                  {cardContent}
                </Card>
              ) : (
                <Card key={build.id} className={cardClassName}>
                  {cardContent}
                </Card>
              );
            })}
          </BentoGrid>
        </div>
      </div>
    </div>
  );
}
