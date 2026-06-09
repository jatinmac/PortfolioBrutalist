import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Play, X } from 'lucide-react';
import { playClickSound, playModalOpenSound, playModalCloseSound } from '../utils/sound';
import './bento.css';
import './BuildsPage.css';

const BUILDS_DATA = [
  {
    id: 1,
    title: 'My AI Twin',
    tag: 'BUILD 01',
    colSpan: 'col-span-2',
    link: 'https://jatindavistwin.vercel.app/',
    image: '/aitwin.webp',
  },
  {
    id: 2,
    title: 'Website Hero',
    tag: 'BUILD 02',
    colSpan: 'col-span-1',
    link: 'https://websitedesign-ten.vercel.app/',
    image: '/aiwebsite.webp',
  },
  {
    id: 3,
    title: 'AI UI',
    tag: 'BUILD 03',
    colSpan: 'col-span-1',
    link: 'https://agenticui.netlify.app/',
  },
  {
    id: 4,
    title: 'Skills.md',
    tag: 'BUILD 04',
    colSpan: 'col-span-1',
    link: 'https://aiskillsmd.netlify.app/',
  },
];

const TICKER_VIDEOS = [
  {
    id: 1,
    videoId: 'Q40UL5DsQ2Q',
    title: 'Coinbase Wallet Onboarding',
    tag: 'Short',
    isShort: true,
  },
  {
    id: 2,
    videoId: 'ncKi6JwKYfo',
    title: 'Twitter Like Interaction',
    tag: 'UI Motion',
    isShort: false,
  },
  {
    id: 3,
    videoId: 'vJk7V_fACQM',
    title: 'GPay Interaction Design',
    tag: 'UX Design',
    isShort: false,
  },
  {
    id: 4,
    videoId: 'JZ1oQVoP3F0',
    title: 'Airbnb iOS Homepage',
    tag: 'iOS Prototype',
    isShort: false,
  },
  {
    id: 5,
    videoId: 'UhJhaOph0y4',
    title: 'GPay Rewards UI',
    tag: 'Short',
    isShort: true,
  },
  {
    id: 6,
    videoId: 'P8ineV8FnGs',
    title: 'Coinbase Wallet iOS',
    tag: 'High-Fidelity',
    isShort: false,
  },
  {
    id: 7,
    videoId: 'WWZzCqce5yI',
    title: 'Spotify iOS Homepage',
    tag: 'iOS Prototype',
    isShort: false,
  },
  {
    id: 8,
    videoId: 'FGRbglVqUfo',
    title: 'Figma Variables Prototype',
    tag: 'Figma Dev',
    isShort: false,
  },
  {
    id: 9,
    videoId: 'CQaTDPNtn7U',
    title: 'Navi Payments App',
    tag: 'Onboarding',
    isShort: false,
  },
  {
    id: 10,
    videoId: 'LZ9FrISExNc',
    title: 'Virtual Dress Try-On',
    tag: 'Showcase',
    isShort: false,
  },
];

const getBuildBackgroundImage = (build) => {
  if (!build.imageWebp) {
    return `url(${build.image})`;
  }

  return `image-set(url("${build.imageWebp}") type("image/webp"), url("${build.image}") type("image/png"))`;
};

