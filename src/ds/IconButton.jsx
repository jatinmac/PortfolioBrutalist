import { forwardRef } from 'react';

/**
 * Square or round icon button.
 *
 * @param {Object} props
 * @param {'md'|'sm'|'overlay'} [props.size='md']
 * @param {boolean} [props.round]
 * @param {'button'|'a'|'span'} [props.as='button']
 * @param {'corner'} [props.placement]
 * @param {string} [props.className]
 */
const IconButton = forwardRef(function IconButton(props, ref) {
  const { size = 'md', round, placement, as: Tag = 'button', className, children, ...rest } = props;
  
  const classes = [
    'ds-icon-btn',
    size !== 'md' && `ds-icon-btn--${size}`,
    round && 'ds-icon-btn--round',
    placement && `ds-icon-btn--${placement}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
});

export default IconButton;
