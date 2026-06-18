/**
 * Full-width page section with a constrained content column.
 */
export default function Section({ id, label, tone = 'default', className, children, background, ...rest }) {
  const classes = ['ds-section', `ds-section--${tone}`, className].filter(Boolean).join(' ');

  return (
    <section id={id} className={classes} aria-label={label} {...rest}>
      {background}
      <div className="ds-section__inner">{children}</div>
    </section>
  );
}