export default function BuildsPage() {
  const [activeVideo, setActiveVideo] = useState(null);
  const videoModalRef = useRef(null);
  const videoTriggerRef = useRef(null);

  const handleItemClick = (build) => {
    playClickSound();
    if (build.link) {
      window.open(build.link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleKeyDown = (e, build) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      playClickSound();
      if (build.link) {
        window.open(build.link, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleVideoClick = (e, video) => {
    videoTriggerRef.current = e.currentTarget;
    playModalOpenSound();
    setActiveVideo(video);
  };

  const handleVideoKeyDown = (e, video) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      videoTriggerRef.current = e.currentTarget;
      playModalOpenSound();
      setActiveVideo(video);
    }
  };

  const handleCloseVideoModal = () => {
    playModalCloseSound();
    setActiveVideo(null);
  };

  // Lock body scroll when video modal is open
  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeVideo]);

  // Focus trap, Escape key, and focus management for video modal
  useEffect(() => {
    if (!activeVideo) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        playModalCloseSound();
        setActiveVideo(null);
        return;
      }

      if (e.key === 'Tab') {
        const modal = videoModalRef.current;
        if (!modal) return;

        const focusableEls = modal.querySelectorAll(
          'button, [href], input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])'
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
      videoModalRef.current?.querySelector('.modal-close-btn')?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(focusTimer);
      // Return focus to the element that opened the modal
      videoTriggerRef.current?.focus();
    };
  }, [activeVideo]);

  return (
    <div className="builds-page-wrapper">
      <div className="builds-bento-wrapper">
        <div className="builds-bento-container">
          <h2 className="sr-only">My Builds</h2>
          <div className="builds-bento-grid">
            {BUILDS_DATA.map((build) => {
              const isInteractive = !!build.link;

              return (
                <div
                  key={build.id}
                  className={`builds-bento-item ${build.colSpan} ${isInteractive ? 'is-interactive' : ''} ${build.image ? 'has-image' : ''}`}
                  onClick={() => handleItemClick(build)}
                  onKeyDown={(e) => handleKeyDown(e, build)}
                  tabIndex={0}
                  role="button"
                  aria-label={isInteractive ? `${build.title} build (Opens in new tab)` : `${build.title}`}
                >
                  {/* Background image if available */}
                  {build.image && (
                    <div className="build-image-bg" style={{ backgroundImage: getBuildBackgroundImage(build) }} />
                  )}

                  {/* Tag on Bottom Left Corner (styled like project card tag) */}
                  <span className="project-card-tag">{build.title}</span>

                  {/* Corner Button */}
                  {isInteractive ? (
                    <a
                      href={build.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="corner-link-btn"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent duplicate navigation trigger from card click
                        playClickSound();
                      }}
                      aria-label={`Open ${build.title} build in a new tab`}
                    >
                      <ArrowUpRight size={14} />
                    </a>
                  ) : (
                    <div className="corner-link-btn placeholder-btn" aria-hidden="true">
                      <ArrowUpRight size={14} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ticker Section */}
      <div className="builds-ticker-section">
        <div className="builds-ticker-header">
          <h3 className="ticker-heading">Interactions and Prototypes</h3>
        </div>

        <div className="builds-ticker-container">
          <div className="builds-ticker-track">
            {/* Group 1 */}
            <div className="builds-ticker-group">
              {TICKER_VIDEOS.map((video) => (
                <div
                  key={`group1-${video.id}`}
                  className="ticker-card is-interactive"
                  onClick={(e) => handleVideoClick(e, video)}
                  onKeyDown={(e) => handleVideoKeyDown(e, video)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Play ${video.title} video`}
                >
                  <div
                    className="ticker-card-image-bg"
                    style={{
                      backgroundImage: `url(https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg)`,
                    }}
                  />
                  <div className="ticker-card-overlay" />
                  <span className="project-card-tag">{video.title}</span>
                  <div className="corner-link-btn play-btn" aria-hidden="true">
                    <Play size={10} fill="currentColor" />
                  </div>
                </div>
              ))}
            </div>
            {/* Group 2 (Duplicate for infinite seamless scroll) */}
            <div className="builds-ticker-group" aria-hidden="true">
              {TICKER_VIDEOS.map((video) => (
                <div
                  key={`group2-${video.id}`}
                  className="ticker-card is-interactive"
                  onClick={(e) => handleVideoClick(e, video)}
                  onKeyDown={(e) => handleVideoKeyDown(e, video)}
                  tabIndex={-1} // De-focus duplicated list for keyboard accessibility
                  role="button"
                >
                  <div
                    className="ticker-card-image-bg"
                    style={{
                      backgroundImage: `url(https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg)`,
                    }}
                  />
                  <div className="ticker-card-overlay" />
                  <span className="project-card-tag">{video.title}</span>
                  <div className="corner-link-btn play-btn" aria-hidden="true">
                    <Play size={10} fill="currentColor" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {activeVideo && createPortal(
        <div
          className="video-modal-backdrop"
          onClick={handleCloseVideoModal}
          role="dialog"
          aria-modal="true"
          aria-label={`Playing video: ${activeVideo.title}`}
        >
          <div
            className={`video-modal-content glass-panel ${activeVideo.isShort ? 'is-short' : 'is-regular'}`}
            onClick={(e) => e.stopPropagation()}
            ref={videoModalRef}
          >
            {/* Close Button */}
            <button
              className="modal-close-btn"
              onClick={handleCloseVideoModal}
              aria-label="Close video player"
            >
              <X size={18} strokeWidth={2.5} />
            </button>

            {/* Video Container */}
            <div className="video-player-container">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&rel=0`}
                title={`YouTube video player: ${activeVideo.title}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="video-player-iframe"
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
