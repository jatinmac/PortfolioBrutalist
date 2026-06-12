import { forwardRef } from 'react';

/**
 * Glass card surface with double-border pseudo-elements.
 *
 * @param {Object} props
 * @param {'div'|'a'|'article'} [props.as='div']
 * @param {boolean} [props.interactive] - Adds pointer cursor + hover effects
 * @param {string} [props.className]
 */
const Card = forwardRef(function Card(props, ref) {
  const { as: Tag = 'div', interactive, className, children, ...rest } = props;
  
  const classes = [
    'ds-card',
    interactive && 'ds-card--interactive',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Tag ref={ref} className={classes} {...rest}>
      {children}
    </Tag>
  );
});

export default Card;
