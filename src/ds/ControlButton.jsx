/**
 * Footer control toggle button (theme, sound, font).
 *
 * @param {Object} props
 * @param {boolean} [props.isActive]
 * @param {boolean} [props.isDisabled]
 * @param {string} [props.className]
 */
export default function ControlButton({ isActive, isDisabled, className, children, ...rest }) {
  const classes = [
    'ds-control-btn',
    isActive && 'is-active',
    isDisabled && 'is-disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} disabled={isDisabled} {...rest}>
      {children}
    </button>
  );
}
