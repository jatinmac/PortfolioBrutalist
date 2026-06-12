/**
 * Carousel dot pagination button.
 *
 * @param {Object} props
 * @param {boolean} props.isActive
 * @param {number} props.index
 * @param {string} [props.className]
 */
export default function DotButton({ isActive, index, className, ...rest }) {
  const classes = [
    'ds-dot-btn',
    isActive && 'is-active',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      aria-label={`Go to slide ${index + 1}`}
      aria-current={isActive ? 'true' : undefined}
      {...rest}
    />
  );
}
