/**
 * MetaGrid — 2-column grid of label/value pairs.
 */
export function MetaGrid({ columns = 2, className, children, ...rest }) {
  const classes = ['ds-meta-grid', className].filter(Boolean).join(' ');
  return (
    <div
      className={classes}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * MetaItem — Single label/value pair within a MetaGrid.
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {string} props.value
 * @param {boolean} [props.fullWidth] - Span entire grid width
 * @param {string} [props.className]
 */
export function MetaItem({ label, value, fullWidth, className, ...rest }) {
  const classes = [
    'ds-meta-item',
    fullWidth && 'ds-meta-item--full',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...rest}>
      <span className="ds-meta-label">{label}</span>
      <span className="ds-meta-val">{value}</span>
    </div>
  );
}
