import { forwardRef } from 'react';

/**
 * Navbar section button with roving tabindex support.
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {boolean} props.isActive
 * @param {string} [props.className]
 */
const NavTab = forwardRef(function NavTab(
  { label, isActive, className, ...rest },
  ref
) {
  const classes = [
    'ds-nav-tab',
    isActive && 'is-active',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type="button"
      className={classes}
      aria-current={isActive ? 'page' : undefined}
      tabIndex={isActive ? 0 : -1}
      {...rest}
    >
      {label}
    </button>
  );
});

export default NavTab;
