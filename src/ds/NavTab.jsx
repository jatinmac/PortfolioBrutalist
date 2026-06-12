import { forwardRef } from 'react';

/**
 * Navbar tab button with roving tabindex support.
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {boolean} props.isActive
 * @param {string} props.tabId
 * @param {string} props.panelId
 * @param {string} [props.className]
 */
const NavTab = forwardRef(function NavTab(
  { label, isActive, tabId, panelId, className, ...rest },
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
      className={classes}
      aria-selected={isActive}
      aria-controls={panelId}
      id={tabId}
      role="tab"
      tabIndex={isActive ? 0 : -1}
      {...rest}
    >
      {label}
    </button>
  );
});

export default NavTab;
