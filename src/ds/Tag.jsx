/**
 * Small uppercase label tag.
 *
 * @param {Object} props
 * @param {'card'|'label'} [props.variant='card'] - card=inline pill, label=absolute positioned
 * @param {string} [props.className]
 */
export default function Tag({ variant = 'card', className, children, ...rest }) {
  const classes = [
    'ds-tag',
    variant === 'label' && 'ds-tag--label',
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}
