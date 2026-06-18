import { useEffect, useRef, useState } from 'react';
import { Play, X } from 'lucide-react';
import { YOUTUBE_VIDEOS } from '../data/siteContent';
import ControlButton from './ControlButton';

export default function VideoTicker() {
  const [activeVideo, setActiveVideo] = useState(null);
  const modalRef = useRef(null);

  // Handle ESC key and focus trapping inside the video modal
  useEffect(() => {
    if (!activeVideo) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveVideo(null);
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;
        const focusableElements = modalRef.current.querySelectorAll(
          'button, iframe, [tabindex="0"]'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Lock body scrolling
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus close button inside modal
    if (modalRef.current) {
      const closeBtn = modalRef.current.querySelector('.video-modal__close');
      if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 50);
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [activeVideo]);

  if (!YOUTUBE_VIDEOS || YOUTUBE_VIDEOS.length === 0) return null;

  // Clone items to support seamless infinite loop scrolling (2x is enough for horizontal)
  const tickerItems = [...YOUTUBE_VIDEOS, ...YOUTUBE_VIDEOS];

  return (
    <div className="builds-youtube-layout">
      {/* Ticker Container - Full Width Horizontal */}
      <div className="builds-youtube-ticker-container">
        <div className="video-ticker-track">
          {tickerItems.map((video, idx) => (
            <div
              key={`ticker-${video.id}-${idx}`}
              className="video-ticker-card"
            >
              <div className="video-ticker-card__media">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&playsinline=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1&cc_load_policy=0&enablejsapi=1`}
                  title={video.title}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
                {/* Catch clicks to open modal */}
                <button
                  className="video-ticker-card__click-overlay"
                  onClick={() => setActiveVideo(video)}
                  aria-label={`Open video: ${video.title}`}
                >
                  <div className="video-ticker-card__hover-overlay">
                    <div className="video-ticker-card__play-btn">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Overlay */}
      {activeVideo && (
        <div
          className="video-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveVideo(null);
          }}
          role="presentation"
        >
          <div
            ref={modalRef}
            className="video-modal-container"
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
          >
            {/* Modal Header */}
            <div className="video-modal__header">
              <span id="video-modal-title" className="video-modal__title">
                {activeVideo.title}
              </span>
              <ControlButton
                onClick={() => setActiveVideo(null)}
                aria-label="Close video player"
                className="video-modal__close"
              >
                <X size={16} />
              </ControlButton>
            </div>

            {/* Modal Video Embed (Vertical 9:16) */}
            <div className="video-modal__body">
              <div className="video-modal__video-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                  title={activeVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
