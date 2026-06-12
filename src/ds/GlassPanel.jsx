/**
 * Glass panel surface with backdrop-filter.
 */
export default function GlassPanel({ className, children, ...rest }) {
  const classes = ['ds-glass-panel', className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
