import { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Icon from './Icon';
import IconButton from './IconButton';
import ScrollArea from './ScrollArea';

/**
 * Modal with backdrop, glass panel, close button, focus trap, scroll lock.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {string} [props.ariaLabelledby]
 * @param {React.Ref} [props.triggerRef] - Element to return focus to on close
 * @param {string} [props.className]
 */
export default function Modal({ isOpen, onClose, ariaLabelledby, triggerRef, className, children, ...rest }) {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Scroll lock
  useEffect(() => {
    if (!isOpen) return undefined;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Focus trap + Escape
  useEffect(() => {
    if (!isOpen) return undefined;

    previousFocusRef.current = document.activeElement;
    const currentTrigger = triggerRef?.current;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Auto-focus first focusable
    requestAnimationFrame(() => {
      if (modalRef.current) {
        const firstFocusable = modalRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) firstFocusable.focus();
      }
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Return focus
      const returnTarget = currentTrigger || previousFocusRef.current;
      if (returnTarget && typeof returnTarget.focus === 'function') {
        returnTarget.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  const contentClasses = ['ds-modal-content', className].filter(Boolean).join(' ');

  return createPortal(
    <div
      className="ds-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledby}
    >
      <div
        className={contentClasses}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        {...rest}
      >
        <IconButton
          size="overlay"
          className="ds-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <Icon icon={X} size="sm" />
        </IconButton>

        <ScrollArea style={{ paddingBottom: '2.5rem' }}>
          {children}
        </ScrollArea>
      </div>
    </div>,
    document.body
  );
}
