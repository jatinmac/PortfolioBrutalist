/**
 * Content section wrapper with heading + body content.
 *
 * @param {Object} props
 * @param {'description'|'insights'} [props.variant='description']
 * @param {string} [props.heading] - Section heading text
 * @param {string} [props.className]
 */
export default function Section({ variant = 'description', heading, className, children, ...rest }) {
  const classes = [
    'ds-section',
    `ds-section--${variant}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...rest}>
      {heading && <h4>{heading}</h4>}
      {children}
    </div>
  );
}
