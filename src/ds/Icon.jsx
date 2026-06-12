import { forwardRef } from 'react';

const SIZES = {
  sm: { size: 14, strokeWidth: 2.5 },
  md: { size: 20, strokeWidth: 2 },
  lg: { size: 24, strokeWidth: 1.5 },
};

/**
 * Consistent icon wrapper around lucide-react icons.
 *
 * @param {Object} props
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {'sm'|'md'|'lg'} [props.size='sm'] - Preset size
 * @param {string} [props.className]
 */
const Icon = forwardRef(function Icon(props, ref) {
  const { icon: IconComponent, size = 'sm', className, ...rest } = props;
  const preset = SIZES[size] || SIZES.sm;
  return (
    <IconComponent
      ref={ref}
      size={preset.size}
      strokeWidth={preset.strokeWidth}
      className={className}
      {...rest}
    />
  );
});

export default Icon;
