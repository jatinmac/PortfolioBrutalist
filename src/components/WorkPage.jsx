import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { playClickSound, playModalOpenSound, playModalCloseSound } from '../utils/sound';
import { PROJECTS } from '../data/projects';
import './WorkPage.css';

export default function WorkPage({ onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [motionDirection, setMotionDirection] = useState('next');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  const activeProject = PROJECTS[activeIndex];

  useEffect(() => {
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateTiltMode = () => setTiltEnabled(hoverQuery.matches);

    updateTiltMode();
    if (hoverQuery.addEventListener) {
      hoverQuery.addEventListener('change', updateTiltMode);
    } else {
      hoverQuery.addListener(updateTiltMode);
    }

    return () => {
      if (hoverQuery.removeEventListener) {
        hoverQuery.removeEventListener('change', updateTiltMode);
      } else {
        hoverQuery.removeListener(updateTiltMode);
      }
    };
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  // Focus trap, Escape key, and focus management for modal
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        playModalCloseSound();
        setIsModalOpen(false);
        return;
      }

      if (e.key === 'Tab') {
        const modal = modalRef.current;
        if (!modal) return;

        const focusableEls = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableEls.length === 0) return;

        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Focus the close button when modal opens
    const focusTimer = setTimeout(() => {
      modalRef.current?.querySelector('.modal-close-btn')?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(focusTimer);
      // Return focus to the element that opened the modal
      triggerRef.current?.focus();
    };
  }, [isModalOpen]);

  const handlePrev = () => {
    playClickSound();
    setMotionDirection('prev');
    setActiveIndex((prev) => (prev === 0 ? PROJECTS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    playClickSound();
    setMotionDirection('next');
    setActiveIndex((prev) => (prev === PROJECTS.length - 1 ? 0 : prev + 1));
  };

  const handleCloseModal = () => {
    playModalCloseSound();
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
      if (index !== activeIndex) {
        playClickSound();
        setMotionDirection(index > activeIndex ? 'next' : 'prev');
        setActiveIndex(index);
      }
    }
  };

  const handleCardPointerMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const pointerX = ((e.clientX - rect.left) / rect.width - 0.5).toFixed(3);
    const pointerY = ((e.clientY - rect.top) / rect.height - 0.5).toFixed(3);

    card.style.setProperty('--pointer-x', pointerX);
    card.style.setProperty('--pointer-y', pointerY);
  };

  const handleCardPointerLeave = (e) => {
    e.currentTarget.style.setProperty('--pointer-x', '0');
    e.currentTarget.style.setProperty('--pointer-y', '0');
  };

  return (
    <div className="work-page-container">
      <h2 className="sr-only">Selected Projects</h2>

      {/* Top Header Row with Navigation Buttons */}
      <div className="work-header">
        <div className="work-nav-buttons">
          <button
            className="nav-btn prev-btn"
            onClick={handlePrev}
            aria-label="Previous Project"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>
          <button
            className="nav-btn next-btn"
            onClick={handleNext}
            aria-label="Next Project"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Projects Accordion Grid */}
      <div className={`projects-grid motion-${motionDirection}`}>
        {PROJECTS.map((project, index) => {
          const isActive = index === activeIndex;
          const titleId = `project-title-${project.id}`;

          return (
            <div
              key={project.id}
              className={`project-card ${isActive ? 'is-expanded' : 'is-collapsed'}`}
              onClick={() => {
                if (!isActive) {
                  playClickSound();
                  setMotionDirection(index > activeIndex ? 'next' : 'prev');
                  setActiveIndex(index);
                }
              }}
              onPointerMove={tiltEnabled ? handleCardPointerMove : undefined}
              onPointerLeave={tiltEnabled ? handleCardPointerLeave : undefined}
              onKeyDown={!isActive ? (e) => handleCardKeyDown(e, index) : undefined}
              role={isActive ? 'group' : 'button'}
              tabIndex={isActive ? undefined : 0}
              aria-labelledby={isActive ? titleId : undefined}
              aria-label={!isActive ? `View ${project.title}` : undefined}
            >
              {isActive ? (
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
                    <button
                      className="nav-btn expand-corner-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerRef.current = e.currentTarget;
                        playModalOpenSound();
                        setIsModalOpen(true);
                      }}
                      aria-label={`Expand details for ${project.title}`}
                    >
                      <Maximize2 size={20} strokeWidth={2} />
                    </button>
                  </div>
                  {/* Project name */}
                  <div className="project-card-footer">
                    <h3 id={titleId} className="project-name-active">{project.title}</h3>
                    {project.subtitle && (
                      <p className="project-subtitle-active">{project.subtitle}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="collapsed-card-content">
                  <div
                    className="collapsed-sliver"
                    style={{ backgroundImage: `url(${project.image})` }}
                    role="img"
                    aria-label={`${project.title} thumbnail`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detailed Project Modal */}
      {isModalOpen && createPortal(
        <div
          className="modal-backdrop"
          onClick={handleCloseModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="modal-content glass-panel"
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
          >
            {/* Close Button */}
            <button
              className="modal-close-btn"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Modal Scrollable Wrapper */}
            <div className="modal-scroll-area">
              {/* Image box */}
              <div className="modal-image-box">
                <img
                  src={activeProject.image}
                  alt={`${activeProject.title} project image`}
                  className="modal-image"
                />
                <span className="modal-number-tag">{activeProject.number}</span>
              </div>

              {/* Sticky TL;DR Header */}
              <div className="modal-sticky-tldr-header">
                <div className="tldr-item">
                  <span className="tldr-label">Role</span>
                  <span className="tldr-val">{activeProject.role}</span>
                </div>
                <div className="tldr-item">
                  <span className="tldr-label">Timeline</span>
                  <span className="tldr-val">{activeProject.context.timeline || activeProject.year}</span>
                </div>
                <div className="tldr-item">
                  <span className="tldr-label">Team</span>
                  <span className="tldr-val">{activeProject.context.team}</span>
                </div>
                <div className="tldr-item">
                  <span className="tldr-label">Outcome</span>
                  <span className="tldr-val">{activeProject.metric || 'Shipped'}</span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                <div className="modal-title-row">
                  <h3 id="modal-title" className="modal-project-title">{activeProject.title}</h3>
                  {activeProject.isUnderDevelopment ? (
                    <div className="live-app-btn is-disabled">
                      <span>Under Development</span>
                    </div>
                  ) : activeProject.liveUrl ? (
                    <a
                      href={activeProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="live-app-btn"
                      onClick={() => playClickSound()}
                    >
                      <span>{activeProject.linkText || 'Visit Live App'}</span>
                    </a>
                  ) : null}
                </div>

                {/* The Hook */}
                <div className="modal-description-section">
                  <p>{activeProject.hook}</p>
                </div>

                <div className="modal-divider" />

                {/* Problems Section */}
                <div className="modal-description-section">
                  <h4>The Challenge</h4>
                  <p><strong>Business Problem:</strong> {activeProject.problems.business}</p>
                  <p><strong>User Problem:</strong> {activeProject.problems.user}</p>
                </div>

                <div className="modal-divider" />

                {/* Worked On Section */}
                <div className="modal-insights-section">
                  <h4>Worked On</h4>
                  <ul>
                    {activeProject.work.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="modal-divider" />

                {/* Process Section */}
                <div className="modal-description-section">
                  <h4>The Process</h4>
                  <p><strong>Research & Discovery:</strong> {activeProject.process.research}</p>
                  <p><strong>Ideation & Explorations:</strong> {activeProject.process.ideation}</p>
                  <p><strong>Decision & Trade-offs:</strong> {activeProject.process.tradeoff}</p>
                  <p><strong>Testing & Iteration:</strong> {activeProject.process.iteration}</p>
                </div>

                <div className="modal-divider" />

                {/* Impact Section */}
                <div className="modal-description-section">
                  <h4>Impact</h4>
                  <p><strong>Quantitative Impact:</strong> {activeProject.impact.quantitative}</p>
                  <p><strong>Qualitative Outcome:</strong> {activeProject.impact.qualitative}</p>
                </div>

                <div className="modal-divider" />

                {/* What Went Wrong Section */}
                <div className="modal-description-section">
                  <h4>What Went Wrong</h4>
                  <p>{activeProject.whatWentWrong.narrative}</p>
                </div>

                <div className="modal-divider" />

                {/* Case Study Footer CTA */}
                <div className="modal-case-study-footer">
                  <span>For more</span>
                  <button
                    className="live-app-btn-secondary"
                    onClick={handleNavigateToContact}
                  >
                    <span>Get in touch</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
