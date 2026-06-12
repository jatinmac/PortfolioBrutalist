/**
 * Contained image with optional overlay content.
 *
 * @param {Object} props
 * @param {string} props.src
 * @param {string} props.alt
 * @param {React.ReactNode} [props.overlay] - Content overlaid on the image
 * @param {string} [props.className]
 */
export default function ImageBox({ src, alt, overlay, className, children, ...rest }) {
  const classes = ['ds-image-box', className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...rest}>
      <img src={src} alt={alt} className="ds-image-box__img" decoding="async" />
      {overlay && <div className="ds-image-box__overlay">{overlay}</div>}
      {children}
    </div>
  );
}
