import { useRef } from 'react';
import { ProjectCard, Section, VideoTicker, HeroDotShader } from '../ds';
import { PROJECT_GROUPS } from '../data/siteContent';

export default function ProjectsSection({ type, onProjectClick }) {
  const group = PROJECT_GROUPS[type];
  const headingRef = useRef(null);

  if (!group) return null;

  return (
    <Section
      id={group.id}
      label={group.title}
      tone={group.tone}
      background={type === 'builds' ? <HeroDotShader headingRef={headingRef} /> : undefined}
    >
      <div className="section-heading">
        <h2 ref={type === 'builds' ? headingRef : undefined} className="ds-text--display section-title">
          {group.title}
        </h2>
      </div>

      <div className={`project-grid project-grid--${type}`}>
        {group.projects.map((project) => (
          <ProjectCard
            key={`${group.id}-${project.eyebrow}`}
            {...project}
            onClick={(e) => {
              if (!project.link) {
                e.preventDefault();
                onProjectClick?.(project);
              }
            }}
          />
        ))}
      </div>

      {type === 'builds' && <VideoTicker />}
    </Section>
  );
}
