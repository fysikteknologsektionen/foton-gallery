import React, {useEffect, useRef} from 'react';

import {Toast as BootstrapToast} from 'bootstrap';

/**
 * Component for rendering a bootstrap toast (push notification)
 * @param title Toast title
 * @param message Toast message
 * @param type Toast type, affects background color
 * @returns Toast component
 */
export const Toast: React.VFC<{
  title: string;
  message: string;
  type: 'success' | 'warning' | 'danger';
}> = ({title, message, type}) => {
  const toastRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (toastRef.current) {
      const toast = new BootstrapToast(toastRef.current);
      toast.show();
    }
  }, [toastRef]);

  /**
   * Hides the toast
   */
  function hideToast(): void {
    if (toastRef.current) {
      BootstrapToast.getInstance(toastRef.current)?.hide();
    }
  }

  return (
    <div
      className={`toast bg-${type}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      ref={toastRef}
    >
      <div className="toast-header">
        <strong className="me-auto">{title}</strong>
        <button
          className="btn-close"
          type="button"
          aria-label="Close"
          onClick={hideToast}
        />
      </div>
      <div
        className={`toast-body ${
          ['success', 'danger'].includes(type) && 'text-white'
        }`}
      >
        {message}
      </div>
    </div>
  );
};
