/**
 * Skip-to-content link — visible only on keyboard focus.
 */
export function SkipLink({ href = '#main-content', children = 'Skip to content', ...rest }) {
  return (
    <a href={href} className="ds-skip-link" {...rest}>
      {children}
    </a>
  );
}
