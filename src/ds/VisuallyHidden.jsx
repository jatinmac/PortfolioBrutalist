/**
 * Screen-reader-only content wrapper.
 */
export function VisuallyHidden(props) {
  const { as: Tag = 'span', children, ...rest } = props;
  return (
    <Tag className="ds-sr-only" {...rest}>
      {children}
    </Tag>
  );
}

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
