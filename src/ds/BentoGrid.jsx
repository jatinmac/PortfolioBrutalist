import Icon from './Icon';
import Tag from './Tag';

/**
 * BentoGrid container.
 *
 * @param {Object} props
 * @param {string} [props.columns='repeat(3, 1fr)'] - CSS grid-template-columns
 * @param {string} [props.className]
 */
export function BentoGrid({ columns = 'repeat(3, 1fr)', className, children, style, ...rest }) {
  const classes = ['ds-bento-grid', className].filter(Boolean).join(' ');
  return (
    <div
      className={classes}
      style={{ gridTemplateColumns: columns, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

/**
 * BentoItem within a BentoGrid.
 *
 * @param {Object} props
 * @param {number} [props.colSpan=1]
 * @param {number} [props.rowSpan]
 * @param {string} [props.tag] - Top-left label text
 * @param {React.ComponentType} [props.icon] - Lucide icon for top-right
 * @param {string} [props.className]
 */
export function BentoItem({ colSpan = 1, rowSpan, tag, icon, className, children, ...rest }) {
  const classes = [
    'ds-bento-item',
    colSpan > 1 && `ds-col-span-${colSpan}`,
    rowSpan > 1 && `ds-row-span-${rowSpan}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...rest}>
      {tag && <Tag variant="label">{tag}</Tag>}
      {icon && (
        <div className="ds-bento-icon">
          <Icon icon={icon} size="sm" />
        </div>
      )}
      <span className="ds-bento-placeholder">{children}</span>
    </div>
  );
}
