import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { playClickSound } from '../utils/sound';
import './ProjectCarousel.css';

export default function ProjectCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartRef = useRef(null);
  const touchEndRef = useRef(null);

  const minSwipeDistance = 50;

  const handlePrev = () => {
    playClickSound();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    playClickSound();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index) => {
    if (index === currentIndex) return;
    playClickSound();
    setCurrentIndex(index);
  };

  const onTouchStart = (e) => {
    touchEndRef.current = null;
    touchStartRef.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndRef.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    const touchStart = touchStartRef.current;
    const touchEnd = touchEndRef.current;
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
    touchStartRef.current = null;
    touchEndRef.current = null;
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="project-carousel-container">
      <div 
        className="project-carousel-window"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div 
          className="project-carousel-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <div key={index} className="project-carousel-slide">
              <img 
                src={src} 
                alt={`Pitch Deck Slide ${index + 1}`} 
                className="project-carousel-image"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={index === currentIndex ? "high" : "low"}
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="project-carousel-controls">
        <button 
          className="carousel-nav-btn prev-btn" 
          onClick={handlePrev}
          aria-label="Previous slide"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>
        
        <div className="carousel-dots-container" role="tablist" aria-label="Slideshow indicators">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot-btn ${index === currentIndex ? 'is-active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
              role="tab"
              aria-selected={index === currentIndex ? 'true' : 'false'}
              tabIndex={0}
            />
          ))}
        </div>
        
        <button 
          className="carousel-nav-btn next-btn" 
          onClick={handleNext}
          aria-label="Next slide"
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
