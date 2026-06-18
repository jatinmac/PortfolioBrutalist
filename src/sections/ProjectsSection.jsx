import { ProjectCard, Section, VideoTicker } from '../ds';
import { PROJECT_GROUPS } from '../data/siteContent';

export default function ProjectsSection({ type, onProjectClick }) {
  const group = PROJECT_GROUPS[type];

  if (!group) return null;

  return (
    <Section id={group.id} label={group.title} tone={group.tone}>
      <div className="section-heading">
        <h2 className="ds-text--display section-title">{group.title}</h2>
      </div>

      <div className="project-grid">
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
