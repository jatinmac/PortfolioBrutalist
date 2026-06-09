import { Home, User, Briefcase, Cpu, Mail } from 'lucide-react';

const TAB_ICONS = {
  Home,
  About: User,
  Work: Briefcase,
  Builds: Cpu,
  Contact: Mail,
};

const renderPreviewIcon = (tabName) => {
  const IconComponent = TAB_ICONS[tabName];
  if (!IconComponent) return null;

  return (
    <div className="carousel-preview-icon-container" aria-hidden="true">
      <IconComponent className="carousel-preview-icon" size={24} strokeWidth={1.5} />
    </div>
  );
};

export default function DesktopPreviewCarousel({
  isDesktop,
  prevTab,
  leftTab,
  rightTab,
  flyingPreview,
  previewTransition,
  displayTab,
  introCompleted,
  onPreviewClick,
}) {
  if (!isDesktop) return null;

  return (
    <>
      {!prevTab && leftTab && rightTab && (
        <>
          <div
            key={`left-${leftTab}`}
            className={`carousel-preview carousel-preview-left tab-${leftTab.toLowerCase()}${flyingPreview?.side === 'left' ? ' carousel-fly-source' : ''}${previewTransition === 'right' ? ' carousel-fly-fade' : ''}`}
            onClick={() => onPreviewClick('left', leftTab)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onPreviewClick('left', leftTab);
              }
            }}
            role="button"
            tabIndex={previewTransition || flyingPreview ? -1 : 0}
            aria-label={`Preview ${leftTab} page`}
            style={{
              animationDelay: previewTransition ? '0s' : (displayTab === 'Home' && !introCompleted ? '3.5s' : '0.1s'),
            }}
          >
            {renderPreviewIcon(leftTab)}
            <div className="carousel-preview-overlay" aria-hidden="true">
              <span className="carousel-preview-label">{leftTab}</span>
            </div>
          </div>
          <div
            key={`right-${rightTab}`}
            className={`carousel-preview carousel-preview-right tab-${rightTab.toLowerCase()}${flyingPreview?.side === 'right' ? ' carousel-fly-source' : ''}${previewTransition === 'left' ? ' carousel-fly-fade' : ''}`}
            onClick={() => onPreviewClick('right', rightTab)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onPreviewClick('right', rightTab);
              }
            }}
            role="button"
            tabIndex={previewTransition || flyingPreview ? -1 : 0}
            aria-label={`Preview ${rightTab} page`}
            style={{
              animationDelay: previewTransition ? '0s' : (displayTab === 'Home' && !introCompleted ? '3.8s' : '0.2s'),
            }}
          >
            {renderPreviewIcon(rightTab)}
            <div className="carousel-preview-overlay" aria-hidden="true">
              <span className="carousel-preview-label">{rightTab}</span>
            </div>
          </div>
        </>
      )}
      {flyingPreview && (
        <div
          key={`flying-${flyingPreview.tabName}`}
          className={`carousel-preview carousel-preview-${flyingPreview.side} carousel-fly-active tab-${flyingPreview.tabName.toLowerCase()}`}
          aria-hidden="true"
          style={{ animationDelay: '0s' }}
        >
          {renderPreviewIcon(flyingPreview.tabName)}
          <div className="carousel-preview-overlay">
            <span className="carousel-preview-label">{flyingPreview.tabName}</span>
          </div>
        </div>
      )}
    </>
  );
}
