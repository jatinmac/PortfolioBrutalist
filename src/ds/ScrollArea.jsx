import { forwardRef } from 'react';

/**
 * Styled scrollable container with thin custom scrollbar.
 */
const ScrollArea = forwardRef(function ScrollArea({ className, children, ...rest }, ref) {
  const classes = ['ds-scroll-area', className].filter(Boolean).join(' ');
  return (
    <div ref={ref} className={classes} {...rest}>
      {children}
    </div>
  );
});

export default ScrollArea;
