const VARIANT_DEFAULTS = {
  display:  { tag: 'h1',   className: 'ds-text--display' },
  title:    { tag: 'h3',   className: 'ds-text--title' },
  body:     { tag: 'p',    className: 'ds-text--body' },
  'body-sm':{ tag: 'p',    className: 'ds-text--body-sm' },
  overline: { tag: 'span', className: 'ds-text--overline' },
  label:    { tag: 'span', className: 'ds-text--label' },
  caption:  { tag: 'span', className: 'ds-text--caption' },
};

/**
 * Typography preset component.
 *
 * @param {Object} props
 * @param {'display'|'title'|'body'|'body-sm'|'overline'|'label'|'caption'} props.variant
 * @param {string} [props.as] - Override the default HTML tag
 * @param {string} [props.className]
 */
export default function Text({ variant = 'body', as, className, children, ...rest }) {
  const config = VARIANT_DEFAULTS[variant] || VARIANT_DEFAULTS.body;
  const Tag = as || config.tag;
  const classes = [config.className, className].filter(Boolean).join(' ');

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
