import React, {createContext, useState} from 'react';

import {Toast} from './Toast';

interface ToastData {
  title: string;
  message: string;
  type: 'success' | 'warning' | 'danger';
}

interface ToastContext {
  (data: ToastData): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const toastContext = createContext<ToastContext>(() => {});

/**
 * Provider component for toastContext
 * @param children Children to provide context to
 * @returns ToastContextProvider component
 */
export const ToastContextProvider: React.VFC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<JSX.Element[]>([]);

  /**
   * Creates a new toast and appends it to the document
   * @param data Toast data object
   */
  function newToast(data: ToastData): void {
    const newToast = <Toast key={Date.now()} {...data} />;
    setToasts((toasts) => [...toasts, newToast]);
  }

  return (
    <>
      <div
        className="toast-container position-fixed bottom-0 end-0 p-3"
        style={{zIndex: 5000}}
      >
        {toasts}
      </div>
      <toastContext.Provider value={newToast}>{children}</toastContext.Provider>
    </>
  );
};
