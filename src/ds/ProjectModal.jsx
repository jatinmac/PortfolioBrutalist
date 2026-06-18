import { useEffect, useRef } from 'react';
import { X, ExternalLink, ArrowRight, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { PROJECT_GROUPS } from '../data/siteContent';
import Button from './Button';
import ControlButton from './ControlButton';

import doubleAiImg from '../images/Double AI.png';
import formula1Img from '../images/Formula 1 Youtube.png';
import marutiSuzukiImg from '../images/Maruti Suzuki.png';
import quiloAiImg from '../images/Quilo AI.png';
import u3kImg from '../images/U3K.png';

const IMAGE_MAP = {
  'double-ai': doubleAiImg,
  'quilo': quiloAiImg,
  'maruti-suzuki-smartplay': marutiSuzukiImg,
  'formula-1-design': formula1Img,
  'u3k-instrument-cluster': u3kImg,
};

/**
 * ProjectModal handles rendering detailed information about work projects in a retro-brutalist overlay.
 * Supports scroll locking, focus trapping, ESC key close, and keyboard accessibility.
 */
export default function ProjectModal({ project, cardImage, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex="0"]'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: if on first element, wrap to last
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          // Tab: if on last element, wrap to first
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Save current active element to restore later
    const previousActiveElement = document.activeElement;

    // Lock body scrolling
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Auto-focus on first focusable element inside the modal
    if (modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex="0"]'
      );
      if (focusable.length > 0) {
        setTimeout(() => focusable[0].focus(), 50);
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalStyle;
      if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
        previousActiveElement.focus();
      }
    };
  }, [project, onClose]);

  if (!project) return null;

  // Resolve card image directly from siteContent using project.id to ensure fallback stability
  const workProjects = PROJECT_GROUPS?.work?.projects || [];
  const matchingCard = workProjects.find((p) => p.id === project.id);
  const displayImage = IMAGE_MAP[project.id] || cardImage || matchingCard?.image || project.image;

  return (
    <div
      className="ds-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="ds-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-subtitle"
      >
        {/* Modal Header */}
        <header className="ds-modal-header">
          <div className="ds-modal-header-title-area">
            <span className="ds-modal-number">{project.number}</span>
            <h2 id="modal-title" className="ds-modal-title">
              {project.title}
            </h2>
          </div>
          <ControlButton
            onClick={onClose}
            aria-label="Close project modal"
            className="ds-modal-close-btn"
          >
            <X size={16} />
          </ControlButton>
        </header>

        {/* Modal Scrollable Content */}
        <div className="ds-modal-body">
          {/* Hero Banner */}
          {displayImage && (
            <div className="ds-modal-hero">
              <img src={displayImage} alt={project.title} loading="lazy" />
            </div>
          )}

          {/* Tagline / Subtitle */}
          <p id="modal-subtitle" className="ds-modal-subtitle">
            {project.subtitle}
          </p>

          {/* Quick Context & Tags */}
          <div className="ds-modal-tags-container">
            {project.tags?.map((tag) => (
              <span key={tag} className="ds-modal-tag">
                {tag}
              </span>
            ))}
            {project.isUnderDevelopment && (
              <span className="ds-modal-tag ds-modal-tag--development">
                Under Development
              </span>
            )}
          </div>

          {/* Hook Callout */}
          {project.hook && (
            <div className="ds-modal-hook">
              <Lightbulb className="ds-modal-hook-icon" size={18} />
              <p>{project.hook}</p>
            </div>
          )}

          {/* Detailed Context Bento */}
          <section className="ds-modal-section">
            <h3 className="ds-modal-section-title">Context & Setup</h3>
            <div className="ds-modal-meta-grid">
              {project.context?.company && (
                <div className="ds-modal-meta-item">
                  <span className="ds-modal-meta-label">Company</span>
                  <span className="ds-modal-meta-value">{project.context.company}</span>
                </div>
              )}
              {project.role && (
                <div className="ds-modal-meta-item">
                  <span className="ds-modal-meta-label">Role</span>
                  <span className="ds-modal-meta-value">{project.role}</span>
                </div>
              )}
              {project.context?.timeline && (
                <div className="ds-modal-meta-item">
                  <span className="ds-modal-meta-label">Timeline</span>
                  <span className="ds-modal-meta-value">{project.context.timeline}</span>
                </div>
              )}
              {project.context?.team && (
                <div className="ds-modal-meta-item">
                  <span className="ds-modal-meta-label">Team Size</span>
                  <span className="ds-modal-meta-value">{project.context.team}</span>
                </div>
              )}
              {project.tools && (
                <div className="ds-modal-meta-item ds-modal-meta-item--full">
                  <span className="ds-modal-meta-label">Tools & Tech</span>
                  <span className="ds-modal-meta-value">{project.tools}</span>
                </div>
              )}
              {project.context?.constraints && (
                <div className="ds-modal-meta-item ds-modal-meta-item--full">
                  <span className="ds-modal-meta-label">Key Constraints</span>
                  <span className="ds-modal-meta-value">{project.context.constraints}</span>
                </div>
              )}
            </div>
          </section>

          {/* Core Problem Narrative */}
          <section className="ds-modal-section">
            <h3 className="ds-modal-section-title">The Challenge</h3>
            <p className="ds-modal-desc">{project.description}</p>
            {project.details && <p className="ds-modal-desc">{project.details}</p>}

            {(project.problems?.business || project.problems?.user) && (
              <div className="ds-modal-split-grid">
                {project.problems?.business && (
                  <div className="ds-modal-split-item">
                    <h4>Business Problem</h4>
                    <p>{project.problems.business}</p>
                  </div>
                )}
                {project.problems?.user && (
                  <div className="ds-modal-split-item">
                    <h4>User Problem</h4>
                    <p>{project.problems.user}</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Process Timeline */}
          {project.process && (
            <section className="ds-modal-section">
              <h3 className="ds-modal-section-title">Process & Strategy</h3>
              <div className="ds-modal-process-list">
                {project.process.research && (
                  <div className="ds-modal-process-step">
                    <div className="ds-modal-process-num">01</div>
                    <div className="ds-modal-process-content">
                      <h4>Research & Benchmarking</h4>
                      <p>{project.process.research}</p>
                    </div>
                  </div>
                )}
                {project.process.ideation && (
                  <div className="ds-modal-process-step">
                    <div className="ds-modal-process-num">02</div>
                    <div className="ds-modal-process-content">
                      <h4>Ideation & Flow Design</h4>
                      <p>{project.process.ideation}</p>
                    </div>
                  </div>
                )}
                {project.process.tradeoff && (
                  <div className="ds-modal-process-step">
                    <div className="ds-modal-process-num">03</div>
                    <div className="ds-modal-process-content">
                      <h4>Trade-offs & Priorities</h4>
                      <p>{project.process.tradeoff}</p>
                    </div>
                  </div>
                )}
                {project.process.iteration && (
                  <div className="ds-modal-process-step">
                    <div className="ds-modal-process-num">04</div>
                    <div className="ds-modal-process-content">
                      <h4>Iterations & Feedback Loop</h4>
                      <p>{project.process.iteration}</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* What Went Wrong Panel */}
          {project.whatWentWrong?.narrative && (
            <section className="ds-modal-section">
              <div className="ds-modal-wrong-panel">
                <div className="ds-modal-wrong-header">
                  <AlertTriangle className="ds-modal-wrong-icon" size={18} />
                  <h4>What Went Wrong & Pivots</h4>
                </div>
                <p>{project.whatWentWrong.narrative}</p>
              </div>
            </section>
          )}

          {/* Quantitative & Qualitative Impact */}
          {project.impact && (
            <section className="ds-modal-section">
              <h3 className="ds-modal-section-title">Results & Impact</h3>
              <div className="ds-modal-split-grid">
                {project.impact.quantitative && (
                  <div className="ds-modal-split-item ds-modal-split-item--impact">
                    <h4>Quantitative Results</h4>
                    <p>{project.impact.quantitative}</p>
                  </div>
                )}
                {project.impact.qualitative && (
                  <div className="ds-modal-split-item ds-modal-split-item--impact">
                    <h4>Qualitative Impact</h4>
                    <p>{project.impact.qualitative}</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Work Done Bullets */}
          {project.work && project.work.length > 0 && (
            <section className="ds-modal-section">
              <h3 className="ds-modal-section-title">Key Work & Responsibilities</h3>
              <ul className="ds-modal-work-list">
                {project.work.map((item, idx) => (
                  <li key={idx} className="ds-modal-work-item">
                    <CheckCircle className="ds-modal-work-icon" size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Modal Footer Actions */}
        <footer className="ds-modal-footer">
          {project.liveUrl ? (
            <Button
              variant="accent"
              href={project.liveUrl}
              external
              className="ds-modal-cta"
            >
              <span>{project.linkText || 'View Live'}</span>
              <ExternalLink size={14} style={{ marginLeft: '6px' }} />
            </Button>
          ) : (
            <div className="ds-modal-nda-notice">
              <span>Internal / NDA Protected Program</span>
            </div>
          )}
          <Button variant="ghost" onClick={onClose} className="ds-modal-close-footer-btn">
            Close
          </Button>
        </footer>
      </div>
    </div>
  );
}
