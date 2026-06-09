import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Toast, type ToastMessage, type ToastType } from './Toast';

type ShowToastOptions = {
  readonly description?: string;
  readonly duration?: number;
  readonly title: string;
  readonly type?: ToastType;
};

type ToastContextType = {
  readonly showToast: (options: ShowToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { readonly children: ReactNode }) {
  const [message, setMessage] = useState<null | ToastMessage>(null);
  const keyReference = useRef(0);

  const showToast = useCallback<ToastContextType['showToast']>(
    ({ title, description, type = 'info', duration }) => {
      keyReference.current += 1;
      setMessage({
        description,
        duration,
        key: keyReference.current,
        title,
        type,
      });
    },
    [],
  );

  const handleHide = useCallback(() => {
    setMessage(null);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast message={message} onHide={handleHide} />
    </ToastContext.Provider>
  );
}

export function useAppToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useAppToast must be used within a ToastProvider');
  }
  return context;
}
