import { ArrowUpRight } from 'lucide-react';

/**
 * Interactive square card for project and build previews.
 */
export default function ProjectCard({ eyebrow, title, description, status, image, link, onClick }) {
  const handleClick = (e) => {
    onClick?.(e);
  };

  const cardClassName = `ds-project-card ${image ? 'ds-project-card--has-image' : ''}`;

  const innerContent = (
    <>
      {image && (
        <span className="ds-project-card__image-container">
          <img src={image} alt={title} className="ds-project-card__image" loading="lazy" />
          <span className="ds-project-card__image-overlay" />
        </span>
      )}
      <span className="ds-project-card__header">
        <span className="ds-project-card__eyebrow">{eyebrow}</span>
        <ArrowUpRight className="ds-project-card__icon" size={16} aria-hidden="true" />
      </span>

      <span className="ds-project-card__content">
        <span className="ds-project-card__title">{title}</span>
        <span className="ds-project-card__description">{description}</span>
      </span>
    </>
  );

  if (link) {
    return (
      <a
        href={link}
        className={cardClassName}
        onClick={handleClick}
        title={status}
        target="_blank"
        rel="noopener noreferrer"
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={cardClassName}
      onClick={handleClick}
      title={status}
    >
      {innerContent}
    </button>
  );
}
