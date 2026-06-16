import { useState, useRef } from 'react';
import { Maximize2 } from 'lucide-react';
import { playClickSound, playModalOpenSound } from '../utils/sound';
import { PROJECTS } from '../data/projects';
import ProjectCarousel from './ProjectCarousel';
import { IconButton, Icon, Card, Tag, Modal, ImageBox, Button, MetaGrid, MetaItem, Divider, Section } from '../ds';
import './WorkPage.css';

const DOUBLE_AI_PITCH_DECK_IMAGES = [
  '/DoubleAipitchdeck/Double%20ai%201.webp',
  '/DoubleAipitchdeck/Double%20ai%202.webp',
  '/DoubleAipitchdeck/Double%20ai%203.webp',
  '/DoubleAipitchdeck/Double%20ai%204.webp',
  '/DoubleAipitchdeck/Double%20ai%205.webp',
  '/DoubleAipitchdeck/Double%20ai%206.webp',
  '/DoubleAipitchdeck/Double%20ai%207.webp',
  '/DoubleAipitchdeck/Double%20ai%208.webp',
  '/DoubleAipitchdeck/Double%20ai%209.webp',
  '/DoubleAipitchdeck/Double%20ai%2010.webp',
];

export default function WorkPage({ onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const triggerRef = useRef(null);

  const activeProject = PROJECTS[activeIndex];

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleNavigateToContact = () => {
    handleCloseModal();
    if (onNavigate) {
      onNavigate('Contact');
    }
  };

  const handleCardKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playClickSound();
      setActiveIndex(index);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="work-page-container">
      <h2 className="ds-sr-only">Selected Projects</h2>

      {/* Projects Grid */}
      <div className="projects-grid">
        {PROJECTS.map((project, index) => {
          const titleId = `project-title-${project.id}`;

          return (
            <Card
              key={project.id}
              className="project-card"
              interactive={true}
              onClick={() => {
                playClickSound();
                setActiveIndex(index);
                setIsModalOpen(true);
              }}
              onKeyDown={(e) => handleCardKeyDown(e, index)}
              role="button"
              tabIndex={0}
              aria-labelledby={titleId}
              aria-label={`View ${project.title} details`}
            >
              <div className="expanded-card-content" key={`expanded-${project.id}`}>
                {/* Image container */}
                <div className="project-image-container">
                  <div
                    className="project-image-black-box"
                    style={{ backgroundImage: `url(${project.image})` }}
                    role="img"
                    aria-label={`${project.title} project screenshot`}
                  />
                  {/* Expand/Modal trigger */}
                  <IconButton
                    size="overlay"
                    placement="corner"
                    className="expand-corner-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerRef.current = e.currentTarget;
                      playModalOpenSound();
                      setActiveIndex(index);
                      setIsModalOpen(true);
                    }}
                    aria-label={`Expand details for ${project.title}`}
                  >
                    <Icon icon={Maximize2} size="md" />
                  </IconButton>
                </div>
                {/* Project name */}
                <div className="project-card-footer">
                  <h3 id={titleId} className="project-name-active">{project.title}</h3>
                  {project.subtitle && (
                    <p className="project-subtitle-active">{project.subtitle}</p>
                  )}
                  {project.tags && (
                    <div className="project-card-tags">
                      {project.tags.map((tag) => (
                        <Tag key={tag} variant="card">{tag}</Tag>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detailed Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        ariaLabelledby="modal-title"
        triggerRef={triggerRef}
      >
        {/* Image box */}
        <ImageBox
          src={activeProject.image}
          alt={`${activeProject.title} project image`}
          overlay={<span className="modal-number-tag">{activeProject.number}</span>}
        />

        {/* Modal Body */}
        <div className="modal-body">
          <div className="modal-title-row">
            <h3 id="modal-title" className="modal-project-title">{activeProject.title}</h3>
            {activeProject.isUnderDevelopment ? (
              <Button variant="primary" as="span" disabled>
                Under Development
              </Button>
            ) : activeProject.liveUrl ? (
              <Button
                variant="primary"
                href={activeProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playClickSound()}
              >
                {activeProject.linkText || 'Visit Live App'}
              </Button>
            ) : null}
          </div>

          {activeProject.context && (
            <>
              <MetaGrid columns={2}>
                <MetaItem label="Company" value={activeProject.context.company} />
                <MetaItem label="Role" value={activeProject.context.role || activeProject.role} />
                <MetaItem label="Timeline" value={activeProject.context.timeline || activeProject.year} />
                <MetaItem label="Team" value={activeProject.context.team} />
                {activeProject.metric && (
                  <MetaItem label="Outcome" value={activeProject.metric} />
                )}
                {activeProject.context.constraints && (
                  <MetaItem label="Constraints" value={activeProject.context.constraints} fullWidth />
                )}
              </MetaGrid>
              <Divider />
            </>
          )}

          {/* The Hook */}
          <Section variant="description">
            <p>{activeProject.hook}</p>
          </Section>

          <Divider />

          {/* Project Overview */}
          <Section heading="Project Overview" variant="description">
            <p>{activeProject.description}</p>
            {activeProject.details && (
              <p className="ds-section__details">{activeProject.details}</p>
            )}
          </Section>

          {activeProject.id === 'double-ai' && (
            <>
              <Divider />
              <Section heading="Project Pitch Deck" variant="description">
                <ProjectCarousel images={DOUBLE_AI_PITCH_DECK_IMAGES} />
              </Section>
            </>
          )}

          <Divider />

          {/* Problems Section */}
          <Section heading="The Challenge" variant="description">
            <p><strong>Business Problem:</strong> {activeProject.problems.business}</p>
            <p><strong>User Problem:</strong> {activeProject.problems.user}</p>
          </Section>

          <Divider />

          {/* Worked On Section */}
          <Section heading="Worked On" variant="insights">
            <ul>
              {activeProject.work.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </Section>

          <Divider />

          {/* Process Section */}
          <Section heading="The Process" variant="description">
            <p><strong>Research & Discovery:</strong> {activeProject.process.research}</p>
            <p><strong>Ideation & Explorations:</strong> {activeProject.process.ideation}</p>
            <p><strong>Decision & Trade-offs:</strong> {activeProject.process.tradeoff}</p>
            <p><strong>Testing & Iteration:</strong> {activeProject.process.iteration}</p>
          </Section>

          <Divider />

          {/* Impact Section */}
          <Section heading="Impact" variant="description">
            <p><strong>Quantitative Impact:</strong> {activeProject.impact.quantitative}</p>
            <p><strong>Qualitative Outcome:</strong> {activeProject.impact.qualitative}</p>
          </Section>

          <Divider />

          {/* What Went Wrong Section */}
          <Section heading="What Went Wrong" variant="description">
            <p>{activeProject.whatWentWrong.narrative}</p>
          </Section>

          <Divider />

          {/* Case Study Footer CTA */}
          <div className="modal-case-study-footer">
            <span className="modal-case-study-footer__text">Want to know more?</span>
            <Button
              variant="ghost"
              onClick={handleNavigateToContact}
            >
              Get in touch
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
