/**
 * Themed horizontal rule divider.
 */
export default function Divider({ className, ...rest }) {
  const classes = ['ds-divider', className].filter(Boolean).join(' ');
  return <div className={classes} role="separator" {...rest} />;
}
