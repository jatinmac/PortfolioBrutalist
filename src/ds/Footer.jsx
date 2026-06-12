import { Sun, Moon, Volume2, VolumeX, AArrowUp, AArrowDown, RotateCcw } from 'lucide-react';
import Icon from './Icon';
import ControlButton from './ControlButton';

/**
 * Full footer with copyright + control groups (font, sound, theme).
 */
export default function Footer({
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
    <footer className="ds-footer" role="contentinfo">
      <div className="ds-footer-content">
        <span className="ds-footer-copyright">
          &copy; {new Date().getFullYear()} Jatin Davis &bull;
        </span>
        <div className="ds-footer-controls">
          {/* Font size controls */}
          <div className="ds-footer-control-group" role="group" aria-label="Font size controls">
            <ControlButton
              onClick={onFontDecrease}
              isDisabled={fontScale <= fontScaleMin}
              aria-label="Decrease font size"
            >
              <Icon icon={AArrowDown} size="sm" />
            </ControlButton>
            <ControlButton
              onClick={onFontReset}
              isActive={fontScale === fontScaleDefault}
              aria-label={`Reset font size (currently ${fontScale}%)`}
              title={`${fontScale}%`}
            >
              <RotateCcw size={12} strokeWidth={2.5} />
            </ControlButton>
            <ControlButton
              onClick={onFontIncrease}
              isDisabled={fontScale >= fontScaleMax}
              aria-label="Increase font size"
            >
              <Icon icon={AArrowUp} size="sm" />
            </ControlButton>
          </div>

          {/* Sound toggle */}
          <div className="ds-footer-control-group">
            <ControlButton
              onClick={onToggleSound}
              isActive={soundEnabled}
              aria-label={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            >
              {soundEnabled ? (
                <Icon icon={Volume2} size="sm" />
              ) : (
                <Icon icon={VolumeX} size="sm" />
              )}
            </ControlButton>
          </div>

          {/* Theme switcher */}
          <div className="ds-footer-control-group">
            <ControlButton
              onClick={() => onToggleTheme('light')}
              isActive={theme === 'light'}
              aria-label="Light Mode"
            >
              <Icon icon={Sun} size="sm" />
            </ControlButton>
            <ControlButton
              onClick={() => onToggleTheme('dark')}
              isActive={theme === 'dark'}
              aria-label="Dark Mode"
            >
              <Icon icon={Moon} size="sm" />
            </ControlButton>
          </div>
        </div>
      </div>
    </footer>
  );
}
