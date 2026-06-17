import { Sun, Moon, AArrowUp, AArrowDown, RotateCcw } from 'lucide-react';
import Icon from './Icon';
import ControlButton from './ControlButton';

/**
 * Full footer with copyright + control groups (font, theme).
 */
export default function Footer({
  fontScale,
  fontScaleMin,
  fontScaleMax,
  fontScaleDefault,
  onFontDecrease,
  onFontIncrease,
  onFontReset,
  theme,
  onToggleTheme,
}) {
  return (
    <footer className="ds-footer" role="contentinfo">
      <div className="ds-footer-content">
        <span className="ds-footer-copyright">
          Copyright {new Date().getFullYear()} Jatin Davis. All rights reserved.
        </span>
        <div className="ds-footer-controls">
          {/* Font size controls */}
          <div className="ds-footer-control-group" role="group" aria-label="Font size controls">
            <ControlButton
              onClick={onFontDecrease}
              isDisabled={fontScale <= fontScaleMin}
              aria-label="Decrease font size"
              title="Decrease Font Size"
            >
              <Icon icon={AArrowDown} size="sm" />
            </ControlButton>
            <ControlButton
              onClick={onFontReset}
              isActive={fontScale === fontScaleDefault}
              aria-label={`Reset font size (currently ${fontScale}%)`}
              title="Reset Font Size"
            >
              <Icon icon={RotateCcw} size="sm" />
            </ControlButton>
            <ControlButton
              onClick={onFontIncrease}
              isDisabled={fontScale >= fontScaleMax}
              aria-label="Increase font size"
              title="Increase Font Size"
            >
              <Icon icon={AArrowUp} size="sm" />
            </ControlButton>
          </div>

          {/* Theme switcher */}
          <div className="ds-footer-control-group" role="group" aria-label="Theme switcher">
            <ControlButton
              onClick={() => onToggleTheme('light')}
              isActive={theme === 'light'}
              aria-label="Light Mode"
              title="Light Mode"
            >
              <Icon icon={Sun} size="sm" />
            </ControlButton>
            <ControlButton
              onClick={() => onToggleTheme('dark')}
              isActive={theme === 'dark'}
              aria-label="Dark Mode"
              title="Dark Mode"
            >
              <Icon icon={Moon} size="sm" />
            </ControlButton>
          </div>
        </div>
      </div>
    </footer>
  );
}
