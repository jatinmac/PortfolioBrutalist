import { Sun, Moon, Volume2, VolumeX, AArrowUp, AArrowDown, RotateCcw } from 'lucide-react';

export default function AppFooter({
  fontScale,
  fontScaleMin,
  fontScaleMax,
  fontScaleDefault,
  onFontDecrease,
  onFontIncrease,
  onFontReset,
  soundEnabled,
  onToggleSound,
  theme,
  onToggleTheme,
}) {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-content">
        <span className="footer-copyright">
          &copy; {new Date().getFullYear()} Jatin Davis &bull;
        </span>
        <div className="footer-controls">
          <div className="font-size-controls" role="group" aria-label="Font size controls">
            <button
              onClick={onFontDecrease}
              className={`theme-btn ${fontScale <= fontScaleMin ? 'is-disabled' : ''}`}
              aria-label="Decrease font size"
              disabled={fontScale <= fontScaleMin}
            >
              <AArrowDown size={14} strokeWidth={2.5} />
            </button>
            <button
              onClick={onFontReset}
              className={`theme-btn ${fontScale === fontScaleDefault ? 'is-active' : ''}`}
              aria-label={`Reset font size (currently ${fontScale}%)`}
              title={`${fontScale}%`}
            >
              <RotateCcw size={12} strokeWidth={2.5} />
            </button>
            <button
              onClick={onFontIncrease}
              className={`theme-btn ${fontScale >= fontScaleMax ? 'is-disabled' : ''}`}
              aria-label="Increase font size"
              disabled={fontScale >= fontScaleMax}
            >
              <AArrowUp size={14} strokeWidth={2.5} />
            </button>
          </div>
          <div className="sound-toggle">
            <button
              onClick={onToggleSound}
              className={`theme-btn ${soundEnabled ? 'is-active' : ''}`}
              aria-label={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {soundEnabled ? (
                <Volume2 size={14} strokeWidth={2.5} />
              ) : (
                <VolumeX size={14} strokeWidth={2.5} />
              )}
            </button>
          </div>
          <div className="theme-switcher">
            <button
              onClick={(e) => onToggleTheme(e, 'light')}
              className={`theme-btn ${theme === 'light' ? 'is-active' : ''}`}
              aria-label="Light Mode"
            >
              <Sun size={14} strokeWidth={2.5} />
            </button>
            <button
              onClick={(e) => onToggleTheme(e, 'dark')}
              className={`theme-btn ${theme === 'dark' ? 'is-active' : ''}`}
              aria-label="Dark Mode"
            >
              <Moon size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
