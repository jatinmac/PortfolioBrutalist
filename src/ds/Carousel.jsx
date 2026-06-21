import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ControlButton from './ControlButton';

/**
 * Reusable Carousel Component for displaying images in a retro-brutalist slider.
 * Includes keyboard accessibility, focus rings, slide transition, and dots indicator.
 *
 * @param {Object} props
 * @param {string[]} props.images - Array of image URLs
 * @param {string} [props.ariaLabel] - Accessibility label
 */
export default function Carousel({ images, ariaLabel = 'Image carousel' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);

  const total = images.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx) => {
    setCurrentIndex(idx);
  };

  // Keyboard navigation when carousel is focused
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement !== containerRef.current) return;

      if (e.key === 'ArrowRight') {
        nextSlide();
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        e.preventDefault();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      if (container) {
        container.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [nextSlide, prevSlide]);


  if (!images || images.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="ds-carousel"
      tabIndex={0}
      role="region"
      aria-label={ariaLabel}
    >
      <div className="ds-carousel-viewport">
        <div
          className="ds-carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="ds-carousel-slide"
              aria-hidden={idx !== currentIndex}
            >
              <img
                src={img}
                alt={`${ariaLabel} - slide ${idx + 1}`}
                className="ds-carousel-img"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="ds-carousel-footer">
        <ControlButton
          onClick={prevSlide}
          aria-label="Previous slide"
          className="ds-carousel-nav-btn"
        >
          <ChevronLeft size={16} />
        </ControlButton>

        <div className="ds-carousel-dots" role="tablist" aria-label="Slides">
          {images.map((_, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={idx === currentIndex}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => goToSlide(idx)}
              className={`ds-carousel-dot ${idx === currentIndex ? 'is-active' : ''}`}
            />
          ))}
        </div>

        <ControlButton
          onClick={nextSlide}
          aria-label="Next slide"
          className="ds-carousel-nav-btn"
        >
          <ChevronRight size={16} />
        </ControlButton>
      </div>
    </div>
  );
}
