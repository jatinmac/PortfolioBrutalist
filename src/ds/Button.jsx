import { forwardRef } from 'react';

/**
 * Primary / Ghost button.
 *
 * @param {Object} props
 * @param {'primary'|'ghost'} [props.variant='primary']
 * @param {boolean} [props.disabled]
 * @param {'button'|'span'} [props.as='button'] - Non-link element to render
 * @param {string} [props.href] - Renders <a> instead of <button>
 * @param {string} [props.download]
 * @param {boolean} [props.external] - Adds target="_blank" rel="noopener noreferrer"
 * @param {Function} [props.playSound] - Sound function called on click
 * @param {string} [props.className]
 */
const Button = forwardRef(function Button(
  { variant = 'primary', disabled, as: Tag = 'button', href, download, external, playSound, className, children, onClick, ...rest },
  ref
) {
  const classes = [
    'ds-btn',
    `ds-btn--${variant}`,
    disabled && 'is-disabled',
    className,
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (playSound) playSound();
    if (onClick) onClick(e);
  };

  if (href) {
    return (
      <a
        ref={ref}
        href={href}
        className={classes}
        onClick={handleClick}
        download={download}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  if (Tag !== 'button') {
    return (
      <Tag
        ref={ref}
        className={classes}
        aria-disabled={disabled ? 'true' : undefined}
        onClick={disabled ? undefined : handleClick}
        {...rest}
      >
        {children}
      </Tag>
    );
  }

  return (
    <button
      ref={ref}
      className={classes}
      onClick={handleClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
});

export default Button;
