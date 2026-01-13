import { useEffect, useRef } from 'react';

/**
 * Custom hook for trapping focus within a modal
 * @param {boolean} isActive - whether the focus trap should be active
 * @param {React.RefObject} containerRef - ref to the container element
 */
export function useFocusTrap(isActive, containerRef) {
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement;

    // Get all focusable elements within the container
    const focusableElements = containerRef.current.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // If no focusable elements, don't set up trap
    if (!firstElement) {
      return;
    }

    // Focus the first element
    firstElement.focus();

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    containerRef.current.addEventListener('keydown', handleTabKey);

    return () => {
      containerRef.current?.removeEventListener('keydown', handleTabKey);
      // Restore focus to the previously focused element
      previousActiveElement.current?.focus();
    };
  }, [isActive, containerRef]);
}
