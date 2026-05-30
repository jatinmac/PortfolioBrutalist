import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { playClickSound, playModalOpenSound, playModalCloseSound } from '../utils/sound';
import { PROJECTS } from '../data/projects';
import './WorkPage.css';

export default function WorkPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  const activeProject = PROJECTS[activeIndex];

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
    setActiveIndex((prev) => (prev === 0 ? PROJECTS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    playClickSound();
    setActiveIndex((prev) => (prev === PROJECTS.length - 1 ? 0 : prev + 1));
  };

  const handleCloseModal = () => {
    playModalCloseSound();
    setIsModalOpen(false);
  };

  const handleCardKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (index !== activeIndex) {
        playClickSound();
        setActiveIndex(index);
      }
    }
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
      <div className="projects-grid">
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
                  setActiveIndex(index);
                }
              }}
              onKeyDown={!isActive ? (e) => handleCardKeyDown(e, index) : undefined}
              role={isActive ? 'group' : 'button'}
              tabIndex={isActive ? undefined : 0}
              aria-labelledby={isActive ? titleId : undefined}
              aria-label={!isActive ? `View ${project.title}` : undefined}
            >
              {isActive ? (
                <div className="expanded-card-content">
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
              <div
                className="modal-image-box"
                style={{ backgroundImage: `url(${activeProject.image})` }}
                role="img"
                aria-label={`${activeProject.title} project image`}
              >
                <span className="modal-number-tag">{activeProject.number}</span>
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

                {/* Project Metadata Grid */}
                <div className="modal-meta-grid">
                  <div className="meta-item">
                    <span className="meta-label">Role</span>
                    <span className="meta-val">{activeProject.role}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Year</span>
                    <span className="meta-val">{activeProject.year}</span>
                  </div>
                  <div className="meta-item col-span-full">
                    <span className="meta-label">Tools & Stack</span>
                    <span className="meta-val">{activeProject.tools}</span>
                  </div>
                </div>

                <div className="modal-divider" />

                {/* Project Description */}
                <div className="modal-description-section">
                  <h4>Overview</h4>
                  <p>{activeProject.description}</p>
                  <p className="modal-body-details">{activeProject.details}</p>
                </div>

                {/* Work Done */}
                <div className="modal-insights-section">
                  <h4>Work</h4>
                  <ul>
                    {activeProject.work.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
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
